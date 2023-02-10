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
exports.theme = void 0;
const native_base_1 = require("native-base");
const layout = __importStar(require("../core/layout/theme"));
const buttons = __importStar(require("../core/buttons/theme"));
const advanced = __importStar(require("../advanced/theme"));
const nativebase = __importStar(require("./nativebase"));
const fonts_1 = require("./fonts");
exports.theme = (0, native_base_1.extendTheme)({
    fontConfig: (0, fonts_1.getPlatformFamilies)(fonts_1.fontConfig),
    colors: {
        // default colors
        grey: "#E5E5E5",
        greyCard: "#F6F8FA",
        lightGrey: "#636363",
        smokeWhite: "#F5F5F5",
        dimgray: "#696969",
        // typo
        main: "#00AEFF",
        mainDark: "#151a30",
        mainDarkContrast: "#1a1f38",
        text: "#0D182D",
        paragraph: "#0005376",
        heading: "#42454A",
        headingBlack: "#303030",
        headingGrey: "#999",
        // UI
        buttonBackground: "#40C4FFCC",
        /* g$ design system */
        primary: "#00AFFF",
        primaryHoverDark: "#0387c3",
        // text
        goodGrey: {
            300: "#D4D4D4",
            400: "#A3A3A3",
            500: "#737373",
            600: "#525252",
            700: "#404040"
        },
        // background
        goodWhite: {
            100: "#F6F8FA" // secondary
        },
        goodBlack: {
            100: "#505661",
            200: "#3F444E",
            300: "#2F3338",
            500: "#26292F"
        },
        // borders
        borderBlue: "#00AEFF",
        borderGrey: "#E2E5EA"
    },
    sizes: {
        md: "200px"
    },
    breakpoints: {
        // custom keys for breakpoints cannot be used in useBreakpoint hook so we override defaults
        base: 0,
        sm: 375,
        md: 480,
        lg: 976,
        xl: 1280,
        "2xl": 1440
    },
    fonts: {
        heading: "Montserrat",
        body: "Montserrat",
        mono: "Montserrat",
        subheading: "Roboto"
    },
    fontSizes: {
        "2xs": 12,
        xs: 14,
        sm: 16,
        md: 20,
        l: 24,
        xl: 30,
        "2xl": 36
    },
    components: {
        ...layout,
        ...buttons,
        ...advanced,
        ...nativebase
    }
});
//# sourceMappingURL=theme.js.map