import { JsonRpcProvider, Web3Provider as W3Provider } from "@ethersproject/providers";
import { Chain, Config } from "@usedapp/core";
import React from "react";
import { EnvKey } from "../sdk/base/sdk";
/**
 * request to switch to network id
 * returns void if no result yet true/false if success
 */
export type SwitchNetwork = (id: number) => Promise<void>;
export type SwitchCallback = (id: number, switchResult: any) => Promise<void>;
export type TxDetails = {
    txhash: string;
    title: string;
    description?: string;
    from: string;
    to: string;
    contract?: string;
    data?: any;
};
export type TxEmitter = {
    on: (cb: (tx: TxDetails) => void) => void;
    emit: (tx: TxDetails) => boolean;
};
type IWeb3Context = {
    setSwitchNetwork: (cb: SwitchNetwork) => void;
    switchNetwork?: SwitchNetwork;
    setOnSwitchNetwork?: (cb: () => SwitchCallback) => void;
    onSwitchNetwork?: SwitchCallback;
    connectWallet?: () => void;
    txEmitter: TxEmitter;
    env: EnvKey;
};
export declare const txEmitter: TxEmitter;
export declare const Web3Context: React.Context<IWeb3Context>;
export declare const TokenContext: React.Context<import("../sdk").G$DecimalsMap>;
type Props = {
    children: React.ReactNode;
    config: Config;
    web3Provider?: JsonRpcProvider | W3Provider;
    env?: EnvKey;
    switchNetworkRequest?: SwitchNetwork;
};
export declare const Fuse: Chain;
export declare const Celo: Chain;
export declare const Web3Provider: ({ children, config, web3Provider, env }: Props) => JSX.Element;
export declare const useSwitchNetwork: () => {
    switchNetwork: (chainId: number) => Promise<void>;
    setSwitchNetwork: (cb: SwitchNetwork) => void;
    setOnSwitchNetwork: ((cb: () => SwitchCallback) => void) | undefined;
};
export {};
//# sourceMappingURL=Web3Context.d.ts.map