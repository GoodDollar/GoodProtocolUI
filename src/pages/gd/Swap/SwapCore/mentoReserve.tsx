import React, { cloneElement, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { ErrorModal } from '@gooddollar/good-design'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Spinner } from 'native-base'
import { useSwapMeta, useSwap } from '@gooddollar/web3sdk-v2'
import { SupportedChainId } from '@gooddollar/web3sdk'
import { debounce } from 'lodash'
import { BigNumber, ethers } from 'ethers'
import { Token, Percent, CurrencyAmount } from '@uniswap/sdk-core'
import { Currency, TokenAmount } from '@sushiswap/sdk'
import { Info } from 'react-feather'

import { SwapCardSC, SwapContentWrapperSC, SwapWrapperSC } from '../styled'
import SwapRow from '../SwapRow'
import { ButtonAction } from 'components/gd/Button'
import { SwitchSVG } from '../common'
import SwapInfo from '../SwapInfo'
import SwapDetails from '../SwapDetails'
import SwapSettings from '../SwapSettings'
import { SwapContext } from '../hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useG$ from 'hooks/useG$'

import SwapConfirmModal from '../SwapConfirmModal'

import QuestionHelper from 'components/QuestionHelper'

import GoodReserveLogo from 'assets/images/goodreserve-logo.png'
import useSendAnalyticsData from 'hooks/useSendAnalyticsData'
import { useReserveToken } from 'hooks/useReserveToken'

const MentoSwap = memo(() => {
    const CUSD = useReserveToken()
    const { i18n } = useLingui()
    const [buying, setBuying] = useState(true)
    const [error, setError] = useState<{ message: string; reason?: string } | undefined>(undefined)
    const [slippageTolerance, setSlippageTolerance] = useState({
        custom: false,
        value: '0.1',
    })
    // console.log('slippageTollerance -->', {slippageTolerance})
    const { account, chainId } = useActiveWeb3React()
    const network = SupportedChainId[chainId]
    const [inputAmount, setInputAmount] = useState('')
    const [outputAmount, setOutputAmount] = useState('')

    const setInputAmountDebounced = useCallback(debounce(setInputAmount, 500), [])
    const setOutputAmountDebounced = useCallback(debounce(setOutputAmount, 500), [])

    const G$ = useG$()
    const cusdBalance = useTokenBalance(account ?? undefined, CUSD)
    const g$Balance = useTokenBalance(account ?? undefined, G$)

    const [swapPair, setSwapPair] = useState({
        input: CUSD,
        output: G$,
    })

    const inputAmountBig = useMemo(
        () => ethers.utils.parseUnits(inputAmount || '0', swapPair.input.decimals),
        [inputAmount]
    )
    const outputAmountBig = useMemo(
        () => ethers.utils.parseUnits(outputAmount || '0', swapPair.output.decimals),
        [outputAmount]
    )

    const [lastEdited, setLastEdited] = useState<{ field: 'output' | 'input' }>()

    const swapMeta = useSwapMeta(
        account || '',
        buying,
        Number(slippageTolerance.value),
        lastEdited?.field === 'input' ? inputAmountBig : undefined,
        lastEdited?.field === 'output' ? outputAmountBig : undefined
    )

    const swapInput: [string, string, any, any] = useMemo(
        () => [
            swapPair.input.address,
            swapPair.output.address,
            lastEdited?.field === 'input'
                ? {
                      input: inputAmountBig.toString(),
                      minAmountOut: outputAmountBig
                          .mul(10000 - +slippageTolerance.value * 100)
                          .div(10000)
                          .toString(),
                  }
                : undefined,
            lastEdited?.field === 'output'
                ? {
                      output: outputAmountBig.toString(),
                      maxAmountIn: inputAmountBig
                          .mul(10000 + +slippageTolerance.value * 100)
                          .div(10000)
                          .toString(),
                  }
                : undefined,
        ],
        [outputAmountBig.toString(), inputAmountBig.toString(), slippageTolerance.value, swapPair.input.address]
    )
    const { swap, approve } = useSwap(swapInput[0], swapInput[1], swapInput[2], swapInput[3])

    const [approving, setApproving] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [approved, setApproved] = useState(false)
    const sendData = useSendAnalyticsData()

    useEffect(() => {
        if (swap?.state?.status === 'Exception') {
            setError({
                message: i18n._(t`Swap transaction failed, please try again.`),
                reason: swap.state.errorMessage,
            })
        }
        if (approve?.state?.status === 'Exception') {
            setError({
                message: i18n._(t`Approve transaction failed, please try again.`),
                reason: approve.state.errorMessage,
            })
        }
    }, [swap?.state?.status, approve?.state?.status])

    useEffect(() => {
        // console.log('swapPair:', swapPair)
        if (!(swapPair.input && swapPair.output)) {
            return
        }
        if (lastEdited?.field === 'input' && swapMeta?.amountOut) {
            const amount = new TokenAmount(swapPair.output, swapMeta.amountOut)
            setOutputAmount(amount.toExact())
        } else if (swapMeta?.amountIn) {
            const amount = new TokenAmount(swapPair.input, swapMeta.amountIn)
            setInputAmount(amount.toExact())
        }
    }, [swapMeta, lastEdited?.field, swapPair])

    const handleApprove = useCallback(async () => {
        if (approved) return
        const type = buying ? 'buy' : 'sell'
        try {
            sendData({ event: 'swap', action: 'swap_approve', type, network })
            setApproving(true)
            await approve.send()
        } catch (e: any) {
            setError({ message: i18n._(t`Transaction failed, please try again`), reason: e.message })
        } finally {
            setApproving(false)
        }
    }, [approved, buying, network])

    useEffect(() => {
        approve.resetState()
    }, [/* used */ inputAmount])

    useEffect(() => {
        const maxAmountIn = inputAmountBig.mul(10000 + +slippageTolerance.value * 100).div(10000)
        if (approve.state.status === 'Success') {
            setApproved(true)
            return
        }
        if (
            lastEdited?.field === 'input' &&
            (buying ? swapMeta?.cusdAllowance : swapMeta?.g$Allowance)?.gte(inputAmountBig)
        ) {
            setApproved(true)
        } else if (
            lastEdited?.field === 'output' &&
            (buying ? swapMeta?.cusdAllowance : swapMeta?.g$Allowance)?.gte(maxAmountIn)
        ) {
            setApproved(true)
        } else setApproved(false)
    }, [lastEdited, buying, swapMeta, approve?.state])

    useEffect(() => {
        if (buying) setSwapPair({ input: CUSD, output: G$ })
        else setSwapPair({ input: G$, output: CUSD })
    }, [buying, G$, CUSD])

    const balanceNotEnough = useMemo(
        () =>
            buying
                ? Number(cusdBalance?.toExact()) < Number(inputAmount)
                : Number(g$Balance?.toExact()) < Number(inputAmount),
        [inputAmount, cusdBalance?.toExact(), g$Balance?.toExact(), buying]
    )

    const metaSymbols = { input: buying ? CUSD.symbol : G$?.symbol, output: buying ? G$?.symbol : CUSD.symbol }
    const symbols: { [prop: string]: any } = metaSymbols

    const { input: inputSymbol, output: outputSymbol } = symbols

    const pair: [
        {
            value?: string
            token?: Currency
        },
        {
            value?: string
            token?: Currency
        }
    ] = [
        {
            token: buying ? CUSD : G$,
            value: inputAmount,
        },
        {
            token: buying ? G$ : CUSD,
            value: outputAmount,
        },
    ]

    const effectivePrice = Number(inputAmount) > 0 ? Number(outputAmount) / Number(inputAmount) : 0
    const curPrice = (swapMeta?.g$Price || BigNumber.from(0)).toNumber() / 10 ** CUSD.decimals

    const priceImpact = useMemo(() => {
        return buying
            ? (1 / curPrice - effectivePrice) * curPrice
            : (curPrice - effectivePrice) / curPrice - swapMeta.exitContribution
    }, [buying, curPrice, effectivePrice, swapMeta.exitContribution])

    const swapFields = {
        minimumReceived:
            lastEdited?.field === 'input'
                ? `${new TokenAmount(swapPair.output, swapMeta.minAmountOut).toFixed(2, {
                      groupSeparator: ',',
                  })} ${outputSymbol}`
                : undefined,
        maxPaid:
            lastEdited?.field === 'output'
                ? `${new TokenAmount(
                      swapPair.output,
                      inputAmountBig
                          .mul(10000 + +slippageTolerance.value * 100)
                          .div(10000)
                          .toString()
                  ).toFixed(2, {
                      groupSeparator: ',',
                  })} ${inputSymbol}`
                : undefined,
        priceImpact: `${Math.abs(priceImpact * 100).toFixed(2)}%`,
        exitContribution: buying
            ? '0%'
            : `${swapMeta.exitContribution * 100}% (${new TokenAmount(swapPair.input, inputAmountBig.toString() || 0n)
                  .multiply(BigInt((swapMeta.exitContribution || 0) * 100))
                  .divide(100n)
                  .toFixed(2)} G$)`,
        price: `${effectivePrice.toPrecision(6)} ${outputSymbol} PER ${inputSymbol} `,
    }

    const swapHelperText = i18n._(
        t`The GoodReserve is an Automated Market Maker (AMM) that operates on Celo and XDC.
              This contract is able to mint and burn G$s according to the increase or decrease of it's demand.
              Price impact is low as G$ liquidity is produced on demand depending by the reserve ratio.`
    )

    const onModalClosed = useCallback(() => setShowConfirm(false), [setShowConfirm])

    const onFromChange = useCallback(
        (value: any) => {
            setInputAmountDebounced(value)
            setLastEdited({ field: 'input' })
        },
        [setInputAmountDebounced, setLastEdited]
    )

    const onToChange = useCallback(
        (value: any) => {
            setOutputAmountDebounced(value)
            setLastEdited({ field: 'output' })
        },
        [setOutputAmountDebounced, setLastEdited]
    )

    // const onTokenChange = useCallback(
    //     (token: any) => {
    //         handleSetPair({ token, value: '' })
    //         setSwapValue('')
    //         setMeta(undefined)
    //     },
    //     [handleSetPair, setSwapValue, setMeta]
    // )

    const onSwitch = useCallback(() => {
        setInputAmount(outputAmount)
        setOutputAmount(inputAmount)
        setBuying((value: boolean) => !value)
    }, [setBuying])

    const onSwap = useCallback(() => {
        sendData({
            event: 'swap',
            action: 'swap_start',
            type: buying ? 'buy' : 'sell',
            network,
        })
        setShowConfirm(true)
    }, [sendData, setShowConfirm, buying, network])

    const onSwapConfirmed = useCallback(async () => {
        setInputAmount('')
        setOutputAmount('')
        sendData({ event: 'swap', action: 'swap_success', type: buying ? 'buy' : 'sell', network })
    }, [setInputAmount, setOutputAmount, buying, network, sendData, swap])

    return (
        <SwapContext.Provider
            value={{
                slippageTolerance,
                setSlippageTolerance,
            }}
        >
            <SwapCardSC open={Boolean(swapMeta)}>
                <SwapWrapperSC>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between">
                            <div className="mr-2">
                                <img
                                    src={GoodReserveLogo}
                                    alt={'GoodReserve logo'}
                                    style={{
                                        height: '39px',
                                    }}
                                />
                            </div>
                            {/* <div style={{ alignContent: 'end', height: '39px' }}>Powered by Mento</div> */}

                            <QuestionHelper text={swapHelperText} placement="right-start">
                                <Info size={14} />
                            </QuestionHelper>
                        </div>
                        <SwapSettings />
                    </div>
                    <SwapContentWrapperSC>
                        <SwapRow
                            title={i18n._(t`Swap from`)}
                            select={false}
                            autoMax={true}
                            balance={buying ? cusdBalance : g$Balance}
                            style={{ marginBottom: 0, marginTop: 0, order: 1 }}
                            token={buying ? CUSD : G$}
                            value={inputAmount}
                            onValueChange={onFromChange}
                            // onTokenChange={onTokenChange}
                            // tokenList={tokenList ?? []}
                            isCalculating={false}
                        />
                        <div className="switch">{cloneElement(SwitchSVG, { onClick: onSwitch })}</div>
                        <SwapRow
                            title={i18n._(t`Swap to`)}
                            autoMax={false}
                            select={false}
                            balance={buying ? g$Balance : cusdBalance}
                            token={buying ? G$ : CUSD}
                            alternativeSymbol="G$"
                            value={outputAmount}
                            onValueChange={onToChange}
                            isCalculating={false}
                            style={{ marginTop: 13, marginBottom: 0, order: 3 }}
                        />
                        <div style={{ marginTop: 14, padding: '0 4px' }}>
                            <SwapInfo
                                title={i18n._(t`Slippage Tolerance`)}
                                value={`${slippageTolerance.value || '0'}${
                                    slippageTolerance.value.endsWith('%') ? '' : '%'
                                }`}
                            />
                            {swapMeta && <SwapInfo title="Price" value={swapFields.price} />}
                        </div>

                        {Number.isNaN(priceImpact) ? (
                            <ButtonAction style={{ marginTop: 22, justifyContent: 'center' }} disabled>
                                <Spinner variant="page-loader" size="sm" color="white" paddingBottom="0" />
                            </ButtonAction>
                        ) : !account ? (
                            <ButtonAction style={{ marginTop: 22 }} disabled>
                                Connect wallet
                            </ButtonAction>
                        ) : !swapMeta || (swapMeta && balanceNotEnough) ? (
                            <ButtonAction style={{ marginTop: 22 }} disabled>
                                Insufficient Funds
                            </ButtonAction>
                        ) : !inputAmount ? (
                            <ButtonAction style={{ marginTop: 22 }} disabled>
                                Enter amount
                            </ButtonAction>
                        ) : (
                            <div className={'flex space-x-4'}>
                                <ButtonAction
                                    className="flex-grow"
                                    style={{ marginTop: 22 }}
                                    width={'auto'}
                                    onClick={handleApprove}
                                    disabled={!swapMeta || approved || approving || balanceNotEnough}
                                >
                                    {approving
                                        ? i18n._(t`Approving`)
                                        : approved
                                        ? i18n._(t`Approved`)
                                        : i18n._(t`Approve`)}
                                </ButtonAction>
                                <ButtonAction
                                    className="flex-grow"
                                    style={{ marginTop: 22 }}
                                    width={'auto'}
                                    disabled={!swapMeta || balanceNotEnough || !approved}
                                    onClick={onSwap}
                                >
                                    {i18n._(t`Swap`)}
                                </ButtonAction>
                            </div>
                        )}
                    </SwapContentWrapperSC>
                </SwapWrapperSC>
                <SwapDetails open={Boolean(swapMeta)} buying={buying} {...swapFields} />
            </SwapCardSC>
            <ErrorModal
                error={error?.message || ''}
                reason={error?.reason}
                overlay="blur"
                onClose={() => setError(undefined)}
            />
            <SwapConfirmModal
                {...swapFields}
                open={showConfirm}
                onClose={onModalClosed}
                setOpen={setShowConfirm}
                swap={swap}
                pair={pair}
                meta={{
                    priceImpact: priceImpact ? new Percent((priceImpact * 100).toFixed(), 100) : new Percent(0, 1),
                    inputAmount: CurrencyAmount.fromRawAmount(
                        new Token(
                            chainId,
                            swapPair.input.address,
                            swapPair.input.decimals,
                            swapPair.input.symbol,
                            swapPair.input.name
                        ),
                        inputAmountBig.toString()
                    ),
                    outputAmount: CurrencyAmount.fromRawAmount(
                        new Token(
                            chainId,
                            swapPair.output.address,
                            swapPair.output.decimals,
                            swapPair.output.symbol,
                            swapPair.output.name
                        ),
                        outputAmountBig.toString()
                    ),
                    minimumOutputAmount: CurrencyAmount.fromRawAmount(
                        new Token(
                            chainId,
                            swapPair.output.address,
                            swapPair.output.decimals,
                            swapPair.output.symbol,
                            swapPair.output.name
                        ),
                        swapMeta.minAmountOut.toString()
                    ),
                }}
                buying={buying}
                onConfirm={onSwapConfirmed}
            />
        </SwapContext.Provider>
    )
})

export default MentoSwap
