"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = void 0;
const native_base_1 = require("native-base");
const native_base_2 = require("native-base");
const react_1 = __importDefault(require("react"));
const withTheme_1 = require("../../theme/hoc/withTheme");
const themingTools_1 = require("../../theme/utils/themingTools");
const BaseButton = (0, withTheme_1.withTheme)({ name: "BaseButton" })(({ text, innerText, innerView, onPress, children, ...props }) => (react_1.default.createElement(native_base_2.Button, { onPress: onPress, px: 100, ...props },
    react_1.default.createElement(native_base_1.View, { ...innerView },
        react_1.default.createElement(native_base_2.Text, { ...innerText }, text),
        children))));
exports.theme = {
    defaultProps: {},
    baseStyle: (0, themingTools_1.withThemingTools)(({ colorModeValue }) => {
        const colors = ["lightBlue.400", "lightBlue.700"];
        const [bg, bgHover] = colorModeValue(colors, [...colors].reverse());
        return {
            maxWidth: 750,
            bg,
            _hover: {
                bg: bgHover
            },
            innerText: {
                fontWeight: "hairline",
                color: "white"
            }
        };
    }),
    variants: {
        arrowIcon: () => ({
            bg: "white",
            w: 208,
            h: 58,
            innerText: {
                fontSize: "md",
                fontWeight: "medium",
                fontFamily: "subheading",
                color: "main"
            },
            innerView: {
                width: 208,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                px: 1.5,
                pl: 4,
                pr: 1.5,
                flexGrow: 0
            },
            borderRadius: 15
        })
    }
};
exports.default = BaseButton;
//# sourceMappingURL=BaseButton.js.map