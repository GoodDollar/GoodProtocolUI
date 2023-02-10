/// <reference types="react" />
import Web3 from "web3";
import type { RPC } from "./useEnvWeb3";
export interface GdSdkContextInterface {
    web3: Web3 | null;
    contractsEnv: string;
    rpcs: RPC | null;
}
declare const GdSdkContext: import("react").Context<GdSdkContextInterface>;
export declare function useGdContextProvider(): GdSdkContextInterface;
export default GdSdkContext;
//# sourceMappingURL=useGdSdkContext.d.ts.map