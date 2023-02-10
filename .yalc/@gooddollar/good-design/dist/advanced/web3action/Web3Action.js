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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3ActionButton = void 0;
const react_1 = __importStar(require("react"));
const native_base_1 = require("native-base");
const core_1 = require("@usedapp/core");
const BaseButton_1 = __importDefault(require("../../core/buttons/BaseButton"));
const theme_1 = require("../../theme");
const ButtonSteps = {
    connect: "Connecting wallet...",
    switch: "Switching network...",
    action: "Awaiting confirmation..."
};
const throwIfCancelled = (e) => {
    if (e.code === 4001) {
        throw e;
    }
};
const throwCancelled = () => {
    const e = new Error("User cancelled");
    e.code = 4001;
    throw e;
};
const StepIndicator = (0, theme_1.withTheme)({ name: "StepIndicator" })(({ text, color, fontSize }) => (react_1.default.createElement(native_base_1.HStack, { space: 2, alignItems: "center", flexDirection: "row" },
    react_1.default.createElement(native_base_1.Spinner, { color: color, size: "sm", accessibilityLabel: "Waiting on wallet confirmation" }),
    react_1.default.createElement(native_base_1.Text, { color: color, fontSize: fontSize, fontFamily: "subheading" }, text))));
exports.Web3ActionButton = (0, theme_1.withTheme)({ name: "Web3ActionButton" })(({ text, requiredChain, switchChain, web3Action, handleConnect, innerIndicatorText, ...buttonProps }) => {
    const { account, switchNetwork, chainId, activateBrowserWallet } = (0, core_1.useEthers)();
    const [runningFlow, setRunningFlow] = (0, react_1.useState)(false);
    const [actionText, setActionText] = (0, react_1.useState)("");
    const timerRef = (0, react_1.useRef)(null);
    const resetText = (0, react_1.useCallback)(() => setActionText(""), []);
    const finishFlow = (0, react_1.useCallback)(() => {
        resetText();
        setRunningFlow(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);
    const startFlow = (0, react_1.useCallback)(() => {
        setRunningFlow(true);
        timerRef.current = setTimeout(finishFlow, 60000);
    }, []);
    const connectWallet = (0, react_1.useCallback)(async () => {
        const connectFn = handleConnect || activateBrowserWallet;
        const isConnected = await connectFn().catch(throwIfCancelled);
        if (handleConnect && !isConnected.length) {
            throwCancelled();
        }
        return isConnected;
    }, [handleConnect, activateBrowserWallet]);
    const switchToChain = (0, react_1.useCallback)(async (chain) => {
        const switchFn = switchChain || switchNetwork;
        const result = await switchFn(chain).catch(throwIfCancelled);
        if (switchChain && !result) {
            throwCancelled();
        }
    }, [switchNetwork, switchChain]);
    // while button is in loading state (1 min), be reactive to external/manual
    // account/chainId changes and re-try to perform current step action
    (0, react_1.useEffect)(() => {
        const continueSteps = async () => {
            if (!account) {
                setActionText(ButtonSteps.connect);
                await connectWallet();
                return;
            }
            if (requiredChain !== chainId) {
                setActionText(ButtonSteps.switch);
                await switchToChain(requiredChain);
                return;
            }
            setActionText(ButtonSteps.action);
            await web3Action();
            finishFlow();
        };
        if (runningFlow) {
            continueSteps().catch(finishFlow);
        }
    }, [runningFlow, account, chainId]);
    return (react_1.default.createElement(BaseButton_1.default, { text: actionText ? "" : text, onPress: startFlow, ...buttonProps }, !!actionText && react_1.default.createElement(StepIndicator, { text: actionText, ...innerIndicatorText })));
});
//# sourceMappingURL=Web3Action.js.map