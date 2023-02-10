import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { W3Wrapper } from "./W3Wrapper";
import { useEthers } from "@usedapp/core";

export interface PageProps {
  user?: {};
  onLogin: () => void;
  onLogout: () => void;
  onCreateAccount: () => void;
}

const Web3Component = () => {
  const library = useEthers();
  return (
    <div>
      <div>{library.account}</div>
      <div>{library.chainId}</div>
    </div>
  );
};
export const Page = () => (
  <W3Wrapper>
    <Web3Component />
  </W3Wrapper>
);

export default {
  title: "Web3 Context Example",
  component: Page
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = () => <Page />;

export const MetamaskExample = Template.bind({});
