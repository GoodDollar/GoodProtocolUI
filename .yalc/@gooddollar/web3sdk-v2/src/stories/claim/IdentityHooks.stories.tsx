import React, { useState } from "react";
import { W3Wrapper } from "../W3Wrapper";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useFVLink, useIsAddressVerified } from "../../sdk/claim/react";
import { useSDK } from "../../sdk/base/react";

export interface PageProps {
  address?: string;
  firstName?: string;
}

const Web3Component = (params: PageProps) => {
  const [fvVerificatoinLink, setLink] = useState<string>();
  const library = useSDK(true, "claim");
  const isVerified = useIsAddressVerified(params.address || "");
  const fvlink = useFVLink();
  return (
    <div>
      <div>Env</div>
      <div>{JSON.stringify(library?.env)}</div>
      <div>Env Contracts</div>
      <div>{JSON.stringify(library?.contracts)}</div>
      <div>Address whitelisted</div>
      <div>
        {params.address} is verified: {JSON.stringify(isVerified)}
      </div>
      <button
        onClick={async () => {
          await fvlink.getLoginSig();
          await fvlink.getFvSig();
          setLink(fvlink.getLink(params.firstName || "", document.location.href));
        }}
      >
        Generate FV Link
      </button>
      <div>FaceVerificatoin Flow link</div> <div>{fvVerificatoinLink}</div>
    </div>
  );
};
const Page = (params: PageProps) => (
  <W3Wrapper withMetaMask={true}>
    <Web3Component {...params} />
  </W3Wrapper>
);

export default {
  title: "Identity SDK hooks example",
  component: Page
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = args => (
  <W3Wrapper withMetaMask={false}>
    <Web3Component {...args} />
  </W3Wrapper>
);

export const IdentitySDKExample = Template.bind({});
IdentitySDKExample.args = {
  address: "",
  firstName: "Hadar"
};
