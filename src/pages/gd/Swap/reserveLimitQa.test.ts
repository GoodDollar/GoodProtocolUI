import {
    canConfirmReserveLimitQa,
    canOpenReserveLimitQa,
    canUseRealReserveActions,
    getReserveActionMode,
    isReserveLimitQaActive,
    isReserveLimitQaRequested,
} from '../../../functions/reserveLimitQa'
import { getReserveLimitFailureChainId } from './reserveLimitError'

describe('Reserve-limit QA mode', () => {
    it('requires the exact opt-in in a development build and SDK activation', () => {
        expect(isReserveLimitQaRequested(true, 'true')).toBe(true)
        expect(isReserveLimitQaRequested(true, 'TRUE')).toBe(false)
        expect(isReserveLimitQaRequested(false, 'true')).toBe(false)
        expect(isReserveLimitQaActive(true, 'true', undefined, true)).toBe(false)
        expect(isReserveLimitQaActive(true, 'true', { forceTradeLimits: false }, true)).toBe(false)
        expect(isReserveLimitQaActive(true, 'true', { forceTradeLimits: true }, true)).toBe(true)
        expect(isReserveLimitQaActive(true, 'true', { forceTradeLimits: true }, false)).toBe(false)
        expect(isReserveLimitQaActive(false, 'true', { forceTradeLimits: true }, true)).toBe(false)
    })

    it('lets an empty wallet reach the QA confirmation only with an account, quote and supported chain', () => {
        expect(
            canOpenReserveLimitQa({
                active: true,
                chainId: 42220,
                address: '0xabc',
                hasValidQuote: true,
            })
        ).toBe(true)
        expect(
            canOpenReserveLimitQa({
                active: true,
                chainId: 50,
                address: '0xabc',
                hasValidQuote: true,
            })
        ).toBe(true)
        expect(
            canOpenReserveLimitQa({
                active: true,
                chainId: 122,
                address: '0xabc',
                hasValidQuote: true,
            })
        ).toBe(false)
        expect(
            canOpenReserveLimitQa({
                active: true,
                address: '0xabc',
                hasValidQuote: true,
            })
        ).toBe(false)
        expect(
            canOpenReserveLimitQa({
                active: true,
                chainId: 42220,
                hasValidQuote: false,
            })
        ).toBe(false)
    })

    it('prioritizes the labelled QA path over an insufficient balance but keeps normal gating when off', () => {
        expect(getReserveActionMode(true, true, true)).toBe('simulate-limit')
        expect(getReserveActionMode(true, false, true)).toBe('qa-unavailable')
        expect(getReserveActionMode(false, false, true)).toBe('insufficient-balance')
        expect(getReserveActionMode(false, false, false)).toBe('normal')
    })

    it('blocks real approval and swap actions while the SDK QA mode is active', () => {
        expect(canUseRealReserveActions(true)).toBe(false)
        expect(canUseRealReserveActions(false)).toBe(true)
        expect(canConfirmReserveLimitQa(true, false)).toBe(false)
        expect(canConfirmReserveLimitQa(true, true)).toBe(true)
        expect(canConfirmReserveLimitQa(false, false)).toBe(true)
    })

    it.each([
        ['Exception', 42220, 'Celo'],
        ['Fail', 42220, 'Celo'],
        ['Exception', 50, 'XDC'],
        ['Fail', 50, 'XDC'],
    ])('routes a classified %s Reserve-limit failure to the modal for %s', (status, chainId, chainName) => {
        const modalChainId = getReserveLimitFailureChainId(
            { status, chainId, errorType: 'RESERVE_LIMIT' } as any,
            42220
        )

        expect(modalChainId).toBe(chainId)
        expect(modalChainId === 42220 ? 'Celo' : 'XDC').toBe(chainName)
    })

    it('does not classify unrelated failures as Reserve limits', () => {
        expect(
            getReserveLimitFailureChainId({ status: 'Fail', errorType: undefined } as any, 42220)
        ).toBeUndefined()
    })
})
