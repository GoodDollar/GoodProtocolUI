"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = void 0;
const native_base_1 = require("native-base");
const react_1 = __importDefault(require("react"));
const withTheme_1 = require("../../theme/hoc/withTheme");
const Title = (0, withTheme_1.withTheme)({ name: "Title" })(({ children, ...props }) => (react_1.default.createElement(native_base_1.Text, { ...props }, children)));
exports.theme = {
    defaultProps: {
        color: "main",
        size: "lg",
    },
    baseStyle: {
        fontFamily: "heading",
        fontWeight: "bold",
        lineHeight: "md"
    },
    sizes: {
        lg: {
            fontSize: "32px"
        }
    }
};
exports.default = Title;
//# sourceMappingURL=Title.js.map