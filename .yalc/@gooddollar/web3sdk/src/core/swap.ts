import Web3 from 'web3'
import { BigNumber } from 'ethers'
import {
  Currency,
  CurrencyAmount,
  Token,
  Percent,
  Fraction,
  TradeType,
} from '@uniswap/sdk-core'
import { cDaiPrice } from 'methods/cDaiPrice'
import { CDAI } from 'constants/tokens'
import { UnexpectedToken } from 'utils/errors'
import { getChainId } from 'utils/web3'
import { getToken } from 'methods/tokenLists'
import { debug, debugGroup, debugGroupEnd } from 'utils/debug'
import { Trade } from '@uniswap/v2-sdk'
import { goodMarketMakerContract } from 'contracts/GoodMarketMakerContract'

export type XResult = {
  amount: CurrencyAmount<Currency>
  minAmount: CurrencyAmount<Currency>
  route: Token[]
  trade: Trade<Currency, Currency, TradeType>
}
type TokenResult = Omit<XResult, 'route' | 'trade'>

export type SwapInfo = {
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  minimumOutputAmount: CurrencyAmount<Currency>

  DAIAmount: CurrencyAmount<Currency> | null
  cDAIAmount: CurrencyAmount<Currency> | null
  GDXAmount: CurrencyAmount<Currency> | Fraction

  priceImpact: Fraction
  slippageTolerance: Percent

  liquidityFee: CurrencyAmount<Currency>
  liquidityToken: Currency

  route: Token[]
  trade: Trade<Currency, Currency, TradeType> | null
}

//-- Buy

let index = 0

/**
 * Tries to convert token cDAI into G$.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency CDAI token amount.
 * @param {Percent} slippageTolerance Slippage tolerance.
 * @returns {TokenResult}
 * @throws {UnexpectedToken} If currency not cDAI.
 */
 export async function cDaiToG$(
  web3: Web3,
  currency: CurrencyAmount<Currency>,
  slippageTolerance: Percent
): Promise<TokenResult> {
  if (currency.currency.symbol !== 'cDAI') {
      throw new UnexpectedToken(currency.currency.symbol)
  }

  const chainId = await getChainId(web3)
  const goodMarketMaker = await goodMarketMakerContract(web3, chainId)
  const G$ = (await getToken(chainId, 'G$')) as Token

  const _index = ++index
  debugGroup(`cDAI to G$ - ${_index}`)

  const bigNumber = currency.multiply(currency.decimalScale).toFixed(0)
  const _priceMinimumOutputAmount = (await goodMarketMaker.methods
      .buyReturn(CDAI[chainId].address, bigNumber)
      .call()) as BigNumber

  const amount = CurrencyAmount.fromRawAmount(G$, _priceMinimumOutputAmount.toString())
  debug('G$', amount.toSignificant(6))

  const minAmount = amount.subtract(amount.multiply(slippageTolerance))
  debug('G$ min', minAmount.toSignificant(6))

  debugGroupEnd(`cDAI to G$ - ${_index}`)
  index--

  return { amount, minAmount }
}

/**
 * Tries to convert token DAI into cDAI.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency DAI token amount.
 * @returns {CurrencyAmount<Currency>}
 * @throws {UnexpectedToken} If currency not DAI.
 */
 export async function daiToCDai(web3: Web3, currency: CurrencyAmount<Currency>): Promise<CurrencyAmount<Currency>> {
  if (currency.currency.symbol !== 'DAI') {
      throw new UnexpectedToken(currency.currency.symbol)
  }

  const chainId = await getChainId(web3)

  debugGroup(`DAI to cDAI`)

  const cDaiPriceRatio = await cDaiPrice(web3, chainId)
  debug('cDAI ratio', cDaiPriceRatio.toSignificant(6))

  // DAI is 18 decimal number, cDAI is 8 decimal number, need to reduce 10 - 8 = 10 decimals from final value
  const _cDaiOutput = currency.divide(cDaiPriceRatio).divide(1e10)
  const amount = CurrencyAmount.fromFractionalAmount(CDAI[chainId], _cDaiOutput.numerator, _cDaiOutput.denominator)

  debug('cDAI', amount.toSignificant(6))
  debugGroupEnd(`DAI to cDAI`)

  return amount
}


//-- Sell
/**
 * Tries to convert token cDAI into DAI.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency CDAI token amount.
 * @returns {CurrencyAmount<Currency>}
 * @throws {UnexpectedToken} If currency not DAI.
 */
 export async function cDaiToDai(web3: Web3, currency: CurrencyAmount<Currency>): Promise<CurrencyAmount<Currency>> {
  if (currency.currency.symbol !== 'cDAI') {
      throw new UnexpectedToken(currency.currency.symbol)
  }

  const chainId = await getChainId(web3)
  const DAI = (await getToken(chainId, 'DAI')) as Token

  debugGroup(`cDAI to DAI`)

  const cDaiPriceRatio = await cDaiPrice(web3, chainId)
  debug('cDAI ratio', cDaiPriceRatio.toSignificant(6))

  // DAI is 18 decimal number, cDAI is 8 decimal number, need to add 10 - 8 = 10 decimals from final value
  const _daiAmount = currency.multiply(cDaiPriceRatio).multiply(1e10)
  const amount = CurrencyAmount.fromFractionalAmount(DAI, _daiAmount.numerator, _daiAmount.denominator)

  debug('cDAI', amount.toSignificant(6))
  debugGroupEnd(`cDAI to DAI`)

  return amount
}

/**
 * Tries to convert token G$ into cDAI.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency G$ token amount.
 * @param {Percent} slippageTolerance Slippage tolerance.
 * @returns {CDAIResult}
 * @throws {UnexpectedToken} If currency not cDAI.
 */
 export async function G$ToCDai(
  web3: Web3,
  currency: CurrencyAmount<Currency>,
  slippageTolerance: Percent
): Promise<TokenResult> {
  if (currency.currency.symbol !== 'G$') {
      throw new UnexpectedToken(currency.currency.symbol)
  }

  const chainId = await getChainId(web3)
  const goodMarketMaker = await goodMarketMakerContract(web3, chainId)

  debugGroup(`G$ to cDAI`)

  const bigNumber = currency.multiply(currency.decimalScale).toFixed(0)
  const _cDaiOutput = await goodMarketMaker.methods.sellReturn(CDAI[chainId].address, bigNumber).call()

  const amount = CurrencyAmount.fromRawAmount(CDAI[chainId], _cDaiOutput.toString())
  debug('cDAI', amount.toSignificant(6))

  const minAmount = amount.subtract(amount.multiply(slippageTolerance))
  debug('cDAI min', minAmount.toSignificant(6))

  debugGroupEnd(`G$ to cDAI`)

  return { amount, minAmount }
}