import React, { useState } from "react";
import { W3Wrapper } from "../W3Wrapper";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useFaucet } from "../../sdk/faucet/react";
import { useNetwork } from "@usedapp/core";

export interface PageProps {
  address?: string;
  firstName?: string;
}

const Web3Component = (params: PageProps) => {
  useFaucet();
  return <div></div>;
};
const Page = (params: PageProps) => (
  <W3Wrapper withMetaMask>
    <Web3Component {...params} />
  </W3Wrapper>
);

export default {
  title: "Faucet SDK hooks example",
  component: Page
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = args => (
  <W3Wrapper withMetaMask>
    <Web3Component {...args} />
  </W3Wrapper>
);

export const FaucetSDKExample = Template.bind({});
