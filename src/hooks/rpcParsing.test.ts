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
        expect(extraRpcs[1]).toBeDefined()
        expect(extraRpcs[122]).toBeDefined()
        expect(extraRpcs[42220]).toBeDefined()
        expect(extraRpcs[50]).toBeDefined()
    }, 30000)
})
