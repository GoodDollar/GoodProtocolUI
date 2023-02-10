import { IModalProps } from "native-base";

export interface FVFlowProps {
  firstName: string;
  method: "popup" | "redirect";
  redirectUrl?: string;
  claim: () => Promise<boolean>;
  styles?: any;
  claimed?: boolean;
  refresh?: "everyBlock" | "never" | number | undefined;
  handleConnect?: () => Promise<any> | void;
}

export type FVModalProps = IModalProps & FVFlowProps;

export interface ClaimCardContent {
  description?: {
    text: string;
    color: string;
  };
  imageUrl?: string;
  link?: {
    linkText: string;
    linkUrl: string;
  };
  list?: Array<{ id: string; key: string; value: string }>;
}
export interface IClaimCard {
  id: string;
  title: {
    text: string;
    color: string;
  };
  bgColor: string;
  content?: Array<ClaimCardContent>;
  hide?: boolean;
}
