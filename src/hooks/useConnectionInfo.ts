import { useAppKitAccount, useAppKitNetwork, useWalletInfo } from '@reown/appkit/react'
import { useMemo } from 'react'
import { getSafeChainId } from '../utils/chain'
import { SupportedChains } from '@gooddollar/web3sdk-v2'

export interface ConnectionInfo {
    address?: string
    chainId: number
    walletInfo?: ReturnType<typeof useWalletInfo>['walletInfo']
    isConnected: boolean
    isSupportedChain: boolean
    connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
}

export const useConnectionInfo = (): ConnectionInfo => {
    const { address } = useAppKitAccount()
    const { chainId: rawChainId } = useAppKitNetwork()
    const { walletInfo } = useWalletInfo()

    return useMemo(() => {
        const chainId = getSafeChainId(rawChainId)
        const isConnected = Boolean(address)
        // Check if chainId is in SupportedChains enum (automatically includes new chains)
        const isSupportedChain = Object.values(SupportedChains).includes(chainId as SupportedChains)

        let connectionStatus: ConnectionInfo['connectionStatus'] = 'disconnected'
        if (address && isSupportedChain) {
            connectionStatus = 'connected'
        } else if (address && !isSupportedChain) {
            connectionStatus = 'error'
        } else if (walletInfo?.status === 'connecting') {
            connectionStatus = 'connecting'
        }

        return {
            address,
            chainId,
            walletInfo,
            isConnected,
            isSupportedChain,
            connectionStatus,
        }
    }, [address, rawChainId, walletInfo])
}
