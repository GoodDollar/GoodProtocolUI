"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenOutput = void 0;
const web3sdk_v2_1 = require("@gooddollar/web3sdk-v2");
const native_base_1 = require("native-base");
const react_1 = __importDefault(require("react"));
const react_number_format_1 = require("react-number-format");
const TokenOutput = ({ outputValue, token, requiredChainId, decimals = 2, _numericformat, ...props }) => {
    const tokenDecimals = (0, web3sdk_v2_1.useG$Decimals)(token, requiredChainId);
    const _decimals = token ? tokenDecimals : decimals;
    return (react_1.default.createElement(native_base_1.Box, { w: "container", ...props, width: "100%" },
        react_1.default.createElement(react_number_format_1.NumericFormat, { disabled: true, size: "xl", value: outputValue, customInput: native_base_1.Input, color: "lightGrey", decimalScale: _decimals, ..._numericformat })));
};
exports.TokenOutput = TokenOutput;
//# sourceMappingURL=TokenOutput.js.map