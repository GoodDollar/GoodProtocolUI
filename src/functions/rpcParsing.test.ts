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
    it('filters discovered RPCs before they can be probed', async () => {
        process.env.REACT_APP_EXCLUDED_RPCS = ' RPC.FUSE.IO, 1rpc.io '
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => CHAINLIST_RPCS_SOURCE,
        } as Response)
        const { fetchRpcsFromChainlist } = await import('./rpcParsing')
        const urls = await fetchRpcsFromChainlist()
        expect(urls['122']).toEqual(['https://fuse.drpc.org'])
        expect(urls['1']).toEqual(['https://eth.llamarpc.com'])
        expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('filters configured and default fallbacks without reintroducing excluded URLs', async () => {
        process.env.REACT_APP_EXCLUDED_RPCS = 'blocked.example, rpc.fuse.io'
        process.env.REACT_APP_CELO_RPC = 'https://blocked.example/celo, https://allowed.example/celo'
        const { getFallbackRpcsByChain } = await import('./rpcParsing')
        expect(getFallbackRpcsByChain()['122']).toEqual([])
        expect(getFallbackRpcsByChain()['42220']).toEqual(['https://allowed.example/celo'])
    })

    it('applies the same case-insensitive substring rules to cached URLs and removes duplicates', async () => {
        const { filterExcludedRpcs } = await import('./rpcParsing')
        expect(
            filterExcludedRpcs(
                [
                    'https://node.example/a',
                    'https://NODE.example/b',
                    ' https://allowed.example/rpc ',
                    'https://allowed.example/rpc',
                ],
                { REACT_APP_EXCLUDED_RPCS: ' NODE.EXAMPLE, , ' }
            )
        ).toEqual(['https://allowed.example/rpc'])
        expect(
            filterExcludedRpcs(['https://node.example/a', 'https://node.example/b'], {
                REACT_APP_EXCLUDED_RPCS: 'https://node.example/a',
            })
        ).toEqual(['https://node.example/b'])
    })
})
