import React, { useEffect, useState } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Web3Provider } from "../contexts/Web3Context";
import * as ethers from "ethers";
import { ExternalProvider } from "@ethersproject/providers";

import { Config, Mainnet, Goerli, useEthers } from "@usedapp/core";
import { Fuse, Celo } from "../contexts";
import { getDefaultProvider } from "ethers";

interface PageProps {
  children: any;
  withMetaMask: boolean;
}

const config: Config = {
  networks: [Goerli, Mainnet, Fuse, Celo],
  readOnlyChainId: Fuse.chainId,
  readOnlyUrls: {
    122: "https://rpc.fuse.io",
    42220: "https://forno.celo.org"
  }
};

export const W3Wrapper = ({ children, withMetaMask }: PageProps) => {
  const ethereum = (window as any).ethereum;
  const { account } = useEthers();
  const w: ethers.Wallet = ethers.Wallet.createRandom();
  let newProvider: JsonRpcProvider | undefined = undefined;
  if (!withMetaMask) {
    const rpc = new ethers.providers.JsonRpcProvider("https://rpc.fuse.io");
    rpc.getSigner = idx => {
      return w as any;
    };
    newProvider = rpc;
  }

  if (withMetaMask && !account) {
    ethereum.request({ method: "eth_requestAccounts" }).then((r: Array<string>) => {
      if (r.length > 0) {
        newProvider = new ethers.providers.Web3Provider(ethereum as ExternalProvider, "any");
      }
    });
  }

  const provider = newProvider ?? new ethers.providers.Web3Provider(ethereum as ExternalProvider, "any");

  return (
    <Web3Provider env="fuse" web3Provider={provider} config={config}>
      <article>
        <section>{children}</section>
      </article>
    </Web3Provider>
  );
};
