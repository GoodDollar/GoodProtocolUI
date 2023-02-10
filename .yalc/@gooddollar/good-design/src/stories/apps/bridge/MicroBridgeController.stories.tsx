import { WalletAndChainGuard } from "../../../core/web3/WalletAndChainGuard";
import React from "react";
import { MicroBridgeController } from "../../../apps/bridge/MicroBridgeController";
import { W3Wrapper } from "../../W3Wrapper";
import { SwitchChainModal } from "../../../core/web3/SwitchChainModal";

export default {
  title: "Apps/MicroBridgeController",
  component: MicroBridgeController,
  decorators: [
    (Story:any) => (
      <W3Wrapper withMetaMask={true} env="fuse">
        <SwitchChainModal>
          <WalletAndChainGuard validChains={[122, 42220]}>
            <Story />
          </WalletAndChainGuard>
        </SwitchChainModal>
      </W3Wrapper>
    )
  ]
  // argTypes: {
  //   useBalanceHook: {
  //     description: "G$ Bridge"
  //   }
  // }
};

export const MicroBridgeControllerWithoutRelay = {
  args: { withRelay: false }
};
export const MicroBridgeControllerWithRelay = {
  args: { withRelay: true }
};
