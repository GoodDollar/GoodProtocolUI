import React, { useEffect } from "react";
import { TransactionState } from "@usedapp/core";
import { useModal } from "./useModal";

export const useSignWalletModal = () => {
  const { Modal, showModal, hideModal } = useModal();
  const SignWalletModal = ({ txStatus, ...props }: { txStatus?: TransactionState }) => {
    useEffect(() => {
      if (["PendingSignature", "CollectingSignaturePool"].includes(txStatus as any)) {
        showModal();
      } else if (txStatus) {
        hideModal();
      }
    }, [txStatus]);
    return <Modal body={"Please sign the transaction in your wallet..."} closeText="" {...props} />;
  };
  return {
    hideModal,
    showModal,
    SignWalletModal
  };
};
