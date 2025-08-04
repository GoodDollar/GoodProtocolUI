import React from 'react'

import { WalletChatWidget } from 'react-wallet-chat-gd'
import { useScreenSize } from '@gooddollar/good-design'
import { useAppKitAccount, useAppKitNetwork, useWalletInfo } from '@reown/appkit/react'
import { useAppKitProvider } from '@reown/appkit/react'
import type { Provider } from '@reown/appkit/react'

const WalletChat = () => {
    const { walletProvider } = useAppKitProvider<Provider>('eip155')
    const { address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const { walletInfo } = useWalletInfo()

    const { isDesktopView } = useScreenSize()
    return (
        <WalletChatWidget
            style={{ marginBottom: !isDesktopView ? 50 : '0px' }}
            connectedWallet={
                address && chainId
                    ? {
                          walletName: walletInfo?.name || '',
                          account: address,
                          chainId: +(chainId ?? 1),
                          provider: walletProvider,
                      }
                    : undefined
            }
        />
    )
}

export default WalletChat
