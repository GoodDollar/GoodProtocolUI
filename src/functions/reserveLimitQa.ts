export interface ReserveLimitQaCapability {
    forceTradeLimits?: boolean
}

export const isReserveLimitQaRequested = (isDevelopmentBuild: boolean, value?: string): boolean =>
    isDevelopmentBuild && value === 'true'

export const isReserveLimitQaActive = (
    isDevelopmentBuild: boolean,
    value: string | undefined,
    capability: ReserveLimitQaCapability | undefined,
    hasLimitModal: boolean
): boolean =>
    isReserveLimitQaRequested(isDevelopmentBuild, value) && capability?.forceTradeLimits === true && hasLimitModal

export const canOpenReserveLimitQa = ({
    active,
    chainId,
    address,
    hasValidQuote,
}: {
    active: boolean
    chainId?: number
    address?: string
    hasValidQuote: boolean
}): boolean => active && Boolean(address) && hasValidQuote && (chainId === 42220 || chainId === 50)

export const getReserveActionMode = (
    qaActive: boolean,
    canStartQaSimulation: boolean,
    balanceNotEnough: boolean
): 'simulate-limit' | 'qa-unavailable' | 'insufficient-balance' | 'normal' => {
    if (qaActive) return canStartQaSimulation ? 'simulate-limit' : 'qa-unavailable'
    return balanceNotEnough ? 'insufficient-balance' : 'normal'
}

export const canUseRealReserveActions = (qaActive: boolean): boolean => !qaActive

export const canConfirmReserveLimitQa = (qaSimulation: boolean, capabilityActive: boolean): boolean =>
    !qaSimulation || capabilityActive
