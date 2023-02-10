import { createContext, useContext } from "react";
import Web3 from "web3";
import type { RPC } from "./useEnvWeb3";

export interface GdSdkContextInterface {
  web3: Web3 | null;
  contractsEnv: string;
  rpcs: RPC | null;
}

const GdSdkContext = createContext<GdSdkContextInterface>({
  web3: null,
  contractsEnv: "",
  rpcs: null
});

export function useGdContextProvider() {
  return useContext(GdSdkContext);
}

export default GdSdkContext;
