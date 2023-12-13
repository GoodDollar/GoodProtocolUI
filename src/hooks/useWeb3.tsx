import React, { ReactNode, ReactNodeArray, useEffect, useMemo } from 'react'
import { BigNumber, ethers } from 'ethers'
import Web3 from 'web3'
import { ExternalProvider } from '@ethersproject/providers'
import { Goerli, Mainnet } from '@usedapp/core'
import { ChainId } from '@sushiswap/sdk'
import { DAO_NETWORK, GdSdkContext, useEnvWeb3 } from '@gooddollar/web3sdk'
import { AsyncStorage, Celo, Fuse, Web3Provider } from '@gooddollar/web3sdk-v2'

import useActiveWeb3React from './useActiveWeb3React'
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
    const [currentNetwork, rpcs] = useMemo(
        () => [
            import.meta.env.REACT_APP_NETWORK || 'fuse',
            {
                MAINNET_RPC:
                    import.meta.env.REACT_APP_MAINNET_RPC ||
                    (ethers.getDefaultProvider('mainnet') as any).providerConfigs[0].provider.connection.url,
                FUSE_RPC: import.meta.env.REACT_APP_FUSE_RPC || 'https://rpc.fuse.io',
                CELO_RPC: import.meta.env.REACT_APP_CELO_RPC || 'https://forno.celo.org',
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
    const { eipProvider, chainId } = useActiveWeb3React()

    const [mainnetWeb3] = useEnvWeb3(DAO_NETWORK.MAINNET)

    const web3 = useMemo(() => (eipProvider ? new Web3(eipProvider as any) : mainnetWeb3), [eipProvider, mainnetWeb3])
    const webprovider = useMemo(
        () => eipProvider && new ethers.providers.Web3Provider(eipProvider as ExternalProvider, 'any'),
        [eipProvider]
    )

    if (webprovider) {
        webprovider.send = async (method: string, params: any) => {
            if (chainId === (42220 as ChainId) && method === 'eth_sendTransaction') {
                params[0].gasPrice = BigNumber.from(5e9).toHexString()
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
                    networks: [Goerli, Mainnet, Fuse, Celo],
                    readOnlyChainId: undefined,
                    readOnlyUrls: {
                        1: 'https://rpc.ankr.com/eth',
                        122: 'https://rpc.fuse.io',
                        42220: import.meta.env.REACT_APP_CELO_RPC || 'https://forno.celo.org',
                    },
                }}
            >
                {children}
            </Web3Provider>
        </GdSdkContext.Provider>
    )
}
