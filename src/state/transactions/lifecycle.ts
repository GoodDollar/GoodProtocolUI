// This expires local pending UI only; it never cancels an on-chain transaction.
export const PENDING_TIMEOUT_MS = 30 * 60 * 1000

type Transaction = {
    hash?: string
    from: string
    nonce: number
    to?: string | null
    data?: string
    value?: { toString(): string }
}
type Provider<Receipt> = {
    getTransactionReceipt(hash: string): Promise<Receipt | null>
    getTransaction(hash: string): Promise<Transaction | null>
    getTransactionCount(address: string, blockTag: 'latest' | number): Promise<number>
    getBlockNumber?(): Promise<number>
    getBlockWithTransactions?(block: number): Promise<{ transactions: Transaction[] }>
}

export type PendingResult<Receipt> =
    | { receipt: Receipt }
    | { dismissed: 'timeout' | 'replaced' }
    | { pending: true }
    | { replacement: { hash: string; receipt: Receipt; reason: 'repriced' | 'cancelled' | 'replaced' } }

function sameAddress(a?: string | null, b?: string | null): boolean {
    return a?.toLowerCase() === b?.toLowerCase()
}

/** Locate the first mined nonce transition; do not assume the replacement is in the latest block. */
async function replacementReceipt<Receipt>(
    provider: Provider<Receipt>,
    original: Transaction
): Promise<PendingResult<Receipt>> {
    if (!provider.getBlockNumber || !provider.getBlockWithTransactions) return { dismissed: 'replaced' }
    const head = await bounded(provider.getBlockNumber())
    let low = 0,
        high = head,
        distance = 1
    // Exponential lookback keeps normal speed-ups cheap and still finds older replacements.
    while (high > 0) {
        const before = Math.max(0, head - distance)
        const count = await bounded(provider.getTransactionCount(original.from, before))
        if (count <= original.nonce) {
            low = before + 1
            break
        }
        high = before
        distance *= 2
    }
    while (low < high) {
        const mid = Math.floor((low + high) / 2)
        const count = await bounded(provider.getTransactionCount(original.from, mid))
        if (count > original.nonce) high = mid
        else low = mid + 1
    }
    const block = await bounded(provider.getBlockWithTransactions(high))
    const replacement = block.transactions.find(
        (tx) => sameAddress(tx.from, original.from) && tx.nonce === original.nonce
    )
    if (!replacement?.hash || replacement.hash === original.hash) return { pending: true }
    const receipt = await bounded(provider.getTransactionReceipt(replacement.hash))
    if (!receipt) return { pending: true } // A reorg or incomplete RPC response is not a confirmed replacement.
    const mined = receipt as { transactionHash?: string; blockNumber?: number }
    if (mined.transactionHash && mined.transactionHash.toLowerCase() !== replacement.hash.toLowerCase())
        return { pending: true }
    if (mined.blockNumber !== undefined && mined.blockNumber !== high) return { pending: true }
    const repriced =
        original.data !== undefined &&
        original.value !== undefined &&
        replacement.data === original.data &&
        sameAddress(replacement.to, original.to) &&
        replacement.value?.toString() === original.value.toString()
    const cancelled =
        sameAddress(replacement.to, original.from) && replacement.data === '0x' && replacement.value?.toString() === '0'
    return {
        replacement: {
            hash: replacement.hash,
            receipt,
            reason: repriced ? 'repriced' : cancelled ? 'cancelled' : 'replaced',
        },
    }
}

async function bounded<T>(operation: Promise<T>): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
        return await Promise.race([
            operation,
            new Promise<never>((_, reject) => {
                timer = setTimeout(() => reject(new Error('Transaction RPC timed out')), 10_000)
            }),
        ])
    } finally {
        if (timer !== undefined) clearTimeout(timer)
    }
}

export async function checkPendingTransaction<Receipt>(
    provider: Provider<Receipt>,
    hash: string,
    addedTime: number,
    now = Date.now()
): Promise<PendingResult<Receipt>> {
    try {
        const receipt = await bounded(provider.getTransactionReceipt(hash))
        if (receipt) return { receipt }
        if (now - addedTime >= PENDING_TIMEOUT_MS) return { dismissed: 'timeout' }
        const transaction = await bounded(provider.getTransaction(hash))
        if (
            transaction &&
            (await bounded(provider.getTransactionCount(transaction.from, 'latest'))) > transaction.nonce
        ) {
            const mined = await bounded(provider.getTransactionReceipt(hash))
            if (mined) return { receipt: mined }
            return await replacementReceipt(provider, { ...transaction, hash })
        }
        return { pending: true }
    } catch (error) {
        // RPC errors are not evidence of replacement; the local timeout still applies.
        if (now - addedTime >= PENDING_TIMEOUT_MS) return { dismissed: 'timeout' }
        throw error
    }
}

export function shouldCheck(
    lastBlockNumber: number,
    tx: { addedTime: number; receipt?: object; lastCheckedBlockNumber?: number }
): boolean {
    if (tx.receipt) return false
    if (!tx.lastCheckedBlockNumber) return true
    const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
    if (blocksSinceCheck < 1) return false
    const minutesPending = (Date.now() - tx.addedTime) / 1000 / 60
    if (minutesPending > 60) return blocksSinceCheck > 9
    if (minutesPending > 5) return blocksSinceCheck > 2
    return true
}
