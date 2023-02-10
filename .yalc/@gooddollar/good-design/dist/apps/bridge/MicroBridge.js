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
exports.MicroBridge = void 0;
const react_1 = __importStar(require("react"));
const native_base_1 = require("native-base");
const core_1 = require("../../core");
const ExplorerLink_1 = require("../../core/web3/ExplorerLink");
const customswitch_1 = require("../../advanced/customswitch/");
const Status = ({ result, ...props }) => {
    switch (result) {
        case undefined:
        case "Mining":
        case "PendingSignature":
        default:
            return react_1.default.createElement(native_base_1.Spinner, { ...props });
        case "Success":
            return react_1.default.createElement(native_base_1.CheckIcon, { size: "5", mt: "0.5", color: "emerald.500", ...props });
        case "Fail":
        case "Exception":
            return react_1.default.createElement(native_base_1.CloseIcon, { size: "5", mt: "0.5", color: "danger.500", ...props });
    }
};
const TriggerButton = (props) => react_1.default.createElement(native_base_1.IconButton, { ...props, icon: react_1.default.createElement(native_base_1.InfoOutlineIcon, null) });
const StatusBox = ({ txStatus, text, infoText, }) => {
    var _a;
    return (react_1.default.createElement(native_base_1.Stack, { mt: "2", alignItems: "center", direction: ["column", "column", "row"] },
        react_1.default.createElement(native_base_1.HStack, { alignItems: "center", flex: "2 0" },
            react_1.default.createElement(native_base_1.Box, null,
                react_1.default.createElement(Status, { result: txStatus === null || txStatus === void 0 ? void 0 : txStatus.status })),
            react_1.default.createElement(native_base_1.Box, { flex: "1 1" },
                react_1.default.createElement(native_base_1.Text, { color: "emerald.500", fontSize: "md", ml: "2" }, text)),
            infoText && (react_1.default.createElement(native_base_1.Popover, { trigger: TriggerButton },
                react_1.default.createElement(native_base_1.Popover.Content, { accessibilityLabel: infoText, w: "md" },
                    react_1.default.createElement(native_base_1.Popover.CloseButton, null),
                    react_1.default.createElement(native_base_1.Popover.Body, null, infoText))))),
        react_1.default.createElement(native_base_1.Flex, { flex: "1 1", alignItems: "center", maxWidth: "100%" }, txStatus && react_1.default.createElement(ExplorerLink_1.ExplorerLink, { chainId: txStatus.chainId, addressOrTx: (_a = txStatus.transaction) === null || _a === void 0 ? void 0 : _a.hash }))));
};
const useBridgeEstimate = ({ limits, fees, sourceChain, inputWei }) => (0, react_1.useMemo)(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const expectedFee = Number((Number(inputWei) * 0.001) / 100).toFixed(2);
    const expectedToReceive = (Number(inputWei) / 100 - Number(expectedFee)).toFixed(2);
    const minimumAmount = ((_b = (_a = limits === null || limits === void 0 ? void 0 : limits[sourceChain]) === null || _a === void 0 ? void 0 : _a.minAmount) === null || _b === void 0 ? void 0 : _b.toNumber()) || 0 / 100;
    const maximumAmount = ((_d = (_c = limits === null || limits === void 0 ? void 0 : limits[sourceChain]) === null || _c === void 0 ? void 0 : _c.txLimit) === null || _d === void 0 ? void 0 : _d.toNumber()) || 0 / 100;
    const bridgeFee = ((_f = (_e = fees === null || fees === void 0 ? void 0 : fees[sourceChain]) === null || _e === void 0 ? void 0 : _e.fee) === null || _f === void 0 ? void 0 : _f.toNumber()) || 0 / 100;
    const minFee = ((_h = (_g = fees === null || fees === void 0 ? void 0 : fees[sourceChain]) === null || _g === void 0 ? void 0 : _g.minFee) === null || _h === void 0 ? void 0 : _h.toNumber()) || 0 / 100;
    const maxFee = ((_k = (_j = fees === null || fees === void 0 ? void 0 : fees[sourceChain]) === null || _j === void 0 ? void 0 : _j.maxFee) === null || _k === void 0 ? void 0 : _k.toNumber()) || 0 / 100;
    const minAmountWei = (_m = (_l = limits === null || limits === void 0 ? void 0 : limits[sourceChain]) === null || _l === void 0 ? void 0 : _l.minAmount) === null || _m === void 0 ? void 0 : _m.toString();
    return { expectedFee, expectedToReceive, minimumAmount, maximumAmount, bridgeFee, minFee, maxFee, minAmountWei };
}, [limits, fees, sourceChain, inputWei]);
const MicroBridge = ({ useBalanceHook, useCanBridge, onBridge, onSetChain, limits, fees, bridgeStatus, relayStatus, selfRelayStatus, onBridgeStart, onBridgeFailed, onBridgeSuccess, }) => {
    const [isBridging, setBridging] = (0, react_1.useState)(false);
    const [inputWei, setInput] = (0, react_1.useState)("0");
    const [sourceChain, setSourceChain] = (0, react_1.useState)("fuse");
    const targetChain = sourceChain === "fuse" ? "celo" : "fuse";
    const balanceWei = useBalanceHook(sourceChain);
    const { isValid, reason } = useCanBridge(sourceChain, inputWei);
    const hasBalance = Number(inputWei) <= Number(balanceWei);
    const isValidInput = isValid && hasBalance;
    const reasonOf = reason || (!hasBalance && "balance") || "";
    const toggleChains = (0, react_1.useCallback)(() => {
        setSourceChain(targetChain);
        onSetChain === null || onSetChain === void 0 ? void 0 : onSetChain(targetChain);
    }, [setSourceChain, onSetChain, targetChain]);
    const triggerBridge = (0, react_1.useCallback)(async () => {
        setBridging(true);
        onBridgeStart === null || onBridgeStart === void 0 ? void 0 : onBridgeStart();
        try {
            await onBridge(inputWei, sourceChain);
        }
        finally {
            setBridging(false);
        }
    }, [setBridging, onBridgeStart, onBridge, inputWei, sourceChain]);
    (0, react_1.useEffect)(() => {
        var _a;
        const { status = "", errorMessage, errorCode } = relayStatus !== null && relayStatus !== void 0 ? relayStatus : {};
        const { status: selfStatus = "" } = selfRelayStatus !== null && selfRelayStatus !== void 0 ? selfRelayStatus : {};
        // if self relay succeeded then we are done, other wise we need to wait for relayStatus
        const isSuccess = [status, selfStatus].includes("Success");
        // if bridge relayer failed or succeeded then we are done
        const isFailed = ["Fail", "Exception"].includes(status);
        // when bridge is signing, mining or succeed but relay not done yet - we're still bridging
        const isBridging = !isFailed && !isSuccess && ["Mining", "PendingSignature", "Success"].includes((_a = bridgeStatus === null || bridgeStatus === void 0 ? void 0 : bridgeStatus.status) !== null && _a !== void 0 ? _a : "");
        setBridging(isBridging);
        if (isSuccess) {
            onBridgeSuccess === null || onBridgeSuccess === void 0 ? void 0 : onBridgeSuccess();
        }
        if (isFailed) {
            const exception = new Error(errorMessage !== null && errorMessage !== void 0 ? errorMessage : "Failed to bridge");
            if (errorCode) {
                exception.name = `BridgeError #${errorCode}`;
            }
            onBridgeFailed === null || onBridgeFailed === void 0 ? void 0 : onBridgeFailed(exception);
        }
    }, [relayStatus, bridgeStatus, selfRelayStatus, onBridgeSuccess, onBridgeFailed]);
    const { minAmountWei, expectedToReceive } = useBridgeEstimate({ limits, fees, inputWei, sourceChain });
    return (react_1.default.createElement(native_base_1.Box, null,
        react_1.default.createElement(native_base_1.Flex, { direction: "column", w: "410px", justifyContent: "center", alignSelf: "center" },
            react_1.default.createElement(native_base_1.Flex, { direction: "row", justifyContent: "center", mb: "40px", zIndex: "100" },
                react_1.default.createElement(customswitch_1.CustomSwitch, { switchListCb: toggleChains, list: ["Fuse", "Celo"] })),
            react_1.default.createElement(native_base_1.Flex, { direction: "column", alignItems: "flex-start", justifyContent: "flex-start", width: "100%" },
                react_1.default.createElement(native_base_1.Text, { fontFamily: "subheading", bold: true, color: "lightGrey:alpha.80" }, "ENTER AMOUNT"),
                react_1.default.createElement(core_1.TokenInput, { token: "G$", balanceWei: balanceWei, onChange: setInput, minAmountWei: minAmountWei })),
            react_1.default.createElement(native_base_1.FormControl, { isInvalid: !!reasonOf },
                react_1.default.createElement(native_base_1.FormControl.ErrorMessage, { leftIcon: react_1.default.createElement(native_base_1.WarningOutlineIcon, { variant: "outline" }) }, reasonOf)),
            react_1.default.createElement(native_base_1.Flex, { mt: "4", direction: "column", alignItems: "flex-start", justifyContent: "flex-start", width: "100%" },
                react_1.default.createElement(native_base_1.Text, { fontFamily: "subheading", color: "lightGrey:alpha.80", textTransform: "uppercase", bold: true },
                    "You will receive on ",
                    targetChain),
                react_1.default.createElement(core_1.TokenOutput, { token: "G$", outputValue: expectedToReceive !== null && expectedToReceive !== void 0 ? expectedToReceive : '0' })),
            react_1.default.createElement(native_base_1.Button, { mt: "5", onPress: triggerBridge, backgroundColor: "main", isLoading: isBridging, disabled: isBridging || isValidInput === false },
                react_1.default.createElement(native_base_1.Text, { fontFamily: "subheading", bold: true, color: "white", textTransform: "uppercase" }, `Bridge to ${targetChain}`)),
            (isBridging || (bridgeStatus && (bridgeStatus === null || bridgeStatus === void 0 ? void 0 : bridgeStatus.status) != "None")) && (react_1.default.createElement(native_base_1.Box, { borderWidth: "1", mt: "10", padding: "5", rounded: "lg" },
                react_1.default.createElement(StatusBox, { text: "Sending funds to bridge", txStatus: bridgeStatus, sourceChain: sourceChain }),
                (bridgeStatus === null || bridgeStatus === void 0 ? void 0 : bridgeStatus.status) === "Success" && selfRelayStatus && (react_1.default.createElement(StatusBox, { text: "Self relaying to target chain... (Can take a few minutes)", infoText: "If you have enough native tokens on the target chain, you will execute the transfer on the target chain yourself and save some bridge fees", txStatus: selfRelayStatus, sourceChain: sourceChain })),
                (bridgeStatus === null || bridgeStatus === void 0 ? void 0 : bridgeStatus.status) === "Success" && (react_1.default.createElement(StatusBox, { text: "Waiting for bridge relayers to relay to target chain... (Can take a few minutes)", infoText: "If you don't have enough native tokens on the target chain, a bridge relay service will execute the transfer for a small G$ fee", txStatus: relayStatus, sourceChain: sourceChain })))))));
};
exports.MicroBridge = MicroBridge;
//# sourceMappingURL=MicroBridge.js.map