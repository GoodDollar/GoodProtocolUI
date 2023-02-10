import { TransactionStatus } from "@usedapp/core";
import { BigNumber } from "ethers";
declare type OnBridge = (amount: string, sourceChain: string, target?: string) => Promise<void>;
declare type ILimits = Record<string, {
    dailyLimit: BigNumber;
    txLimit: BigNumber;
    accountDailyLimit: BigNumber;
    minAmount: BigNumber;
}>;
declare type IFees = Record<string, {
    minFee: BigNumber;
    maxFee: BigNumber;
    fee: BigNumber;
}>;
export declare const MicroBridge: ({ useBalanceHook, useCanBridge, onBridge, onSetChain, limits, fees, bridgeStatus, relayStatus, selfRelayStatus, onBridgeStart, onBridgeFailed, onBridgeSuccess, }: {
    onBridge: OnBridge;
    useBalanceHook: (chain: "fuse" | "celo") => string;
    useCanBridge: (chain: "fuse" | "celo", amountWei: string) => {
        isValid: boolean;
        reason: string;
    };
    onSetChain?: ((chain: "fuse" | "celo") => void) | undefined;
    limits?: ILimits | undefined;
    fees?: IFees | undefined;
    bridgeStatus?: Partial<TransactionStatus> | undefined;
    relayStatus?: Partial<TransactionStatus> | undefined;
    selfRelayStatus?: Partial<TransactionStatus> | undefined;
    onBridgeStart?: (() => void) | undefined;
    onBridgeSuccess?: (() => void) | undefined;
    onBridgeFailed?: ((e: Error) => void) | undefined;
}) => JSX.Element;
export {};
//# sourceMappingURL=MicroBridge.d.ts.map