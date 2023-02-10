import { BigNumber } from "ethers";
import { BaseSDK } from "../base/sdk";
export declare class ClaimSDK extends BaseSDK {
    generateFVLink(firstName: string, callbackUrl?: string, popupMode?: boolean): Promise<string>;
    getFVLink(): {
        getLoginSig: () => Promise<string>;
        getFvSig: () => Promise<string>;
        getLink: (firstName: string, callbackUrl?: string, popupMode?: boolean) => string;
    };
    isAddressVerified(address: string): Promise<boolean>;
    checkEntitlement(address?: string): Promise<BigNumber>;
    getNextClaimTime(): Promise<Date>;
    claim(): Promise<import("ethers").ContractTransaction>;
}
//# sourceMappingURL=sdk.d.ts.map