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

import { SUPPORTED_CHAIN_IDS, fetchRpcsFromChainlist, getFallbackRpcsByChain } from 'functions/rpcParsing'
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
    const fallbackRpcsByChain = getFallbackRpcsByChain()

    try {
        const extraRpcs = await fetchRpcsFromChainlist().catch(() => fallbackRpcsByChain)

        for (const chainId of SUPPORTED_CHAIN_IDS) {
            const chainRpcs = extraRpcs[chainId] || []
            const testResults = await Promise.all(
                chainRpcs.slice(0, 10).map(async (rpcUrl) => ({
                    rpcUrl,
                    isValid: await testRpc(rpcUrl),
                }))
            )
            const validRpcs = testResults.filter((r) => r.isValid).map((r) => r.rpcUrl)
            rpcsByChain[chainId] = validRpcs.length ? validRpcs : fallbackRpcsByChain[chainId]
        }
    } catch (error) {
        console.warn('[fetchAndTestRpcs] Error during RPC fetch/test:', error)
        rpcInitializationPromise = null
        return fallbackRpcsByChain
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

    const fallbackRpcsByChain = useMemo(() => getFallbackRpcsByChain(), [])

    const [currentNetwork, rpcs] = useMemo(() => {
        const selectedRpcs = {
            1: sample(testifiedRpcs?.['1'] || []) || sample(fallbackRpcsByChain['1']) || '',
            122: sample(testifiedRpcs?.['122'] || []) || sample(fallbackRpcsByChain['122']) || '',
            42220: sample(testifiedRpcs?.['42220'] || []) || sample(fallbackRpcsByChain['42220']) || '',
            50: sample(testifiedRpcs?.['50'] || []) || sample(fallbackRpcsByChain['50']) || '',
        }

        return [process.env.REACT_APP_NETWORK || 'fuse', selectedRpcs]
    }, [testifiedRpcs, fallbackRpcsByChain])

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
            if (
                method === 'eth_getCode' &&
                address &&
                typeof params?.[0] === 'string' &&
                params[0].toLowerCase() === address.toLowerCase()
            ) {
                const code = await webprovider.jsonRpcFetchFunc(method, params)
                if (typeof code === 'string' && code !== '0x' && code !== '0x0') {
                    // @usedapp/core treats any address with non-empty bytecode as a Gnosis Safe and
                    // calls Safe-specific methods (`nonce()`, `ExecutionSuccess`). EIP-7702 delegated
                    // EOAs (0xef0100...) and non-Safe contract wallets must return '0x' here unless
                    // the account actually implements the Gnosis Safe interface (`VERSION()`,
                    // `getThreshold()`, and `nonce()`).
                    if (code.toLowerCase().startsWith('0xef0100')) {
                        return '0x'
                    }
                    const blockTag = params[1] || 'latest'
                    const isDeterministicRevert = (err: unknown): boolean => {
                        const errCode =
                            (err as { code?: unknown; error?: { code?: unknown } } | null)?.error?.code ??
                            (err as { code?: unknown } | null)?.code
                        if (errCode === 3 || errCode === 'CALL_EXCEPTION') return true
                        const text = [
                            (err as { message?: string })?.message,
                            (err as { reason?: string })?.reason,
                            (err as { error?: { message?: string } })?.error?.message,
                        ]
                            .filter((v): v is string => typeof v === 'string')
                            .join(' ')
                        return /execution reverted|revert|VM Exception|invalid opcode|function selector was not recognized/i.test(
                            text
                        )
                    }
                    type ProbeResult =
                        | { status: 'ok'; data: string }
                        | { status: 'reverted' }
                        | { status: 'error'; error: unknown }
                    const probeSelector = async (selector: string): Promise<ProbeResult> => {
                        try {
                            const res = await webprovider.jsonRpcFetchFunc('eth_call', [
                                { to: params[0], data: selector },
                                blockTag,
                            ])
                            if (typeof res !== 'string') {
                                return { status: 'error', error: new Error('Invalid eth_call response') }
                            }
                            if (res === '0x' || res === '0x0') return { status: 'reverted' }
                            return { status: 'ok', data: res }
                        } catch (err) {
                            if (isDeterministicRevert(err)) {
                                return { status: 'reverted' }
                            }
                            try {
                                // If the provider responds to a lightweight liveness check, the eth_call
                                // failure was an unrecognized contract revert rather than a transport failure.
                                await webprovider.jsonRpcFetchFunc('eth_chainId', [])
                                return { status: 'reverted' }
                            } catch {
                                return { status: 'error', error: err }
                            }
                        }
                    }
                    const [versionRes, thresholdRes, nonceRes] = await Promise.all([
                        probeSelector('0xffa1ad74'),
                        probeSelector('0xe75235b8'),
                        probeSelector('0xaffed0e0'),
                    ])
                    if (
                        versionRes.status === 'reverted' ||
                        thresholdRes.status === 'reverted' ||
                        nonceRes.status === 'reverted'
                    ) {
                        return '0x'
                    }
                    const failedProbe = [versionRes, thresholdRes, nonceRes].find(
                        (r): r is { status: 'error'; error: unknown } => r.status === 'error'
                    )
                    if (failedProbe) {
                        throw failedProbe.error
                    }
                    if (
                        versionRes.status === 'ok' &&
                        thresholdRes.status === 'ok' &&
                        nonceRes.status === 'ok'
                    ) {
                        const isValidUint256 = (hex: string) => /^0x[0-9a-fA-F]{64}$/.test(hex)
                        const isGnosisSafe =
                            versionRes.data.length >= 130 &&
                            isValidUint256(thresholdRes.data) &&
                            BigInt(thresholdRes.data) > 0n &&
                            isValidUint256(nonceRes.data)
                        if (!isGnosisSafe) {
                            return '0x'
                        }
                    }
                }
                return code
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

