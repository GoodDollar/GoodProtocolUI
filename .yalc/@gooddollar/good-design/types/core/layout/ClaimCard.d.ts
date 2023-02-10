import { FC } from "react";
import { ClaimCardContent } from "../buttons";
interface ClaimCardProps {
    bgColor: string;
    title: {
        text: string;
        color: string;
    };
    content?: ClaimCardContent[];
}
declare const ClaimCard: FC<ClaimCardProps>;
export default ClaimCard;
//# sourceMappingURL=ClaimCard.d.ts.map