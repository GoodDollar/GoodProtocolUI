import { QueryParams } from "@usedapp/core";
import { BigNumber } from "ethers";
import { EnvKey } from "../base/sdk";
export declare const useFVLink: () => {
    getLoginSig: () => Promise<string>;
    getFvSig: () => Promise<string>;
    getLink: (firstName: string, callbackUrl?: string | undefined, popupMode?: boolean) => string;
};
export declare const useIsAddressVerified: (address: string, env?: EnvKey) => [undefined, undefined, "pending"] | [undefined, Error, "rejected"] | [boolean | undefined, undefined, "resolved"];
export declare const useClaim: (refresh?: QueryParams["refresh"]) => {
    isWhitelisted: boolean;
    claimAmount: BigNumber;
    claimTime: Date;
    claimCall: {
        send: (overrides?: (import("ethers").Overrides & {
            from?: string | Promise<string> | undefined;
        }) | undefined) => Promise<import("@ethersproject/abstract-provider").TransactionReceipt | undefined>;
        state: import("@usedapp/core").TransactionStatus;
        events: import("@ethersproject/abi").LogDescription[] | undefined;
        resetState: () => void;
    };
};
export declare const useWhitelistSync: () => {
    fuseWhitelisted: boolean;
    currentWhitelisted: boolean;
    syncStatus: Promise<boolean> | undefined;
};
//# sourceMappingURL=react.d.ts.map