export function isDivisionByZero(msg: string): boolean {
    return /(division\s+by\s+zero|divided\s+by\s+zero|\bInfinity\b|\bNaN\b)/i.test(msg)
}

export function isPriceImpactError(msg: string): boolean {
    return /price\s+impact/i.test(msg)
}

export function classifySwapError(raw: string) {
    if (isDivisionByZero(raw) || isPriceImpactError(raw)) {
        return {
            type: 'price_impact_error' as const,
            message: 'High price impact detected. Try a smaller amount or check token liquidity.',
        }
    }
    return { type: 'generic_error' as const, message: raw }
}
