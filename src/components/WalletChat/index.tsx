import React from 'react'

import { WalletChatWidget } from 'react-wallet-chat-gd'
import { useScreenSize } from '@gooddollar/good-design'
import { useAppKitProvider } from '@reown/appkit/react'
import type { Provider } from '@reown/appkit/react'
import { useConnectionInfo } from 'hooks/useConnectionInfo'
import { getSafeChainId } from 'utils/chain'

const WalletChat = () => {
    const { walletProvider } = useAppKitProvider<Provider>('eip155')
    const { address, chainId, walletInfo } = useConnectionInfo()

    const { isDesktopView } = useScreenSize()
    return (
        <WalletChatWidget
            style={{ marginBottom: !isDesktopView ? 50 : '0px' }}
            connectedWallet={
                address && chainId
                    ? {
                          walletName: walletInfo?.name || '',
                          account: address,
                          chainId: getSafeChainId(chainId),
                          provider: walletProvider,
                      }
                    : undefined
            }
        />
    )
}

export default WalletChat
