import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { HStack, Spinner, Text, ITextProps } from "native-base";
import { useEthers } from "@usedapp/core";
import BaseButton, { BaseButtonProps } from "../../core/buttons/BaseButton";
import { withTheme } from "../../theme";

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

const ButtonSteps = {
  connect: "Connecting wallet...",
  switch: "Switching network...",
  action: "Awaiting confirmation..."
};

const throwIfCancelled = (e: any) => {
  if (e.code === 4001) {
    throw e;
  }
};

const throwCancelled = () => {
  const e = new Error("User cancelled");

  (e as any).code = 4001;
  throw e;
};

const StepIndicator: FC<{ text?: string } & ITextProps> = withTheme({ name: "StepIndicator" })(
  ({ text, color, fontSize }) => (
    <HStack space={2} alignItems="center" flexDirection="row">
      <Spinner color={color as string} size="sm" accessibilityLabel="Waiting on wallet confirmation" />
      <Text color={color} fontSize={fontSize} fontFamily="subheading">
        {text}
      </Text>
    </HStack>
  )
);

export const Web3ActionButton: FC<Web3ActionProps> = withTheme({ name: "Web3ActionButton" })(
  ({ text, requiredChain, switchChain, web3Action, handleConnect, innerIndicatorText, ...buttonProps }) => {
    const { account, switchNetwork, chainId, activateBrowserWallet } = useEthers();
    const [runningFlow, setRunningFlow] = useState(false);
    const [actionText, setActionText] = useState("");
    const timerRef = useRef<any>(null);

    const resetText = useCallback(() => setActionText(""), []);

    const finishFlow = useCallback(() => {
      resetText();
      setRunningFlow(false);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    const startFlow = useCallback(() => {
      setRunningFlow(true);
      timerRef.current = setTimeout(finishFlow, 60000);
    }, []);

    const connectWallet = useCallback(async () => {
      const connectFn = handleConnect || (activateBrowserWallet as any);
      const isConnected = await connectFn().catch(throwIfCancelled);

      if (handleConnect && !isConnected.length) {
        throwCancelled();
      }

      return isConnected;
    }, [handleConnect, activateBrowserWallet]);

    const switchToChain = useCallback(
      async (chain: number) => {
        const switchFn = switchChain || switchNetwork;
        const result = await switchFn(chain).catch(throwIfCancelled);

        if (switchChain && !result) {
          throwCancelled();
        }
      },
      [switchNetwork, switchChain]
    );

    // while button is in loading state (1 min), be reactive to external/manual
    // account/chainId changes and re-try to perform current step action
    useEffect(() => {
      const continueSteps = async () => {
        if (!account) {
          setActionText(ButtonSteps.connect);
          await connectWallet();
          return;
        }

        if (requiredChain !== chainId) {
          setActionText(ButtonSteps.switch);
          await switchToChain(requiredChain);
          return;
        }

        setActionText(ButtonSteps.action);
        await web3Action();
        finishFlow();
      };

      if (runningFlow) {
        continueSteps().catch(finishFlow);
      }
    }, [runningFlow, account, chainId]);

    return (
      <BaseButton text={actionText ? "" : text} onPress={startFlow} {...buttonProps}>
        {!!actionText && <StepIndicator text={actionText} {...innerIndicatorText} />}
      </BaseButton>
    );
  }
);
