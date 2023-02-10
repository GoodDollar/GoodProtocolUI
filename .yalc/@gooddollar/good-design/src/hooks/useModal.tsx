import { noop, over } from "lodash";
import React, { FC, useCallback, useMemo, useState } from "react";
import { BasicModal } from "../core/modals";
import { BasicModalProps } from "../core/modals/BasicModal";

export const useModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = useCallback(() => setModalVisible(true), [setModalVisible]);
  const hideModal = useCallback(() => setModalVisible(false), [setModalVisible]);

  const MemoizedModal: FC<Omit<BasicModalProps, "modalVisible">> = useMemo(
    () =>
      ({ onClose = noop, ...props }) =>
        <BasicModal {...props} modalVisible={modalVisible} onClose={over(onClose, hideModal)} />,
    [modalVisible, hideModal]
  );

  return {
    modalVisible,
    showModal,
    hideModal,
    Modal: MemoizedModal
  };
};
