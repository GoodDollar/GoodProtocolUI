import React, { ReactNode, ReactNodeArray, useEffect, useMemo } from 'react'
import { BigNumber, ethers } from 'ethers'
import Web3 from 'web3'
import { ExternalProvider } from '@ethersproject/providers'
import { Mainnet } from '@usedapp/core'
import { ChainId } from '@sushiswap/sdk'
import { DAO_NETWORK, GdSdkContext, useEnvWeb3 } from '@gooddollar/web3sdk'
import { AsyncStorage, Celo, Fuse, Web3Provider } from '@gooddollar/web3sdk-v2'
import { sample } from 'lodash'
import { useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import type { Provider } from '@reown/appkit/react'

import { getEnv } from 'utils/env'

type NetworkSettings = {
    currentNetwork: string
    rpcs: {
        MAINNET_RPC: string | undefined
        FUSE_RPC: string | undefined
        CELO_RPC: string | undefined
        KOVAN_RPC: string | undefined
        ROPSTEN_RPC: string | undefined
    }
}

export function useNetwork(): NetworkSettings {
    const celoRpcList = sample(process.env.REACT_APP_CELO_RPC?.split(',')) ?? ''
    const fuseRpcList = sample(process.env.REACT_APP_FUSE_RPC?.split(',')) ?? 'https://rpc.fuse.io'
    const mainnetList = sample(['https://eth.llamarpc.com', 'https://1rpc.io/eth'])
    const [currentNetwork, rpcs] = useMemo(
        () => [
            process.env.REACT_APP_NETWORK || 'fuse',
            {
                MAINNET_RPC:
                    mainnetList ||
                    process.env.REACT_APP_MAINNET_RPC ||
                    (ethers.getDefaultProvider('mainnet') as any).providerConfigs[0].provider.connection.url,
                FUSE_RPC: fuseRpcList || 'https://rpc.fuse.io',
                CELO_RPC: celoRpcList || 'https://forno.celo.org',
                KOVAN_RPC: undefined,
                ROPSTEN_RPC: undefined,
            },
        ],
        []
    )

    useEffect(() => {
        AsyncStorage.safeSet('GD_RPCS', rpcs) //this is required for sdk v1
    }, [])

    return { currentNetwork, rpcs }
}

export function Web3ContextProvider({ children }: { children: ReactNode | ReactNodeArray }): JSX.Element {
    const { rpcs } = useNetwork()
    const { chainId } = useAppKitNetwork()
    const { walletProvider } = useAppKitProvider<Provider>('eip155')
    const isMiniPay = window?.ethereum?.isMiniPay
    const [mainnetWeb3] = useEnvWeb3(DAO_NETWORK.MAINNET)

    const web3 = useMemo(
        () => (walletProvider ? new Web3(walletProvider as any) : mainnetWeb3),
        [walletProvider, mainnetWeb3]
    )
    const webprovider = useMemo(
        () => walletProvider && new ethers.providers.Web3Provider(walletProvider as ExternalProvider, 'any'),
        [walletProvider]
    )

    if (webprovider) {
        webprovider.send = async (method: string, params: any) => {
            // for celo force gasPrice to 5 gwei
            if (!isMiniPay && chainId === (42220 as ChainId) && method === 'eth_sendTransaction') {
                params[0].gasPrice = BigNumber.from(25.001e9).toHexString()
            }

            if (chainId === (122 as ChainId) && method === 'eth_sendTransaction') {
                params[0].gasPrice = BigNumber.from(11e9).toHexString()
            }
            return webprovider.jsonRpcFetchFunc(method, params)
        }
    }

    const network = getEnv()
    const contractsEnv = network
    const contractsEnvV2 = network === 'development' ? 'fuse' : network

    return (
        <GdSdkContext.Provider
            value={{
                web3: web3,
                contractsEnv,
                rpcs: rpcs,
            }}
        >
            <Web3Provider
                web3Provider={webprovider}
                env={contractsEnvV2}
                config={{
                    pollingInterval: 15000,
                    networks: [Mainnet, Fuse, Celo],
                    readOnlyChainId: undefined,
                    readOnlyUrls: {
                        1: sample(process.env.REACT_APP_MAINNET_RPC?.split(',')) ?? 'https://eth.llamarpc.com',
                        122: sample(process.env.REACT_APP_FUSE_RPC?.split(',')) || 'https://rpc.fuse.io',
                        42220: sample(process.env.REACT_APP_CELO_RPC?.split(',')) || 'https://forno.celo.org',
                    },
                }}
            >
                {children}
            </Web3Provider>
        </GdSdkContext.Provider>
    )
}
