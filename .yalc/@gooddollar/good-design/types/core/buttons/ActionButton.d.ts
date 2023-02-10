import { IButtonProps } from "native-base";
import React from "react";
interface IBasicButtonProps extends IButtonProps {
    text: string;
    onPress: () => void;
}
declare const ActionButton: React.FunctionComponent<IBasicButtonProps>;
export declare const theme: {
    defaultProps: {};
    baseStyle: {
        fontSize: string;
        lineHeight: string;
        fontWeight: string;
        textTransform: string;
        boxShadow: string;
        backgroundColor: string;
        transition: string;
        userSelect: string;
    };
};
export default ActionButton;
//# sourceMappingURL=ActionButton.d.ts.map