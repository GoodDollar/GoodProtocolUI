import React, { FC, useEffect, useRef } from 'react'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { AsyncStorage, getDevice, SupportedChains } from '@gooddollar/web3sdk-v2'
import { Web3ActionButton } from '@gooddollar/good-design'
import { noop } from 'lodash'
import { useConnect } from 'wagmi'
import { isMiniPay } from '../../utils/minipay'

import useSendAnalyticsData from '../../hooks/useSendAnalyticsData'

export const clearDeeplink = () => {
    const osName = getDevice().os.name
    if (['Linux', 'Windows', 'macOS', 'iOS'].includes(osName)) {
        AsyncStorage.safeRemove('WALLETCONNECT_DEEPLINK_CHOICE')
    }
}

export const OnboardConnectButton: FC = () => {
    const { address } = useAppKitAccount()
    const { open } = useAppKit()
    const { connect, connectors } = useConnect()
    const sendData = useSendAnalyticsData()
    const { i18n } = useLingui()
    const buttonText = i18n._(t`Connect to a wallet`)
    const connectionStartedRef = useRef(false)
    const isMiniPayDetected = isMiniPay()

    const onWalletConnect = async () => {
        if (isMiniPayDetected && !address) {
            const miniPayConn = connectors.find((conn) => conn.id === 'minipay')
            if (miniPayConn) {
                try {
                    connectionStartedRef.current = true
                    sendData({ event: 'wallet_connect', action: 'wallet_connect_start' })
                    connect({ connector: miniPayConn })
                    return false
                } catch (error) {
                    connectionStartedRef.current = false
                    console.warn('MiniPay connect failed:', error)
                }
            }
        }

        connectionStartedRef.current = true
        sendData({ event: 'wallet_connect', action: 'wallet_connect_start' })

        try {
            clearDeeplink()
            await open({ view: 'Connect' })
        } catch {
            connectionStartedRef.current = false
        }

        return false
    }

    useEffect(() => {
        if (!connectionStartedRef.current) {
            return
        }

        if (address) {
            connectionStartedRef.current = false
        }
    }, [address])

    if (address) {
        return null
    }

    return (
        <Web3ActionButton
            text={buttonText}
            web3Action={noop}
            supportedChains={[SupportedChains.CELO, SupportedChains.MAINNET, SupportedChains.FUSE, SupportedChains.XDC]}
            handleConnect={onWalletConnect}
            variant={'outlined'}
            isDisabled={false}
            isLoading={false}
        />
    )
}
