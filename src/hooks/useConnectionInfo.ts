import { useAppKitAccount, useAppKitNetwork, useWalletInfo } from '@reown/appkit/react'

export interface ConnectionInfo {
    address?: string
    chainId?: number
    walletInfo?: ReturnType<typeof useWalletInfo>['walletInfo']
    isConnected: boolean
}

export const useConnectionInfo = (): ConnectionInfo => {
    const { address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const { walletInfo } = useWalletInfo()

    return {
        address,
        chainId: typeof chainId === 'string' ? Number(chainId) : chainId,
        walletInfo,
        isConnected: Boolean(address),
    }
}
