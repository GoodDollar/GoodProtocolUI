import { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import { SupportedChainId, DAO_NETWORK } from "constants/chains";
import GdSdkContext from "./useGdSdkContext";
import { noop } from "lodash";

export interface RPC {
  MAINNET_RPC: string | undefined;
  FUSE_RPC: string | undefined;
}

export const defaultRPC = {
  [SupportedChainId.MAINNET]: (ethers.getDefaultProvider("mainnet") as any).providerConfigs[0].provider.connection.url,
  [SupportedChainId.FUSE]: "https://rpc.fuse.io"
};

export const getRpc = (chainId: number): string => {
  const rpcs = localStorage.getItem("GD_RPCS");
  if (!rpcs) return "https://rpc.fuse.io";

  const rpcUrls: RPC = JSON.parse(rpcs);

  switch (chainId) {
    case 122:
      return rpcUrls.FUSE_RPC || defaultRPC[chainId];
    case 1:
      return rpcUrls.MAINNET_RPC || defaultRPC[chainId];
    default:
      return "https://eth-mainnet.alchemyapi.io/v2/2kSbx330Sc8S3QRwD9nutr9XST_DfeJh";
  }
};

/**
 * Returns provider for chain.
 * @param {number | string} chainId Chain ID.
 */
export const useEnvWeb3 = (
  dao: DAO_NETWORK,
  activeWeb3?: any | undefined,
  activeChainId?: number
): [Web3 | null, SupportedChainId] => {
  const [web3, setWeb3] = useState<[any, SupportedChainId]>([null, 0]);
  const { contractsEnv } = useContext(GdSdkContext);

  useEffect(() => {
    const getProvider = async () => {
      let provider,
        selectedChainId = SupportedChainId.MAINNET;
      if (dao === DAO_NETWORK.FUSE) {
        if (activeWeb3 && (activeChainId as number) === SupportedChainId.FUSE) {
          return setWeb3([activeWeb3, activeChainId as number]);
        } else provider = new Web3.providers.HttpProvider(getRpc(SupportedChainId.FUSE));
      } else {
        //"mainnet" contracts can be on different blockchains depending on env
        switch (contractsEnv) {
          case "production":
            if (activeWeb3 && activeChainId && SupportedChainId.MAINNET === (activeChainId as number)) {
              return setWeb3([activeWeb3, activeChainId as number]);
            }
            provider = new Web3.providers.HttpProvider(getRpc(SupportedChainId.MAINNET));
            selectedChainId = SupportedChainId.MAINNET;
            break;
          default:
            provider = new Web3.providers.HttpProvider(getRpc(SupportedChainId.MAINNET));
            selectedChainId = SupportedChainId.MAINNET;
            break;
        }
      }
      setWeb3([new Web3(provider), selectedChainId]);
    };
    
    getProvider().catch(noop);
  }, [activeWeb3, dao, activeChainId, contractsEnv]);

  return web3;
};
