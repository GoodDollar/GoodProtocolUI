"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const BaseButton_1 = __importDefault(require("./BaseButton"));
const native_base_1 = require("native-base");
const ArrowButton = ({ text, onPress, ...props }) => (react_1.default.createElement(BaseButton_1.default, { text: text, onPress: onPress, variant: "arrowIcon", ...props },
    react_1.default.createElement(native_base_1.Box, { w: "46", h: "46", mr: "1.5", bg: "primary", borderRadius: "12", justifyContent: "center", alignItems: "center" },
        react_1.default.createElement(native_base_1.ArrowForwardIcon, { color: "white" }))));
exports.default = ArrowButton;
//# sourceMappingURL=ArrowButton.js.map