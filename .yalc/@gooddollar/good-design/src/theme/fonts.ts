import { chain, first, toPairs } from 'lodash';
import { Platform } from 'react-native';

export const fontConfig = {
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

export type FontID = Lowercase<keyof typeof fontConfig>;

export const pickWeight = (list: any[], style: 'normal' | 'italic') => chain(list)
  .groupBy(style)
  .mapValues(items => Number(first(items).weight))
  .values()
  .value();

export const getFamiliesUrl = (families: Record<string, any>, fontName: string) => {
  const list = toPairs(families).map(([weight, props]: [string, any]) => ({ weight, ...props }));

  const [normalWeights, italicWeights] = ["normal", "italic"]
    .map(style => pickWeight(list, style as 'normal' | 'italic'))
    .map((weights, index) => weights.map(value => `${index},${value}`).join(";"));

  return `//fonts.googleapis.com/css2?family=${fontName}:ital,wght@${normalWeights};${italicWeights}&display=swap`
};

export const getPlatformFamilies = (families: typeof fontConfig) => Platform.select<Partial<typeof fontConfig>>({
  native: families,
  default: {}
});
