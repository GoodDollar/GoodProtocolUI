import { SwapInfo } from 'core/swap';
/**
 * Pick necessary date from meta swap.
 * @param {SwapInfo} meta Result of the method getMeta() execution.
 * @returns {input: string, minReturn: string, minCDai: string}
 */
export declare function prepareValues(meta: SwapInfo, type?: string): {
    input: string;
    minReturn: string;
    minDai: string;
};
//# sourceMappingURL=prepareValues.d.ts.map