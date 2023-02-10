"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroBridgeController = exports.useBalanceHook = void 0;
const web3sdk_v2_1 = require("@gooddollar/web3sdk-v2");
const core_1 = require("@usedapp/core");
const lodash_1 = require("lodash");
const native_base_1 = require("native-base");
const react_1 = __importStar(require("react"));
const ExplorerLink_1 = require("../../core/web3/ExplorerLink");
const useSignWalletModal_1 = require("../../hooks/useSignWalletModal");
const MicroBridge_1 = require("./MicroBridge");
const useBalanceHook = (chain) => {
    var _a;
    const refresh = (0, web3sdk_v2_1.useRefreshOrNever)(12);
    const { G$ } = (0, web3sdk_v2_1.useG$Balance)(refresh, chain === "fuse" ? web3sdk_v2_1.SupportedChains.FUSE : web3sdk_v2_1.SupportedChains.CELO);
    return (_a = G$ === null || G$ === void 0 ? void 0 : G$.toString()) !== null && _a !== void 0 ? _a : "0";
};
exports.useBalanceHook = useBalanceHook;
const useCanBridge = (chain, amountWei) => {
    const { chainId } = (0, web3sdk_v2_1.useGetEnvChainId)(chain === "fuse" ? web3sdk_v2_1.SupportedChains.FUSE : web3sdk_v2_1.SupportedChains.CELO);
    const { account } = (0, core_1.useEthers)();
    const canBridge = (0, web3sdk_v2_1.useWithinBridgeLimits)(chainId, account || "", amountWei);
    return canBridge;
};
const MicroBridgeHistory = () => {
    const { fuseHistory, celoHistory } = (0, web3sdk_v2_1.useBridgeHistory)();
    const historySorted = (0, lodash_1.sortBy)(((fuseHistory === null || fuseHistory === void 0 ? void 0 : fuseHistory.value) || []).concat((celoHistory === null || celoHistory === void 0 ? void 0 : celoHistory.value) || []), _ => _.data.from === "account");
    const relayTx = (0, web3sdk_v2_1.useRelayTx)();
    const [relaying, setRelaying] = (0, react_1.useState)({});
    const triggerRelay = (0, react_1.useCallback)(async (i) => {
        setRelaying({ ...relaying, [i.transactionHash]: true });
        try {
            const relayResult = await relayTx(i.data.targetChainId.toNumber() === 42220 ? 122 : 42220, i.data.targetChainId.toNumber(), i.transactionHash);
            if (!relayResult.relayPromise) {
                setRelaying({ ...relaying, [i.transactionHash]: false });
            }
        }
        catch (e) {
            setRelaying({ ...relaying, [i.transactionHash]: false });
        }
    }, [setRelaying, relayTx]);
    return (react_1.default.createElement(native_base_1.Box, { borderRadius: "md", mt: "4", borderWidth: "1", padding: "5" },
        react_1.default.createElement(native_base_1.Heading, { size: "sm" }, "Transactions History"),
        react_1.default.createElement(native_base_1.Stack, { direction: ["column", "column", "row"], alignContent: "center", alignItems: "center", justifyContent: "center", mt: "5" },
            react_1.default.createElement(native_base_1.Flex, { flex: "1 1" }),
            react_1.default.createElement(native_base_1.Flex, { flex: "2 1" },
                react_1.default.createElement(native_base_1.Heading, { size: "xs" }, "Transaction Hash")),
            react_1.default.createElement(native_base_1.Flex, { flex: "2 0" },
                react_1.default.createElement(native_base_1.Heading, { size: "xs" }, "From")),
            react_1.default.createElement(native_base_1.Flex, { flex: "2 0" },
                react_1.default.createElement(native_base_1.Heading, { size: "xs" }, "To")),
            react_1.default.createElement(native_base_1.Flex, { flex: "1 0" },
                react_1.default.createElement(native_base_1.Heading, { size: "xs" }, "Amount")),
            react_1.default.createElement(native_base_1.Flex, { flex: "1 0" },
                react_1.default.createElement(native_base_1.Heading, { size: "xs" }, "Status"))),
        historySorted.map(i => (react_1.default.createElement(native_base_1.Stack, { direction: ["column", "column", "row"], alignContent: "center", alignItems: ["flex-start", "flex-start", "center"], mt: 2, key: i.transactionHash, space: "2", borderWidth: ["1", "1", "0"], padding: ["2", "2", "0"], borderRadius: ["md", "md", "none"] },
            react_1.default.createElement(native_base_1.HStack, { flex: "1 1", alignItems: "center" },
                react_1.default.createElement(native_base_1.Text, { flex: "1 0" }, i.data.targetChainId.toNumber() === 122 ? "Celo" : "Fuse"),
                react_1.default.createElement(native_base_1.ArrowForwardIcon, { size: "3", color: "black", ml: "1", mr: "1", flex: "auto 0" }),
                react_1.default.createElement(native_base_1.Text, { flex: "1 0" }, i.data.targetChainId.toNumber() === 122 ? "Fuse" : "Celo")),
            react_1.default.createElement(native_base_1.Flex, { flex: ["1 1", "1 1", "2 0"], maxWidth: "100%" },
                react_1.default.createElement(ExplorerLink_1.ExplorerLink, { chainId: i.data.targetChainId.toNumber() === 122 ? 42220 : 122, addressOrTx: i.transactionHash })),
            react_1.default.createElement(native_base_1.Flex, { flex: ["1 1", "1 1", "2 0"], maxWidth: "100%" },
                react_1.default.createElement(ExplorerLink_1.ExplorerLink, { chainId: i.data.targetChainId.toNumber() === 122 ? 42220 : 122, addressOrTx: i.data.from })),
            react_1.default.createElement(native_base_1.Flex, { flex: ["1 1", "1 1", "2 0"], maxWidth: "100%" },
                react_1.default.createElement(ExplorerLink_1.ExplorerLink, { chainId: i.data.targetChainId.toNumber() === 122 ? 42220 : 122, addressOrTx: i.data.to })),
            react_1.default.createElement(native_base_1.Flex, { flex: ["1 1", "1 1", "1 0"], maxWidth: "100%" },
                react_1.default.createElement(native_base_1.Text, null,
                    i.data.amount.toNumber() / 100,
                    " G$")),
            react_1.default.createElement(native_base_1.Flex, { flex: ["1 1", "1 1", "1 0"], maxWidth: "100%" }, i.relayEvent ? (react_1.default.createElement(ExplorerLink_1.ExplorerLink, { chainId: i.data.targetChainId.toNumber(), addressOrTx: i.relayEvent.transactionHash, text: "Completed" })) : (react_1.default.createElement(native_base_1.Button, { isLoading: relaying[i.transactionHash], onPress: () => triggerRelay(i) }, "Relay"))))))));
};
const MicroBridgeController = ({ withRelay = false, onBridgeStart = lodash_1.noop, onBridgeSuccess = lodash_1.noop, onBridgeFailed = lodash_1.noop }) => {
    const { sendBridgeRequest, bridgeRequestStatus, relayStatus, selfRelayStatus } = (0, web3sdk_v2_1.useBridge)();
    const { bridgeFees: fuseBridgeFees, bridgeLimits: fuseBridgeLimits } = (0, web3sdk_v2_1.useGetBridgeData)(web3sdk_v2_1.SupportedChains.FUSE, "");
    const { bridgeFees: celoBridgeFees, bridgeLimits: celoBridgeLimits } = (0, web3sdk_v2_1.useGetBridgeData)(web3sdk_v2_1.SupportedChains.CELO, "");
    const { SignWalletModal } = (0, useSignWalletModal_1.useSignWalletModal)();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(MicroBridge_1.MicroBridge, { onBridge: sendBridgeRequest, useBalanceHook: exports.useBalanceHook, useCanBridge: useCanBridge, bridgeStatus: bridgeRequestStatus, relayStatus: relayStatus, selfRelayStatus: selfRelayStatus, limits: { fuse: fuseBridgeLimits, celo: celoBridgeLimits }, fees: { fuse: fuseBridgeFees, celo: celoBridgeFees }, onBridgeStart: onBridgeStart, onBridgeSuccess: onBridgeSuccess, onBridgeFailed: onBridgeFailed }),
        withRelay && react_1.default.createElement(MicroBridgeHistory, null),
        react_1.default.createElement(SignWalletModal, { txStatus: bridgeRequestStatus.status }),
        react_1.default.createElement(SignWalletModal, { txStatus: selfRelayStatus === null || selfRelayStatus === void 0 ? void 0 : selfRelayStatus.status })));
};
exports.MicroBridgeController = MicroBridgeController;
//# sourceMappingURL=MicroBridgeController.js.map