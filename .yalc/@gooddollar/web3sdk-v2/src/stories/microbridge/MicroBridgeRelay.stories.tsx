import React, { useEffect, useState } from "react";
import { W3Wrapper } from "../W3Wrapper";
import { useRelayTx } from "../../sdk/microbridge/react";
import { useEthers } from "@usedapp/core";

export interface PageProps {
  txHash: string;
}

const BridgeHooksTest = (params: PageProps) => {
  const [relayTxDone, setRelayDone] = useState();
  const relayTx = useRelayTx();
  const { account } = useEthers();
  useEffect(() => {
    console.log(params.txHash, relayTx);
    if (params.txHash && account)
      relayTx(122, 42220, params.txHash)
        .catch(e => e.message)
        .then(setRelayDone);
  }, [params, account]);
  return <div>{relayTxDone}</div>;
};

export default {
  title: "MicroBridge Relay TX",
  component: BridgeHooksTest,
  decorators: [
    Story => (
      <W3Wrapper withMetaMask={true}>
        <Story />
      </W3Wrapper>
    )
  ],
  argTypes: {
    txHash: {
      description: "tx hash to relay"
    }
  }
};

export const BridgeRelay = {
  args: {
    txHash: ""
  }
};
