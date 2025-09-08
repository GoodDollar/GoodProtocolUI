import React, { FC, useEffect, useRef } from 'react'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { AsyncStorage, getDevice, SupportedChains } from '@gooddollar/web3sdk-v2'
import { Web3ActionButton } from '@gooddollar/good-design'
import { noop } from 'lodash'

import useSendAnalyticsData from '../../hooks/useSendAnalyticsData'

/**
 * Just a button to trigger the onboard connect modal.
 * any state updates after succesfully connecting are handled by useOnboardConnect (src/hooks/useActiveOnboard)
 * @returns Connect Button or Empty
 */

export const clearDeeplink = () => {
    const osName = getDevice().os.name
    // temp solution for where it tries and open a deeplink for desktop app
    if (['Linux', 'Windows', 'macOS', 'iOS'].includes(osName)) {
        AsyncStorage.safeRemove('WALLETCONNECT_DEEPLINK_CHOICE')
    }
}

export const OnboardConnectButton: FC = () => {
    const { address } = useAppKitAccount()
    const { open } = useAppKit()
    const sendData = useSendAnalyticsData()
    const { i18n } = useLingui()
    const buttonText = i18n._(t`Connect to a wallet`)
    // flag to detect for wallet connected only after we pressed a button
    const connectionStartedRef = useRef(false)

    const onWalletConnect = async () => {
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
            supportedChains={[SupportedChains.CELO, SupportedChains.MAINNET, SupportedChains.FUSE]}
            handleConnect={onWalletConnect}
            variant={'outlined'}
            isDisabled={false}
            isLoading={false}
        />
    )
}

// Note: OnboardProviderWrapper is no longer needed as we're using AppKit
// The AppKitProvider is already set up in src/index.tsx
