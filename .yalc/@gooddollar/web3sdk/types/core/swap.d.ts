import Web3 from 'web3';
import { Currency, CurrencyAmount, Token, Percent, Fraction, TradeType } from '@uniswap/sdk-core';
import { Trade } from '@uniswap/v2-sdk';
export type XResult = {
    amount: CurrencyAmount<Currency>;
    minAmount: CurrencyAmount<Currency>;
    route: Token[];
    trade: Trade<Currency, Currency, TradeType>;
};
type TokenResult = Omit<XResult, 'route' | 'trade'>;
export type SwapInfo = {
    inputAmount: CurrencyAmount<Currency>;
    outputAmount: CurrencyAmount<Currency>;
    minimumOutputAmount: CurrencyAmount<Currency>;
    DAIAmount: CurrencyAmount<Currency> | null;
    cDAIAmount: CurrencyAmount<Currency> | null;
    GDXAmount: CurrencyAmount<Currency> | Fraction;
    priceImpact: Fraction;
    slippageTolerance: Percent;
    liquidityFee: CurrencyAmount<Currency>;
    liquidityToken: Currency;
    route: Token[];
    trade: Trade<Currency, Currency, TradeType> | null;
};
/**
 * Tries to convert token cDAI into G$.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency CDAI token amount.
 * @param {Percent} slippageTolerance Slippage tolerance.
 * @returns {TokenResult}
 * @throws {UnexpectedToken} If currency not cDAI.
 */
export declare function cDaiToG$(web3: Web3, currency: CurrencyAmount<Currency>, slippageTolerance: Percent): Promise<TokenResult>;
/**
 * Tries to convert token DAI into cDAI.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency DAI token amount.
 * @returns {CurrencyAmount<Currency>}
 * @throws {UnexpectedToken} If currency not DAI.
 */
export declare function daiToCDai(web3: Web3, currency: CurrencyAmount<Currency>): Promise<CurrencyAmount<Currency>>;
/**
 * Tries to convert token cDAI into DAI.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency CDAI token amount.
 * @returns {CurrencyAmount<Currency>}
 * @throws {UnexpectedToken} If currency not DAI.
 */
export declare function cDaiToDai(web3: Web3, currency: CurrencyAmount<Currency>): Promise<CurrencyAmount<Currency>>;
/**
 * Tries to convert token G$ into cDAI.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency G$ token amount.
 * @param {Percent} slippageTolerance Slippage tolerance.
 * @returns {CDAIResult}
 * @throws {UnexpectedToken} If currency not cDAI.
 */
export declare function G$ToCDai(web3: Web3, currency: CurrencyAmount<Currency>, slippageTolerance: Percent): Promise<TokenResult>;
export {};
//# sourceMappingURL=swap.d.ts.map