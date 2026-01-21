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

type RpcCacheEntry = {
    rpcs: Record<string, string[]>
    timestamp: number
}

const gasSettings = {
    42220: {
        maxFeePerGas: BigNumber.from(25.001e9).toHexString(),
        maxPriorityFeePerGas: BigNumber.from(2.5e9).toHexString(),
    },
    122: { maxFeePerGas: BigNumber.from(11e9).toHexString() },
    // 50: { maxFeePerGas: BigNumber.from(12.5e9).toHexString() }, // eip-1559 is only supported on XDC testnet. Last checked 15 november 2025.
}

const CHAINLIST_URL = 'https://raw.githubusercontent.com/DefiLlama/chainlist/refs/heads/main/constants/extraRpcs.js'
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
        return !data.error && (data.result !== undefined || data.result !== null)
    } catch {
        return false
    }
}

async function fetchAndTestRpcs(): Promise<Record<string, string[]>> {
    const rpcsByChain: Record<string, string[]> = {
        MAINNET_RPC: [],
        FUSE_RPC: [],
        CELO_RPC: [],
        XDC_RPC: [],
    }

    try {
        console.log('[fetchAndTestRpcs] Starting RPC fetch and test...')
        const response = await fetch(CHAINLIST_URL)
        if (!response.ok) throw new Error('Failed to fetch chainlist')

        const text = await response.text()
        console.log('[fetchAndTestRpcs] Chainlist fetched, parsing extraRpcs...')
        // Parse "export const extraRpcs" from the JS file
        const match = text.match(/export\s+const\s+extraRpcs\s*=\s*(\{[\s\S]*?\n\})/m)
        if (!match) throw new Error('Could not parse extraRpcs from chainlist')

        // Create a mock privacyStatement object for eval context
        const privacyStatement = {}

        // Safe evaluation of the RPC object with privacyStatement in scope
        const extraRpcs = eval(
            `(function() { const privacyStatement = ${JSON.stringify(privacyStatement)}; return ${match[1]}; })()`
        )
        console.log('[fetchAndTestRpcs] Successfully parsed extraRpcs', extraRpcs)

        // Map chainlist chain IDs to our RPC keys
        const chainMapping: Record<number, string> = {
            1: 'MAINNET_RPC',
            122: 'FUSE_RPC',
            42220: 'CELO_RPC',
            50: 'XDC_RPC',
        }

        // Test RPCs for each chain
        for (const [chainId] of Object.entries(chainMapping)) {
            const chainIdNum = Number(chainId)
            console.log(`[fetchAndTestRpcs] Processing chain ${chainIdNum}...`)

            const chainRpcsData = extraRpcs[chainIdNum] || { rpcs: [] }

            // Handle both old format (array) and new format (object with rpcs property)
            const chainRpcs = Array.isArray(chainRpcsData) ? chainRpcsData : chainRpcsData.rpcs || []
            console.log(`[fetchAndTestRpcs] Found ${chainRpcs.length} RPC entries for ${chainId}`)

            if (Array.isArray(chainRpcs)) {
                // Extract URLs and filter out WebSocket protocols
                const rpcUrlsToTest = chainRpcs
                    .map((rpcEntry) => {
                        if (typeof rpcEntry === 'string') {
                            return rpcEntry
                        }
                        if (typeof rpcEntry === 'object' && rpcEntry !== null && 'url' in rpcEntry) {
                            return rpcEntry.url
                        }
                        return null
                    })
                    .filter((url): url is string => url !== null && !url.startsWith('wss://'))

                console.log(
                    `[fetchAndTestRpcs] Testing ${rpcUrlsToTest.length} HTTP(S) RPCs for ${chainId}:`,
                    rpcUrlsToTest
                )

                // Test all RPCs in parallel
                const testResults = await Promise.all(
                    rpcUrlsToTest.slice(0, 10).map(async (rpcUrl) => ({
                        rpcUrl,
                        isValid: await testRpc(rpcUrl),
                    }))
                )

                // Log individual test results
                testResults.forEach((result) => {
                    console.log(`[fetchAndTestRpcs] ${result.rpcUrl}: ${result.isValid ? '✓ VALID' : '✗ INVALID'}`)
                })

                // Collect valid RPCs
                const validRpcs = testResults.filter((result) => result.isValid).map((result) => result.rpcUrl)
                rpcsByChain[chainId] = validRpcs
                console.log(`[fetchAndTestRpcs] ${chainId} has ${validRpcs.length} valid RPCs`)
            }
        }
        console.log('[fetchAndTestRpcs] RPC testing complete:', rpcsByChain)
    } catch (error) {
        console.warn('[fetchAndTestRpcs] Error during RPC fetch/test:', error)
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
    // Return existing promise if already in progress
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
    // Create initialization promise
    rpcInitializationPromise = (async () => {
        // Try to get cached RPCs first
        const { rpcs: cachedRpcs, expired } = await getRpcCache()

        if (!cachedRpcs || expired) {
            // Fetch and test RPCs if cache miss or expired
            const cachedRpcsResult = dofetch()
            if (!cachedRpcs) {
                return await cachedRpcsResult
            } else {
                // let the fetch happen in background but return the old cached rpcs immediately
                void cachedRpcsResult
            }
        }
        return cachedRpcs
    })()

    return rpcInitializationPromise
}

export function useNetwork(): NetworkSettings {
    const [testifiedRpcs, setTestifiedRpcs] = React.useState<Record<string, string[]> | null>(null)

    const celoRpcList = sample(process.env.REACT_APP_CELO_RPC?.split(',')) ?? 'https://forno.celo.org'
    const fuseRpcList = sample(process.env.REACT_APP_FUSE_RPC?.split(',')) ?? 'https://rpc.fuse.io'
    const xdcRpcList = sample(process.env.REACT_APP_XDC_RPC?.split(',')) ?? 'https://rpc.xinfin.network'
    const mainnetList = sample(['https://eth.llamarpc.com', 'https://1rpc.io/eth']) ?? 'https://eth.llamarpc.com'

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
            setTestifiedRpcs(rpcs)
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
                    if (!params[0].maxFeePerGas && Number(chainId) !== 50) {
                        // params[0].gasPrice = gasPriceSettings[chainId].maxFeePerGas
                        delete params[0].gasPrice
                        params[0] = { ...params[0], ...gasSettingsForChain }
                    } else {
                        params[0] = { ...params[0], ...gasSettingsForChain }
                    }
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
