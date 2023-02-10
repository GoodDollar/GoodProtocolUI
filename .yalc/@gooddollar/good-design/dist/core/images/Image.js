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
const lodash_1 = require("lodash");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const native_base_1 = require("native-base");
const isAutoHeight = (width, height) => !!width && "auto" === height;
const Image = ({ source, style = {}, w, h, onPress, ...props }) => {
    const [aspectRatio, setAspectRatio] = (0, react_1.useState)();
    const flattenStyle = (0, react_1.useMemo)(() => react_native_1.StyleSheet.flatten(style), [style]);
    // image source could be base64 data uri
    const uri = (0, react_1.useMemo)(() => (0, lodash_1.get)(source, "uri", (0, lodash_1.isString)(source) ? source : null), [source]);
    const fixed = !isAutoHeight(w, h);
    const imageStyle = (0, react_1.useMemo)(() => fixed
        ? flattenStyle
        : {
            ...flattenStyle,
            aspectRatio
        }, [fixed, flattenStyle, aspectRatio]);
    (0, react_1.useEffect)(() => {
        const onImageSize = (width, height) => setAspectRatio(width / height);
        if (!uri || fixed) {
            return;
        }
        react_native_1.Image.getSize(uri, onImageSize);
    }, [uri, fixed]);
    if (!aspectRatio && !fixed) {
        return null;
    }
    return (react_1.default.createElement(native_base_1.Pressable, { disabled: !(0, lodash_1.isFunction)(onPress), onPress: onPress },
        react_1.default.createElement(native_base_1.Image, { alt: "GoodDollar", ...props, source: source, style: imageStyle, w: w, h: h })));
};
exports.default = Image;
//# sourceMappingURL=Image.js.map