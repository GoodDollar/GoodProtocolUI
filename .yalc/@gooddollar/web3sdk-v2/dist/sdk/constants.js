"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.G$ContractAddresses = exports.G$Amount = exports.G$Token = exports.G$TokenContracts = exports.Envs = exports.G$Tokens = exports.G$Decimals = exports.SupportedV2Networks = exports.SupportedChains = void 0;
const core_1 = require("@usedapp/core");
const deployment_json_1 = __importDefault(require("@gooddollar/goodprotocol/releases/deployment.json"));
/* List of supported chains for this sdk. */
var SupportedChains;
(function (SupportedChains) {
    SupportedChains[SupportedChains["MAINNET"] = 1] = "MAINNET";
    SupportedChains[SupportedChains["FUSE"] = 122] = "FUSE";
    SupportedChains[SupportedChains["CELO"] = 42220] = "CELO";
})(SupportedChains = exports.SupportedChains || (exports.SupportedChains = {}));
var SupportedV2Networks;
(function (SupportedV2Networks) {
    SupportedV2Networks[SupportedV2Networks["FUSE"] = 122] = "FUSE";
    SupportedV2Networks[SupportedV2Networks["CELO"] = 42220] = "CELO";
})(SupportedV2Networks = exports.SupportedV2Networks || (exports.SupportedV2Networks = {}));
;
// will be used as default (fallback) values
exports.G$Decimals = {
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
exports.G$Tokens = Object.keys(exports.G$Decimals);
exports.Envs = {
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
exports.G$TokenContracts = {
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
};
function G$Token(tokenName, chainId, env, decimalsMap = exports.G$Decimals) {
    const { contract, name, ticker } = exports.G$TokenContracts[tokenName];
    let tokenEnv = env;
    let tokenChain = chainId;
    switch (tokenName) {
        case 'GDX':
            tokenEnv = "production-mainnet"; // only hardcoded because of missing dev contracts (deprecated ropsten/kovan)
            tokenChain = SupportedChains.MAINNET;
            break;
        default:
            break;
    }
    const decimals = decimalsMap[tokenName][chainId];
    const address = G$ContractAddresses(contract, tokenEnv);
    return new core_1.Token(name, ticker, tokenChain, address, decimals);
}
exports.G$Token = G$Token;
function G$Amount(tokenName, value, chainId, env, decimalsMap = exports.G$Decimals) {
    const token = G$Token(tokenName, chainId, env, decimalsMap);
    return new core_1.CurrencyValue(token, value);
}
exports.G$Amount = G$Amount;
function G$ContractAddresses(name, env) {
    if (!deployment_json_1.default[env]) {
        console.warn(`tokens: Unsupported chain ID ${env}`, env);
        env = env.includes("mainnet") ? env + "-mainnet" : env;
    }
    if (!deployment_json_1.default[env][name]) {
        throw new Error(`Inappropriate contract name ${name} in ${env}`);
    }
    return deployment_json_1.default[env][name];
}
exports.G$ContractAddresses = G$ContractAddresses;
//# sourceMappingURL=constants.js.map