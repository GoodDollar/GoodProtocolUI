"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeBaseProvider = void 0;
const native_base_1 = require("native-base");
const react_1 = __importDefault(require("react"));
const react_helmet_1 = require("react-helmet");
const lodash_1 = require("lodash");
const fonts_1 = require("./fonts");
const FAMILIES = (0, lodash_1.chain)(fonts_1.fontConfig)
    .mapValues(fonts_1.getFamiliesUrl)
    .mapKeys((_, key) => (0, lodash_1.toLower)(key))
    .value();
const FAMILIES_AVAILABLE = (0, lodash_1.keys)(FAMILIES);
const DEFAULT_FAMILIES = (0, lodash_1.mapValues)(FAMILIES, () => true);
const NativeBaseProvider = ({ children, ...props }) => {
    const rest = (0, lodash_1.omit)(props, FAMILIES_AVAILABLE);
    const loadFonts = (0, lodash_1.chain)(DEFAULT_FAMILIES)
        .clone()
        .assign((0, lodash_1.pick)(props, FAMILIES_AVAILABLE))
        .pickBy()
        .keys()
        .value();
    return react_1.default.createElement(native_base_1.NativeBaseProvider, { ...rest },
        react_1.default.createElement(react_helmet_1.Helmet, null,
            loadFonts.length && ([
                react_1.default.createElement("link", { key: "gapis", rel: "preconnect", href: "//fonts.googleapis.com" }),
                react_1.default.createElement("link", { key: "gstatic", rel: "preconnect", href: "//fonts.gstatic.com", crossOrigin: "crossorigin" })
            ]),
            loadFonts.map((fontID, index) => react_1.default.createElement("link", { key: fontID + index, href: FAMILIES[fontID], rel: "stylesheet" }))),
        children);
};
exports.NativeBaseProvider = NativeBaseProvider;
//# sourceMappingURL=NativeBaseProvider.js.map