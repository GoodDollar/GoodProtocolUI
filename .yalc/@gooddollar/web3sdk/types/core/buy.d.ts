import Web3 from "web3";
import { Currency, CurrencyAmount, Percent } from "@uniswap/sdk-core";
import { SwapInfo as BuyInfo, XResult as DAIResult } from "./swap";
/**
 * Tries to convert token X into DAI. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency Token X currency amount instance.
 * @param {Percent} slippageTolerance Slippage tolerance.
 * @returns {DAIResult | null}
 */
export declare function xToDaiExactIn(web3: Web3, currency: CurrencyAmount<Currency>, slippageTolerance: Percent): Promise<DAIResult | null>;
/**
 * Tries to get amount of token X from DAI. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {Currency} currency Token X currency amount instance.
 * @param {CurrencyAmount<Currency>} DAI Token DAI currency amount instance.
 * @returns {DAIResult | null}
 */
export declare function xToDaiExactOut(web3: Web3, currency: Currency, DAI: CurrencyAmount<Currency>): Promise<CurrencyAmount<Currency> | null>;
/**
 * Tries to convert token X into G$. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency Token X currency amount instance.
 * @param {Percent} slippageTolerance Slippage tolerance.
 * @returns {DAIResult | null}
 */
export declare function xToG$ExactIn(web3: Web3, currency: CurrencyAmount<Currency>, slippageTolerance: Percent): Promise<DAIResult | null>;
/**
 * Tries to get amount of token X from G$. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {Currency} currency Token X currency amount instance.
 * @param {CurrencyAmount<Currency>} G$ Token G$ currency amount instance.
 * @returns {DAIResult | null}
 */
export declare function xToG$ExactOut(web3: Web3, currency: Currency, G$: CurrencyAmount<Currency>): Promise<CurrencyAmount<Currency> | null>;
/**
 * Returns trade information for buying G$.
 * @param {Web3} web3 Web3 instance.
 * @param {string} fromSymbol Symbol of the token that you want to use to buy G$.
 * @param {number | string} amount Amount of given currency.
 * @param {number} slippageTolerance Slippage tolerance while exchange tokens.
 * @returns {Promise<BuyInfo | null>}
 */
export declare function getBuyMeta(web3: Web3, fromSymbol: string, amount: number | string, slippageTolerance?: number): Promise<BuyInfo | null>;
/**
 * Returns trade information for buying G$ for exact G$ amount.
 * @param {Web3} web3 Web3 instance.
 * @param {string} fromSymbol Symbol of the token that you want to use to buy G$.
 * @param {number | string} toAmount Amount of how much G$ want to receive.
 * @param {number} slippageTolerance Slippage tolerance while exchange tokens.
 * @returns {Promise<BuyInfo | null>}
 */
export declare function getBuyMetaReverse(web3: Web3, fromSymbol: string, toAmount: number | string, slippageTolerance?: number): Promise<BuyInfo | null>;
/**
 * Swap tokens.
 * @param {Web3} web3 Web3 instance.
 * @param {BuyInfo} meta Result of the method getMeta() execution.
 * @param {Function} onSent On sent event listener.
 */
export declare function buy(web3: Web3, meta: BuyInfo, onSent?: (transactionHash: string, from: string) => void): Promise<any>;
//# sourceMappingURL=buy.d.ts.map