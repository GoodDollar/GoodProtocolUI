import Web3 from 'web3'
import { BigNumber, ethers } from 'ethers'
import {
    computePriceImpact,
    Currency,
    CurrencyAmount,
    Ether,
    Fraction,
    Percent,
    Token,
    TradeType
} from '@uniswap/sdk-core'
import { Trade } from '@uniswap/v2-sdk'
import { getToken } from 'methods/tokenLists'
import { calculateExitContribution } from 'methods/calculateExitContribution'
import { decimalPercentToPercent, decimalToJSBI, g$FromDecimal } from 'utils/converter'
import { CDAI, FUSE } from 'constants/tokens'
import { v2TradeExactIn } from 'methods/v2TradeExactIn'
import { getAccount, getChainId } from 'utils/web3'
import { debug, debugGroup, debugGroupEnd } from 'utils/debug'
import { computeRealizedLPFeePercent } from 'utils/prices'
import { tokenBalance } from 'utils/tokenBalance'
import { exchangeHelperContract } from 'contracts/ExchangeHelperContract'
import { SupportedChainId } from 'constants/chains'
import { v2TradeExactOut } from 'methods/v2TradeExactOut'
import { ZERO_PERCENT } from 'constants/misc'
import { TransactionDetails } from 'constants/transactions'
import * as fuse from 'contracts/FuseUniswapContract'
import { g$ReservePrice } from 'methods/g$price'
import { prepareValues } from 'functions/prepareValues'
import { cDaiToDai, G$ToCDai, XResult, SwapInfo, cDaiToG$, daiToCDai } from './swap'

export type SellInfo = { contribution: Fraction } & SwapInfo

/**
 * Tries to convert token DAI into X. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} DAI DAI token amount.
 * @param {Currency} to Token X to convert to.
 * @param {Percent} slippageTolerance Slippage tolerance.
 * @returns {DAIResult | null}
 */
export async function DaiToXExactIn(
    web3: Web3,
    DAI: CurrencyAmount<Currency>,
    to: Currency,
    slippageTolerance: Percent
): Promise<XResult | null> {
    const chainId = await getChainId(web3)

    debugGroup(`DAI to ${to.symbol}`)

    const trade = await v2TradeExactIn(DAI, to, { chainId })
    if (!trade) {
        debug('Trade', null)
        debugGroupEnd(`DAI to ${to.symbol}`)

        return null
    }

    const amount = trade.outputAmount
    debug(DAI.currency.symbol, amount.toSignificant(6))

    const minAmount = trade.minimumAmountOut(slippageTolerance)
    debug(`${to.symbol} min`, minAmount.toSignificant(6))

    debugGroupEnd(`DAI to ${to.symbol}`)

    return { amount, minAmount, route: trade.route.path, trade }
}

/**
 * Tries get amount of token DAI from X. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {Currency} DAI DAI token amount.
 * @param {CurrencyAmount<Currency>} to Token X to convert to.
 * @returns {DAIResult | null}
 */
export async function DaiToXExactOut(
    web3: Web3,
    DAI: Currency,
    to: CurrencyAmount<Currency>
): Promise<CurrencyAmount<Currency> | null> {
    const chainId = await getChainId(web3)

    debugGroup(`DAI to ${to.currency.symbol}`)

    const trade = await v2TradeExactOut(DAI, to, { chainId })
    if (!trade) {
        debug('Trade', null)
        debugGroupEnd(`DAI to ${to.currency.symbol}`)

        return null
    }

    debug(DAI.symbol, trade.inputAmount.toSignificant(6))
    debugGroupEnd(`DAI to ${to.currency.symbol}`)

    return trade.inputAmount
}

/**
 * Tries to convert token G$ into X. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency G$ token amount.
 * @param {Currency} to Token X to convert to.
 * @param {Percent} slippageTolerance Slippage tolerance.
 * @returns {DAIResult | null}
 */
export async function G$ToXExactIn(
    web3: Web3,
    currency: CurrencyAmount<Currency>,
    to: Currency,
    slippageTolerance: Percent
): Promise<XResult | null> {
    const chainId = await getChainId(web3)

    debugGroup(`G$ to ${to.symbol}`)

    const trade = await v2TradeExactIn(currency, to, { chainId })
    if (!trade) {
        debug('Trade', null)
        debugGroupEnd(`G$ to ${to.symbol}`)

        return null
    }

    const amount = trade.outputAmount
    debug(to.symbol, amount.toSignificant(6))

    const minAmount = trade.minimumAmountOut(slippageTolerance)
    debug(`${to.symbol} min`, minAmount.toSignificant(6))

    debugGroupEnd(`G$ to ${to.symbol}`)

    return { amount, minAmount, route: trade.route.path, trade }
}

/**
 * Tries get amount of token G$ from X. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {Currency} G$ G$ token amount.
 * @param {CurrencyAmount<Currency>} to Token X to convert to.
 * @returns {DAIResult | null}
 */
export async function G$ToXExactOut(
    web3: Web3,
    G$: Currency,
    to: CurrencyAmount<Currency>
): Promise<CurrencyAmount<Currency> | null> {
    const chainId = await getChainId(web3)

    debugGroup(`G$ to ${to.currency.symbol}`)

    const trade = await v2TradeExactOut(G$, to, { chainId })
    if (!trade) {
        debug('Trade', null)
        debugGroupEnd(`G$ to ${to.currency.symbol}`)

        return null
    }

    debug(to.currency.symbol, trade.inputAmount.toSignificant(6))
    debugGroupEnd(`G$ to ${to.currency.symbol}`)

    return trade.inputAmount
}

/**
 * Calculates liquidity fee and price impact on uniswap.
 * @param {Trade<Currency, Currency, TradeType>} trade Trade returned by uniswap.
 * @returns {{ liquidityFee: CurrencyAmount<Currency>, priceImpact: Percent }}
 */
export function realizedLPFeePriceImpact(trade: Trade<Currency, Currency, TradeType>): {
    liquidityFee: CurrencyAmount<Currency>
    priceImpact: Percent
} {
    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent)
    const liquidityFee = trade.inputAmount.multiply(realizedLpFeePercent)

    debug('Price impact', priceImpact.toSignificant(6))
    debug('Liquidity fee', liquidityFee.toSignificant(6))

    return { liquidityFee, priceImpact }
}

/**
 * Returns trade information for selling G$.
 * @param {Web3} web3 Web3 instance.
 * @param {string} toSymbol Symbol of the token that you want to get while selling G$.
 * @param {number | string} amount Amount of given currency.
 * @param {number} slippageTolerance Slippage tolerance while exchange tokens.
 */
export async function getSellMeta(
    web3: Web3,
    toSymbol: string,
    amount: number | string,
    slippageTolerance = 0.5
): Promise<SellInfo | null> {
    const chainId = await getChainId(web3)
    const account = await getAccount(web3)

    debugGroup(`Get meta ${amount} G$ to ${toSymbol}`)

    const G$ = await getToken(chainId, 'G$')
    if (!G$) {
        throw new Error('Unsupported chain ID')
    }

    let TO: Currency
    if (toSymbol === 'ETH') {
        TO = Ether.onChain(chainId)
    } else if (toSymbol === 'FUSE') {
        TO = FUSE
    } else {
        TO = (await getToken(chainId, toSymbol)) as Currency
    }

    if (!TO) {
        throw new Error('Unsupported token')
    }

    const DAI = (await getToken(chainId, 'DAI')) as Token

    let DAIAmount: CurrencyAmount<Currency | Token> | null = null
    let cDAIAmount: CurrencyAmount<Currency | Token> | null = null

    const inputAmount: CurrencyAmount<Currency> = await g$FromDecimal(chainId, amount)
    let outputAmount: CurrencyAmount<Currency>
    let outputCDAIValue: CurrencyAmount<Currency>
    let minimumOutputAmount: CurrencyAmount<Currency>
    let route: Token[]
    let trade: Trade<Currency, Currency, TradeType> | null = null

    let priceImpact = new Fraction(0)
    let liquidityFee = CurrencyAmount.fromRawAmount(G$, '0')
    let GDXBalance: CurrencyAmount<Currency> | Fraction = new Fraction(0)

    let contribution = CurrencyAmount.fromRawAmount(G$, '0')

    const slippageTolerancePercent = decimalPercentToPercent(slippageTolerance)

    if (chainId === SupportedChainId.FUSE) {
        const g$trade = await G$ToXExactIn(web3, inputAmount, TO, slippageTolerancePercent)
        if (!g$trade) {
            return null
        }

        trade = g$trade.trade
        ;({ priceImpact, liquidityFee } = realizedLPFeePriceImpact(g$trade.trade))
        ;({ amount: outputAmount, minAmount: minimumOutputAmount, route } = g$trade)
    } else {
        contribution = await calculateExitContribution(web3, inputAmount, account)
        const inputWithoutContribution = inputAmount.subtract(contribution)
        if (TO.symbol === 'G$') {
            return null
        } else if (TO.symbol === 'cDAI') {
            ;({ amount: outputAmount, minAmount: minimumOutputAmount } = await G$ToCDai(
                web3,
                inputWithoutContribution,
                slippageTolerancePercent
            ))

            DAIAmount = CurrencyAmount.fromRawAmount(DAI, 0)
            cDAIAmount = minimumOutputAmount
            outputCDAIValue = outputAmount
            route = [CDAI[chainId]]
        } else if (TO.symbol === 'DAI') {
            ;({ amount: outputAmount, minAmount: cDAIAmount } = await G$ToCDai(
                web3,
                inputWithoutContribution,
                slippageTolerancePercent
            ))

            outputCDAIValue = outputAmount
            minimumOutputAmount = DAIAmount = await cDaiToDai(web3, cDAIAmount)
            outputAmount = await cDaiToDai(web3, outputAmount)
            route = [DAI]
        } else {
            ;({ minAmount: cDAIAmount } = await G$ToCDai(web3, inputWithoutContribution, slippageTolerancePercent))

            DAIAmount = await cDaiToDai(web3, cDAIAmount)

            const daiTrade = await DaiToXExactIn(web3, DAIAmount, TO, slippageTolerancePercent)
            if (!daiTrade) {
                return null
            }

            //calcualte how much the output currency that we got, is worth in cDAI
            outputCDAIValue = await daiToCDai(web3, DAIAmount.subtract(DAIAmount.multiply(daiTrade.trade.priceImpact)))

            trade = daiTrade.trade
            ;({ priceImpact, liquidityFee } = realizedLPFeePriceImpact(daiTrade.trade))
            ;({ amount: outputAmount, minAmount: minimumOutputAmount, route } = daiTrade)
        }

        const { cDAI: price } = await g$ReservePrice(web3, chainId)
        priceImpact = computePriceImpact(price.invert(), inputWithoutContribution, outputCDAIValue)

        GDXBalance = await tokenBalance(web3, 'GDX', account)
    }

    debugGroupEnd(`Get meta ${amount} G$ to ${toSymbol}`)

    return {
        inputAmount,
        outputAmount,
        minimumOutputAmount,

        DAIAmount,
        cDAIAmount,
        GDXAmount: inputAmount.lessThan(GDXBalance) ? inputAmount : GDXBalance,

        priceImpact,
        slippageTolerance: slippageTolerancePercent,
        contribution,

        liquidityFee,
        liquidityToken: DAI,

        route,
        trade
    }
}

/**
 * Returns trade information for selling G$ for exact token amount.
 * @param {Web3} web3 Web3 instance.
 * @param {string} toSymbol Symbol of the token that you want to get while selling G$.
 * @param {number | string} toAmount Amount of how much token want to receive.
 * @param {number} slippageTolerance Slippage tolerance while exchange tokens.
 */
export async function getSellMetaReverse(
    web3: Web3,
    toSymbol: string,
    toAmount: number | string,
    slippageTolerance = 0.5
): Promise<SellInfo | null> {
    const chainId = await getChainId(web3)

    debugGroup(`Get meta ${toAmount} ${toSymbol} to G$`)

    const G$ = await getToken(chainId, 'G$')
    if (!G$) {
        throw new Error('Unsupported chain ID')
    }

    let TO: Currency
    if (toSymbol === 'ETH') {
        TO = Ether.onChain(chainId)
    } else if (toSymbol === 'FUSE') {
        TO = FUSE
    } else {
        TO = (await getToken(chainId, toSymbol)) as Currency
    }

    if (!TO) {
        throw new Error('Unsupported token')
    }

    const DAI = (await getToken(chainId, 'DAI')) as Token

    const inputAmount: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(TO, decimalToJSBI(toAmount, TO.decimals))

    let result
    if (chainId === SupportedChainId.FUSE) {
        result = await G$ToXExactOut(web3, G$, inputAmount)
    } else {
        if (TO.symbol === 'G$') {
            result = null
        } else if (TO.symbol === 'cDAI') {
            const { amount } = await cDaiToG$(web3, inputAmount, ZERO_PERCENT)
            result = amount
        } else if (TO.symbol === 'DAI') {
            const cDai = await daiToCDai(web3, inputAmount)
            const { amount } = await cDaiToG$(web3, cDai, ZERO_PERCENT)
            result = amount
        } else {
            const dai = await DaiToXExactOut(web3, DAI, inputAmount)
            if (!dai) {
                result = null
            } else {
                const cDai = await daiToCDai(web3, dai)
                const { amount } = await cDaiToG$(web3, cDai, ZERO_PERCENT)
                result = amount
            }
        }
    }

    debugGroupEnd(`Get meta ${toAmount} ${toSymbol} to G$`)

    if (!result) {
        return null
    }

    return getSellMeta(web3, toSymbol, result.toExact(), slippageTolerance)
}

/**
 * Swap tokens.
 * @param {Web3} web3 Web3 instance.
 * @param {SwapInfo} meta Result of the method getMeta() execution.
 * @param {Function} onSent On sent event listener.
 */
export async function sell(
    web3: Web3,
    meta: SwapInfo,
    onSent?: (transactionHash: string, from: string) => void
): Promise<TransactionDetails> {
    const chainId = await getChainId(web3)

    if (chainId === SupportedChainId.FUSE) {
        return fuse.swap(web3, meta.trade!, meta.slippageTolerance, onSent)
    } else {
        const account = await getAccount(web3)

        const contract = await exchangeHelperContract(web3)

        const { input, minReturn, minDai } = prepareValues(meta, 'sell')

        // Convert into addresses
        const route: string[] = meta.route.map(token => token.address)

        const req = contract.methods
            .sell(
                route,
                BigNumber.from(input),
                BigNumber.from(minDai),
                BigNumber.from(minReturn),
                ethers.constants.AddressZero
            )
            .send({
                from: account,
                type: '0x2' //force eip1599 on ethereum
            })

        if (onSent) req.on('transactionHash', (hash: string) => onSent(hash, account))
        return req
    }
}
