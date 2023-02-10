import React, { useEffect, useState } from "react";
import { W3Wrapper } from "../W3Wrapper";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useWhitelistSync } from "../../sdk/claim/react";

export interface PageProps {
  address?: string;
  firstName?: string;
}

const Web3Component = (params: PageProps) => {
  const [syncResult, setSyncResult] = useState<boolean>();
  const { fuseWhitelisted, currentWhitelisted, syncStatus } = useWhitelistSync();

  useEffect(() => {
    if (syncStatus) syncStatus.then(r => setSyncResult(r));
  }, [syncStatus]);
  return (
    <div>
      <div>Fuse Whitelisted:</div>
      <div>{String(fuseWhitelisted)}</div>
      <div>Connected Chain Whitelisted:</div>
      <div>{String(currentWhitelisted)}</div>
      <div>sync status promise</div>
      <div>{String(syncStatus)}</div>
      <div>sync promise result</div>
      <div>{String(syncResult)}</div>
    </div>
  );
};
const Page = (params: PageProps) => (
  <W3Wrapper>
    <Web3Component {...params} />
  </W3Wrapper>
);

export default {
  title: "Whitelist Sync SDK hooks example",
  component: Page
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = args => (
  <W3Wrapper withMetaMask>
    <Web3Component {...args} />
  </W3Wrapper>
);

export const WhitelistSyncExample = Template.bind({});
