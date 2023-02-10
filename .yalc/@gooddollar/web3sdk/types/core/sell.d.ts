import Web3 from 'web3';
import { Currency, CurrencyAmount, Fraction, Percent, TradeType } from '@uniswap/sdk-core';
import { Trade } from '@uniswap/v2-sdk';
import { TransactionDetails } from 'constants/transactions';
import { XResult, SwapInfo } from './swap';
export type SellInfo = {
    contribution: Fraction;
} & SwapInfo;
/**
 * Tries to convert token DAI into X. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} DAI DAI token amount.
 * @param {Currency} to Token X to convert to.
 * @param {Percent} slippageTolerance Slippage tolerance.
 * @returns {DAIResult | null}
 */
export declare function DaiToXExactIn(web3: Web3, DAI: CurrencyAmount<Currency>, to: Currency, slippageTolerance: Percent): Promise<XResult | null>;
/**
 * Tries get amount of token DAI from X. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {Currency} DAI DAI token amount.
 * @param {CurrencyAmount<Currency>} to Token X to convert to.
 * @returns {DAIResult | null}
 */
export declare function DaiToXExactOut(web3: Web3, DAI: Currency, to: CurrencyAmount<Currency>): Promise<CurrencyAmount<Currency> | null>;
/**
 * Tries to convert token G$ into X. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency G$ token amount.
 * @param {Currency} to Token X to convert to.
 * @param {Percent} slippageTolerance Slippage tolerance.
 * @returns {DAIResult | null}
 */
export declare function G$ToXExactIn(web3: Web3, currency: CurrencyAmount<Currency>, to: Currency, slippageTolerance: Percent): Promise<XResult | null>;
/**
 * Tries get amount of token G$ from X. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {Currency} G$ G$ token amount.
 * @param {CurrencyAmount<Currency>} to Token X to convert to.
 * @returns {DAIResult | null}
 */
export declare function G$ToXExactOut(web3: Web3, G$: Currency, to: CurrencyAmount<Currency>): Promise<CurrencyAmount<Currency> | null>;
/**
 * Calculates liquidity fee and price impact on uniswap.
 * @param {Trade<Currency, Currency, TradeType>} trade Trade returned by uniswap.
 * @returns {{ liquidityFee: CurrencyAmount<Currency>, priceImpact: Percent }}
 */
export declare function realizedLPFeePriceImpact(trade: Trade<Currency, Currency, TradeType>): {
    liquidityFee: CurrencyAmount<Currency>;
    priceImpact: Percent;
};
/**
 * Returns trade information for selling G$.
 * @param {Web3} web3 Web3 instance.
 * @param {string} toSymbol Symbol of the token that you want to get while selling G$.
 * @param {number | string} amount Amount of given currency.
 * @param {number} slippageTolerance Slippage tolerance while exchange tokens.
 */
export declare function getSellMeta(web3: Web3, toSymbol: string, amount: number | string, slippageTolerance?: number): Promise<SellInfo | null>;
/**
 * Returns trade information for selling G$ for exact token amount.
 * @param {Web3} web3 Web3 instance.
 * @param {string} toSymbol Symbol of the token that you want to get while selling G$.
 * @param {number | string} toAmount Amount of how much token want to receive.
 * @param {number} slippageTolerance Slippage tolerance while exchange tokens.
 */
export declare function getSellMetaReverse(web3: Web3, toSymbol: string, toAmount: number | string, slippageTolerance?: number): Promise<SellInfo | null>;
/**
 * Swap tokens.
 * @param {Web3} web3 Web3 instance.
 * @param {SwapInfo} meta Result of the method getMeta() execution.
 * @param {Function} onSent On sent event listener.
 */
export declare function sell(web3: Web3, meta: SwapInfo, onSent?: (transactionHash: string, from: string) => void): Promise<TransactionDetails>;
//# sourceMappingURL=sell.d.ts.map