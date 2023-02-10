"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = void 0;
const native_base_1 = require("native-base");
const react_1 = __importDefault(require("react"));
const withTheme_1 = require("../../theme/hoc/withTheme");
const ActionButton = (0, withTheme_1.withTheme)({ name: "ActionButton" })(({ text, ...props }) => (react_1.default.createElement(native_base_1.Button, { alignItems: "center", justifyContent: "center", minWidth: "100%", height: 71, paddingX: 5, paddingY: 5, borderRadius: 20, textAlign: "center", ...props }, text)));
exports.theme = {
    defaultProps: {},
    baseStyle: {
        fontSize: "xl",
        lineHeight: "2xs",
        fontWeight: "black",
        textTransform: "capitalize",
        boxShadow: "3px 3px 10px -1px rgba(11, 27, 102, 0.304824)",
        backgroundColor: "#00B0FF",
        transition: "background 0.25s",
        userSelect: "none"
    }
};
exports.default = ActionButton;
//# sourceMappingURL=ActionButton.js.map