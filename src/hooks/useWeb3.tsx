import React, { ReactNode, ReactNodeArray, useEffect, useMemo } from 'react'
import { BigNumber, ethers } from 'ethers'
import Web3 from 'web3'
import { ExternalProvider } from '@ethersproject/providers'
import { Mainnet } from '@usedapp/core'
import { DAO_NETWORK, GdSdkContext, useEnvWeb3 } from '@gooddollar/web3sdk'
import { AsyncStorage, Celo, Fuse, Xdc, Web3Provider } from '@gooddollar/web3sdk-v2'
import { sample } from 'lodash'
import { useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import type { Provider } from '@reown/appkit/react'
import { useAccount } from 'wagmi'

import { FALLBACK_RPCS_BY_CHAIN, fetchRpcsFromChainlistOrFallback } from 'functions/rpcParsing'
import { getEnv } from 'utils/env'
import { isMiniPay, getMiniPayProvider } from 'utils/minipay'

type NetworkSettings = {
    currentNetwork: string
    rpcs: {
        1: string
        122: string
        42220: string
        50: string
    }
    testedRpcs: Record<string, string[]> | null
}

const gasSettings = {
    122: { maxFeePerGas: BigNumber.from(11e9).toHexString() },
    // 50: { maxFeePerGas: BigNumber.from(12.5e9).toHexString() }, // eip-1559 is only supported on XDC testnet. Last checked 15 november 2025.
}

type RpcCacheEntry = {
    rpcs: Record<string, string[]>
    timestamp: number
}

const RPC_CACHE_KEY = 'GD_RPC_CACHE'
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours
const RPC_TEST_TIMEOUT_MS = 5000

let rpcInitializationPromise: Promise<Record<string, string[]>> | null = null

async function testRpc(rpcUrl: string): Promise<boolean> {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), RPC_TEST_TIMEOUT_MS)

        const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_blockNumber',
                params: [],
                id: 1,
            }),
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) return false

        const data = await response.json()
        return !data.error && !!data.result
    } catch {
        return false
    }
}

async function fetchAndTestRpcs(): Promise<Record<string, string[]>> {
    const rpcsByChain: Record<string, string[]> = {}

    try {
        const extraRpcs = await fetchRpcsFromChainlistOrFallback()

        for (const [chainId] of Object.entries(FALLBACK_RPCS_BY_CHAIN)) {
            const chainRpcs = extraRpcs[chainId] || []
            const testResults = await Promise.all(
                chainRpcs.slice(0, 10).map(async (rpcUrl) => ({
                    rpcUrl,
                    isValid: await testRpc(rpcUrl),
                }))
            )
            const validRpcs = testResults.filter((r) => r.isValid).map((r) => r.rpcUrl)
            rpcsByChain[chainId] = validRpcs.length ? validRpcs : FALLBACK_RPCS_BY_CHAIN[chainId]
        }
    } catch (error) {
        console.warn('[fetchAndTestRpcs] Error during RPC fetch/test:', error)
        rpcInitializationPromise = null
        return FALLBACK_RPCS_BY_CHAIN
    }

    return rpcsByChain
}

async function getRpcCache(): Promise<{ rpcs: Record<string, string[]> | null; expired: boolean }> {
    try {
        const cached = await AsyncStorage.getItem(RPC_CACHE_KEY)
        if (!cached) return { rpcs: null, expired: false }

        const cacheEntry: RpcCacheEntry = JSON.parse(cached)
        const isExpired = Date.now() - cacheEntry.timestamp > CACHE_DURATION_MS

        return { rpcs: cacheEntry.rpcs, expired: isExpired }
    } catch {
        return { rpcs: null, expired: false }
    }
}

async function setRpcCache(rpcs: Record<string, string[]>): Promise<void> {
    try {
        const cacheEntry: RpcCacheEntry = {
            rpcs,
            timestamp: Date.now(),
        }
        await AsyncStorage.setItem(RPC_CACHE_KEY, JSON.stringify(cacheEntry))
    } catch (error) {
        console.warn('Failed to cache RPCs:', error)
    }
}

export const initializeRpcs = async () => {
    if (rpcInitializationPromise) {
        return rpcInitializationPromise
    }

    const dofetch = async () => {
        const cachedRpcs = await fetchAndTestRpcs()
        if (Object.values(cachedRpcs).some((arr) => arr.length > 0)) {
            await setRpcCache(cachedRpcs)
        }
        return cachedRpcs
    }

    rpcInitializationPromise = (async () => {
        const { rpcs: cachedRpcs, expired } = await getRpcCache()

        if (!cachedRpcs || expired) {
            const cachedRpcsResult = dofetch()
            if (!cachedRpcs) {
                return await cachedRpcsResult
            } else {
                void cachedRpcsResult
            }
        }
        return cachedRpcs
    })()

    return rpcInitializationPromise
}

export function useNetwork(): NetworkSettings {
    const [testifiedRpcs, setTestifiedRpcs] = React.useState<Record<string, string[]> | null>(null)
    const excludedRpcs = useMemo(
        () =>
            (process.env.REACT_APP_EXCLUDED_RPCS ?? '')
                .split(',')
                .map((value) => value.trim().toLowerCase())
                .filter(Boolean),
        []
    )

    const filterBlockedRpcs = (rpcs: Record<string, string[]>) =>
        Object.fromEntries(
            Object.entries(rpcs).map(([chainId, urls]) => [
                chainId,
                urls.filter((url) => !excludedRpcs.some((blocked) => url.toLowerCase().includes(blocked))),
            ])
        )

    const celoRpcList = sample(process.env.REACT_APP_CELO_RPC?.split(',')) ?? FALLBACK_RPCS_BY_CHAIN['42220'][0]
    const fuseRpcList = sample(process.env.REACT_APP_FUSE_RPC?.split(',')) ?? FALLBACK_RPCS_BY_CHAIN['122'][0]
    const xdcRpcList = sample(process.env.REACT_APP_XDC_RPC?.split(',')) ?? FALLBACK_RPCS_BY_CHAIN['50'][0]
    const mainnetList = sample(FALLBACK_RPCS_BY_CHAIN['1']) ?? FALLBACK_RPCS_BY_CHAIN['1'][0]

    const [currentNetwork, rpcs] = useMemo(() => {
        const selectedRpcs = {
            1: sample(testifiedRpcs?.['1'] || []) || mainnetList,
            122: sample(testifiedRpcs?.['122'] || []) || fuseRpcList,
            42220: sample(testifiedRpcs?.['42220'] || []) || celoRpcList,
            50: sample(testifiedRpcs?.['50'] || []) || xdcRpcList,
        }

        return [process.env.REACT_APP_NETWORK || 'fuse', selectedRpcs]
    }, [testifiedRpcs, mainnetList, fuseRpcList, celoRpcList, xdcRpcList])

    useEffect(() => {
        void initializeRpcs().then((rpcs) => {
            setTestifiedRpcs(filterBlockedRpcs(rpcs))
        })
    }, [])

    useEffect(() => {
        AsyncStorage.safeSet('GD_RPCS', rpcs)
    }, [rpcs])

    return { currentNetwork, rpcs, testedRpcs: testifiedRpcs }
}

export function Web3ContextProvider({ children }: { children: ReactNode | ReactNodeArray }): JSX.Element {
    const { rpcs } = useNetwork()
    const { chainId } = useAppKitNetwork()
    const { walletProvider } = useAppKitProvider<Provider>('eip155')
    const { connector, address } = useAccount()
    const isMiniPayWallet = isMiniPay()
    const [mainnetWeb3] = useEnvWeb3(DAO_NETWORK.MAINNET)

    const resolvedProvider = useMemo(() => {
        if (walletProvider) {
            return walletProvider
        }

        const isMiniPayConnector = connector?.id === 'minipay'
        if (isMiniPayConnector && address) {
            return getMiniPayProvider() as Provider | undefined
        }

        return undefined
    }, [walletProvider, connector?.id, address])

    const web3 = useMemo(
        () => (resolvedProvider ? new Web3(resolvedProvider as any) : mainnetWeb3),
        [resolvedProvider, mainnetWeb3]
    )
    const webprovider = useMemo(
        () => resolvedProvider && new ethers.providers.Web3Provider(resolvedProvider as ExternalProvider, 'any'),
        [resolvedProvider]
    )

    if (webprovider) {
        webprovider.send = async (method: string, params: any) => {
            if (method === 'eth_sendTransaction' && !isMiniPayWallet && chainId && chainId in gasSettings) {
                const gasSettingsForChain = gasSettings[Number(chainId)]
                if (gasSettingsForChain) {
                    delete params[0].gasPrice
                    params[0] = { ...params[0], ...gasSettingsForChain }
                }
            }
            return webprovider.jsonRpcFetchFunc(method, params)
        }
    }

    const network = getEnv()
    const contractsEnv = network
    const contractsEnvV2 = network === 'development' ? 'fuse' : network

    if (!rpcs) return <></>
    return (
        <GdSdkContext.Provider
            value={{
                web3: web3,
                contractsEnv,
                rpcs: {
                    MAINNET_RPC: rpcs['1'],
                    FUSE_RPC: rpcs['122'],
                },
            }}
        >
            <Web3Provider
                web3Provider={webprovider}
                env={contractsEnvV2}
                config={{
                    pollingInterval: 15000,
                    networks: [Mainnet, Fuse, Celo, Xdc],
                    readOnlyChainId: undefined,
                    readOnlyUrls: rpcs,
                }}
            >
                {children}
            </Web3Provider>
        </GdSdkContext.Provider>
    )
}
