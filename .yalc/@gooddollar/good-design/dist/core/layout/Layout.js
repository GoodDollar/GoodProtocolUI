"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = void 0;
const native_base_1 = require("native-base");
const react_1 = __importDefault(require("react"));
const withTheme_1 = require("../../theme/hoc/withTheme");
const Layout = (0, withTheme_1.withTheme)({ name: "Layout" })(({ children, ...props }) => (react_1.default.createElement(native_base_1.View, { width: "full", maxWidth: 712, borderWidth: 1, borderRadius: 20, paddingY: "5", paddingX: "17", ...props }, children)));
exports.theme = {
    baseStyle: {
        backgroundColor: "#fff",
        borderColor: "rgba(208, 217, 228, 0.483146)",
        boxShadow: "3px 3px 10px -1px rgba(11, 27, 102, 0.304824)"
    }
};
exports.default = Layout;
//# sourceMappingURL=Layout.js.map