"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplorerLink = void 0;
const core_1 = require("@usedapp/core");
const native_base_1 = require("native-base");
const react_1 = __importDefault(require("react"));
const LinkIcon = (0, native_base_1.createIcon)({
    viewBox: "0 0 448 512",
    d: "M288 32c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L306.7 128 169.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L352 173.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V64c0-17.7-14.3-32-32-32H288zM80 64C35.8 64 0 99.8 0 144V400c0 44.2 35.8 80 80 80H336c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16h80c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"
});
const ExplorerLink = ({ chainId, addressOrTx, text, ...props }) => {
    const { networks } = (0, core_1.useConfig)();
    const network = (networks || []).find(_ => _.chainId === chainId);
    const link = addressOrTx &&
        network &&
        (addressOrTx.length === 42
            ? network === null || network === void 0 ? void 0 : network.getExplorerAddressLink(addressOrTx)
            : network === null || network === void 0 ? void 0 : network.getExplorerTransactionLink(addressOrTx));
    return link ? (react_1.default.createElement(native_base_1.HStack, { flex: "2 0", alignItems: "center", space: "1", maxWidth: "100%" },
        react_1.default.createElement(native_base_1.Link, { _text: { fontSize: "sm", isTruncated: true }, href: link, isExternal: true, alignItems: "center", flex: "1 0", ...props }, text || addressOrTx),
        react_1.default.createElement(LinkIcon, { flex: "auto 0", size: "3" }))) : null;
};
exports.ExplorerLink = ExplorerLink;
//# sourceMappingURL=ExplorerLink.js.map