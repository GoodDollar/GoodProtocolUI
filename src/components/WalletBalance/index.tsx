import React, { memo } from 'react'
import { Fragment } from 'react'
import { LoadingPlaceHolder } from 'theme/components'
import { G$Balances } from '@gooddollar/web3sdk-v2'

export type WalletBalanceProps = {
    balances: G$Balances
}

const WalletBalance = memo(({ balances }: WalletBalanceProps): JSX.Element | null => (
    <div className="flex flex-col">
        {balances &&
            Object.values(balances).map((balance, index) => {
                const { currency } = balance || {}
                if (!currency) {
                    return <div key={index}></div>
                }

                return (
                    <Fragment key={currency.ticker}>
                        <span className="flex">
                            {!balance ? (
                                <LoadingPlaceHolder />
                            ) : (
                                balance?.format({ suffix: '', prefix: currency?.ticker + ' - ' })
                            )}
                        </span>
                    </Fragment>
                )
            })}
    </div>
))

export default WalletBalance
