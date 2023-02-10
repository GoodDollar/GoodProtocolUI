import { Call, RawCall } from "@usedapp/core";
import { Result } from "@ethersproject/abi";
import { JsonRpcProvider, Provider } from "@ethersproject/providers";
export type CallsResult = Array<RawCall & {
    success: boolean;
    value: string;
    decoded?: Result;
}>;
export declare function multicall2(provider: Provider, address: string, blockNumber: number, requests: RawCall[]): Promise<CallsResult>;
export declare function multicall(provider: Provider, address: string, blockNumber: number, requests: RawCall[]): Promise<CallsResult>;
export declare const useReadOnlyProvider: (chainId: number) => JsonRpcProvider | undefined;
/**
 * @internal Intended for internal use - use it on your own risk
 */
export declare function validateCall(call: Call): Call;
/**
 * perform multicall requests to a specific chain using readonly rpcs from usedapp
 */
export declare const useMulticallAtChain: (chainId: number) => (calls: Call[], blockNumber?: number) => Promise<CallsResult | undefined>;
//# sourceMappingURL=useMulticallAtChain.d.ts.map