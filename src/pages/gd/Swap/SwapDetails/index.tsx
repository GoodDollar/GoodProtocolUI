import React, { CSSProperties, memo } from 'react'
import { SwapDetailsSC } from './styled'
import SwapInfo from '../SwapInfo'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export interface SwapDetailsFields {
    minimumReceived?: string | null
    maxPaid?: string
    priceImpact?: string | null
    liquidityFee?: string | null
    route?: string | null
    GDX?: string | null
    exitContribution?: string | null
}

export interface SwapDetailsProps extends SwapDetailsFields {
    className?: string
    style?: CSSProperties
    open?: boolean
    buying?: boolean
}

const SwapDetails = memo(
    ({
        className,
        style,
        open,
        minimumReceived,
        maxPaid,
        priceImpact,
        liquidityFee,
        route,
        exitContribution,
    }: SwapDetailsProps) => {
        const { i18n } = useLingui()

        return (
            <SwapDetailsSC className={className} style={style} $open={open}>
                {minimumReceived && (
                    <SwapInfo
                        title={i18n._(t`Minimum received`)}
                        value={minimumReceived}
                        tip={i18n._(t`The minimum amount of tokens to receive.`)}
                    />
                )}
                {maxPaid && (
                    <SwapInfo
                        title={i18n._(t`Maximum sold`)}
                        value={maxPaid}
                        tip={i18n._(t`The maximum amount of tokens to sell.`)}
                    />
                )}
                <SwapInfo
                    title={i18n._(t`Price Impact`)}
                    value={priceImpact}
                    tip={i18n._(t`The change from the market price to the actual price you are paying`)}
                />
                {liquidityFee && (
                    <SwapInfo
                        title={i18n._(t`Liquidity Provider Fee`)}
                        value={liquidityFee}
                        tip={i18n._(
                            t`Swapping G$ against GoodReserve has no third party fees if you swap from/to cDAI as it's our reserve token. Swapping G$s from/to other assets implies a 0.3% of fee going to 3rd party AMM liquidity providers.`
                        )}
                    />
                )}
                {route && (
                    <SwapInfo
                        title={i18n._(t`Route`)}
                        value={route}
                        tip={i18n._(t`Routing through these tokens resulted in the best price for your trade.`)}
                    />
                )}
                {exitContribution && (
                    <SwapInfo
                        tip={i18n._(t`A contribution to the reserve paid by members for directly selling G$ tokens.`)}
                        title="EXIT CONTRIBUTION"
                        value={exitContribution}
                    />
                )}
            </SwapDetailsSC>
        )
    }
)

export default SwapDetails
