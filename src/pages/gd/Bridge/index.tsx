import React, { memo } from 'react'
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
                    // kimaBackendUrl='https://transaction_backend.kima.finance'
                    kimaBackendUrl="http://54.172.168.100:3001"
                    kimaNodeProviderQuery="https://api_testnet.kima.finance"
                    provider={library}
                    compliantOption={false}
                    errorHandler={(e: any) => {
                        console.log('error:', e)
                    }}
                    successHandler={() => {
                        console.log('success')
                    }}
                    closeHandler={() => {
                        console.log('closed')
                    }}
                />
            </div>
        </KimaProvider>
    )
})

export default Bridge
