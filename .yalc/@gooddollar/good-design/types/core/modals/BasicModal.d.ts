import { FC, ReactNode } from "react";
export interface BasicModalProps {
    modalVisible: boolean;
    header?: ReactNode;
    body: ReactNode;
    footer?: ReactNode;
    actionText?: string;
    closeText?: string;
    hasCloseButton?: boolean;
    hasTopBorder?: boolean;
    hasBottomBorder?: boolean;
    onClose?: () => void;
    onAction?: () => void;
    _modal?: any;
    _body?: any;
    _footer?: any;
    _header?: any;
}
declare const BasicModal: FC<BasicModalProps>;
export default BasicModal;
//# sourceMappingURL=BasicModal.d.ts.map