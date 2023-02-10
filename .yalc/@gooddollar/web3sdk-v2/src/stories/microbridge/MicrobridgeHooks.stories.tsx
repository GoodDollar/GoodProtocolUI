import React from "react";
import { W3Wrapper } from "../W3Wrapper";
import { useWithinBridgeLimits, useGetBridgeData } from "../../sdk/microbridge/react";

export interface PageProps {
  address: string;
  amount: number;
  chainId: number;
}

const BridgeHooksTest = (params: PageProps) => {
  const limits = useWithinBridgeLimits(params.chainId, params.address, params.amount.toString());
  const bridgeInfo = useGetBridgeData(params.chainId, params.address);
  return (
    <>
      <div>canBridge result: {JSON.stringify(limits)}</div>
      <pre>bridge data {JSON.stringify(bridgeInfo, null, 4)}</pre>
    </>
  );
};

export default {
  title: "MicroBridge Hooks",
  component: BridgeHooksTest,
  decorators: [
    Story => (
      <W3Wrapper withMetaMask={true}>
        <Story />
      </W3Wrapper>
    )
  ],
  argTypes: {
    address: {
      description: "wallet address"
    },
    amount: {
      description: "bridge amount"
    },
    chainId: {
      description: "source chain"
    }
  },
  args: {
    address: "0x0",
    amount: 100,
    chainId: 122
  }
};

export const Bridge = {
  args: {
    address: "0x0",
    amount: 100,
    chainId: 122
  }
};
