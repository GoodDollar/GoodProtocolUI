"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFaucet = void 0;
const core_1 = require("@usedapp/core");
const ethers_1 = require("ethers");
const lodash_1 = require("lodash");
const react_1 = require("react");
const useRefreshOrNever_1 = __importDefault(require("../../hooks/useRefreshOrNever"));
const react_2 = require("../base/react");
const constants_1 = require("../constants");
//default wait roughly 1 minute
const useFaucet = async (refresh = 12) => {
    let refreshOrNever = (0, useRefreshOrNever_1.default)(refresh);
    const { notifications } = (0, core_1.useNotifications)();
    const latest = (0, react_1.useMemo)(() => (0, lodash_1.maxBy)(notifications, "submittedAt"), [notifications]);
    const lastNotification = (0, react_1.useRef)((latest === null || latest === void 0 ? void 0 : latest.submittedAt) || 0);
    // if we connected wallet or did a tx then force a refresh
    if (latest && latest.type !== "transactionStarted" && (latest === null || latest === void 0 ? void 0 : latest.submittedAt) > lastNotification.current) {
        lastNotification.current = latest === null || latest === void 0 ? void 0 : latest.submittedAt;
        refreshOrNever = 1;
    }
    const gasPrice = (0, core_1.useGasPrice)({ refresh: "never" }) || ethers_1.BigNumber.from("1000000000");
    const minBalance = ethers_1.BigNumber.from("110000").mul(gasPrice);
    const { account, chainId } = (0, core_1.useEthers)();
    const balance = (0, core_1.useEtherBalance)(account, { refresh: refreshOrNever }); // refresh roughly once in 10 minutes
    const { baseEnv } = (0, react_2.useGetEnvChainId)(); // get the env the user is connected to
    const faucet = (0, react_2.useGetContract)(chainId === constants_1.SupportedChains.FUSE ? "FuseFaucet" : "Faucet", true, "base");
    const [result] = (0, core_1.useCalls)([
        {
            contract: faucet,
            method: "canTop",
            args: [account || ethers_1.ethers.constants.AddressZero]
        }
    ].filter(_ => _.contract), { refresh: "never" });
    (0, react_1.useEffect)(() => {
        if ((result === null || result === void 0 ? void 0 : result.value) && account && balance && balance.lt(minBalance)) {
            const devEnv = baseEnv === "fuse" ? "development" : baseEnv;
            const { backend } = constants_1.Envs[devEnv];
            fetch(backend + "/verify/topWallet", {
                method: "POST",
                body: JSON.stringify({ chainId, account }),
                headers: { "content-type": "application/json" }
            }).catch(e => {
                console.error("topping wallet failed:", e.message, e);
            });
        }
    }, [result, account, balance, baseEnv]);
};
exports.useFaucet = useFaucet;
//# sourceMappingURL=react.js.map