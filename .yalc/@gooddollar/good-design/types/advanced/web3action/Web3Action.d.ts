import { FC } from "react";
import { ITextProps } from "native-base";
import { BaseButtonProps } from "../../core/buttons/BaseButton";
export interface Web3ActionProps extends Omit<BaseButtonProps, "onPress"> {
    /**
     * a text to be rendered in the component.
     */
    requiredChain: number;
    innerIndicatorText?: ITextProps;
    web3Action: () => Promise<void> | void;
    switchChain?: (requiredChain: number) => Promise<any>;
    handleConnect?: () => Promise<any> | void;
}
export declare const Web3ActionButton: FC<Web3ActionProps>;
//# sourceMappingURL=Web3Action.d.ts.map