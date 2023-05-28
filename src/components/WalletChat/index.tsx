import React from 'react'

import { WalletChatWidget } from 'react-wallet-chat'
import { isMobile } from 'react-device-detect'

const WalletChat = () => {
    return <WalletChatWidget style={{ marginBottom: isMobile ? '75px' : '0px' }} />
}

export default WalletChat
