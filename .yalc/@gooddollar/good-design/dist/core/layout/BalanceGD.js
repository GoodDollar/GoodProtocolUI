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
const react_1 = __importStar(require("react"));
const native_base_1 = require("native-base");
const web3sdk_v2_1 = require("@gooddollar/web3sdk-v2");
const BalanceCopy = ({ heading, subHeading }) => (react_1.default.createElement(native_base_1.Box, { mb: "4" },
    react_1.default.createElement(native_base_1.Text, { fontSize: "2xl", fontWeight: "extrabold", fontFamily: "heading", mb: "0.5", color: "main" }, heading),
    react_1.default.createElement(native_base_1.Text, { fontSize: "sm", fontWeight: "normal", fontFamily: "subheading", color: "goodGrey.500" }, subHeading)));
const BalanceView = (0, react_1.memo)(({ gdPrice, amount, requiredChainId }) => {
    const network = requiredChainId === 122 ? "Fuse" : "Celo";
    const copies = [
        {
            id: "your-balance-label",
            heading: "Your Balance",
            subheading: `on ${network}`
        },
        {
            id: "your-balance-value",
            heading: amount.format({ suffix: "", prefix: amount.currency.ticker + " " }),
            subheading: "(USD " + gdPrice.multiply(amount.format({ suffix: "", thousandSeparator: "" })).toFixed(2) + ")"
        }
    ];
    return (react_1.default.createElement(native_base_1.View, { w: "full", flexDirection: "column", alignItems: "center" }, copies.map(({ id, heading, subheading }) => (react_1.default.createElement(BalanceCopy, { key: id, heading: heading, subHeading: subheading })))));
});
const BalanceGD = ({ gdPrice, requiredChainId, refresh = "never" }) => {
    const { chainId } = (0, web3sdk_v2_1.useGetEnvChainId)(requiredChainId);
    const { G$ } = (0, web3sdk_v2_1.useG$Balance)(refresh, chainId);
    return !G$ || !gdPrice ? null : (react_1.default.createElement(BalanceView, { amount: G$, gdPrice: gdPrice, refresh: refresh, requiredChainId: chainId }));
};
exports.default = BalanceGD;
//# sourceMappingURL=BalanceGD.js.map