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
exports.useModal = void 0;
const lodash_1 = require("lodash");
const react_1 = __importStar(require("react"));
const modals_1 = require("../core/modals");
const useModal = () => {
    const [modalVisible, setModalVisible] = (0, react_1.useState)(false);
    const showModal = (0, react_1.useCallback)(() => setModalVisible(true), [setModalVisible]);
    const hideModal = (0, react_1.useCallback)(() => setModalVisible(false), [setModalVisible]);
    const MemoizedModal = (0, react_1.useMemo)(() => ({ onClose = lodash_1.noop, ...props }) => react_1.default.createElement(modals_1.BasicModal, { ...props, modalVisible: modalVisible, onClose: (0, lodash_1.over)(onClose, hideModal) }), [modalVisible, hideModal]);
    return {
        modalVisible,
        showModal,
        hideModal,
        Modal: MemoizedModal
    };
};
exports.useModal = useModal;
//# sourceMappingURL=useModal.js.map