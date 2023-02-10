import { EnvKey } from "./base/sdk";
import { CurrencyValue, Token } from "@usedapp/core";
import { BigNumber } from "ethers";
export declare enum SupportedChains {
    MAINNET = 1,
    FUSE = 122,
    CELO = 42220
}
export type SUPPORTED_NETWORKS = "FUSE" | "CELO" | "MAINNET";
export declare enum SupportedV2Networks {
    FUSE = 122,
    CELO = 42220
}
export interface G$Balances {
    G$: CurrencyValue | undefined;
    GOOD: CurrencyValue | undefined;
    GDX: CurrencyValue | undefined;
}
export type G$Token = keyof G$Balances;
export type G$DecimalsByChain = Partial<Record<SupportedChains, number>>;
export type G$DecimalsMap = {
    G$: G$DecimalsByChain;
    GOOD: G$DecimalsByChain;
    GDX: G$DecimalsByChain;
};
export declare const G$Decimals: G$DecimalsMap;
export declare const G$Tokens: (keyof G$Balances)[];
export type SupportedV2Network = keyof typeof SupportedV2Networks;
export declare const Envs: {
    [key: EnvKey]: {
        [key: string]: string;
    };
};
type ObjectLike = {
    [key: string]: string | ObjectLike | Array<string[]> | string[] | number;
};
export declare const G$TokenContracts: {
    G$: {
        contract: string;
        name: string;
        ticker: string;
    };
    GOOD: {
        contract: string;
        name: string;
        ticker: string;
    };
    GDX: {
        contract: string;
        name: string;
        ticker: string;
    };
};
export declare function G$Token(tokenName: G$Token, chainId: number, env: string, decimalsMap?: G$DecimalsMap): Token;
export declare function G$Amount(tokenName: G$Token, value: BigNumber, chainId: number, env: string, decimalsMap?: G$DecimalsMap): CurrencyValue;
export declare function G$ContractAddresses<T = ObjectLike>(name: string, env: EnvKey): T;
export {};
//# sourceMappingURL=constants.d.ts.map