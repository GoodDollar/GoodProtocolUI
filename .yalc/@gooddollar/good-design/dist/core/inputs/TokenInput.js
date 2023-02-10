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
exports.TokenInput = void 0;
const native_base_1 = require("native-base");
const react_1 = __importStar(require("react"));
const react_number_format_1 = require("react-number-format");
const web3sdk_v2_1 = require("@gooddollar/web3sdk-v2");
const TokenInput = ({ balanceWei, onChange, token, requiredChainId, decimals = 2, _numericformat, _button, _text, minAmountWei = "0", ...props }) => {
    const tokenDecimals = (0, web3sdk_v2_1.useG$Decimals)(token, requiredChainId);
    const _decimals = token ? tokenDecimals : decimals;
    const [input, setInput] = (0, react_1.useState)(0);
    const balance = Number(balanceWei) / 10 ** _decimals;
    const minAmount = Number(minAmountWei) / 10 ** _decimals;
    const setMax = (0, react_1.useCallback)(() => setInput(balance), [setInput, balance]);
    const handleChange = (0, react_1.useCallback)((v) => {
        setInput(Number(v));
        onChange((Number(v) * 10 ** _decimals).toFixed(0));
    }, [setInput, onChange]);
    return (react_1.default.createElement(native_base_1.Box, { w: "container", ...props, width: "100%" },
        react_1.default.createElement(react_number_format_1.NumericFormat, { isInvalid: Number(input) > balance || Number(input) < minAmount, onChangeText: handleChange, InputRightElement: react_1.default.createElement(native_base_1.Button, { rounded: "xl", variant: "outline", h: "0.5", mr: "1", onPress: setMax, ..._button }, "Max"), size: "xl", value: input, customInput: native_base_1.Input, decimalSeparator: ".", decimalScale: _decimals, color: "lightGrey", ..._numericformat }),
        react_1.default.createElement(native_base_1.Text, { bold: true, color: "lightGrey:alpha.80", alignSelf: "flex-end", ..._text },
            "Balance: ",
            balance)));
};
exports.TokenInput = TokenInput;
//# sourceMappingURL=TokenInput.js.map