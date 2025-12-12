export const DEFAULT_CHAIN_ID = 42220

export function getSafeChainId(chainId?: number | string | null): number {
    const numeric = typeof chainId === 'string' ? Number(chainId) : chainId
    return typeof numeric === 'number' && Number.isFinite(numeric) ? numeric : DEFAULT_CHAIN_ID
}
