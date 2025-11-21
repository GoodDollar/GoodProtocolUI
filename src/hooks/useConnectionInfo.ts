import { useAppKitAccount, useAppKitNetwork, useWalletInfo } from '@reown/appkit/react'
import { useMemo } from 'react'
import { getSafeChainId } from '../utils/chain'

export interface ConnectionInfo {
    address?: string
    chainId: number
    walletInfo?: ReturnType<typeof useWalletInfo>['walletInfo']
    isConnected: boolean
    isSupportedChain: boolean
    connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
}

// Supported chain IDs for validation
const SUPPORTED_CHAINS = [1, 122, 42220] // MAINNET, FUSE, CELO

export const useConnectionInfo = (): ConnectionInfo => {
    const { address } = useAppKitAccount()
    const { chainId: rawChainId } = useAppKitNetwork()
    const { walletInfo } = useWalletInfo()

    return useMemo(() => {
        const chainId = getSafeChainId(rawChainId)
        const isConnected = Boolean(address)
        const isSupportedChain = SUPPORTED_CHAINS.includes(chainId)

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
