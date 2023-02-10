import { Text } from "native-base";
import React, { useEffect } from "react";
import { useEthers, useConfig } from "@usedapp/core";
import { SupportedChains } from "@gooddollar/web3sdk-v2";
import { filter } from "lodash";
import { useModal } from "../../hooks/useModal";

export const WalletAndChainGuard = ({
  validChains = [SupportedChains.FUSE, SupportedChains.CELO, SupportedChains.MAINNET],
  children
}: {
  connectWallet?: () => void;
  switchChain?: () => void;
  validChains?: Array<number>;
  children: any;
}) => {
  const { account, chainId, library } = useEthers();
  const config = useConfig();
  const networkNames = filter(config.networks, _ => validChains.includes(_.chainId)).map(_ => _.chainName);

  const { Modal, showModal, hideModal, modalVisible } = useModal();

  useEffect(() => {
    const isValid = account && chainId && validChains.includes(chainId);

    if (isValid) {
      hideModal();
    } else {
      showModal();
    }
  }, [account, chainId, showModal, hideModal, validChains]);

  return (
    <React.Fragment>
      <Modal
        body={
          <Text>
            {account || (library && !chainId)
              ? `Connect to supported chain: ${networkNames.join(", ")} (${validChains.join(", ")})`
              : "Connect Wallet"}
          </Text>
        }
        closeText=""
        _modal={{
          isKeyboardDismissable: false,
          closeOnOverlayClick: false
        }}
      />
      {modalVisible === false && children}
    </React.Fragment>
  );
};
