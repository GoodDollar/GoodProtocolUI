/** @jest-environment node */
/* eslint-env jest */
import { providers } from 'ethers'
import { createSdkReadOnlyUrls } from './rpcProviders'
import { getUrl } from '@ethersproject/web/lib/geturl'
import { getProvidersFromConfig } from '@usedapp/core/dist/cjs/src/providers/network/readonlyNetworks/provider'

jest.mock('@ethersproject/web/lib/geturl', () => ({ getUrl: jest.fn() }))

const a = 'https://a.offline.invalid/rpc'
const b = 'https://b.offline.invalid/rpc'
const rpcs = { 1: 'https://mainnet.offline.invalid', 122: a, 42220: b, 50: 'https://xdc.offline.invalid' }
const candidates = { 122: [a, b, a], 42220: [b] }

const pools: providers.FallbackProvider[] = []
function makePool() {
    const result = createSdkReadOnlyUrls(rpcs, candidates)!
    for (const value of Object.values(result)) if (value instanceof providers.FallbackProvider) pools.push(value)
    return result[122] as providers.FallbackProvider
}

describe('SDK read-only RPC pools', () => {
    const originalEnv = process.env
    beforeEach(() => {
        process.env = { ...originalEnv, REACT_APP_EXCLUDED_RPCS: '' }
        jest.clearAllMocks()
    })
    afterEach(() => {
        process.env = originalEnv
        for (const pool of pools.splice(0)) {
            pool.removeAllListeners()
            pool.polling = false
            for (const { provider } of pool.providerConfigs) {
                ;(provider as providers.BaseProvider).removeAllListeners()
                ;(provider as providers.BaseProvider).polling = false
            }
        }
    })

    it('keeps scalar URLs intact and produces bounded providers accepted by usedapp', () => {
        const result = createSdkReadOnlyUrls(rpcs, candidates)!
        const pool = result[122] as providers.FallbackProvider
        expect(rpcs[122]).toBe(a)
        expect(result[1]).toBe(rpcs[1])
        expect(result[50]).toBe(rpcs[50])
        expect(pool.quorum).toBe(1)
        expect(pool.providerConfigs).toHaveLength(2)
        pool.providerConfigs.forEach((config, index) => {
            expect(config).toMatchObject({ priority: index + 1, weight: 1, stallTimeout: 1000 })
            const child = config.provider as providers.StaticJsonRpcProvider
            expect(child.connection).toMatchObject({ throttleLimit: 1, timeout: 5000 })
            expect(child.network.chainId).toBe(122)
        })
        expect(getProvidersFromConfig({ 122: pool })[122]).toBe(pool)
        expect(getProvidersFromConfig({ 122: () => pool })[122]).toBe(pool)
        expect(getUrl).not.toHaveBeenCalled()
    })

    it('fails over from HTTP 429 to B with one transport attempt per endpoint', async () => {
        ;(getUrl as jest.Mock).mockImplementation(async (url, options) => {
            const request = JSON.parse(Buffer.from(options.body).toString())
            return url === a
                ? { statusCode: 429, headers: {}, body: Buffer.from('{}') }
                : {
                      statusCode: 200,
                      headers: {},
                      body: Buffer.from(
                          JSON.stringify({
                              jsonrpc: '2.0',
                              id: request.id,
                              result: '0x64',
                          })
                      ),
                  }
        })
        await expect(makePool().getBlockNumber()).resolves.toBe(100)
        expect((getUrl as jest.Mock).mock.calls.filter(([url]) => url === a)).toHaveLength(1)
        expect((getUrl as jest.Mock).mock.calls.filter(([url]) => url === b)).toHaveLength(1)
    })

    it('rejects when all endpoints return 429 without an endless retry loop', async () => {
        ;(getUrl as jest.Mock).mockResolvedValue({ statusCode: 429, headers: {}, body: Buffer.from('{}') })
        await expect(makePool().getBlockNumber()).rejects.toThrow('failed to meet quorum')
        expect(getUrl).toHaveBeenCalledTimes(2)
    })

    it('filters selected and cached URLs, including the all-excluded case', () => {
        process.env.REACT_APP_EXCLUDED_RPCS = 'A.OFFLINE.INVALID'
        const pool = makePool()
        expect(pool.providerConfigs).toHaveLength(1)
        expect((pool.providerConfigs[0].provider as providers.StaticJsonRpcProvider).connection.url).toBe(b)
        process.env.REACT_APP_EXCLUDED_RPCS = 'offline.invalid'
        expect(createSdkReadOnlyUrls(rpcs, candidates)?.[122]).toBe('')
        expect(getUrl).not.toHaveBeenCalled()
    })
})
