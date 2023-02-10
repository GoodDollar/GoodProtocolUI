import { useEthers } from "@usedapp/core";
import { useCallback, useEffect, useState } from "react";
import { useSwitchNetwork } from "../contexts/Web3Context";

type Props = { chainId: number; onPress: () => void; };

export const usePressOrSwitchChain = (props: Props) => {
  const [trigger, setTrigger] = useState(false);
  const { chainId } = useEthers();
  const { switchNetwork } = useSwitchNetwork();

  const onPress = useCallback(async () => {
    if (props.chainId !== chainId && switchNetwork) {
      await switchNetwork(props.chainId);
      // console.log("switched network?");
      setTrigger(true);
    } else {
      props.onPress();
    }
  }, [chainId, props, switchNetwork]);

  useEffect(() => {
    if (trigger && chainId === props.chainId) {
      props.onPress();
      setTrigger(false);
    }
  }, [trigger, chainId, props]);

  return onPress;
};
