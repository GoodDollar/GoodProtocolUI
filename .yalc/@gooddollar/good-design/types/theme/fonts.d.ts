export declare const fontConfig: {
    Montserrat: {
        100: {
            normal: string;
            italic: string;
        };
        200: {
            normal: string;
            italic: string;
        };
        300: {
            normal: string;
            italic: string;
        };
        400: {
            normal: string;
            italic: string;
        };
        500: {
            normal: string;
            italic: string;
        };
        600: {
            normal: string;
            italic: string;
        };
        700: {
            normal: string;
            italic: string;
        };
        800: {
            normal: string;
            italic: string;
        };
        900: {
            normal: string;
            italic: string;
        };
    };
    Roboto: {
        100: {
            normal: string;
            italic: string;
        };
        200: {
            normal: string;
            italic: string;
        };
        300: {
            normal: string;
            italic: string;
        };
        400: {
            normal: string;
            italic: string;
        };
        500: {
            normal: string;
            italic: string;
        };
        600: {
            normal: string;
            italic: string;
        };
        700: {
            normal: string;
            italic: string;
        };
        800: {
            normal: string;
            italic: string;
        };
        900: {
            normal: string;
            italic: string;
        };
    };
};
export declare type FontID = Lowercase<keyof typeof fontConfig>;
export declare const pickWeight: (list: any[], style: 'normal' | 'italic') => number[];
export declare const getFamiliesUrl: (families: Record<string, any>, fontName: string) => string;
export declare const getPlatformFamilies: (families: typeof fontConfig) => Partial<{
    Montserrat: {
        100: {
            normal: string;
            italic: string;
        };
        200: {
            normal: string;
            italic: string;
        };
        300: {
            normal: string;
            italic: string;
        };
        400: {
            normal: string;
            italic: string;
        };
        500: {
            normal: string;
            italic: string;
        };
        600: {
            normal: string;
            italic: string;
        };
        700: {
            normal: string;
            italic: string;
        };
        800: {
            normal: string;
            italic: string;
        };
        900: {
            normal: string;
            italic: string;
        };
    };
    Roboto: {
        100: {
            normal: string;
            italic: string;
        };
        200: {
            normal: string;
            italic: string;
        };
        300: {
            normal: string;
            italic: string;
        };
        400: {
            normal: string;
            italic: string;
        };
        500: {
            normal: string;
            italic: string;
        };
        600: {
            normal: string;
            italic: string;
        };
        700: {
            normal: string;
            italic: string;
        };
        800: {
            normal: string;
            italic: string;
        };
        900: {
            normal: string;
            italic: string;
        };
    };
}>;
//# sourceMappingURL=fonts.d.ts.map