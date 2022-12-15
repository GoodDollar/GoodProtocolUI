import React from 'react'
import { useApplicationTheme } from 'state/application/hooks'
import Swap from 'ubeswap-swap-dev'

export const UbeSwap = (): JSX.Element => {
    const [theme] = useApplicationTheme()
    return (
        <div
            className="flex flex-col items-center justify-center w-5/6 h-5/6 rounded-3xl"
            style={{
                padding: '50px 5px',
            }}
        >
            <Swap
                theme={{
                    fontFamily: 'Roboto',
                    primaryColor: '#00b0ff',
                    userDarkMode: theme === 'dark',
                }}
                defaultSwapToken={{
                    address: '0x33265D74abd5ae87cA02A4Fb0C30B7405C8b0682',
                    name: 'GoodDollar',
                    symbol: 'G$',
                    chainId: 42220,
                    decimals: 18,
                    logoURI:
                        'https://raw.githubusercontent.com/GoodDollar/GOodProtocolUI/master/src/assets/images/tokens/gd-logo.png',
                }}
            />
            <span className="flex flex-row items-center justify-center w-full h-2 mt-1 italic font-bold text-gray-400">
                Powered by UbeSwap
            </span>
        </div>
    )
}
