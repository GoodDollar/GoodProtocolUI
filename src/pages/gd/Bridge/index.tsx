import React, { memo, useCallback } from 'react'
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

const Bridge = memo(() => {
    const { library } = useActiveWeb3React()
    const [theme] = useApplicationTheme()

    const successHandler = useCallback(() => {
        console.log('Kima bridge success:')
    }, [])

    const errorHandler = useCallback((e) => {
        console.log('Kima bridge error:', e?.message, e)
    }, [])

    return (
        <KimaProvider>
            <div
                className="container"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <KimaTransactionWidget
                    theme={{
                        colorMode: theme === 'light' ? ColorModeOptions.light : ColorModeOptions.dark,
                        fontSize: FontSizeOptions.medium,
                        fontFamily: 'Roboto',
                        backgroundColorDark: 'rgb(21, 26, 48)',
                    }}
                    mode={ModeOptions.bridge}
                    dAppOption={DAppOptions.G$}
                    kimaBackendUrl="https://gooddollar-beta.kima.finance"
                    kimaNodeProviderQuery="https://api_testnet.kima.finance"
                    provider={library}
                    compliantOption={false}
                    successHandler={successHandler}
                    errorHandler={errorHandler}
                />
            </div>
        </KimaProvider>
    )
})

export default Bridge