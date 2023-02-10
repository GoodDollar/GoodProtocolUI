import { IButtonProps, ITextProps } from "native-base";
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";
import React from "react";
export interface BaseButtonProps extends IButtonProps {
    /**
     * a text to be rendered in the component.
     */
    text: string;
    onPress: () => void;
    innerText?: ITextProps;
    innerView?: IViewProps;
    children?: any;
    name?: string;
}
declare const BaseButton: React.FunctionComponent<BaseButtonProps>;
export declare const theme: {
    defaultProps: {};
    baseStyle: (baseTools: {
        colorMode: string;
    }) => any;
    variants: {
        arrowIcon: () => {
            bg: string;
            w: number;
            h: number;
            innerText: {
                fontSize: string;
                fontWeight: string;
                fontFamily: string;
                color: string;
            };
            innerView: {
                width: number;
                flexDirection: string;
                justifyContent: string;
                alignItems: string;
                px: number;
                pl: number;
                pr: number;
                flexGrow: number;
            };
            borderRadius: number;
        };
    };
};
export default BaseButton;
//# sourceMappingURL=BaseButton.d.ts.map