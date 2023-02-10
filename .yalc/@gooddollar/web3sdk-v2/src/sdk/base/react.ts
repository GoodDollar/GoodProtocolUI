import { useContext, useMemo, useState } from "react";
import { Signer, providers, BigNumber } from "ethers";
import { BaseSDK, EnvKey, EnvValue } from "./sdk";
import { TokenContext, Web3Context } from "../../contexts";
import { QueryParams, useCalls, useEthers, ChainId, CurrencyValue } from "@usedapp/core";
import { ClaimSDK } from "../claim/sdk";
import { SavingsSDK } from "../savings/sdk";
import Contracts from "@gooddollar/goodprotocol/releases/deployment.json";
import { useReadOnlyProvider } from "../../hooks/useMulticallAtChain";
import useUpdateEffect from "../../hooks/useUpdateEffect";
import { useRefreshOrNever } from "../../hooks";
import { SupportedChains, G$Balances, G$Tokens, G$Token, G$Amount } from "../constants";
import { GoodReserveCDai, GReputation, IGoodDollar } from "@gooddollar/goodprotocol/types";

export const NAME_TO_SDK: { [key: string]: typeof ClaimSDK | typeof SavingsSDK | typeof BaseSDK } = {
  claim: ClaimSDK,
  savings: SavingsSDK,
  base: BaseSDK
};

type RequestedSdk = {
  sdk: ClaimSDK | SavingsSDK | BaseSDK | undefined;
  readOnly: boolean;
};

export type SdkTypes = "claim" | "savings" | "base";

export const useReadOnlySDK = (type: SdkTypes, requiredChainId?: number): RequestedSdk["sdk"] => {
  return useSDK(true, type, requiredChainId);
};

export const useGetEnvChainId = (requiredChainId?: number) => {
  const { chainId } = useEthers();
  const web3Context = useContext(Web3Context);
  const baseEnv = web3Context.env || "";
  let connectedEnv = baseEnv;

  switch (requiredChainId ?? chainId) {
    case 1:
      connectedEnv = "production-mainnet"; // temp untill dev contracts are released to goerli
      break;
    case 42220:
      connectedEnv = connectedEnv === "fuse" ? "development-celo" : connectedEnv + "-celo";
      break;
  }

  const defaultEnv = connectedEnv;
  
  return {
    chainId: Number((Contracts[defaultEnv as keyof typeof Contracts] as EnvValue)?.networkId),
    defaultEnv,
    baseEnv,
    connectedEnv,
    switchNetworkRequest: web3Context.switchNetwork
  };
};

export const useGetContract = (
  contractName: string,
  readOnly = false,
  type: SdkTypes = "base",
  requiredChainId?: number
) => {
  const sdk = useSDK(readOnly, type, requiredChainId);
  const [contract, setContract] = useState(() => sdk?.getContract(contractName));

  // skip first render as contract already initialized by useState()
  useUpdateEffect(() => {
    setContract(sdk?.getContract(contractName));
  }, [contractName, sdk]);

  return contract;
};

export const getSigner = async (signer: void | Signer, account: string) => {
  if (Signer.isSigner(signer)) {
    const address = await signer.getAddress();

    if (address === account) {
      return signer;
    }
  }

  return new Error("no signer or wrong signer");
};

function sdkFactory(
  type: SdkTypes,
  defaultEnv: EnvKey,
  readOnly: boolean,
  library: providers.JsonRpcProvider | providers.FallbackProvider | undefined,
  roLibrary: providers.JsonRpcProvider | undefined
): ClaimSDK | SavingsSDK | undefined {
  let provider = library;
  const reqSdk = NAME_TO_SDK[type];

  if (readOnly && roLibrary) {
    provider = roLibrary;
  }

  if (!provider) {
    console.error("Error detecting readonly urls from config");
    return;
  }

  return new reqSdk(provider as providers.JsonRpcProvider, defaultEnv) as ClaimSDK | SavingsSDK;
}

export const useSDK = (
  readOnly = false,
  type: SdkTypes = "base",
  requiredChainId?: number | undefined
): RequestedSdk["sdk"] => {
  const { library } = useEthers();
  const { chainId, defaultEnv } = useGetEnvChainId(requiredChainId);
  const rolibrary = useReadOnlyProvider(chainId);
  const [sdk, setSdk] = useState<ClaimSDK | SavingsSDK | undefined>(() =>
    sdkFactory(
      type,
      defaultEnv,
      readOnly,
      library instanceof providers.JsonRpcProvider ? library : undefined,
      rolibrary
    )
  );

  // skip first render as sdk already initialized by useState()
  useUpdateEffect(() => {
    setSdk(
      sdkFactory(
        type,
        defaultEnv,
        readOnly,
        library instanceof providers.JsonRpcProvider ? library : undefined,
        rolibrary
      )
    );
  }, [library, rolibrary, readOnly, defaultEnv, type]);

  return sdk;
};

export function useG$Tokens(requiredChainId?: number) {
  const { chainId, defaultEnv } = useGetEnvChainId(requiredChainId);
  const decimals = useContext(TokenContext);

  const tokens = useMemo(
    () => G$Tokens.map(token => G$Token(token, chainId, defaultEnv, decimals)), 
    [chainId, defaultEnv, decimals]
  );

  return tokens;
}

export function useG$Amount(value?: BigNumber, token: G$Token = "G$", requiredChainId?: number): CurrencyValue | null {
  const { chainId, defaultEnv } = useGetEnvChainId(requiredChainId);
  const decimals = useContext(TokenContext);  

  return value ? G$Amount(token, value, chainId, defaultEnv, decimals) : null;
}

export function useG$Decimals(token: G$Token = "G$", requiredChainId?: number): number {
  const { chainId } = useGetEnvChainId(requiredChainId);
  const decimals = useContext(TokenContext)[token];

  switch (token) {
    case "GDX":
      return decimals[SupportedChains.MAINNET] || 2;
    default:
      return decimals[chainId]
  }
}

export function useG$Balance(refresh: QueryParams["refresh"] = "never", requiredChainId?: number) { 
  const refreshOrNever = useRefreshOrNever(refresh);
  const { account } = useEthers();  
  const { chainId } = useGetEnvChainId(requiredChainId);  

  const g$Contract = useGetContract("GoodDollar", true, "base") as IGoodDollar;
  const goodContract = useGetContract("GReputation", true, "base") as GReputation;
  const gdxContract = useGetContract("GoodReserveCDai", true, "base", 1) as GoodReserveCDai;

  const { MAINNET } = SupportedChains;

  const results = useCalls(
    [
      {
        contract: g$Contract,
        method: "balanceOf",
        args: [account]
      },
      {
        contract: goodContract,
        method: "balanceOf",
        args: [account]
      },
    ],
    {
      refresh: refreshOrNever,
      chainId
    }
  );

  const [mainnetGdx] = useCalls(
    [
      {
        contract: gdxContract,
        method: "balanceOf",
        args: [account]
      },
    ].filter(_ => _.contract && chainId == MAINNET),
    { refresh: refreshOrNever, chainId: MAINNET as unknown as ChainId }
  );

  const [g$Value, goodValue, gdxValue] = [...results, mainnetGdx].map(
    result => result && !result.error ? result.value[0] : undefined
  );
  
  const g$Balance = useG$Amount(g$Value) as CurrencyValue;
  const goodBalance = useG$Amount(goodValue, "GOOD") as CurrencyValue;
  const gdxBalance = useG$Amount(gdxValue, "GDX") as CurrencyValue;

  const balances: G$Balances = {
    G$: g$Balance,
    GOOD: goodBalance,
    GDX: gdxBalance
  };

  return balances;
}
