import { GoodDollarStaking, IGoodDollar } from "@gooddollar/goodprotocol/types";
import { ChainId, CurrencyValue, QueryParams, useCalls, useContractFunction, useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { useCallback } from "react";
import useRefreshOrNever from "../../hooks/useRefreshOrNever";
import { useGetContract, useGetEnvChainId, useG$Amount } from "../base/react";

export interface StakerInfo {
  claimable:
    | {
        g$Reward: CurrencyValue | any;
        goodReward: CurrencyValue | any;
      }
    | undefined;
  balance?: CurrencyValue | any;
  rewardsPaid?: {
    g$Minted: CurrencyValue | any;
    goodMinted: CurrencyValue | any;
  };
  deposit?: CurrencyValue | any;
  principle?: CurrencyValue | any;
  shares?: number | any;
  lastSharePrice?: number | any;
}

export interface SavingsStats {
  totalStaked: CurrencyValue | undefined;
  totalRewardsPaid: CurrencyValue | undefined;
  apy: number | undefined;
  lastUpdateBlock?: number;
  savings?: number;
}

export function useSavingsBalance(refresh: QueryParams["refresh"] = "never", requiredChainId: number) {
  const refreshOrNever = useRefreshOrNever(refresh);
  const { account } = useEthers();
  const gooddollar = useGetContract("GoodDollar", true, "savings") as IGoodDollar;
  const gdStaking = useGetContract("GoodDollarStaking", true, "savings") as GoodDollarStaking;

  const results = useCalls(
    [
      {
        contract: gooddollar,
        method: "balanceOf",
        args: [account]
      },
      {
        contract: gdStaking,
        method: "getSavings",
        args: [account]
      }
    ],
    {
      refresh: refreshOrNever,
      chainId: requiredChainId
    }
  );

  const [balance = { value: 0, error: undefined }, sBalance = { value: 0, error: undefined }] = results;
  const g$Balance = useG$Amount(balance.value, "G$", requiredChainId);
  const savingsBalance = useG$Amount(sBalance.value, "G$", requiredChainId);

  return { g$Balance, savingsBalance };
}

export const useSavingsFunctions = () => {
  const gooddollar = useGetContract("GoodDollar", false, "savings") as IGoodDollar;
  const gdStaking = useGetContract("GoodDollarStaking", false, "savings") as GoodDollarStaking;

  const { state: transferState, send: sendTransfer } = useContractFunction(gooddollar, "transferAndCall", {
    transactionName: "Transfer to savings"
  });
  const { state: withdrawState, send: sendWithdraw } = useContractFunction(gdStaking, "withdrawStake", {
    transactionName: "Withdraw from savings"
  });
  const { state: claimState, send: sendClaim } = useContractFunction(gdStaking, "withdrawRewards", {
    transactionName: "Withdraw rewards from savings"
  });

  const transfer = useCallback(
    (amount: string) => {
      const callData = ethers.constants.HashZero;
      return sendTransfer(gdStaking.address, amount, callData);
    },
    [sendTransfer, gdStaking]
  );

  const withdraw = useCallback(
    async (amount: string, address?: string) => {
      const shares = address ? await gdStaking.sharesOf(address) : await gdStaking.amountToShares(amount); // sharesOf used to withdraw full amount
      return sendWithdraw(shares);
    },
    [sendWithdraw]
  );

  const claim = useCallback(() => sendClaim(), [sendClaim]);

  return { transfer, withdraw, claim, transferState, withdrawState, claimState };
};

export const useSavingsStats = (requiredChainId: number, refresh: QueryParams["refresh"] = "never") => {
  const refreshOrNever = useRefreshOrNever(refresh);
  const { chainId } = useGetEnvChainId(requiredChainId);

  const gdStaking = useGetContract("GoodDollarStaking", true, "savings", chainId) as GoodDollarStaking;

  const results = useCalls(
    [
      {
        contract: gdStaking,
        method: "stats",
        args: []
      },
      {
        contract: gdStaking,
        method: "getRewardsPerBlock",
        args: []
      },
      {
        contract: gdStaking,
        method: "numberOfBlocksPerYear",
        args: []
      }
    ],
    { refresh: refreshOrNever, chainId: chainId as unknown as ChainId }
  );

  const globalStats: SavingsStats = {
    totalStaked: undefined,
    totalRewardsPaid: undefined,
    apy: undefined
  };

  const [, totalStaked, totalRewardsPaid] = results[0]?.value ?? []; // eslint-disable-line no-unsafe-optional-chaining
  const staked = useG$Amount(totalStaked, "G$", requiredChainId);
  const rewardsPaid = useG$Amount(totalRewardsPaid, "G$", requiredChainId);

  if (results[0]?.error) {
    // one fails, all fails
    const errMessages: Array<any> = [];
    for (let i = 0; i < results.length; i++) {
      errMessages.push(results[i]?.error);
    }

    return {
      stats: undefined,
      error: errMessages
    };
  }

  if (staked && rewardsPaid) {
    globalStats.totalStaked = staked;
    globalStats.totalRewardsPaid = rewardsPaid;
  }

  if (results[1] && results[2]) { // eslint-disable-line no-unsafe-optional-chaining
    const { _gdInterestRatePerBlock: gdIrpb } = results[1]?.value; // eslint-disable-line no-unsafe-optional-chaining
    const numberOfBlocksPerYear = results[2]?.value;
    const apy = (Math.pow(gdIrpb / 1e18, numberOfBlocksPerYear) - 1) * 100;

    globalStats.apy = apy;
  }

  return {
    stats: globalStats,
    error: undefined
  };
};

export const useStakerInfo = (requiredChainId: number, refresh: QueryParams["refresh"] = "never", account: string) => {
  const refreshOrNever = useRefreshOrNever(refresh);
  const { chainId } = useGetEnvChainId(requiredChainId);
  const contract = useGetContract("GoodDollarStaking", true, "savings", chainId) as GoodDollarStaking;

  const results = useCalls(
    [
      {
        contract: contract,
        method: "getUserPendingReward(address)",
        args: [account]
      },
      {
        contract: contract,
        method: "principle",
        args: [account]
      }
    ],
    { refresh: refreshOrNever, chainId: chainId as unknown as ChainId }
  );

  const stakerInfo: StakerInfo = {
    claimable: undefined,
    principle: undefined
  };

  const [goodRewardValue, g$RewardValue] = results[0]?.value ?? []
  const [principle] = results[1]?.value ?? []
  
  const g$Reward = useG$Amount(g$RewardValue, "G$", requiredChainId);
  const goodReward = useG$Amount(goodRewardValue, "GOOD", requiredChainId);
  const deposit = useG$Amount(principle, "G$", requiredChainId);

  if (results[0]?.error) {
    const errMessages: Array<any> = [];
    for (let i = 0; i < results.length; i++) {
      errMessages.push(results[i]?.error);
    }

    return {
      stats: undefined,
      error: errMessages
    };
  }

  if (goodReward && g$Reward) {
    const claimableRewards = { g$Reward, goodReward };
    
    stakerInfo.claimable = claimableRewards;
  }

  if (deposit) {    
    stakerInfo.principle = deposit;
  }

  return {
    stats: stakerInfo,
    error: undefined
  };
};
