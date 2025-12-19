import React, { CSSProperties, memo } from 'react'
import { SwapTokensModalTokenRowSC } from './styled'
import CurrencyLogo from 'components/CurrencyLogo'
import { Currency } from '@sushiswap/sdk'
import { useCurrencyBalance } from 'state/wallet/hooks'
import Loader from 'components/Loader'
import { useAppKitAccount } from '@reown/appkit/react'

export interface SwapTokensModalTokenRowProps extends Omit<JSX.IntrinsicElements['div'], 'ref'> {
    className?: string
    style?: CSSProperties
    token: Currency
    active: boolean
}

const SwapTokensModalTokenRow = memo(
    ({ className, style, token, active, ...divProps }: SwapTokensModalTokenRowProps) => {
        const { address } = useAppKitAccount()
        const balance = useCurrencyBalance(address ?? undefined, token)

        return (
            <SwapTokensModalTokenRowSC className={className} style={style} $active={active} {...divProps}>
                <div className="icon">
                    <CurrencyLogo currency={token} size={'32px'} />
                </div>
                <div className="title">{token.getSymbol()}</div>
                <div className="subtitle">{token.getName()}</div>
                <div className="balance">{balance ? balance.toSignificant(4) : address ? <Loader /> : null}</div>
            </SwapTokensModalTokenRowSC>
        )
    }
)

export default SwapTokensModalTokenRow
