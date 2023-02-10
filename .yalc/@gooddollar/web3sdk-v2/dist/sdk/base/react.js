"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useG$Balance = exports.useG$Decimals = exports.useG$Amount = exports.useG$Tokens = exports.useSDK = exports.getSigner = exports.useGetContract = exports.useGetEnvChainId = exports.useReadOnlySDK = exports.NAME_TO_SDK = void 0;
const react_1 = require("react");
const ethers_1 = require("ethers");
const sdk_1 = require("./sdk");
const contexts_1 = require("../../contexts");
const core_1 = require("@usedapp/core");
const sdk_2 = require("../claim/sdk");
const sdk_3 = require("../savings/sdk");
const deployment_json_1 = __importDefault(require("@gooddollar/goodprotocol/releases/deployment.json"));
const useMulticallAtChain_1 = require("../../hooks/useMulticallAtChain");
const useUpdateEffect_1 = __importDefault(require("../../hooks/useUpdateEffect"));
const hooks_1 = require("../../hooks");
const constants_1 = require("../constants");
exports.NAME_TO_SDK = {
    claim: sdk_2.ClaimSDK,
    savings: sdk_3.SavingsSDK,
    base: sdk_1.BaseSDK
};
const useReadOnlySDK = (type, requiredChainId) => {
    return (0, exports.useSDK)(true, type, requiredChainId);
};
exports.useReadOnlySDK = useReadOnlySDK;
const useGetEnvChainId = (requiredChainId) => {
    var _a;
    const { chainId } = (0, core_1.useEthers)();
    const web3Context = (0, react_1.useContext)(contexts_1.Web3Context);
    const baseEnv = web3Context.env || "";
    let connectedEnv = baseEnv;
    switch (requiredChainId !== null && requiredChainId !== void 0 ? requiredChainId : chainId) {
        case 1:
            connectedEnv = "production-mainnet"; // temp untill dev contracts are released to goerli
            break;
        case 42220:
            connectedEnv = connectedEnv === "fuse" ? "development-celo" : connectedEnv + "-celo";
            break;
    }
    const defaultEnv = connectedEnv;
    return {
        chainId: Number((_a = deployment_json_1.default[defaultEnv]) === null || _a === void 0 ? void 0 : _a.networkId),
        defaultEnv,
        baseEnv,
        connectedEnv,
        switchNetworkRequest: web3Context.switchNetwork
    };
};
exports.useGetEnvChainId = useGetEnvChainId;
const useGetContract = (contractName, readOnly = false, type = "base", requiredChainId) => {
    const sdk = (0, exports.useSDK)(readOnly, type, requiredChainId);
    const [contract, setContract] = (0, react_1.useState)(() => sdk === null || sdk === void 0 ? void 0 : sdk.getContract(contractName));
    // skip first render as contract already initialized by useState()
    (0, useUpdateEffect_1.default)(() => {
        setContract(sdk === null || sdk === void 0 ? void 0 : sdk.getContract(contractName));
    }, [contractName, sdk]);
    return contract;
};
exports.useGetContract = useGetContract;
const getSigner = async (signer, account) => {
    if (ethers_1.Signer.isSigner(signer)) {
        const address = await signer.getAddress();
        if (address === account) {
            return signer;
        }
    }
    return new Error("no signer or wrong signer");
};
exports.getSigner = getSigner;
function sdkFactory(type, defaultEnv, readOnly, library, roLibrary) {
    let provider = library;
    const reqSdk = exports.NAME_TO_SDK[type];
    if (readOnly && roLibrary) {
        provider = roLibrary;
    }
    if (!provider) {
        console.error("Error detecting readonly urls from config");
        return;
    }
    return new reqSdk(provider, defaultEnv);
}
const useSDK = (readOnly = false, type = "base", requiredChainId) => {
    const { library } = (0, core_1.useEthers)();
    const { chainId, defaultEnv } = (0, exports.useGetEnvChainId)(requiredChainId);
    const rolibrary = (0, useMulticallAtChain_1.useReadOnlyProvider)(chainId);
    const [sdk, setSdk] = (0, react_1.useState)(() => sdkFactory(type, defaultEnv, readOnly, library instanceof ethers_1.providers.JsonRpcProvider ? library : undefined, rolibrary));
    // skip first render as sdk already initialized by useState()
    (0, useUpdateEffect_1.default)(() => {
        setSdk(sdkFactory(type, defaultEnv, readOnly, library instanceof ethers_1.providers.JsonRpcProvider ? library : undefined, rolibrary));
    }, [library, rolibrary, readOnly, defaultEnv, type]);
    return sdk;
};
exports.useSDK = useSDK;
function useG$Tokens(requiredChainId) {
    const { chainId, defaultEnv } = (0, exports.useGetEnvChainId)(requiredChainId);
    const decimals = (0, react_1.useContext)(contexts_1.TokenContext);
    const tokens = (0, react_1.useMemo)(() => constants_1.G$Tokens.map(token => (0, constants_1.G$Token)(token, chainId, defaultEnv, decimals)), [chainId, defaultEnv, decimals]);
    return tokens;
}
exports.useG$Tokens = useG$Tokens;
function useG$Amount(value, token = "G$", requiredChainId) {
    const { chainId, defaultEnv } = (0, exports.useGetEnvChainId)(requiredChainId);
    const decimals = (0, react_1.useContext)(contexts_1.TokenContext);
    return value ? (0, constants_1.G$Amount)(token, value, chainId, defaultEnv, decimals) : null;
}
exports.useG$Amount = useG$Amount;
function useG$Decimals(token = "G$", requiredChainId) {
    const { chainId } = (0, exports.useGetEnvChainId)(requiredChainId);
    const decimals = (0, react_1.useContext)(contexts_1.TokenContext)[token];
    switch (token) {
        case "GDX":
            return decimals[constants_1.SupportedChains.MAINNET] || 2;
        default:
            return decimals[chainId];
    }
}
exports.useG$Decimals = useG$Decimals;
function useG$Balance(refresh = "never", requiredChainId) {
    const refreshOrNever = (0, hooks_1.useRefreshOrNever)(refresh);
    const { account } = (0, core_1.useEthers)();
    const { chainId } = (0, exports.useGetEnvChainId)(requiredChainId);
    const g$Contract = (0, exports.useGetContract)("GoodDollar", true, "base");
    const goodContract = (0, exports.useGetContract)("GReputation", true, "base");
    const gdxContract = (0, exports.useGetContract)("GoodReserveCDai", true, "base", 1);
    const { MAINNET } = constants_1.SupportedChains;
    const results = (0, core_1.useCalls)([
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
    ], {
        refresh: refreshOrNever,
        chainId
    });
    const [mainnetGdx] = (0, core_1.useCalls)([
        {
            contract: gdxContract,
            method: "balanceOf",
            args: [account]
        },
    ].filter(_ => _.contract && chainId == MAINNET), { refresh: refreshOrNever, chainId: MAINNET });
    const [g$Value, goodValue, gdxValue] = [...results, mainnetGdx].map(result => result && !result.error ? result.value[0] : undefined);
    const g$Balance = useG$Amount(g$Value);
    const goodBalance = useG$Amount(goodValue, "GOOD");
    const gdxBalance = useG$Amount(gdxValue, "GDX");
    const balances = {
        G$: g$Balance,
        GOOD: goodBalance,
        GDX: gdxBalance
    };
    return balances;
}
exports.useG$Balance = useG$Balance;
//# sourceMappingURL=react.js.map