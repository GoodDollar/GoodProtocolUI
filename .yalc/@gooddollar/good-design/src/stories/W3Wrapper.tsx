import { ExternalProvider, JsonRpcProvider } from "@ethersproject/providers";
import { Web3Provider } from "@gooddollar/web3sdk-v2";
import * as ethers from "ethers";
import { View } from "native-base";
import React, { useState } from "react";

import { Celo, Fuse } from "@gooddollar/web3sdk-v2";
import { Config, Goerli, Mainnet, useEthers } from "@usedapp/core";

interface PageProps {
  children: any;
  withMetaMask: boolean;
  env?: string;
}

const config: Config = {
  networks: [Goerli, Mainnet, Fuse, Celo],
  readOnlyChainId: undefined,
  readOnlyUrls: {
    122: "https://rpc.fuse.io",
    42220: "https://forno.celo.org"
  }
};

export const W3Wrapper = ({ children, withMetaMask, env = "fuse" }: PageProps) => {
  const ethereum = (window as any).ethereum;
  const { account } = useEthers();
  const w: ethers.Wallet = ethers.Wallet.createRandom();
  const [newProvider, setProvider] = useState<JsonRpcProvider | undefined>();

  if (!withMetaMask) {
    const rpc = new ethers.providers.JsonRpcProvider("https://rpc.fuse.io");
    
    rpc.getSigner = () => w as any;
    setProvider(rpc);
  }

  if (withMetaMask && !account && !newProvider) {
    ethereum.request({ method: "eth_requestAccounts" }).then((r: Array<string>) => {
      if (r.length > 0) {
        setProvider(new ethers.providers.Web3Provider(ethereum as ExternalProvider, "any"));
      }
    });
  }

  return (
    <Web3Provider env={env} web3Provider={newProvider} config={config}>
      <View>{children}</View>
    </Web3Provider>
  );
};
