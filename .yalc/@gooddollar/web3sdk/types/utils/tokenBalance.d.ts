import Web3 from 'web3';
import { Currency, CurrencyAmount, NativeCurrency, Token } from '@uniswap/sdk-core';
import { ethers } from 'ethers';
/**
 * Token or native currency balance for given network.
 * @param {Web3} web3 Web3 instance.
 * @param {Token | string} token Token instance or token's symbol representation in given network.
 * @param {string} account Account address.
 * @returns {Promise<CurrencyAmount>}
 */
export declare function tokenBalance(web3: Web3, token: Token | string, account: string): Promise<CurrencyAmount<NativeCurrency | Currency>>;
export declare const formatBalance: (value: ethers.BigNumberish, decimals?: number, maxFraction?: number) => string;
export declare const parseBalance: (value: string, decimals?: number) => ethers.BigNumber;
export declare const isEmptyValue: (text: string) => boolean;
//# sourceMappingURL=tokenBalance.d.ts.map