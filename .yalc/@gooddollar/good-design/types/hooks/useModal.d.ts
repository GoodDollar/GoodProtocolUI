import React from "react";
import { BasicModalProps } from "../core/modals/BasicModal";
export declare const useModal: () => {
    modalVisible: boolean;
    showModal: () => void;
    hideModal: () => void;
    Modal: React.FC<Omit<BasicModalProps, "modalVisible">>;
};
//# sourceMappingURL=useModal.d.ts.map