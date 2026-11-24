import type { TransactionStatus } from '@usedapp/core'

// Structural typing keeps the legacy UI compatible until the new SDK is published and upgraded.
type ReserveSwapStatus = TransactionStatus & { errorType?: 'RESERVE_LIMIT' }

export const isReserveLimitFailure = (state: ReserveSwapStatus): boolean =>
    (state.status === 'Exception' || state.status === 'Fail') && state.errorType === 'RESERVE_LIMIT'

export const getReserveLimitFailureChainId = (
    state: ReserveSwapStatus,
    fallbackChainId?: number
): number | undefined => (isReserveLimitFailure(state) ? state.chainId ?? fallbackChainId : undefined)

// These external interfaces support Celo mainnet. This does not assert a quote or executable route.
export const canOfferCeloDexRoutes = (production: boolean, celoNetworkEnabled: boolean): boolean =>
    production && celoNetworkEnabled
