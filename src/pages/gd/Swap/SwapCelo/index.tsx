import React from 'react'
import Swap from 'ubeswap-swap-dev'

export const UbeSwap = (): JSX.Element => {
    return (
        <div
            className="flex flex-col items-center justify-center"
            style={{ border: '1px solid rgba(128,0,128,0.2)', borderRadius: '20px', width: '50%', padding: '50px 5px' }}
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
            <span
                className="flex flex-row items-center justify-center"
                style={{
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    width: '100%',
                    height: '10px',
                    marginTop: '-50px',
                    color: 'grey',
                }}
            >
                Powered by UbeSwap
            </span>
        </div>
    )
}
