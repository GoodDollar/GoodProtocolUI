"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingsSDK = void 0;
const ethers_1 = require("ethers");
const sdk_1 = require("../base/sdk");
class SavingsSDK extends sdk_1.BaseSDK {
    //simple helper for checking an active savings account
    async hasBalance(account) {
        const contract = this.getContract("GoodDollarStaking");
        if (contract && account) {
            const balance = await contract.balanceOf(account);
            return !balance.isZero();
        }
    }
    async onTokenTransfer(amount) {
        const contract = this.getContract("GoodDollar");
        const stakeContract = this.getContract("GoodDollarStaking");
        try {
            const callData = ethers_1.ethers.constants.HashZero;
            const transfer = contract.transferAndCall(stakeContract.address, amount, callData);
            return transfer;
        }
        catch (e) {
            if (e.code === 4001) {
                throw new Error("User cancelled transaction confirmation");
            }
            else {
                /// log error to sentry
            }
        }
    }
    async withdraw(amount, isFullWithdraw) {
        const contract = this.getContract("GoodDollarStaking");
        try {
            //note: if tx fails on limit, up the gasLimitBufferPercentage (see context config))
            const shares = isFullWithdraw
                ? await contract.sharesOf(await contract.signer.getAddress())
                : await contract.amountToShares(amount);
            const withdraw = contract.withdrawStake(shares);
            return withdraw;
        }
        catch (e) {
            if (e.code === 4001) {
                throw new Error("User cancelled transaction confirmation");
            }
            else {
                /// log error to sentry
            }
        }
    }
    async getStakerInfo(account) {
        if (!account)
            return;
        const contract = this.getContract("GoodDollarStaking");
        try {
            const req = await contract.stakersInfo(account).then(res => {
                return res;
            });
            return req;
        }
        catch (e) {
            if (e.code === 4001) {
                throw new Error("User cancelled transaction confirmation");
            }
            else {
                /// log error to sentry
            }
        }
    }
}
exports.SavingsSDK = SavingsSDK;
//# sourceMappingURL=sdk.js.map