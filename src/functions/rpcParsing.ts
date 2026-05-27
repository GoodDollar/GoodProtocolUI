export const FALLBACK_RPCS_BY_CHAIN: Record<string, string[]> = {
    '1': ['https://eth.llamarpc.com', 'https://1rpc.io/eth'],
    '122': ['https://rpc.fuse.io'],
    '42220': ['https://forno.celo.org'],
    '50': ['https://rpc.xinfin.network'],
}

const CHAINLIST_JSON_URL = 'https://chainid.network/chains.json'
const TARGET_CHAIN_IDS = new Set([1, 122, 42220, 50])

export async function fetchRpcsFromChainlist(): Promise<Record<string, string[]>> {
    const response = await fetch(CHAINLIST_JSON_URL)
    if (!response.ok) throw new Error('Failed to fetch chainlist')

    const chains: Array<{ chainId: number; rpc: string[] }> = await response.json()

    const result: Record<string, string[]> = {}
    for (const chain of chains) {
        if (TARGET_CHAIN_IDS.has(chain.chainId)) {
            result[String(chain.chainId)] = chain.rpc.filter(
                (url) => url.startsWith('http://') || url.startsWith('https://')
            )
        }
    }
    return result
}

export async function fetchRpcsFromChainlistOrFallback(): Promise<Record<string, string[]>> {
    try {
        return await fetchRpcsFromChainlist()
    } catch {
        return FALLBACK_RPCS_BY_CHAIN
    }
}
