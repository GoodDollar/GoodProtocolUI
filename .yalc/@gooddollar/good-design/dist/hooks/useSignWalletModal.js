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
exports.useSignWalletModal = void 0;
const react_1 = __importStar(require("react"));
const useModal_1 = require("./useModal");
const useSignWalletModal = () => {
    const { Modal, showModal, hideModal } = (0, useModal_1.useModal)();
    const SignWalletModal = ({ txStatus, ...props }) => {
        (0, react_1.useEffect)(() => {
            if (["PendingSignature", "CollectingSignaturePool"].includes(txStatus)) {
                showModal();
            }
            else if (txStatus) {
                hideModal();
            }
        }, [txStatus]);
        return react_1.default.createElement(Modal, { body: "Please sign the transaction in your wallet...", closeText: "", ...props });
    };
    return {
        hideModal,
        showModal,
        SignWalletModal
    };
};
exports.useSignWalletModal = useSignWalletModal;
//# sourceMappingURL=useSignWalletModal.js.map