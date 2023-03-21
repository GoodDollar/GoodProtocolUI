import React, { memo, useCallback, useMemo } from 'react'
import { useSwitchNetwork } from '@gooddollar/web3sdk-v2'
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

const Bridge = memo(() => {
    const { library } = useActiveWeb3React()
    const [theme] = useApplicationTheme()
    const sendData = useSendAnalyticsData()
    const { switchNetwork } = useSwitchNetwork()

    const successHandler = useCallback(() => {
        sendData({ event: 'kima_bridge', action: 'bridge_success' })
    }, [sendData])

    const errorHandler = useCallback(
        (e) => {
            console.log('Kima bridge error:', e?.message, e)
            sendData({ event: 'kima_bridge', action: 'bridge_failure', error: e?.message })
        },
        [sendData]
    )

    const switchChainHandler = useCallback(async (chainId) => await switchNetwork(chainId), [switchNetwork])

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
        <KimaProvider>
            <KimaTransactionWidget
                {...options}
                successHandler={successHandler}
                errorHandler={errorHandler}
                switchChainHandler={switchChainHandler}
            />
        </KimaProvider>
    )
})

export default Bridge
