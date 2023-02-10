"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformFamilies = exports.getFamiliesUrl = exports.pickWeight = exports.fontConfig = void 0;
const lodash_1 = require("lodash");
const react_native_1 = require("react-native");
exports.fontConfig = {
    Montserrat: {
        100: {
            normal: "Montserrat-Thin",
            italic: "Montserrat-ThinItalic",
        },
        200: {
            normal: "Montserrat-ExtraLight",
            italic: "Montserrat-ExtraLightItalic",
        },
        300: {
            normal: "Montserrat-Light",
            italic: "Montserrat-LightItalic",
        },
        400: {
            normal: "Montserrat-Regular",
            italic: "Montserrat-Italic",
        },
        500: {
            normal: "Montserrat-Medium",
            italic: "Montserrat-MediumItalic",
        },
        600: {
            normal: "Montserrat-SemiBold",
            italic: "Montserrat-SemiBoldItalic",
        },
        700: {
            normal: 'Montserrat-Bold',
            italic: 'Montserrat-BoldItalic',
        },
        800: {
            normal: 'Montserrat-ExtraBold',
            italic: 'Montserrat-ExtraBoldItalic',
        },
        900: {
            normal: 'Montserrat-Black',
            italic: 'Montserrat-BlackItalic',
        },
    },
    Roboto: {
        100: {
            normal: 'Roboto-Thin',
            italic: 'Roboto-ThinItalic',
        },
        200: {
            normal: 'Roboto-Thin',
            italic: 'Roboto-ThinItalic',
        },
        300: {
            normal: 'Roboto-Light',
            italic: 'Roboto-LightItalic',
        },
        400: {
            normal: 'Roboto-Regular',
            italic: 'Roboto-Italic',
        },
        500: {
            normal: 'Roboto-Medium',
            italic: 'Roboto-MediumItalic',
        },
        600: {
            normal: 'Roboto-Medium',
            italic: 'Roboto-MediumItalic',
        },
        700: {
            normal: 'Roboto-Bold',
            italic: 'Roboto-BoldItalic',
        },
        800: {
            normal: 'Roboto-Bold',
            italic: 'Roboto-BoldItalic',
        },
        900: {
            normal: 'Roboto-Black',
            italic: 'Roboto-BlackItalic',
        },
    }
};
const pickWeight = (list, style) => (0, lodash_1.chain)(list)
    .groupBy(style)
    .mapValues(items => Number((0, lodash_1.first)(items).weight))
    .values()
    .value();
exports.pickWeight = pickWeight;
const getFamiliesUrl = (families, fontName) => {
    const list = (0, lodash_1.toPairs)(families).map(([weight, props]) => ({ weight, ...props }));
    const [normalWeights, italicWeights] = ["normal", "italic"]
        .map(style => (0, exports.pickWeight)(list, style))
        .map((weights, index) => weights.map(value => `${index},${value}`).join(";"));
    return `//fonts.googleapis.com/css2?family=${fontName}:ital,wght@${normalWeights};${italicWeights}&display=swap`;
};
exports.getFamiliesUrl = getFamiliesUrl;
const getPlatformFamilies = (families) => react_native_1.Platform.select({
    native: families,
    default: {}
});
exports.getPlatformFamilies = getPlatformFamilies;
//# sourceMappingURL=fonts.js.map