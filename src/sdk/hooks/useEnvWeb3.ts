import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { getChainId } from '../utils/web3'

import { SupportedChainId, NETWORK_LABELS } from 'sdk/constants/chains'
import { FallbackProvider } from '@ethersproject/providers'
const RPC = {
    [SupportedChainId.MAINNET]:
        process.env.MAINNET_RPC ||
        (ethers.getDefaultProvider('mainnet') as any).providerConfigs[0].provider.connection.url,
    [SupportedChainId.ROPSTEN]:
        process.env.ROPSTEN_RPC ||
        (ethers.getDefaultProvider('ropsten') as any).providerConfigs[0].provider.connection.url,
    [SupportedChainId.KOVAN]:
        process.env.KOVAN_RPC || (ethers.getDefaultProvider('kovan') as any).providerConfigs[0].provider.connection.url,
    [SupportedChainId.FUSE]: process.env.FUSE_RPC || 'https://rpc.fuse.io'
}

const getEnv = () => {
    return localStorage.getItem('GD_NETWORK') || process.env.NETWORK || 'staging'
}
/**
 * Returns provider for chain.
 * @param {number | string} chainId Chain ID.
 */
export const useEnvWeb3 = (
    chainId: SupportedChainId.MAINNET | SupportedChainId.FUSE,
    activeWeb3: Web3 | null = null
): [Web3 | null, SupportedChainId] => {
    const [web3, setWeb3] = useState<[Web3 | null, SupportedChainId]>([null, 0])

    useEffect(() => {
        const getProvider = async () => {
            const networkEnv = getEnv()
            const activeChainId = activeWeb3 && (await getChainId(activeWeb3))
            let provider,
                selectedChainId = SupportedChainId.MAINNET
            if (chainId === SupportedChainId.FUSE) {
                provider = new Web3.providers.HttpProvider(process.env.FUSE_RPC || 'https://rpc.fuse.io/')
            } else {
                //"mainnet" contracts can be on different blockchains depending on env
                switch (networkEnv) {
                    case 'production':
                        provider = new Web3.providers.HttpProvider(RPC[SupportedChainId.MAINNET])
                        selectedChainId = SupportedChainId.MAINNET
                        break
                    case 'staging':
                        console.log('useEnvWeb3: staging', activeChainId)
                        if (
                            activeChainId &&
                            [SupportedChainId.KOVAN, SupportedChainId.ROPSTEN].includes(activeChainId)
                        ) {
                            return setWeb3([activeWeb3, activeChainId])
                        }
                        provider = new Web3.providers.HttpProvider(RPC[SupportedChainId.ROPSTEN])
                        selectedChainId = SupportedChainId.ROPSTEN

                        break
                    default:
                        provider = new Web3.providers.HttpProvider(RPC[SupportedChainId.ROPSTEN])
                        selectedChainId = SupportedChainId.ROPSTEN

                        break
                }
            }
            setWeb3([new Web3(provider), selectedChainId])
        }
        getProvider()
    }, [activeWeb3, chainId])

    return web3
}
