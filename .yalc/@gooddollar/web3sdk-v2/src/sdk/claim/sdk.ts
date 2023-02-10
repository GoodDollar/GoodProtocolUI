import { BigNumber } from "ethers";
import { invokeMap, pickBy, forIn } from "lodash";
import { BaseSDK } from "../base/sdk";

const DAY = 1000 * 60 * 60 * 24;

const FV_LOGIN_MSG = `Sign this message to login into GoodDollar Unique Identity service.
WARNING: do not sign this message unless you trust the website/application requesting this signature.
nonce:`;

const FV_IDENTIFIER_MSG2 = `Sign this message to request verifying your account <account> and to create your own secret unique identifier for your anonymized record.
You can use this identifier in the future to delete this anonymized record.
WARNING: do not sign this message unless you trust the website/application requesting this signature.`;

export class ClaimSDK extends BaseSDK {
  async generateFVLink(firstName: string, callbackUrl?: string, popupMode = false) {
    const steps = this.getFVLink();

    await steps.getLoginSig();
    await steps.getFvSig();
    return steps.getLink(firstName, callbackUrl, popupMode);
  }

  getFVLink() {
    let loginSig: string, fvSig: string, nonce: string, account: string;
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

    const getLink = (firstName: string, callbackUrl?: string, popupMode = false) => {
      if (!fvSig) {
        throw new Error("missing login or identifier signature");
      }
      
      if (popupMode === false && !callbackUrl) {
        throw new Error("redirect url is missing for redirect mode");
      }
      
      const url = new URL(identityUrl);
      const { searchParams } = url

      const params = pickBy({
        account,
        nonce,
        fvsig: fvSig,
        firstname: firstName,
        sg: loginSig
      });

      forIn(params, (value, param) => {
        searchParams.append(param, value);
      });

      if (callbackUrl) {
        searchParams.append(popupMode ? "cbu" : "rdu", callbackUrl);
      }

      return url.toString();
    };

    return { getLoginSig, getFvSig, getLink };
  }

  async isAddressVerified(address: string): Promise<boolean> {
    const identity = this.getContract("Identity");

    return identity.isWhitelisted(address);
  }

  async checkEntitlement(address?: string): Promise<BigNumber> {
    const ubi = this.getContract("UBIScheme");

    try {
      if (address) {
        return await ubi["checkEntitlement(address)"](address);
      }

      return await ubi["checkEntitlement()"]();
    } catch {
      return BigNumber.from("0");
    }
  }

  async getNextClaimTime() {
    const ubi = this.getContract("UBIScheme");
    const [periodStart, currentDay] = await Promise.all([ubi.periodStart(), ubi.currentDay()]).then(values =>
      invokeMap(values, "toNumber")
    );

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
