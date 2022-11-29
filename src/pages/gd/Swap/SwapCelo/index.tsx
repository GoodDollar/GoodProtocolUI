import React from 'react'
import Swap from 'ubeswap-swap-dev'

export const UbeSwap = (): JSX.Element => {
    return (
        <div
            className="flex flex-col items-center justify-center w-5/6 h-5/6 rounded-3xl"
            style={{
                backgroundColor: 'rgba(229, 247, 255, 0.52)',
                padding: '50px 5px',
            }}
        >
            <Swap
                defaultSwapToken={{
                    address: '0x33265D74abd5ae87cA02A4Fb0C30B7405C8b0682',
                    name: 'GoodDollar',
                    symbol: 'G$',
                    chainId: 42220,
                    decimals: 18,
                }}
            />
            <span className="flex flex-row items-center justify-center w-full h-2 mt-1 italic font-bold text-gray-400">
                Powered by UbeSwap
            </span>
        </div>
    )
}
