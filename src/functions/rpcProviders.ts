import { providers } from 'ethers'
import { Config } from '@usedapp/core'
import { filterExcludedRpcs } from './rpcParsing'

// Keep SDK-v1 scalar URLs separate from SDK-v2's read providers.
export function createSdkReadOnlyUrls(
    rpcs: Record<string, string>,
    candidates: Record<string, string[]>
): Config['readOnlyUrls'] {
    const readOnlyUrls: NonNullable<Config['readOnlyUrls']> = { ...rpcs }
    for (const chainId of [122, 42220]) {
        const urls = filterExcludedRpcs([rpcs[chainId] || '', ...(candidates[chainId] || [])])
        if (!urls.length) {
            readOnlyUrls[chainId] = ''
            continue
        }
        readOnlyUrls[chainId] = new providers.FallbackProvider(
            urls.map((url, index) => ({
                provider: new providers.StaticJsonRpcProvider({ url, throttleLimit: 1, timeout: 5000 }, chainId),
                priority: index + 1,
                weight: 1,
                stallTimeout: 1000,
            })),
            1
        )
    }
    return readOnlyUrls
}
