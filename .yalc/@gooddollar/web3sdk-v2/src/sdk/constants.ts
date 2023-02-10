import { EnvKey } from "./base/sdk";
import { CurrencyValue, Token } from "@usedapp/core";
import contractsAddresses from "@gooddollar/goodprotocol/releases/deployment.json";
import { BigNumber } from "ethers";

/* List of supported chains for this sdk. */
export enum SupportedChains {
  MAINNET = 1,
  FUSE = 122,
  CELO = 42220
}

export type SUPPORTED_NETWORKS = "FUSE" | "CELO" | "MAINNET";

export enum SupportedV2Networks {
  FUSE = 122,
  CELO = 42220
}

export interface G$Balances {
  G$: CurrencyValue | undefined,
  GOOD: CurrencyValue | undefined,
  GDX: CurrencyValue | undefined,
};

export type G$Token = keyof G$Balances;

export type G$DecimalsByChain = Partial<Record<SupportedChains, number>>;

export type G$DecimalsMap = {
  G$: G$DecimalsByChain,
  GOOD: G$DecimalsByChain,
  GDX: G$DecimalsByChain
};

// will be used as default (fallback) values
export const G$Decimals: G$DecimalsMap = {
  G$: {
    [SupportedChains.MAINNET]: 2,
    [SupportedChains.FUSE]: 2,
    [SupportedChains.CELO]: 18,
  },
  GOOD: {
    [SupportedChains.MAINNET]: 18,
    [SupportedChains.FUSE]: 18,
    [SupportedChains.CELO]: 18,
  },
  GDX: {
    [SupportedChains.MAINNET]: 2,
  }
};

export const G$Tokens = Object.keys(G$Decimals) as G$Token[];

export type SupportedV2Network = keyof typeof SupportedV2Networks;

export const Envs: { [key: EnvKey]: { [key: string]: string } } = {
  production: {
    dappUrl: "https://wallet.gooddollar.org",
    identityUrl: "https://goodid.gooddollar.org",
    backend: "https://goodserver.gooddollar.org"
  },
  staging: {
    dappUrl: "https://goodqa.netlify.app",
    identityUrl: "https://goodid-qa.vercel.app",
    backend: "https://goodserver-qa.herokuapp.com"
  },
  development: {
    dappUrl: "https://gooddev.netlify.app",
    identityUrl: "https://goodid-dev.vercel.app",
    backend: "https://good-server.herokuapp.com"
  }
};

type ObjectLike = { [key: string]: string | ObjectLike | Array<string[]> | string[] | number };

export const G$TokenContracts = {
  G$: {
    contract: "GoodDollar",
    name: "GoodDollar",
    ticker: "G$",
  },
  GOOD: {
    contract: "GReputation",
    name: "GDAO",
    ticker: "GOOD",
  },
  GDX: {
    contract: "GoodReserveCDai",
    name: "GoodDollar X",
    ticker: "GDX",
  }
}

export function G$Token(tokenName: G$Token, chainId: number, env: string, decimalsMap: G$DecimalsMap = G$Decimals) {
  const { contract, name, ticker } = G$TokenContracts[tokenName]  
  
  let tokenEnv: string = env;
  let tokenChain: number = chainId;

  switch (tokenName) {
    case 'GDX':
      tokenEnv = "production-mainnet"; // only hardcoded because of missing dev contracts (deprecated ropsten/kovan)
      tokenChain = SupportedChains.MAINNET;
      break;
    default:
      break;
  }

  const decimals = decimalsMap[tokenName][chainId];
  const address = G$ContractAddresses(contract, tokenEnv) as string;

  return new Token(name, ticker, tokenChain, address, decimals);
}

export function G$Amount(tokenName: G$Token, value: BigNumber, chainId: number, env: string, decimalsMap: G$DecimalsMap = G$Decimals) {
  const token = G$Token(tokenName, chainId, env, decimalsMap);

  return new CurrencyValue(token, value);
}

export function G$ContractAddresses<T = ObjectLike>(name: string, env: EnvKey): T {
  if (!(contractsAddresses as any)[env]) {
    console.warn(`tokens: Unsupported chain ID ${env}`, env);
    env = env.includes("mainnet") ? env + "-mainnet" : env;
  }

  if (!(contractsAddresses as any)[env][name]) {
    throw new Error(`Inappropriate contract name ${name} in ${env}`);
  }

  return (contractsAddresses as any)[env][name] as unknown as T;
}
