/* eslint-env jest */
import { fetchRpcsFromChainlist, fetchRpcsFromChainlistOrFallback, FALLBACK_RPCS_BY_CHAIN } from './rpcParsing'

describe('rpcParsing', () => {
    it('fetches and parses HTTP(S) RPCs for all required chains from chainlist', async () => {
        const extraRpcs = await fetchRpcsFromChainlist()

        expect(extraRpcs).toBeDefined()
        ;[1, 122, 42220, 50].forEach((chainId) => {
            const key = String(chainId)
            expect(extraRpcs[key]).toBeDefined()
            expect(extraRpcs[key].length).toBeGreaterThan(0)
            expect(extraRpcs[key].every((url) => /^https?:\/\//.test(url))).toBe(true)
        })
    }, 30000)

    it('FALLBACK_RPCS_BY_CHAIN covers all required chains with HTTP(S) URLs', () => {
        ;['1', '122', '42220', '50'].forEach((chainId) => {
            expect(FALLBACK_RPCS_BY_CHAIN[chainId]).toBeDefined()
            expect(FALLBACK_RPCS_BY_CHAIN[chainId].length).toBeGreaterThan(0)
            expect(FALLBACK_RPCS_BY_CHAIN[chainId].every((url) => /^https?:\/\//.test(url))).toBe(true)
        })
    })

    it('falls back to the bundled RPCs when the chainlist fetch fails', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('network down'))
        try {
            await expect(fetchRpcsFromChainlistOrFallback()).resolves.toEqual(FALLBACK_RPCS_BY_CHAIN)
        } finally {
            fetchSpy.mockRestore()
        }
    })
})
