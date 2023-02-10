import { FC } from "react";
export declare const useBalanceHook: (chain: "fuse" | "celo") => string;
interface IMicroBridgeControllerProps {
    withRelay?: boolean;
    onBridgeStart?: () => void;
    onBridgeSuccess?: () => void;
    onBridgeFailed?: (e: Error) => void;
}
export declare const MicroBridgeController: FC<IMicroBridgeControllerProps>;
export {};
//# sourceMappingURL=MicroBridgeController.d.ts.map