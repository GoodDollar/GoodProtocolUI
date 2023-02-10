import { ethers } from "ethers";
import { BaseSDK } from "../base/sdk";

export class SavingsSDK extends BaseSDK {
  //simple helper for checking an active savings account
  async hasBalance(account: string): Promise<boolean | undefined> {
    const contract = this.getContract("GoodDollarStaking");
    if (contract && account) {
      const balance = await contract.balanceOf(account);
      return !balance.isZero();
    }
  }

  async onTokenTransfer(
    amount: string,
  ): Promise<ethers.ContractTransaction | undefined> {
    const contract = this.getContract("GoodDollar");
    const stakeContract = this.getContract("GoodDollarStaking");

    try {
      const callData = ethers.constants.HashZero;

      const transfer = contract.transferAndCall(stakeContract.address, amount, callData);
      return transfer;
    } catch (e: any) {
      if (e.code === 4001) {
        throw new Error("User cancelled transaction confirmation");
      } else {
        /// log error to sentry
      }
    }
  }

  async withdraw(
    amount: string,
    isFullWithdraw: boolean,
  ): Promise<ethers.ContractTransaction | undefined> {
    const contract = this.getContract("GoodDollarStaking");
    try {
      //note: if tx fails on limit, up the gasLimitBufferPercentage (see context config))
      const shares = isFullWithdraw
        ? await contract.sharesOf(await contract.signer.getAddress())
        : await contract.amountToShares(amount);
      const withdraw = contract.withdrawStake(shares);
      return withdraw;
    } catch (e: any) {
      if (e.code === 4001) {
        throw new Error("User cancelled transaction confirmation");
      } else {
        /// log error to sentry
      }
    }
  }

  async getStakerInfo(account: string) {
    if (!account) return;
    const contract = this.getContract("GoodDollarStaking");
    try {
      const req = await contract.stakersInfo(account).then(res => {
        return res;
      });
      return req;
    } catch (e: any) {
      if (e.code === 4001) {
        throw new Error("User cancelled transaction confirmation");
      } else {
        /// log error to sentry
      }
    }
  }
}
