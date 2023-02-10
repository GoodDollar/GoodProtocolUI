import { extendTheme } from "native-base";
import * as layout from "../core/layout/theme";
import * as buttons from "../core/buttons/theme";
import * as advanced from "../advanced/theme";
import * as nativebase from "./nativebase";
import { fontConfig, getPlatformFamilies } from "./fonts";

export const theme = extendTheme({
  fontConfig: getPlatformFamilies(fontConfig),
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

// extend the theme
export type MyThemeType = typeof theme;

declare module "native-base" {
  type ICustomTheme = MyThemeType;
}
