import React, { CSSProperties, memo, ReactNode, useEffect, useState } from 'react'
import { SwapConfirmModalSC } from './styled'
import Modal from 'components/Modal'
import Title from 'components/gd/Title'
import { SwapDetailsFields } from '../SwapDetails'
import SwapInfo from '../SwapInfo'
import { ButtonAction, ButtonDefault } from 'components/gd/Button'
import CurrencyLogo from 'components/CurrencyLogo'
import { Currency } from '@sushiswap/sdk'
import { addTransaction } from 'state/transactions/actions'
import { useDispatch } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getExplorerLink } from 'utils'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import confirmPriceImpactWithoutFee from 'components/swap/confirmPriceImpactWithoutFee'
import { Percent } from '@sushiswap/sdk'
import sendGa from 'functions/sendGa'

import ShareTransaction from 'components/ShareTransaction'

import {
  buy, 
  SwapInfo as BuyInfo,
  sell,
  SellInfo,
  useGdContextProvider,
  SupportedChainId
} from '@gooddollar/web3sdk'

export interface SwapConfirmModalProps extends SwapDetailsFields {
    className?: string
    style?: CSSProperties
    price?: string | null
    onConfirm?: () => any
    pair: [
        {
            value?: string
            token?: Currency
        },
        {
            value?: string
            token?: Currency
        }
    ]
    open: boolean
    onClose: () => void,
    setOpen: (value: boolean) => void,
    meta: BuyInfo | SellInfo | null | undefined
    buying: boolean
}

const initialState = {}

function SwapConfirmModal({
    GDX,
    meta,
    style,
    route,
    price,
    pair,
    open,
    buying,
    onClose,
    setOpen,
    onConfirm,
    className,
    priceImpact,
    liquidityFee,
    minimumReceived,
    exitContribution,
}: SwapConfirmModalProps) {
    const { i18n } = useLingui()
    const [from, to] = pair ?? []
    const globalDispatch = useDispatch()
    const { chainId } = useActiveWeb3React()
    const network = SupportedChainId[chainId]
    const { web3 } = useGdContextProvider()
    const [status, setStatus] = useState<'PREVIEW' | 'CONFIRM' | 'SENT' | 'SUCCESS'>('SENT')
    const [hash, setHash] = useState('')
    const getData = sendGa

    const handleSwap = async () => {
        if (meta && meta.priceImpact && !confirmPriceImpactWithoutFee((meta.priceImpact as unknown) as Percent)) {
            return
        }

        setStatus('CONFIRM')

        const inputSig = meta?.inputAmount.toSignificant(5)
        const minimumOutputSig = meta?.minimumOutputAmount.toSignificant(5)
        const inputSymbol = meta?.inputAmount.currency.symbol
        const outputSymbol = meta?.outputAmount.currency.symbol

        const onSent = (hash: string, from: string) => {
            setStatus('SENT')
            setHash(hash)
            const tradeInfo = {
                input: {
                    decimals: meta?.inputAmount.currency.decimals,
                    symbol: meta?.inputAmount.currency.symbol
                },
                output: {
                    decimals: meta?.outputAmount.currency.decimals,
                    symbol: meta?.outputAmount.currency.symbol
                }
            }
            const summary = i18n._(t`Swapped ${inputSig} ${meta?.inputAmount.currency.symbol} 
                              to a minimum of ${minimumOutputSig} ${meta?.outputAmount.currency.symbol}`)

            globalDispatch(
                addTransaction({
                    chainId: chainId!,
                    hash: hash,
                    from: from,
                    summary: summary,
                    tradeInfo: tradeInfo
                })
            )
            getData({event: "swap", action: "submittedSwap", network: network})
            if (onConfirm) onConfirm()
        }

        try {
            getData({event: "swap", 
                                   action: "confirmSwap", 
                                   amount: buying ? minimumOutputSig : inputSig, 
                                   tokens: [inputSymbol, outputSymbol], 
                                   type: buying ? 'buy' : 'sell', network: network})
            const result = buying ? await buy(web3!, meta!, onSent) : await sell(web3!, meta!, onSent)

            if (meta?.outputAmount.currency.name === 'GoodDollar') {
                setOpen(true)
                setStatus('SUCCESS')
            };

            // let transactionDetails = buying ? await buy(web3!, meta!, prepareTx, onSent) : await sell(web3!, meta!, prepareTx, onSent)
            // globalDispatch(
            //     addTransaction({
            //         chainId: chainId!,
            //         hash: transactionDetails.transactionHash,
            //         from: transactionDetails.from
            //     })
            // )
        } catch (e) {
            console.error(e)
            setStatus('PREVIEW')
        }
    }

    useEffect(() => {
        if (open) {
            setStatus('PREVIEW')
            setHash('')
        }
    }, [open])

    let content: ReactNode

    switch (status) {
        case 'PREVIEW':
            content = (
                <>
                    <Title className="mb-6 text-center">{i18n._(t`Confirm swap`)}</Title>
                    <div className="mb-6 diagram">
                        <div className="icon">
                            <CurrencyLogo currency={from?.token} size={'54px'} />
                        </div>
                        <div className="value">{from?.value}</div>
                        <div className="symbol">{from?.token?.getSymbol()}</div>
                        <div className="direction">
                            <svg
                                width="36"
                                height="36"
                                viewBox="0 0 36 36"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    x="1"
                                    y="1"
                                    width="34"
                                    height="34"
                                    rx="17"
                                    fill="#1FC2AF"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M26 18L24.59 16.59L19 22.17V10H17V22.17L11.42 16.58L10 18L18 26L26 18Z"
                                    fill="white"
                                />
                            </svg>
                        </div>
                        <div className="icon">
                            <CurrencyLogo currency={to?.token} size={'54px'} />
                        </div>
                        <div className="value">{to?.value}</div>
                        <div className="symbol">{to?.token?.getSymbol()}</div>
                    </div>
                    <div className="description">
                        {i18n._(
                            t`Output is estimated. You will receive at least ${minimumReceived} or the transaction will revert`
                        )}
                    </div>
                    <div className="mt-8 mb-8">
                        <SwapInfo title="Price" value={price} />
                        <SwapInfo
                            title={i18n._(t`Minimum received`)}
                            value={minimumReceived}
                            tip={i18n._(
                                t`Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.`
                            )}
                        />
                        <SwapInfo
                            title={i18n._(t`Price Impact`)}
                            value={priceImpact}
                            tip={i18n._(
                                t`Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.`
                            )}
                        />
                        <SwapInfo
                            title={i18n._(t`Liquidity Provider Fee`)}
                            value={liquidityFee}
                            tip={i18n._(
                                t`Swapping G$ against GoodReserve has no third party fees if you swap from/to cDAI as it's our reserve token. Swapping G$s from/to other assets implies a 0.3% of fee going to 3rd party AMM liquidity providers.`
                            )}
                        />
                        <SwapInfo
                            title={i18n._(t`Route`)}
                            value={route}
                            tip={i18n._(t`Routing through these tokens resulted in the best price for your trade.`)}
                        />
                        {GDX && 
                            <SwapInfo 
                                tip={i18n._(t`GDX is a token earned by directly buying G$ from the Reserve. Members with GDX do not pay the contribution exit.`)}
                                title="GDX" 
                                value={GDX} 
                            />
                        }
                        {exitContribution && exitContribution !== undefined && (
                            <SwapInfo 
                                tip={i18n._(t`A contribution to the reserve paid by members for directly selling G$ tokens.`)}
                                title="EXIT CONTRIBUTION" 
                                value={exitContribution} 
                            />
                        )}
                    </div>
                    <ButtonAction onClick={handleSwap} disabled={false}>
                        {i18n._(t`CONFIRM SWAP`)}
                    </ButtonAction>
                </>
            )
            break
        case 'CONFIRM':
            content = (
                <>
                    <Title className="mt-6 mb-6 text-center">{i18n._(t`Waiting for Confirmation`)}</Title>
                    <div className="text-center">
                        {i18n._(t`Swapping`)} {price}
                    </div>
                    <div className="text-center description">{i18n._(t`Confirm this transaction in your wallet`)}</div>
                </>
            )
            break
        case 'SENT':
            content = (
                <>
                    <Title className="mb-6 text-center">{i18n._(t`Transaction Submitted`)}</Title>
                    {chainId && (
                        <div className="text-center">
                            <a
                                className="text-cyan-blue hover:underline"
                                href={getExplorerLink(chainId, hash, 'transaction')}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {i18n._(t`View on explorer`)}
                            </a>
                        </div>
                    )}
                    <div className="flex justify-center mt-1">
                        <ButtonDefault width="auto" className="px-16" onClick={onClose}>
                            {i18n._(t`Close`)}
                        </ButtonDefault>
                    </div>
                </>
            )
            break
        case 'SUCCESS':
            content = (
                <ShareTransaction
                    title={i18n._(t`Swap Completed`)}
                    text={i18n._(t`You just used your crypto for good to help fund crypto UBI for all with GoodDollar!`)}
                    shareProps={{
                        title: i18n._(t`Share with friends`),
                        copyText: 'I just bought GoodDollars at https://goodswap.xyz to make the world better',
                        show: true,
                        linkedin: {
                            url: 'https://gooddollar.org'
                        },
                        twitter: {
                            url: 'https://gooddollar.org',
                            hashtags: ['InvestForGood']
                        },
                        facebook: {
                            url: 'https://gooddollar.org',
                            hashtag: '#InvestForGood'
                        }
                    }}
                />
            )
            break
    }

    return (
        <Modal isOpen={open} showClose onDismiss={onClose}>
            <SwapConfirmModalSC className={className} style={style}>
                {content}
            </SwapConfirmModalSC>
        </Modal>
    )
}

export default memo(SwapConfirmModal)
