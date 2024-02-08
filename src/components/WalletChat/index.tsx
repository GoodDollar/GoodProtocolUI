import React from 'react'

import { WalletChatWidget } from 'react-wallet-chat-gd'
import { useScreenSize } from '@gooddollar/good-design'

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

const WalletChat = () => {
    const { account, chainId, label, eipProvider } = useActiveWeb3React()
    const { isDesktopView } = useScreenSize()
    return (
        <WalletChatWidget
            style={{ marginBottom: !isDesktopView ? 50 : '0px' }}
            connectedWallet={
                account && chainId
                    ? {
                          walletName: label || '',
                          account: account,
                          chainId,
                          provider: eipProvider,
                      }
                    : undefined
            }
        />
    )
}

export default WalletChat
