import { TokenBridge } from "@gooddollar/bridge-contracts/typechain-types";
import { TransactionStatus } from "@usedapp/core";
import { BigNumber } from "ethers";
export declare const useGetBridgeContracts: () => {
    122: TokenBridge;
    42220: TokenBridge;
} | {
    122?: undefined;
    42220?: undefined;
};
export declare const useWithinBridgeLimits: (requestChainId: number, account: string, amount: string) => {
    isValid: boolean;
    reason: string;
};
export type BridgeData = {
    bridgeFees: {
        minFee: BigNumber;
        maxFee: BigNumber;
        fee: BigNumber;
    };
    bridgeLimits: {
        dailyLimit: BigNumber;
        txLimit: BigNumber;
        accountDailyLimit: BigNumber;
        minAmount: BigNumber;
    };
    bridgeDailyLimit: {
        lastTransferReset: BigNumber;
        totalBridgedToday: BigNumber;
    };
    accountDailyLimit: {
        lastTransferReset: BigNumber;
        totalBridgedToday: BigNumber;
    };
};
export declare const useGetBridgeData: (requestChainId: number, account: string) => BridgeData;
export declare const useBridge: (withRelay?: boolean) => {
    sendBridgeRequest: (amount: string, sourceChain: string, target?: any) => Promise<void>;
    bridgeRequestStatus: TransactionStatus;
    relayStatus: Partial<TransactionStatus> | undefined;
    selfRelayStatus: Partial<TransactionStatus> | undefined;
};
export declare const useRelayTx: () => (sourceChain: number, targetChain: number, txHash: string) => Promise<{
    relayTxHash?: string;
    relayPromise?: Promise<any>;
}>;
export declare const useBridgeHistory: () => {
    fuseHistory: import("@usedapp/core").LogsResult<TokenBridge, "BridgeRequest">;
    celoHistory: import("@usedapp/core").LogsResult<TokenBridge, "BridgeRequest">;
};
//# sourceMappingURL=react.d.ts.map