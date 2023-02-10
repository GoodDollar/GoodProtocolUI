"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWhitelistSync = exports.useClaim = exports.useIsAddressVerified = exports.useFVLink = void 0;
const core_1 = require("@usedapp/core");
const ethers_1 = require("ethers");
const lodash_1 = require("lodash");
const react_1 = require("react");
const storage_1 = require("../storage");
const react_use_promise_1 = __importDefault(require("react-use-promise"));
const useRefreshOrNever_1 = __importDefault(require("../../hooks/useRefreshOrNever"));
const react_2 = require("../base/react");
const constants_1 = require("../constants");
const lodash_2 = require("lodash");
const useFVLink = () => {
    const { chainId } = (0, react_2.useGetEnvChainId)();
    const sdk = (0, react_2.useSDK)(false, "claim", chainId);
    return (0, react_1.useMemo)(() => sdk === null || sdk === void 0 ? void 0 : sdk.getFVLink(), [sdk]);
};
exports.useFVLink = useFVLink;
const useIsAddressVerified = (address, env) => {
    const sdk = (0, react_2.useReadOnlySDK)("claim");
    const result = (0, react_use_promise_1.default)(() => {
        if (address && sdk)
            return sdk.isAddressVerified(address);
        return Promise.resolve(undefined);
    }, [address, env, sdk]);
    return result;
};
exports.useIsAddressVerified = useIsAddressVerified;
const useClaim = (refresh = "never") => {
    var _a, _b, _c, _d;
    const refreshOrNever = (0, useRefreshOrNever_1.default)(refresh);
    const DAY = 1000 * 60 * 60 * 24;
    const { account } = (0, core_1.useEthers)();
    const { chainId } = (0, react_2.useGetEnvChainId)();
    const ubi = (0, react_2.useGetContract)("UBIScheme", true, "claim", chainId);
    const identity = (0, react_2.useGetContract)("Identity", true, "claim", chainId);
    const claimCall = (0, core_1.useContractFunction)(ubi, "claim");
    console.log("useClaim -->", { ubi, identity, claimCall });
    const results = (0, core_1.useCalls)([
        identity &&
            account && {
            contract: identity,
            method: "isWhitelisted",
            args: [account]
        },
        ubi && {
            contract: ubi,
            method: "currentDay",
            args: []
        },
        ubi && {
            contract: ubi,
            method: "periodStart",
            args: []
        },
        ubi &&
            account && {
            contract: ubi,
            method: "checkEntitlement(address)",
            args: [account]
        }
    ].filter(_ => _), { refresh: refreshOrNever, chainId });
    const periodStart = ((0, lodash_1.first)((_a = results[2]) === null || _a === void 0 ? void 0 : _a.value) || ethers_1.BigNumber.from("0"));
    const currentDay = ((0, lodash_1.first)((_b = results[1]) === null || _b === void 0 ? void 0 : _b.value) || ethers_1.BigNumber.from("0"));
    let startRef = new Date(periodStart.toNumber() * 1000 + currentDay.toNumber() * DAY);
    if (startRef < new Date()) {
        startRef = new Date(periodStart.toNumber() * 1000 + (currentDay.toNumber() + 1) * DAY);
    }
    return {
        isWhitelisted: (0, lodash_1.first)((_c = results[0]) === null || _c === void 0 ? void 0 : _c.value),
        claimAmount: (0, lodash_1.first)((_d = results[3]) === null || _d === void 0 ? void 0 : _d.value) || undefined,
        claimTime: startRef,
        claimCall
    };
};
exports.useClaim = useClaim;
// if user is verified on fuse and not on current network then send backend request to whitelist
const useWhitelistSync = () => {
    const [syncStatus, setSyncStatus] = (0, react_1.useState)();
    const { baseEnv } = (0, react_2.useGetEnvChainId)();
    const { account, chainId } = (0, core_1.useEthers)();
    const identity = (0, react_2.useGetContract)("Identity", true, "claim", constants_1.SupportedChains.FUSE);
    const identity2 = (0, react_2.useGetContract)("Identity", true, "claim", chainId);
    const [fuseResult] = (0, core_1.useCalls)([
        {
            contract: identity,
            method: "isWhitelisted",
            args: [account]
        }
    ], { refresh: "never", chainId: constants_1.SupportedChains.FUSE });
    const [otherResult] = (0, core_1.useCalls)([
        {
            contract: identity2,
            method: "isWhitelisted",
            args: [account]
        }
    ].filter(_ => _.contract && chainId != constants_1.SupportedChains.FUSE), { refresh: "never", chainId });
    (0, react_1.useEffect)(() => {
        const whitelistSync = async () => {
            const isSynced = await storage_1.AsyncStorage.getItem(`${account}-whitelistedSync`);
            if (!isSynced && (fuseResult === null || fuseResult === void 0 ? void 0 : fuseResult.value[0]) && (otherResult === null || otherResult === void 0 ? void 0 : otherResult.value[0]) === false) {
                const devEnv = baseEnv === "fuse" ? "development" : baseEnv;
                const { backend } = constants_1.Envs[devEnv];
                setSyncStatus(fetch(backend + `/syncWhitelist/${account}`)
                    .then(async (r) => {
                    if (r.status === 200) {
                        await r.json();
                        storage_1.AsyncStorage.safeSet(`${account}-whitelistedSync`, true);
                        return true;
                    }
                    else {
                        return false;
                    }
                })
                    .catch(() => false));
            }
            else {
                setSyncStatus(Promise.resolve(true));
            }
        };
        whitelistSync().catch(lodash_2.noop);
    }, [fuseResult, otherResult, account, setSyncStatus]);
    return {
        fuseWhitelisted: (0, lodash_1.first)(fuseResult === null || fuseResult === void 0 ? void 0 : fuseResult.value),
        currentWhitelisted: (0, lodash_1.first)(otherResult === null || otherResult === void 0 ? void 0 : otherResult.value),
        syncStatus
    };
};
exports.useWhitelistSync = useWhitelistSync;
//# sourceMappingURL=react.js.map