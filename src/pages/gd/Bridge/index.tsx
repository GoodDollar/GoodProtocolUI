import React, { memo } from 'react'

import {
    KimaTransactionWidget,
    KimaProvider,
    ThemeOptions,
    FontSizeOptions,
    ModeOptions,
    SupportNetworks,
} from '@kimafinance/kima-transaction-widget'
import '@kimafinance/kima-transaction-widget/dist/index.css'

const Bridge = memo(() => {
    return (
        <KimaProvider>
            <div
                style={{
                    margin: '0 5vw',
                }}
            >
                <div className="container">
                    <KimaTransactionWidget
                        theme={ThemeOptions.light}
                        fontSize={FontSizeOptions.medium}
                        mode={ModeOptions.bridge}
                        // kimaBackendUrl='https://transaction_backend.kima.finance'
                        kimaBackendUrl="http://localhost:3001"
                        kimaNodeProviderQuery="https://api_staging_testnet.kima.finance"
                        titleOption={{
                            initialTitle: 'New Purchase',
                        }}
                        useFIAT={true}
                        paymentTitleOption={{
                            title: 'You can now purchase our NFT on Polygon, using funds from other chains.',
                            style: {
                                fontSize: '1.2em',
                                fontWeight: '500',
                            },
                        }}
                        // compliantOption={false}
                        transactionOption={{
                            targetChain: SupportNetworks.AVALANCHE,
                            targetAddress: '0x67cc400c434F691Ed45e452dC8F2Baf0101a9B63',
                            amount: 5,
                        }}
                        txId={33}
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
            </div>
        </KimaProvider>
    )
})

export default Bridge
