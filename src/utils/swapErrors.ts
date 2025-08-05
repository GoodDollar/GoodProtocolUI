export function isDivisionByZero(msg: string): boolean {
    return /\b(division by zero|infinity|nan)\b/i.test(msg)
}

export function isPriceImpactError(msg: string): boolean {
    return /\b(price impact|high.*impact|exceeds.*impact)\b/i.test(msg)
}

export function classifySwapError(raw: string) {
    if (isDivisionByZero(raw)) {
        return {
            type: 'calculation_error' as const,
            message: 'Trade calculation failed due to extreme price conditions. Please try a smaller amount.',
        }
    }

    if (isPriceImpactError(raw)) {
        return {
            type: 'price_impact_error' as const,
            message: 'This trade would have 100% price impact. Reduce your trade size or check token liquidity.',
        }
    }

    return { type: 'generic_error' as const, message: raw }
}
