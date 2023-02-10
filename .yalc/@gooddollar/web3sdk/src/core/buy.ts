import Web3 from "web3";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import {
  Currency,
  CurrencyAmount,
  Ether,
  Fraction,
  Percent,
  Token,
  TradeType,
  computePriceImpact
} from "@uniswap/sdk-core";
import { Trade } from "@uniswap/v2-sdk";
import { getToken } from "methods/tokenLists";
import { decimalPercentToPercent, decimalToJSBI } from "utils/converter";
import { CDAI, FUSE } from "constants/tokens";
import { v2TradeExactIn } from "methods/v2TradeExactIn";
import { getAccount, getChainId } from "utils/web3";
import { UnsupportedChainId, UnsupportedToken } from "utils/errors";
import { debug, debugGroup, debugGroupEnd } from "utils/debug";
import { ZERO_PERCENT } from "constants/misc";
import { exchangeHelperContract } from "contracts/ExchangeHelperContract";
import { prepareValues } from "functions/prepareValues";
import { computeRealizedLPFeePercent } from "utils/prices";
import { SupportedChainId } from "constants/chains";
import { v2TradeExactOut } from "methods/v2TradeExactOut";
import * as fuse from "contracts/FuseUniswapContract";
import { g$ReservePrice } from "methods/g$price";
import { cDaiToDai, G$ToCDai, daiToCDai, cDaiToG$, SwapInfo as BuyInfo, XResult as DAIResult } from "./swap";

/**
 * Tries to convert token X into DAI. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency Token X currency amount instance.
 * @param {Percent} slippageTolerance Slippage tolerance.
 * @returns {DAIResult | null}
 */
export async function xToDaiExactIn(
  web3: Web3,
  currency: CurrencyAmount<Currency>,
  slippageTolerance: Percent
): Promise<DAIResult | null> {
  const chainId = await getChainId(web3);
  const DAI = (await getToken(chainId, "DAI")) as Token;

  debugGroup(`${currency.currency.symbol} to DAI`);

  const trade = await v2TradeExactIn(currency, DAI, { chainId });
  if (!trade) {
    debug("Trade", null);
    debugGroupEnd(`${currency.currency.symbol} to DAI`);

    return null;
  }

  const amount = trade.outputAmount;
  debug("DAI", amount.toSignificant(6));

  const minAmount = trade.minimumAmountOut(slippageTolerance);
  debug("DAI min", minAmount.toSignificant(6));

  debugGroupEnd(`${currency.currency.symbol} to DAI`);

  return { amount, minAmount, route: trade.route.path, trade };
}

/**
 * Tries to get amount of token X from DAI. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {Currency} currency Token X currency amount instance.
 * @param {CurrencyAmount<Currency>} DAI Token DAI currency amount instance.
 * @returns {DAIResult | null}
 */
export async function xToDaiExactOut(
  web3: Web3,
  currency: Currency,
  DAI: CurrencyAmount<Currency>
): Promise<CurrencyAmount<Currency> | null> {
  const chainId = await getChainId(web3);

  debugGroup(`${currency.symbol} to DAI`);

  const trade = await v2TradeExactOut(currency, DAI, { chainId });
  if (!trade) {
    debug("Trade", null);
    debugGroupEnd(`${currency.symbol} to DAI`);

    return null;
  }

  debug(currency.symbol, trade.inputAmount.toSignificant(6));
  debugGroupEnd(`${currency.symbol} to DAI`);

  return trade.inputAmount;
}

/**
 * Tries to convert token X into G$. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {CurrencyAmount<Currency>} currency Token X currency amount instance.
 * @param {Percent} slippageTolerance Slippage tolerance.
 * @returns {DAIResult | null}
 */
export async function xToG$ExactIn(
  web3: Web3,
  currency: CurrencyAmount<Currency>,
  slippageTolerance: Percent
): Promise<DAIResult | null> {
  const chainId = await getChainId(web3);

  const G$ = (await getToken(chainId, "G$")) as Token;

  debugGroup(`${currency.currency.symbol} to G$`);

  const trade = await v2TradeExactIn(currency, G$, { chainId });
  if (!trade) {
    debug("Trade", null);
    debugGroupEnd(`${currency.currency.symbol} to G$`);

    return null;
  }

  const amount = trade.outputAmount;
  debug("G$", amount.toSignificant(6));

  const minAmount = trade.minimumAmountOut(slippageTolerance);
  debug("G$ min", minAmount.toSignificant(6));

  debugGroupEnd(`${currency.currency.symbol} to G$`);

  return { amount, minAmount, route: trade.route.path, trade };
}

/**
 * Tries to get amount of token X from G$. If it impossible - returns null.
 * @param {Web3} web3 Web3 instance.
 * @param {Currency} currency Token X currency amount instance.
 * @param {CurrencyAmount<Currency>} G$ Token G$ currency amount instance.
 * @returns {DAIResult | null}
 */
export async function xToG$ExactOut(
  web3: Web3,
  currency: Currency,
  G$: CurrencyAmount<Currency>
): Promise<CurrencyAmount<Currency> | null> {
  const chainId = await getChainId(web3);

  debugGroup(`${currency.symbol} to G$`);

  const trade = await v2TradeExactOut(currency, G$, { chainId });
  if (!trade) {
    debug("Trade", null);
    debugGroupEnd(`${currency.symbol} to G$`);

    return null;
  }

  debug(currency.symbol, trade.inputAmount.toSignificant(6));
  debugGroupEnd(`${currency.symbol} to G$`);

  return trade.inputAmount;
}

/**
 * Calculates liquidity fee.
 * @param {Trade<Currency, Currency, TradeType>} trade Currency amount.
 * @returns {Fraction}
 */
function getLiquidityFee(trade: Trade<Currency, Currency, TradeType>): CurrencyAmount<Currency> {
  const realizedLpFeePercent = computeRealizedLPFeePercent(trade);

  debug("Liquidity fee", realizedLpFeePercent.toSignificant(6));
  const liquidityFee = trade.inputAmount.multiply(realizedLpFeePercent);
  return liquidityFee;
}

/**
 * Returns trade information for buying G$.
 * @param {Web3} web3 Web3 instance.
 * @param {string} fromSymbol Symbol of the token that you want to use to buy G$.
 * @param {number | string} amount Amount of given currency.
 * @param {number} slippageTolerance Slippage tolerance while exchange tokens.
 * @returns {Promise<BuyInfo | null>}
 */
export async function getBuyMeta(
  web3: Web3,
  fromSymbol: string,
  amount: number | string,
  slippageTolerance = 0.5
): Promise<BuyInfo | null> {
  const chainId = await getChainId(web3);
  console.log("CHAIN ID:", chainId);

  debugGroup(`Get meta ${amount} ${fromSymbol} to G$`);

  const G$ = (await getToken(chainId, "G$")) as Token;

  console.log("getBuyMeta -->", { G$ });

  if (!G$) {
    throw new UnsupportedChainId(chainId);
  }

  let FROM: Currency;
  if (fromSymbol === "ETH") {
    FROM = Ether.onChain(chainId);
  } else if (fromSymbol === "FUSE") {
    FROM = FUSE;
  } else {
    FROM = (await getToken(chainId, fromSymbol)) as Currency;
  }

  if (!FROM) {
    throw new UnsupportedToken(fromSymbol);
  }

  console.log("getBuyMeta -->", { FROM });
  const DAI = (await getToken(chainId, "DAI")) as Token;

  let inputCDAIValue;
  let DAIAmount: CurrencyAmount<Currency> | null = null;
  let cDAIAmount: CurrencyAmount<Currency> | null = null;

  let inputAmount: CurrencyAmount<Currency>;
  let outputAmount: CurrencyAmount<Currency>;
  let minimumOutputAmount: CurrencyAmount<Currency>;
  let route: Token[];
  let trade: Trade<Currency, Currency, TradeType> | null = null;

  let liquidityFee = CurrencyAmount.fromRawAmount(FROM, "0");
  let priceImpact = new Fraction(0);

  const slippageTolerancePercent = decimalPercentToPercent(slippageTolerance);

  if (chainId === SupportedChainId.FUSE) {
    inputAmount = CurrencyAmount.fromRawAmount(FROM, decimalToJSBI(amount, FROM.decimals));
    console.log("amount -->", { amount });

    const g$trade = await xToG$ExactIn(web3, inputAmount, slippageTolerancePercent);

    if (!g$trade) {
      return null;
    }

    trade = g$trade.trade;
    route = g$trade.route;

    liquidityFee = getLiquidityFee(g$trade.trade);

    outputAmount = g$trade.amount;
    minimumOutputAmount = g$trade.minAmount;

    priceImpact = g$trade.trade.priceImpact;

    console.log({ trade, route, liquidityFee, outputAmount, minimumOutputAmount, priceImpact });
  } else {
    if (FROM.symbol === "G$") {
      return null;
    } else if (FROM.symbol === "cDAI") {
      const cDAI = CDAI[chainId];
      route = [cDAI];

      inputAmount = CurrencyAmount.fromRawAmount(cDAI, decimalToJSBI(amount, cDAI.decimals));

      DAIAmount = CurrencyAmount.fromRawAmount(DAI, 0);
      inputCDAIValue = cDAIAmount = inputAmount;
      ({ amount: outputAmount, minAmount: minimumOutputAmount } = await cDaiToG$(
        web3,
        inputAmount,
        slippageTolerancePercent
      ));
    } else if (FROM.symbol === "DAI") {
      const DAI = (await getToken(chainId, "DAI")) as Token;
      route = [DAI];

      inputAmount = CurrencyAmount.fromRawAmount(DAI, decimalToJSBI(amount, DAI.decimals));

      DAIAmount = inputAmount;
      inputCDAIValue = cDAIAmount = await daiToCDai(web3, DAIAmount);
      ({ amount: outputAmount, minAmount: minimumOutputAmount } = await cDaiToG$(
        web3,
        cDAIAmount,
        slippageTolerancePercent
      ));
    } else {
      inputAmount = CurrencyAmount.fromRawAmount(FROM, decimalToJSBI(amount, FROM.decimals));

      const g$trade = await xToDaiExactIn(web3, inputAmount, slippageTolerancePercent);

      if (!g$trade) {
        return null;
      }

      DAIAmount = g$trade.minAmount;
      cDAIAmount = await daiToCDai(web3, DAIAmount);

      inputCDAIValue = await daiToCDai(web3, g$trade.amount.add(g$trade.amount.multiply(g$trade.trade.priceImpact)));

      route = g$trade.route;

      liquidityFee = getLiquidityFee(g$trade.trade);
      [{ amount: outputAmount }, { minAmount: minimumOutputAmount }] = await Promise.all([
        daiToCDai(web3, g$trade.amount).then(cDAI => cDaiToG$(web3, cDAI, ZERO_PERCENT)),
        cDaiToG$(web3, cDAIAmount, ZERO_PERCENT)
      ]);

      trade = g$trade.trade;
    }

    const { cDAI: price } = await g$ReservePrice(web3, chainId);
    priceImpact = computePriceImpact(price, inputCDAIValue, minimumOutputAmount);
  }

  debugGroupEnd(`Get meta ${amount} ${fromSymbol} to G$`);
  debug("Route", route);

  return {
    inputAmount,
    outputAmount,
    minimumOutputAmount,

    DAIAmount,
    cDAIAmount,
    GDXAmount: outputAmount,

    priceImpact,
    slippageTolerance: slippageTolerancePercent,

    liquidityFee,
    liquidityToken: FROM,

    route,
    trade
  };
}

/**
 * Returns trade information for buying G$ for exact G$ amount.
 * @param {Web3} web3 Web3 instance.
 * @param {string} fromSymbol Symbol of the token that you want to use to buy G$.
 * @param {number | string} toAmount Amount of how much G$ want to receive.
 * @param {number} slippageTolerance Slippage tolerance while exchange tokens.
 * @returns {Promise<BuyInfo | null>}
 */
export async function getBuyMetaReverse(
  web3: Web3,
  fromSymbol: string,
  toAmount: number | string,
  slippageTolerance = 0.5
): Promise<BuyInfo | null> {
  const chainId = await getChainId(web3);

  debugGroup(`Get meta ${toAmount} G$ to ${fromSymbol}`);

  const G$ = (await getToken(chainId, "G$")) as Token;
  console.log("G$");

  if (!G$) {
    throw new UnsupportedChainId(chainId);
  }

  let FROM: Currency;
  if (fromSymbol === "ETH") {
    FROM = Ether.onChain(chainId);
  } else if (fromSymbol === "FUSE") {
    FROM = FUSE;
  } else {
    FROM = (await getToken(chainId, fromSymbol)) as Currency;
  }

  if (!FROM) {
    throw new UnsupportedToken(fromSymbol);
  }

  const inputAmount: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(G$, decimalToJSBI(toAmount, G$.decimals));

  let result;
  if (chainId === SupportedChainId.FUSE) {
    result = await xToG$ExactOut(web3, FROM, inputAmount);
  } else {
    if (FROM.symbol === "G$") {
      result = null;
    } else if (FROM.symbol === "cDAI") {
      const { amount } = await G$ToCDai(web3, inputAmount, ZERO_PERCENT);
      result = amount;
    } else if (FROM.symbol === "DAI") {
      const { amount } = await G$ToCDai(web3, inputAmount, ZERO_PERCENT);
      result = await cDaiToDai(web3, amount);
    } else {
      const { amount } = await G$ToCDai(web3, inputAmount, ZERO_PERCENT);
      const dai = await cDaiToDai(web3, amount);
      result = await xToDaiExactOut(web3, FROM, dai);
    }
  }

  debugGroupEnd(`Get meta ${toAmount} G$ to ${fromSymbol}`);

  if (!result) {
    return null;
  }

  return getBuyMeta(web3, fromSymbol, result.toExact(), slippageTolerance);
}

/**
 * Swap tokens.
 * @param {Web3} web3 Web3 instance.
 * @param {BuyInfo} meta Result of the method getMeta() execution.
 * @param {Function} onSent On sent event listener.
 */
export async function buy(
  web3: Web3,
  meta: BuyInfo,
  onSent?: (transactionHash: string, from: string) => void
): Promise<any> {
  const chainId = await getChainId(web3);
  const account = await getAccount(web3);

  if (chainId === SupportedChainId.FUSE) {
    return fuse.swap(web3, meta.trade!, meta.slippageTolerance, onSent);
  } else {
    const contract = await exchangeHelperContract(web3);

    const { input, minReturn, minDai } = prepareValues(meta, "buy");

    let route: string[];
    // If ETH - change route a little bit to start from a zero address
    if (meta.trade && meta.trade.inputAmount.currency.isNative) {
      // Convert into an array of addresses
      route = [ethers.constants.AddressZero, ...meta.route.slice(1).map(token => token.address)];
    } else {
      // Otherwise keep as if, convert into an addresses
      route = meta.route.map(token => token.address);
    }

    const req = contract.methods
      .buy(
        route,
        BigNumber.from(input),
        BigNumber.from(minReturn),
        BigNumber.from(minDai),
        ethers.constants.AddressZero
      )
      .send({
        type: "0x2", //force eip1599 on ethereum
        from: account,
        value: route[0] === ethers.constants.AddressZero ? input : undefined
      });

    if (onSent) req.on("transactionHash", (hash: string) => onSent(hash, account));
    return req;
  }
}
