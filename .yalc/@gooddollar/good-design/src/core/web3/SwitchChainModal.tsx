import { Text } from "native-base";
import React, { useEffect, useState } from "react";
import { useConfig } from "@usedapp/core";
import { useSwitchNetwork } from "@gooddollar/web3sdk-v2";
import { find } from "lodash";
import { useModal } from "../../hooks/useModal";

export const SwitchChainModal = (props: any) => {
  const config = useConfig();
  const [requestedChain, setRequestedChain] = useState(0);
  const { setOnSwitchNetwork } = useSwitchNetwork();

  const { Modal, showModal, hideModal } = useModal();

  useEffect(() => {
    if (setOnSwitchNetwork) {
      setOnSwitchNetwork(() => async (chainId: number, afterSwitch: any) => {
        if (afterSwitch !== undefined) hideModal();
        else {
          setRequestedChain(chainId);
          showModal();
        }
      });
    }
  }, [setOnSwitchNetwork]);

  const networkName = find(config.networks, _ => _.chainId === requestedChain)?.chainName;

  return (
    <React.Fragment>
      <Modal
        body={
          <Text>
            Connect to chain: {networkName} ({requestedChain})
          </Text>
        }
        closeText=""
      />
      {props.children}
    </React.Fragment>
  );
};
