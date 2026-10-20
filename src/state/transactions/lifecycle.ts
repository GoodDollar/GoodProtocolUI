// This expires local pending UI only; it never cancels an on-chain transaction.
export const PENDING_TIMEOUT_MS = 30 * 60 * 1000

type Provider<Receipt> = {
    getTransactionReceipt(hash: string): Promise<Receipt | null>
    getTransaction(hash: string): Promise<{ from: string; nonce: number } | null>
    getTransactionCount(address: string, blockTag: 'latest'): Promise<number>
}

async function bounded<T>(operation: Promise<T>): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
        return await Promise.race([operation, new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error('Transaction RPC timed out')), 10_000)
        })])
    } finally {
        if (timer !== undefined) clearTimeout(timer)
    }
}

export async function checkPendingTransaction<Receipt>(
    provider: Provider<Receipt>,
    hash: string,
    addedTime: number,
    now = Date.now()
): Promise<{ receipt: Receipt } | { dismissed: 'timeout' | 'replaced' } | { pending: true }> {
    try {
        const receipt = await bounded(provider.getTransactionReceipt(hash))
        if (receipt) return { receipt }
        if (now - addedTime >= PENDING_TIMEOUT_MS) return { dismissed: 'timeout' }
        const transaction = await bounded(provider.getTransaction(hash))
        if (transaction && (await bounded(provider.getTransactionCount(transaction.from, 'latest'))) > transaction.nonce) {
            const mined = await bounded(provider.getTransactionReceipt(hash))
            if (mined) return { receipt: mined }
            return { dismissed: 'replaced' }
        }
        return { pending: true }
    } catch (error) {
        // RPC errors are not evidence of replacement; the local timeout still applies.
        if (now - addedTime >= PENDING_TIMEOUT_MS) return { dismissed: 'timeout' }
        throw error
    }
}
