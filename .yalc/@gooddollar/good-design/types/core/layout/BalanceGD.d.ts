import { FC } from "react";
import { Fraction } from "@uniswap/sdk-core";
import { QueryParams } from "@usedapp/core";
interface BalanceGDProps {
    gdPrice?: Fraction;
    refresh?: QueryParams["refresh"];
    requiredChainId?: number;
}
declare const BalanceGD: FC<BalanceGDProps>;
export default BalanceGD;
//# sourceMappingURL=BalanceGD.d.ts.map