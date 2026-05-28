export const SUPPORTED_CHAIN_IDS = ['1', '122', '42220', '50'] as const

type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]
type Env = Record<string, string | undefined>

const CHAINLIST_EXTRA_RPCS_URL =
    'https://raw.githubusercontent.com/DefiLlama/chainlist/refs/heads/main/constants/extraRpcs.js'
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

        result[chainId] =
            enabledFallbackChains.has(chainId) && configuredRpcs.length > 0
                ? configuredRpcs
                : enabledFallbackChains.has(chainId)
                ? DEFAULT_FALLBACK_RPCS_BY_CHAIN[chainId]
                : []

        return result
    }, {} as Record<SupportedChainId, string[]>)
}

export async function fetchRpcsFromChainlist(): Promise<Record<string, string[]>> {
    const response = await fetch(CHAINLIST_EXTRA_RPCS_URL)
    if (!response.ok) throw new Error('Failed to fetch chainlist')

    const source = await response.text()

    return SUPPORTED_CHAIN_IDS.reduce<Record<string, string[]>>((result, chainId) => {
        const chainMatch = source.match(
            new RegExp(String.raw`(?:^|\n)\s*${chainId}:\s*\{[\s\S]*?rpcs:\s*\[([\s\S]*?)\]`, 'm')
        )

        result[chainId] = (chainMatch?.[1].match(/https?:\/\/[^"'`\s,]+/g) ?? []).filter(
            (url) => url.startsWith('http://') || url.startsWith('https://')
        )
        return result
    }, {})
}
