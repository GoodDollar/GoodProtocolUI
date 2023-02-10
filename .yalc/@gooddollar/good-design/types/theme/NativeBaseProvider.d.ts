import { NativeBaseProviderProps } from 'native-base';
import { ReactElement } from 'react';
import { FontID } from './fonts';
declare type ILoadFonts = {
    [fontId in FontID]?: boolean;
};
export declare const NativeBaseProvider: ({ children, ...props }: NativeBaseProviderProps & ILoadFonts) => ReactElement;
export {};
//# sourceMappingURL=NativeBaseProvider.d.ts.map