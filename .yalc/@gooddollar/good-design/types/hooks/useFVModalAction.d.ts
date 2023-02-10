import { FVFlowProps } from "../core";
interface FVModalActionProps extends Pick<FVFlowProps, "method" | "firstName"> {
    onClose: () => void;
    redirectUrl?: string;
}
export declare const useFVModalAction: ({ firstName, method, onClose, redirectUrl }: FVModalActionProps) => {
    loading: boolean;
    verify: () => Promise<void>;
};
export {};
//# sourceMappingURL=useFVModalAction.d.ts.map