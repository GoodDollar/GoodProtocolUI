import { SwapInfo } from 'core/swap'
import { InsufficientLiquidity } from 'utils/errors'
import { debug } from 'utils/debug'

/**
 * Pick necessary date from meta swap.
 * @param {SwapInfo} meta Result of the method getMeta() execution.
 * @returns {input: string, minReturn: string, minCDai: string}
 */
 export function prepareValues(meta: SwapInfo, type?: string): { input: string; minReturn: string; minDai: string } {
  if (!meta.route.length) {
      throw new InsufficientLiquidity()
  }
  const amount = type === 'buy' ? meta.DAIAmount : meta.cDAIAmount
  const input = meta.inputAmount.multiply(meta.inputAmount.decimalScale).toFixed(0)
  const minReturn = meta.minimumOutputAmount.multiply(meta.minimumOutputAmount.decimalScale).toFixed(0)
  const minDai = amount ? amount.multiply(amount.decimalScale).toFixed(0) : '0'

  debug({
      input: meta.inputAmount.toSignificant(6),
      minReturn: meta.minimumOutputAmount.toSignificant(6),
      minDai: amount ? amount.toSignificant(6) : '0'
  })

  return { input, minReturn, minDai }
}