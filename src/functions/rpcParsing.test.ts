/* eslint-env jest */

const EXTRA_RPCS_SOURCE = `
const privacyStatement = {
  onerpc: 'ignored',
}

export const extraRpcs = {
  1: {
    rpcs: [
      "https://eth.llamarpc.com",
      { url: "https://1rpc.io/eth", trackingDetails: privacyStatement.onerpc },
      { url: "wss://ethereum-rpc.publicnode.com" },
    ],
  },
  122: { rpcs: [{ url: "https://rpc.fuse.io" }, { url: "https://fuse.drpc.org" }] },
  1220: { rpcs: [{ url: "https://should-not-match-1220.example" }] },
  42220: { rpcs: ["https://forno.celo.org", { url: "wss://forno.celo.org/ws" }] },
  422201: { rpcs: [{ url: "https://should-not-match-422201.example" }] },
  11142220: { rpcs: [{ url: "https://should-not-match-11142220.example" }] },
  50: { rpcs: ["https://rpc.xinfin.network", { url: "https://erpc.xinfin.network" }] },
  500: { rpcs: [{ url: "https://should-not-match-500.example" }] },
  5050: { rpcs: [{ url: "https://should-not-match-5050.example" }] },
  1750: { rpcs: [{ url: "https://should-not-match-1750.example" }] },
  250: { rpcs: [{ url: "https://should-not-match-250.example" }] },
}
`

describe('rpcParsing', () => {
    const originalEnv = process.env

    beforeEach(() => {
        process.env = { ...originalEnv }
    })

    afterEach(() => {
        process.env = originalEnv
        jest.restoreAllMocks()
    })

    it('parses HTTP(S) RPCs from extraRpcs.js', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            text: async () => EXTRA_RPCS_SOURCE,
        } as Response)

        const { fetchRpcsFromChainlist } = await import('./rpcParsing')

        await expect(fetchRpcsFromChainlist()).resolves.toEqual({
            '1': ['https://eth.llamarpc.com', 'https://1rpc.io/eth'],
            '122': ['https://rpc.fuse.io', 'https://fuse.drpc.org'],
            '42220': ['https://forno.celo.org'],
            '50': ['https://rpc.xinfin.network', 'https://erpc.xinfin.network'],
        })
    })

    it('returns only configured fallback chains', async () => {
        process.env.REACT_APP_RPC_FALLBACK_CHAIN_IDS = '122,50'
        process.env.REACT_APP_FUSE_RPC = 'https://fuse.example'

        const { getFallbackRpcsByChain } = await import('./rpcParsing')

        expect(getFallbackRpcsByChain()).toEqual({
            '1': [],
            '122': ['https://fuse.example'],
            '42220': [],
            '50': ['https://rpc.xinfin.network'],
        })
    })
})
