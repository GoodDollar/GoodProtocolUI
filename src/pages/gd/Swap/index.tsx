import React, { cloneElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SwapCardSC, SwapContentWrapperSC, SwapWrapperSC } from './styled'
import SwapRow from './SwapRow'
import { ButtonAction } from 'components/gd/Button'
import { SwitchSVG } from './common'
import SwapInfo from './SwapInfo'
import SwapDetails from './SwapDetails'
import SwapSettings from './SwapSettings'
import { SwapContext, SwapVariant, useTokens } from './hooks'
import { Currency, ETHER } from '@sushiswap/sdk'
import { useCurrencyBalance } from 'state/wallet/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useG$ from 'hooks/useG$'
import useWeb3 from 'hooks/useWeb3'
import { approve as approveBuy, BuyInfo, getMeta as getBuyMeta, getMetaReverse as getBuyMetaReverse } from 'sdk/buy'
import {
    approve as approveSell,
    getMeta as getSellMeta,
    getMetaReverse as getSellMetaReverse,
    SellInfo
} from 'sdk/sell'
import { SupportedChainId } from 'sdk/constants/chains'
import SwapConfirmModal from './SwapConfirmModal'
import { FUSE } from 'constants/index'
import { useDispatch } from 'react-redux'
import SwapDescriptions from './SwapDescriptions'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

import { Info } from 'react-feather'
import QuestionHelper from 'components/QuestionHelper'

import VoltageLogo from 'assets/images/voltage-logo.png'
import GoodReserveLogo from 'assets/images/goodreserve-logo.png'
import sendGa from 'functions/sendGa'

function Swap() {
    const { i18n } = useLingui()
    const [buying, setBuying] = useState(true)
    const [slippageTolerance, setSlippageTolerance] = useState({
        custom: false,
        value: '0.1'
    })
    const { account, chainId } = useActiveWeb3React()
    const network = SupportedChainId[chainId]
    const [swapPair, setSwapPair] = useState<SwapVariant>({
        token: network === 'FUSE' ? FUSE : ETHER,
        value: ''
    })

    useEffect(() => {
        setSwapPair({
            token: network === 'FUSE' ? FUSE : ETHER,
            value: ''
        })
    }, [chainId]) // on first render chainId is undefined

    const handleSetPair = useCallback(
        (value: Partial<SwapVariant>) =>
            setSwapPair(current => ({
                ...current,
                ...value
            })),
        []
    )
    const handleSetPairValue = useCallback((value: string) => handleSetPair({ value }), [])

    const tokenList = useTokens()
    const G$ = useG$()
    const [swapValue, setSwapValue] = useState('')
    const [meta, setMeta] = useState<undefined | null | BuyInfo | SellInfo>()
    const pairBalance = useCurrencyBalance(account ?? undefined, swapPair.token)
    const swapBalance = useCurrencyBalance(account ?? undefined, G$)
    const web3 = useWeb3()
    const [lastEdited, setLastEdited] = useState<{ field: 'external' | 'internal' }>()

    const [calcExternal, setCalcExternal] = useState(false)
    const [calcInternal, setCalcInternal] = useState(false)

    const metaTimer = useRef<any>()
    useEffect(() => {
        clearTimeout(metaTimer.current)
        if (!account || !web3 || !SupportedChainId[Number(chainId)] || !lastEdited) return
        const { field } = lastEdited
        const getMeta = buying
            ? field === 'external'
                ? getBuyMeta
                : getBuyMetaReverse
            : field === 'internal'
            ? getSellMeta
            : getSellMetaReverse
        const value = field === 'external' ? swapPair.value : swapValue
        const symbol = swapPair.token.getSymbol()
        const setOtherValue = field === 'external' ? setSwapValue : handleSetPairValue

        if (!symbol) return
        if (!value.match(/[^0.]/)) {
            setOtherValue('')
            setMeta(undefined)
            return
        }

        const timer = (metaTimer.current = setTimeout(async () => {

          buying && field === 'external' ? setCalcExternal(true) : setCalcInternal(true)

          const meta = await getMeta(web3, symbol, value, parseFloat(slippageTolerance.value)).catch(e => {
              console.error(e)
              return null
          })
          if (metaTimer.current !== timer) return
          if (!meta) return setMeta(null)
          setOtherValue(
              buying
                  ? field === 'external'
                      ? meta.outputAmount.toExact()
                      : meta.inputAmount.toExact()
                  : field === 'external'
                  ? meta.inputAmount.toExact()
                  : meta.outputAmount.toExact()
          )
          setMeta(meta)

          buying && field === 'external' ? setCalcExternal(false) : setCalcInternal(false)
            
        }, 400))
    }, [account, chainId, lastEdited, buying, web3, slippageTolerance.value]) // eslint-disable-line react-hooks/exhaustive-deps
    const [approving, setApproving] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [approved, setApproved] = useState(false)
    const getData = sendGa

    const handleApprove = async () => {
        if (!meta || !web3) return
        try {
          getData({event: 'swap', action: 'approveSwap', 
                   type: buying ? 'buy' : 'sell', network: network})
            setApproving(true)
            if (buying) {
                await approveBuy(web3, meta)
            } else {
                await approveSell(web3, meta)
            }
            setApproved(true)
        } finally {
            setApproving(false)
        }
    }

    useEffect(() => setApproved(false), [swapValue, swapPair, buying])

    const balanceNotEnough = useMemo(
        () =>
            BigInt(meta?.inputAmount.multiply(meta?.inputAmount.decimalScale).toFixed(0) ?? '0') >
            BigInt(buying ? pairBalance?.raw.toString() ?? '0' : swapBalance?.raw.toString() ?? '0'),
        [meta?.inputAmount, pairBalance]
    )

    const route = useMemo(() => {
        const route = meta?.route
            .map(token => {
                return token.symbol === 'WETH9'
                    ? SupportedChainId[Number(chainId)] === 'FUSE'
                        ? 'FUSE'
                        : 'ETH'
                    : token.symbol
            })
            .join(' > ')

        if (!route) return route
        if (SupportedChainId[Number(chainId)] === 'FUSE') return route

        if (buying) {
            return route.endsWith('cDAI') ? `${route} > ${G$?.symbol}` : `${route} > cDAI > ${G$?.symbol}`
        } else {
            return route.startsWith('cDAI') ? `${G$?.symbol} > ${route}` : `${G$?.symbol} > cDAI > ${route}`
        }
    }, [meta?.route, buying, chainId])
    const dispatch = useDispatch()

    const isFuse = SupportedChainId[Number(chainId)] === 'FUSE'

    const metaSymbols = { input: meta?.inputAmount.currency.symbol, output: meta?.outputAmount.currency.symbol }
    const symbols: { [prop: string]: any } = { input: '', output: '' }

    const getWETH9Symbol = () => (isFuse ? 'FUSE' : 'ETH')

    if (meta) {
        for (const [key, symbol] of Object.entries(metaSymbols)) {
            symbols[key] = symbol === 'WETH9' ? getWETH9Symbol() : symbol
        }
    }

    const { input: inputSymbol, output: outputSymbol } = symbols

    const swapFields = {
        minimumReceived:
            meta && `${meta.minimumOutputAmount.toSignificant(4, { groupSeparator: ',' })} ${outputSymbol}`,
        priceImpact: meta && `${meta.priceImpact.toFixed(2, { groupSeparator: ',' })}%`,
        liquidityFee:
            meta &&
            `${meta.liquidityFee.toSignificant(6, { groupSeparator: ',' })} ${meta.liquidityFee.currency.symbol}`,
        route: route,
        GDX:
            (chainId as any) === SupportedChainId.FUSE
                ? undefined
                : meta?.GDXAmount.toFixed(2, { groupSeparator: ',' }),
        exitContribution:
            (chainId as any) === SupportedChainId.FUSE
                ? undefined
                : (meta as SellInfo)?.contribution?.toSignificant(6, { groupSeparator: ',' }),
        price:
            meta &&
            `${
                meta.inputAmount.greaterThan(0)
                    ? meta.outputAmount
                          .multiply(meta.inputAmount.decimalScale)
                          .divide(meta.inputAmount.asFraction)
                          .toSignificant(6, { groupSeparator: ',' })
                    : '0'
            } ${outputSymbol} PER ${inputSymbol} `
    }

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
            token: swapPair.token,
            value: swapPair.value
        },
        {
            token: G$,
            value: swapValue
        }
    ]

    if (!buying) pair.reverse()

    const swapHelperText = isFuse
        ? i18n._(
              t`Voltage is an UNI-V2 Automated Market Maker (AMM) 
                that operates on Fuse Network where G$ is paired to other market tokens such as FUSE or USDC. 
                The liquidity relies on Liquidity Providers that aggregate paired tokens to a pool. 
                Price impact might be too high when the swapping volume of one transaction is relatively high to the total liquidity in the pool.`
          )
        : i18n._(
              t`The GoodReserve is a Bancor-V1 Automated Market Maker (AMM) that operates on Ethereum. 
                This contract is able to mint and burn G$s according to the increase or decrease of it's demand. 
                Price impact is low as G$ liquidity is produced on demand depending by the reserve ratio.`
          )

    return (
        <SwapContext.Provider
            value={{
                slippageTolerance,
                setSlippageTolerance,
                tokenList: tokenList ?? [],
                tokenListLoading: tokenList == null,
                swapPair,
                setSwapPair: handleSetPair,
                buying,
                setBuying
            }}
        >
            <SwapCardSC open={Boolean(meta)}>
                <SwapWrapperSC>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between">
                            <div className="mr-2">
                                <img
                                    src={isFuse ? VoltageLogo : GoodReserveLogo}
                                    alt={isFuse ? 'Voltage logo' : 'GoodReserve logo'}
                                    style={
                                        isFuse
                                            ? {
                                                  height: '40px'
                                              }
                                            : {
                                                  height: '39px'
                                              }
                                    }
                                />
                            </div>

                            <QuestionHelper text={swapHelperText} placement="right-start">
                                <Info size={14} />
                            </QuestionHelper>
                        </div>
                        <SwapSettings />
                    </div>
                    <SwapContentWrapperSC>
                        <SwapRow
                            title={buying ? i18n._(t`Swap from`) : i18n._(t`Swap to`)}
                            select
                            autoMax={buying}
                            balance={pairBalance}
                            style={{ marginBottom: buying ? 13 : 0, marginTop: buying ? 0 : 13, order: buying ? 1 : 3 }}
                            token={swapPair.token}
                            value={swapPair.value}
                            onValueChange={value => {
                                handleSetPairValue(value)
                                setLastEdited({ field: 'external' })
                            }}
                            onTokenChange={token => {
                                handleSetPair({ token, value: '' })
                                setSwapValue('')
                                setMeta(undefined)
                            }}
                            tokenList={tokenList ?? []}
                            isCalculating={calcInternal}
                        />
                        <div className="switch">
                            {cloneElement(SwitchSVG, {
                                onClick: () => setBuying(value => !value)
                            })}
                        </div>
                        <SwapRow
                            title={buying ? i18n._(t`Swap to`) : i18n._(t`Swap from`)}
                            autoMax={!buying}
                            select={false}
                            balance={swapBalance}
                            token={G$}
                            alternativeSymbol="G$"
                            value={swapValue}
                            onValueChange={value => {
                                setSwapValue(value)
                                setLastEdited({ field: 'internal' })
                            }}
                            isCalculating={calcExternal}
                            style={{ marginTop: buying ? 13 : 0, marginBottom: buying ? 0 : 13, order: buying ? 3 : 1 }}
                        />
                        <div style={{ marginTop: 14, padding: '0 4px' }}>
                            <SwapInfo
                                title={i18n._(t`Slippage Tolerance`)}
                                value={`${slippageTolerance.value || '0'}${
                                    slippageTolerance.value.endsWith('%') ? '' : '%'
                                }`}
                            />
                            {meta && <SwapInfo title="Price" value={swapFields.price} />}
                        </div>

                        {!account ? (
                            <ButtonAction style={{ marginTop: 22 }} disabled>
                                Connect wallet
                            </ButtonAction>
                        ) : meta === null || (meta && balanceNotEnough) ? (
                            <ButtonAction style={{ marginTop: 22 }} disabled>
                                Insufficient Funds
                            </ButtonAction>
                        ) : !(swapPair.value || swapValue) ? (
                            <ButtonAction style={{ marginTop: 22 }} disabled>
                                Enter amount
                            </ButtonAction>
                        ) : (
                            <div
                                className={buying && [ETHER, FUSE].includes(swapPair.token) ? 'flex' : 'flex space-x-4'}
                            >
                                {!(buying && [ETHER, FUSE].includes(swapPair.token)) && (
                                    <ButtonAction
                                        className="flex-grow"
                                        style={{ marginTop: 22 }}
                                        width={'auto'}
                                        onClick={handleApprove}
                                        disabled={!meta || approved || approving || balanceNotEnough}
                                    >
                                        {approving
                                            ? i18n._(t`Approving`)
                                            : approved
                                            ? i18n._(t`Approved`)
                                            : i18n._(t`Approve`)}
                                    </ButtonAction>
                                )}
                                <ButtonAction
                                    className="flex-grow"
                                    style={{ marginTop: 22 }}
                                    width={'auto'}
                                    disabled={
                                        !meta ||
                                        balanceNotEnough ||
                                        (buying && [ETHER, FUSE].includes(swapPair.token) ? false : !approved)
                                    }
                                    onClick={() => {
                                      getData({event: 'swap', action: 'startSwap', type: buying ? 'buy' : 'sell', network: network})
                                      setShowConfirm(true)
                                    }}>
                                    {i18n._(t`Swap`)}
                                </ButtonAction>
                            </div>
                        )}
                    </SwapContentWrapperSC>
                </SwapWrapperSC>
                <SwapDetails open={Boolean(meta)} buying={buying} {...swapFields} />
            </SwapCardSC>
            <SwapConfirmModal
                {...swapFields}
                open={showConfirm}
                onClose={() => setShowConfirm(false)}
                setOpen={(value: boolean) => setShowConfirm(value)} 
                pair={pair} 
                meta={meta}
                buying={buying}
                onConfirm={async () => {
                    handleSetPairValue('')
                    setSwapValue('')
                    setMeta(undefined)
                }}
            />
        </SwapContext.Provider>
    )
}

export default memo(Swap)
