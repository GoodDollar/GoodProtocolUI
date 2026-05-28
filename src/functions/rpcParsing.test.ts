/* eslint-env jest */

const CHAINLIST_RPCS_SOURCE = [
    {
        chainId: 1,
        name: 'Ethereum Mainnet',
        rpc: [
            { url: 'https://eth.llamarpc.com' },
            { url: 'https://1rpc.io/eth' },
            { url: 'wss://ethereum-rpc.publicnode.com' },
        ],
    },
    {
        chainId: 122,
        name: 'Fuse Mainnet',
        rpc: [{ url: 'https://rpc.fuse.io' }, { url: 'https://fuse.drpc.org' }],
    },
    {
        chainId: 42220,
        name: 'Celo Mainnet',
        rpc: [{ url: 'https://forno.celo.org' }, { url: 'wss://forno.celo.org/ws' }],
    },
    {
        chainId: 50,
        name: 'XDC Network',
        rpc: [{ url: 'https://rpc.xinfin.network' }, { url: 'https://erpc.xinfin.network' }],
    },
]

describe('rpcParsing', () => {
    const originalEnv = process.env

    beforeEach(() => {
        process.env = { ...originalEnv }
    })

    afterEach(() => {
        process.env = originalEnv
        jest.restoreAllMocks()
    })

    it('parses HTTP(S) RPCs from chainlist json', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => CHAINLIST_RPCS_SOURCE,
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
