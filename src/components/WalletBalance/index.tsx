import React from 'react'
import { ChainId, TokenAmount } from '@sushiswap/sdk'
import { Fragment, useEffect, useState } from 'react'
import { LoadingPlaceHolder } from 'theme/components'
import { AdditionalChainId } from '../../constants'

export interface Balances {
    G$: TokenAmount | undefined
    GDX: TokenAmount | undefined
    GOOD: TokenAmount | undefined
}

export interface BalancesV2 {
    G$: any
    GOOD: any
}

export type WalletBalanceProps = {
    balances: BalancesV2
    chainId: ChainId
}

export default function WalletBalance(props: WalletBalanceProps): JSX.Element {
    const { balances, chainId } = props
    const [balance, setBalance] = useState<JSX.Element[]>()

    useEffect(() => {
        if (balances) {
            const newBalance = Object.entries(balances).map((balance) => {
                const token = balance && balance[0]
                const amount = balance && balance[1]?.amount
                if (Object.values(AdditionalChainId).includes(chainId as any) && token === 'GDX')
                    return <div key={token}></div>
                const frag = (
                    <Fragment key={token}>
                        <span className="flex">
                            {!amount ? (
                                <LoadingPlaceHolder />
                            ) : (
                                amount.format({ suffix: '', prefix: amount.currency.ticker + ' - ' })
                            )}
                        </span>
                    </Fragment>
                )
                return frag
            })
            setBalance(newBalance)
        } else {
            setBalance(undefined)
        }
    }, [chainId, balances])

    return <div className="flex flex-col">{balance}</div>
}
