"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimSDK = void 0;
const ethers_1 = require("ethers");
const lodash_1 = require("lodash");
const sdk_1 = require("../base/sdk");
const DAY = 1000 * 60 * 60 * 24;
const FV_LOGIN_MSG = `Sign this message to login into GoodDollar Unique Identity service.
WARNING: do not sign this message unless you trust the website/application requesting this signature.
nonce:`;
const FV_IDENTIFIER_MSG2 = `Sign this message to request verifying your account <account> and to create your own secret unique identifier for your anonymized record.
You can use this identifier in the future to delete this anonymized record.
WARNING: do not sign this message unless you trust the website/application requesting this signature.`;
class ClaimSDK extends sdk_1.BaseSDK {
    async generateFVLink(firstName, callbackUrl, popupMode = false) {
        const steps = this.getFVLink();
        await steps.getLoginSig();
        await steps.getFvSig();
        return steps.getLink(firstName, callbackUrl, popupMode);
    }
    getFVLink() {
        let loginSig, fvSig, nonce, account;
        const { env, provider } = this;
        const signer = provider.getSigner();
        const { identityUrl } = env;
        const getLoginSig = async () => {
            nonce = (Date.now() / 1000).toFixed(0);
            loginSig = await signer.signMessage(FV_LOGIN_MSG + nonce);
            return loginSig;
        };
        const getFvSig = async () => {
            account = await signer.getAddress();
            fvSig = await signer.signMessage(FV_IDENTIFIER_MSG2.replace("<account>", account));
            return fvSig;
        };
        const getLink = (firstName, callbackUrl, popupMode = false) => {
            if (!fvSig) {
                throw new Error("missing login or identifier signature");
            }
            if (popupMode === false && !callbackUrl) {
                throw new Error("redirect url is missing for redirect mode");
            }
            const url = new URL(identityUrl);
            const { searchParams } = url;
            const params = (0, lodash_1.pickBy)({
                account,
                nonce,
                fvsig: fvSig,
                firstname: firstName,
                sg: loginSig
            });
            (0, lodash_1.forIn)(params, (value, param) => {
                searchParams.append(param, value);
            });
            if (callbackUrl) {
                searchParams.append(popupMode ? "cbu" : "rdu", callbackUrl);
            }
            return url.toString();
        };
        return { getLoginSig, getFvSig, getLink };
    }
    async isAddressVerified(address) {
        const identity = this.getContract("Identity");
        return identity.isWhitelisted(address);
    }
    async checkEntitlement(address) {
        const ubi = this.getContract("UBIScheme");
        try {
            if (address) {
                return await ubi["checkEntitlement(address)"](address);
            }
            return await ubi["checkEntitlement()"]();
        }
        catch {
            return ethers_1.BigNumber.from("0");
        }
    }
    async getNextClaimTime() {
        const ubi = this.getContract("UBIScheme");
        const [periodStart, currentDay] = await Promise.all([ubi.periodStart(), ubi.currentDay()]).then(values => (0, lodash_1.invokeMap)(values, "toNumber"));
        let startRef = new Date(periodStart * 1000 + currentDay * DAY);
        if (startRef < new Date()) {
            startRef = new Date(startRef.getTime() + DAY);
        }
        return startRef;
    }
    async claim() {
        const ubi = this.getContract("UBIScheme");
        return ubi.claim();
    }
}
exports.ClaimSDK = ClaimSDK;
//# sourceMappingURL=sdk.js.map