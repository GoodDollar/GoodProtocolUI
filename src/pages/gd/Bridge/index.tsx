import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { useSwitchNetwork, SupportedV2Networks } from '@gooddollar/web3sdk-v2'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useApplicationTheme } from 'state/application/hooks'
import {
    KimaTransactionWidget,
    KimaProvider,
    FontSizeOptions,
    ColorModeOptions,
    ModeOptions,
    DAppOptions,
} from '@kimafinance/kima-transaction-widget'
import '@kimafinance/kima-transaction-widget/dist/index.css'
import useSendAnalyticsData from 'hooks/useSendAnalyticsData'
import { KimaModal } from '@gooddollar/good-design'

const Bridge = memo(() => {
    const { library, chainId } = useActiveWeb3React()
    const [theme] = useApplicationTheme()
    const sendData = useSendAnalyticsData()
    const { switchNetwork } = useSwitchNetwork()
    const [bridgeStatus, setBridgeStatus] = useState<boolean | undefined>(undefined)
    const activeChain = useRef({ origin: '', destination: '' })

    useEffect(() => {
        const supportedNetworks = Object.keys(SupportedV2Networks)

        if (chainId === (SupportedV2Networks.CELO as number)) {
            supportedNetworks.reverse()
        }

        const networks = { origin: supportedNetworks[0], destination: supportedNetworks[1] }

        activeChain.current = networks
    }, [/* used */ chainId, activeChain])

    const successHandler = useCallback(() => {
        setBridgeStatus(true)
        sendData({ event: 'kima_bridge', action: 'bridge_success' })
    }, [sendData])

    const errorHandler = useCallback(
        (e) => {
            if (e?.code === 'NETWORK_ERROR') return
            console.log('Kima bridge error:', { message: e?.message, e })
            setBridgeStatus(false)
            sendData({ event: 'kima_bridge', action: 'bridge_failure', error: e?.message })
        },
        [sendData]
    )

    const resetState = () => {
        setBridgeStatus(undefined)
    }

    const switchChainHandler = useCallback(
        async (chainId) => {
            console.log('Kima test log -->', { chainId }) // for testing repeated switch requests
            await switchNetwork(chainId)
        },
        [switchNetwork]
    )

    const options = useMemo(
        () => ({
            theme: {
                colorMode: theme === 'dark' ? ColorModeOptions.dark : ColorModeOptions.light,
                fontSize: FontSizeOptions.medium,
                fontFamily: 'Roboto',
                backgroundColorDark: 'rgb(21, 26, 48)',
            },
            mode: ModeOptions.bridge,
            dAppOption: DAppOptions.G$,
            kimaBackendUrl: 'https://gooddollar-beta.kima.finance',
            kimaNodeProviderQuery: 'https://api_testnet.kima.finance',
            provider: library,
            compliantOption: false,
            autoConnect: false,
            helpURL: 'https://t.me/GoodDollarX',
        }),
        [theme, library]
    )

    return (
        <KimaModal success={bridgeStatus} networks={activeChain.current} resetState={resetState}>
            <KimaProvider>
                <KimaTransactionWidget
                    {...options}
                    successHandler={successHandler}
                    errorHandler={errorHandler}
                    switchChainHandler={switchChainHandler}
                />
            </KimaProvider>
        </KimaModal>
    )
})

export default Bridge
