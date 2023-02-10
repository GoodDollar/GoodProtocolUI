/// <reference types="react" />
import { InitOptions } from "@web3-onboard/core";
export interface IOnboardWallets {
    torus?: boolean;
    gooddollar?: boolean;
    metamask?: boolean;
    walletconnect?: boolean;
    coinbase?: boolean;
    zengo?: boolean;
    custom?: InitOptions["wallets"];
}
export interface IOnboardProviderProps {
    options?: Omit<InitOptions, "wallets">;
    wallets?: IOnboardWallets | null;
    children?: React.ReactNode;
}
export declare const OnboardProvider: ({ options, wallets, children }: IOnboardProviderProps) => JSX.Element;
//# sourceMappingURL=react.d.ts.map