/* eslint-env jest */
import { parseExtraRpcsFromChainlist } from './rpcParsing'

const CHAINLIST_URL = 'https://raw.githubusercontent.com/DefiLlama/chainlist/refs/heads/main/constants/extraRpcs.js'

describe('rpcParsing', () => {
    it('parses extraRpcs from DefiLlama chainlist source', async () => {
        const response = await fetch(CHAINLIST_URL)
        expect(response.ok).toBe(true)

        const content = await response.text()
        const extraRpcs = parseExtraRpcsFromChainlist(content)

        expect(extraRpcs).toBeDefined()
        ;[1, 122, 42220, 50].forEach((chainId) => {
            expect(extraRpcs[chainId]).toBeDefined()
            expect(extraRpcs[chainId].length).toBeGreaterThan(0)
            expect(extraRpcs[chainId].every((url) => /^https?:\/\//.test(url))).toBe(true)
        })
    }, 10000)
})
