function sanitizeErrorMessage(message: string): string {
    return message
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .substring(0, 200)
}

export function isDivisionByZero(msg: string): boolean {
    return /(division by zero|divide by zero|infinity)/i.test(msg)
}

export function isNaNError(msg: string): boolean {
    return /\bnan\b/i.test(msg)
}

export function isPriceImpactError(msg: string): boolean {
    return /(price impact|high.*impact|exceeds.*impact|impact.*high|impact.*too.*high|slippage.*high|liquidity.*insufficient|insufficient.*liquidity)/i.test(
        msg
    )
}

export function classifySwapError(raw: string) {
    const sanitized = sanitizeErrorMessage(raw)
    if (isDivisionByZero(sanitized)) {
        return {
            type: 'division_by_zero_error' as const,
            message: 'Invalid calculation: division by zero detected. Please try a different trade amount.',
        }
    }

    if (isNaNError(sanitized)) {
        return {
            type: 'calculation_error' as const,
            message: 'Invalid calculation detected. This may be due to extreme market conditions or invalid input.',
        }
    }

    if (isPriceImpactError(sanitized)) {
        return {
            type: 'price_impact_error' as const,
            message: 'This trade would have 100% price impact. Reduce your trade size or check token liquidity.',
        }
    }

    return { type: 'generic_error' as const, message: sanitized }
}
