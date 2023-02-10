"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSDK = exports.CONTRACT_TO_ABI = void 0;
const ethers_1 = require("ethers");
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
//@ts-ignore
const IIdentity_min_json_1 = __importDefault(require("@gooddollar/goodprotocol/artifacts/abis/IIdentity.min.json"));
//@ts-ignore
const UBIScheme_min_json_1 = __importDefault(require("@gooddollar/goodprotocol/artifacts/abis/UBIScheme.min.json"));
//@ts-ignore
const GoodDollarStaking_min_json_1 = __importDefault(require("@gooddollar/goodprotocol/artifacts/abis/GoodDollarStaking.min.json"));
//@ts-ignore
const IGoodDollar_min_json_1 = __importDefault(require("@gooddollar/goodprotocol/artifacts/abis/IGoodDollar.min.json"));
const Faucet_min_json_1 = __importDefault(require("@gooddollar/goodprotocol/artifacts/abis/Faucet.min.json"));
const GReputation_min_json_1 = __importDefault(require("@gooddollar/goodprotocol/artifacts/abis/GReputation.min.json"));
const GoodReserveCDai_min_json_1 = __importDefault(require("@gooddollar/goodprotocol/artifacts/abis/GoodReserveCDai.min.json"));
//@ts-ignore
const deployment_json_1 = __importDefault(require("@gooddollar/goodprotocol/releases/deployment.json"));
exports.CONTRACT_TO_ABI = {
    Identity: IIdentity_min_json_1.default,
    UBIScheme: UBIScheme_min_json_1.default,
    GoodDollarStaking: GoodDollarStaking_min_json_1.default,
    GoodDollar: IGoodDollar_min_json_1.default,
    Faucet: Faucet_min_json_1.default,
    FuseFaucet: Faucet_min_json_1.default,
    GReputation: GReputation_min_json_1.default,
    GoodReserveCDai: GoodReserveCDai_min_json_1.default
};
class BaseSDK {
    constructor(provider, contractsEnv = "production") {
        this.signer = undefined;
        this.provider = provider;
        let devEnv = contractsEnv.split("-")[0];
        devEnv = devEnv === "fuse" ? "development" : devEnv;
        this.env = constants_1.Envs[devEnv];
        this.contracts = deployment_json_1.default[contractsEnv];
        // console.log("baseSdk provider", { provider });
        provider
            .getNetwork()
            .then(network => {
            if (network.chainId != this.contracts.networkId)
                console.error(`BaseSDK: provider chainId doesn't match env (${contractsEnv}) chainId. provider:${network.chainId} env:${this.contracts.networkId}`);
        })
            .catch(lodash_1.noop);
        try {
            const signer = provider.getSigner();
            signer
                .getAddress()
                .then(async () => void (this.signer = signer))
                .catch(() => {
                // todo @l03tj3: revert back
                // console.warn("BaseSDK: provider has no signer", { signer, provider, e });
            });
        }
        catch (e) {
            // todo @l03tj3: revert back
            // console.warn("BaseSDK: provider has no signer", { provider, e });
        }
    }
    getContract(contractName) {
        if (!this.contracts[contractName])
            return;
        switch (contractName) {
            case "UBIScheme":
                return new ethers_1.Contract(this.contracts["UBIScheme"], exports.CONTRACT_TO_ABI["UBIScheme"].abi, this.signer || this.provider);
            case "Identity":
                return new ethers_1.Contract(this.contracts["Identity"], exports.CONTRACT_TO_ABI["Identity"].abi, this.signer || this.provider);
            case "GoodDollarStaking":
                return new ethers_1.Contract(this.contracts["GoodDollarStaking"], exports.CONTRACT_TO_ABI["GoodDollarStaking"].abi, this.signer || this.provider);
            case "GoodDollar":
                return new ethers_1.Contract(this.contracts["GoodDollar"], exports.CONTRACT_TO_ABI["GoodDollar"].abi, this.signer || this.provider);
            case "Faucet":
                return new ethers_1.Contract(this.contracts["Faucet"], exports.CONTRACT_TO_ABI["Faucet"].abi, this.signer || this.provider);
            case "GReputation":
                return new ethers_1.Contract(this.contracts["GReputation"], exports.CONTRACT_TO_ABI["GReputation"].abi, this.signer || this.provider);
            case "GoodReserveCDai":
                return new ethers_1.Contract(this.contracts["GoodReserveCDai"], exports.CONTRACT_TO_ABI["GoodReserveCDai"].abi, this.signer || this.provider);
            default:
                return new ethers_1.Contract(this.contracts[contractName], exports.CONTRACT_TO_ABI[contractName].abi, this.signer || this.provider);
        }
    }
}
exports.BaseSDK = BaseSDK;
//# sourceMappingURL=sdk.js.map