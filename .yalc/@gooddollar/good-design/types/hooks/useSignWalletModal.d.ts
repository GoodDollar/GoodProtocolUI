import { TransactionState } from "@usedapp/core";
export declare const useSignWalletModal: () => {
    hideModal: () => void;
    showModal: () => void;
    SignWalletModal: ({ txStatus, ...props }: {
        txStatus?: TransactionState | undefined;
    }) => JSX.Element;
};
//# sourceMappingURL=useSignWalletModal.d.ts.map