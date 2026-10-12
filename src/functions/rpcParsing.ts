export const SUPPORTED_CHAIN_IDS = ['1', '122', '42220', '50'] as const

type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]
type Env = Record<string, string | undefined>
type ChainlistRpc = { url?: string }
type ChainlistChain = { chainId: number; rpc?: ChainlistRpc[] }

const CHAINLIST_RPCS_URL = 'https://chainlist.org/rpcs.json'
const FALLBACK_CHAIN_IDS_ENV = 'REACT_APP_RPC_FALLBACK_CHAIN_IDS'

const DEFAULT_FALLBACK_RPCS_BY_CHAIN: Record<SupportedChainId, string[]> = {
    '1': ['https://eth.llamarpc.com', 'https://1rpc.io/eth'],
    '122': ['https://rpc.fuse.io'],
    '42220': ['https://forno.celo.org'],
    '50': ['https://rpc.xinfin.network'],
}

const ENV_RPC_KEYS_BY_CHAIN: Record<SupportedChainId, string> = {
    '1': 'REACT_APP_MAINNET_RPC',
    '122': 'REACT_APP_FUSE_RPC',
    '42220': 'REACT_APP_CELO_RPC',
    '50': 'REACT_APP_XDC_RPC',
}

// Case-insensitive URL substrings: a hostname blocks every matching path on that host.
export function filterExcludedRpcs(urls: string[], env: Env = process.env): string[] {
    const excluded = (env.REACT_APP_EXCLUDED_RPCS ?? '')
        .split(',')
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean)

    return [...new Set(urls.map((url) => url.trim()).filter(Boolean))].filter(
        (url) => !excluded.some((blocked) => url.toLowerCase().includes(blocked))
    )
}

function normalizeRpcUrls(rpcs: ChainlistRpc[] = []): string[] {
    return rpcs
        .map((rpc) => rpc.url?.trim())
        .filter((url): url is string => !!url && (url.startsWith('http://') || url.startsWith('https://')))
}

export function getFallbackRpcsByChain(env: Env = process.env): Record<SupportedChainId, string[]> {
    const enabledFallbackChains = new Set(
        (env[FALLBACK_CHAIN_IDS_ENV] ?? SUPPORTED_CHAIN_IDS.join(','))
            .split(',')
            .map((chainId) => chainId.trim())
            .filter((chainId): chainId is SupportedChainId =>
                (SUPPORTED_CHAIN_IDS as readonly string[]).includes(chainId)
            )
    )

    return SUPPORTED_CHAIN_IDS.reduce((result, chainId) => {
        const configuredRpcs = (env[ENV_RPC_KEYS_BY_CHAIN[chainId]] ?? '')
            .split(',')
            .map((rpc) => rpc.trim())
            .filter((rpc) => rpc.startsWith('http://') || rpc.startsWith('https://'))

        result[chainId] = filterExcludedRpcs(
            enabledFallbackChains.has(chainId) && configuredRpcs.length > 0
                ? configuredRpcs
                : enabledFallbackChains.has(chainId)
                ? DEFAULT_FALLBACK_RPCS_BY_CHAIN[chainId]
                : [],
            env
        )

        return result
    }, {} as Record<SupportedChainId, string[]>)
}

export async function fetchRpcsFromChainlist(): Promise<Record<string, string[]>> {
    const response = await fetch(CHAINLIST_RPCS_URL)
    if (!response.ok) throw new Error('Failed to fetch chainlist')

    const chains: ChainlistChain[] = await response.json()
    const chainsById = new Map(chains.map((chain) => [String(chain.chainId), chain]))

    return SUPPORTED_CHAIN_IDS.reduce<Record<string, string[]>>((result, chainId) => {
        result[chainId] = filterExcludedRpcs(normalizeRpcUrls(chainsById.get(chainId)?.rpc))
        return result
    }, {})
}
