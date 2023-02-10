import React, { useEffect, useCallback, useState } from "react";
import { Web3ActionButton } from "../advanced/web3action/Web3Action";
import { Mainnet, DAppProvider, Config, Goerli, useEthers } from "@usedapp/core";
import { useClaim, Fuse, Celo, Web3Provider } from "@gooddollar/web3sdk-v2";
import { getDefaultProvider, ethers } from "ethers";
import { ExternalProvider } from "@ethersproject/providers";

const config: Config = {
  networks: [Mainnet, Fuse, Celo, Goerli],
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider("https://mainnet.infura.io/v3/12207372b62941dfb1efd4fe26b95ccc"),
    [Goerli.chainId]: getDefaultProvider("https://goerli.infura.io/v3/12207372b62941dfb1efd4fe26b95ccc"),
    122: "https://rpc.fuse.io",
    42220: "https://forno.celo.org"
  }
};

export const W3Wrapper = () => {
  const ethereum = (window as any).ethereum;
  const { account, library } = useEthers();
  const [provider, setProvider] = useState(new ethers.providers.JsonRpcProvider("https://rpc.fuse.io", "any"));
  const [accountFound, setAccountFound] = useState(false);

  useEffect(() => {
    if (!account && !accountFound) {
      setAccountFound(true);
      ethereum.request({ method: "eth_requestAccounts" }).then((r: Array<string>) => {
        if (r.length > 0) {
          setProvider(new ethers.providers.Web3Provider(ethereum as ExternalProvider, "any"));
        }
      });
    }
  }, [library]);

  //todo: should not need two providers, current bug with only web3provider and not able to find connected account
  // probably causing the claimCall bug where it doesn't update to web3provider
  return (
    <DAppProvider config={config}>
      <Web3Provider env="fuse" web3Provider={provider} config={config}>
        <Web3Action />
      </Web3Provider>
    </DAppProvider>
  );
};

const Web3Action = () => {
  const { isWhitelisted, claimAmount, claimCall } = useClaim("everyBlock");
  const [claimText, setClaimText] = useState<string>("Claim UBI");

  const handleClaim = useCallback(async () => {
    // console.log("HC isWhitelisted -->", { isWhitelisted });
    // console.log("HC -- account / library", { account, library });
    if (isWhitelisted) {
      console.log("isWhitelisted");
      //todo-fix: this tries to send call from readonly provider, where library already should be Web3Provider
      // see note above in W3 Wrapper
      await claimCall.send();
    }
  }, [claimCall, isWhitelisted]);

  useEffect(() => {
    if (claimAmount) {
      const amount = parseInt(claimAmount.toString());
      setClaimText(`Claim ${amount}`);
    }
  }, [claimAmount]);

  return <Web3ActionButton text={claimText} requiredChain={122} web3Action={handleClaim} />;
};

export default {
  title: "Advanced/Web3Action",
  component: W3Wrapper,
  argTypes: {
    onPress: {
      action: "clicked",
      description: "The function to call when the button is pressed"
    },
    colorScheme: {
      control: {
        type: "inline-radio",
        options: ["primary", "secondary", "success", "danger", "warning", "info"]
      }
    },
    size: {
      control: {
        type: "inline-radio",
        options: ["sm", "md", "lg"]
      }
    }
  }
};
