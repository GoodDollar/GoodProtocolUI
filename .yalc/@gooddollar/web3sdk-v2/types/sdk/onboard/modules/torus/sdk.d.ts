import { WalletInit } from '@web3-onboard/common';
import { TorusCtorArgs, TorusParams } from '@toruslabs/torus-embed';
type TorusOptions = TorusCtorArgs & TorusParams;
declare function torus(options?: TorusOptions): WalletInit;
export default torus;
//# sourceMappingURL=sdk.d.ts.map