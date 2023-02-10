"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const theme_1 = require("../../theme");
const native_base_1 = require("native-base");
const fuse_svg_1 = __importDefault(require("../../assets/svg/fuse.svg"));
const celo_svg_1 = __importDefault(require("../../assets/svg/celo.svg"));
// TODO: make imports from .svg work
const IconList = {
    "Fuse": fuse_svg_1.default,
    "Celo": celo_svg_1.default
};
const SelectBox = (0, theme_1.withTheme)({ name: "SelectBox" })(({ text, press, isListItem, ...props }) => (react_1.default.createElement(native_base_1.Pressable, { onPress: press, ...props },
    react_1.default.createElement("img", { src: IconList[text], style: {
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            width: "30px",
            height: '48px',
            paddingLeft: '10px'
        } }),
    react_1.default.createElement(native_base_1.Text, { textAlign: "center", fontSize: "lg", ml: "0", w: "105%", alignSelf: "center", display: "flex", pl: "2", fontWeight: "thin", fontFamily: "subheading", selectable: false }, text),
    !isListItem && (react_1.default.createElement(native_base_1.ChevronDownIcon, { mr: "0", ml: "5", size: "xl", display: "flex", alignSelf: "center", justifySelf: "flex-end", marginRight: "0" })))));
exports.default = SelectBox;
//# sourceMappingURL=SelectBox.js.map