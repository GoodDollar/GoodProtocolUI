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
exports.WalletAndChainGuard = void 0;
const native_base_1 = require("native-base");
const react_1 = __importStar(require("react"));
const core_1 = require("@usedapp/core");
const web3sdk_v2_1 = require("@gooddollar/web3sdk-v2");
const lodash_1 = require("lodash");
const useModal_1 = require("../../hooks/useModal");
const WalletAndChainGuard = ({ validChains = [web3sdk_v2_1.SupportedChains.FUSE, web3sdk_v2_1.SupportedChains.CELO, web3sdk_v2_1.SupportedChains.MAINNET], children }) => {
    const { account, chainId, library } = (0, core_1.useEthers)();
    const config = (0, core_1.useConfig)();
    const networkNames = (0, lodash_1.filter)(config.networks, _ => validChains.includes(_.chainId)).map(_ => _.chainName);
    const { Modal, showModal, hideModal, modalVisible } = (0, useModal_1.useModal)();
    (0, react_1.useEffect)(() => {
        const isValid = account && chainId && validChains.includes(chainId);
        if (isValid) {
            hideModal();
        }
        else {
            showModal();
        }
    }, [account, chainId, showModal, hideModal, validChains]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Modal, { body: react_1.default.createElement(native_base_1.Text, null, account || (library && !chainId)
                ? `Connect to supported chain: ${networkNames.join(", ")} (${validChains.join(", ")})`
                : "Connect Wallet"), closeText: "", _modal: {
                isKeyboardDismissable: false,
                closeOnOverlayClick: false
            } }),
        modalVisible === false && children));
};
exports.WalletAndChainGuard = WalletAndChainGuard;
//# sourceMappingURL=WalletAndChainGuard.js.map