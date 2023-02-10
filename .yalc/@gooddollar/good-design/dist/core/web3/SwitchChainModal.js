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
exports.SwitchChainModal = void 0;
const native_base_1 = require("native-base");
const react_1 = __importStar(require("react"));
const core_1 = require("@usedapp/core");
const web3sdk_v2_1 = require("@gooddollar/web3sdk-v2");
const lodash_1 = require("lodash");
const useModal_1 = require("../../hooks/useModal");
const SwitchChainModal = (props) => {
    var _a;
    const config = (0, core_1.useConfig)();
    const [requestedChain, setRequestedChain] = (0, react_1.useState)(0);
    const { setOnSwitchNetwork } = (0, web3sdk_v2_1.useSwitchNetwork)();
    const { Modal, showModal, hideModal } = (0, useModal_1.useModal)();
    (0, react_1.useEffect)(() => {
        if (setOnSwitchNetwork) {
            setOnSwitchNetwork(() => async (chainId, afterSwitch) => {
                if (afterSwitch !== undefined)
                    hideModal();
                else {
                    setRequestedChain(chainId);
                    showModal();
                }
            });
        }
    }, [setOnSwitchNetwork]);
    const networkName = (_a = (0, lodash_1.find)(config.networks, _ => _.chainId === requestedChain)) === null || _a === void 0 ? void 0 : _a.chainName;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Modal, { body: react_1.default.createElement(native_base_1.Text, null,
                "Connect to chain: ",
                networkName,
                " (",
                requestedChain,
                ")"), closeText: "" }),
        props.children));
};
exports.SwitchChainModal = SwitchChainModal;
//# sourceMappingURL=SwitchChainModal.js.map