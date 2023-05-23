import React from 'react'

import { WalletChatWidget } from 'react-wallet-chat'
import { isMobile } from 'react-device-detect'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

const WalletChat = () => {
    const { account, chainId, label } = useActiveWeb3React()

    return (
        <WalletChatWidget
            style={{ marginBottom: isMobile ? '75px' : '0px' }}
            connectedWallet={
                account && chainId
                    ? {
                          walletName: label || '',
                          account: account,
                          chainId,
                      }
                    : undefined
            }
        />
    )
}

export default WalletChat
