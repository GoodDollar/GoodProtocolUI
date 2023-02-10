import React, { useEffect, useMemo, useState } from "react";
import { View, Button, Modal, Text, StyleSheet, Linking, Platform, ModalProps } from "react-native";
import { W3Wrapper } from "../W3Wrapper";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ethers } from "ethers";
import { first, noop } from "lodash";
import { ClaimSDK } from "../../sdk/claim/sdk";

export interface PageProps {
  address?: string;
  firstName: string;
}

const FVModal = (params: ModalProps & { firstName: string; sdk: ClaimSDK }) => {
  const { sdk } = params;
  const fvlink = useMemo(() => sdk.getFVLink(), [sdk]); //important so fvlink methods are not generated again and keep the state
  const method = "popup";

  return (
    <Modal {...params} animationType="slide">
      <View style={styles.containeralt}>
        <View>
          <Text>To verify your identity you need to sign TWICE with your wallet.</Text>
          <Text>First sign your address to be whitelisted</Text>
          <Text>
            Second sign your self sovereign anonymized identifier, so no link is kept between your identity record and
            your address.
          </Text>
        </View>
        <Button
          onPress={async () => {
            await fvlink?.getLoginSig();
          }}
          title={"Step 1 - Login"}
        />
        <Button
          onPress={async () => {
            await fvlink?.getFvSig();
          }}
          title={"Step 2 - Sign unique identifier"}
        />
        <Button
          onPress={async () => {
            if (method === "popup") {
              const link = await fvlink?.getLink(params.firstName, undefined, true);
              const popup = window.open(link, "_blank", "width: '800px', height: 'auto'");
            } else {
              const link = fvlink?.getLink(params.firstName, document.location.href, false);
              link && Linking.openURL(link);
            }
            params.onRequestClose?.(noop as any);
          }}
          title={"Step 3 - Verify"}
        />
        <Button color="red" onPress={() => params.onRequestClose?.(noop as any)} title="Close" />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  containeralt: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#eee",
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    height: 300,
    margin: "auto",
    padding: 30,
    width: 600
  },
  gap: {
    height: 10
  }
});

const ClaimButton = ({ firstName }: PageProps) => {
  const [claimStatus, setClaimStatus] = useState({ isWhitelisted: false, claimAmount: 0, claimTime: new Date(0) });
  const [isCheckTimer, setCheckTimer] = useState(false);
  const sdk = useMemo(() => new ClaimSDK(new ethers.providers.Web3Provider((window as any).ethereum), "fuse"), []); //fuse=dev env contracts
  const init = async () => {
    await sdk.provider.send("eth_requestAccounts", []);

    const addresses = await sdk.provider.listAccounts();
    const address = first(addresses);
    if (!address) {
      return;
    }
    const [isWhitelisted, claimValue, claimTime] = await Promise.all([
      sdk.isAddressVerified(address),
      sdk.checkEntitlement(),
      sdk.getNextClaimTime()
    ]);

    // console.log("init result:", { address, isWhitelisted, claimValue, claimTime });
    setClaimStatus({ isWhitelisted, claimAmount: claimValue.toNumber(), claimTime });
    if (isWhitelisted) setCheckTimer(false);
  };

  useEffect(() => {
    let handle: any;
    if (isCheckTimer && isWhitelisted === false) {
      handle = setInterval(init, 2000);
    }
    return () => handle && clearInterval(handle);
  }, [init, isCheckTimer, claimStatus.isWhitelisted]);

  useEffect(() => {
    init();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const { isWhitelisted, claimAmount, claimTime } = claimStatus;

  const handleClaim = async () => {
    if (isWhitelisted) {
      if (claimAmount > 0) {
        await sdk.claim();
        init(); //force reading claim status again
      }
    } else {
      setShowModal(true);
    }
  };
  const buttonTitle = () => {
    if (isWhitelisted) {
      if (claimAmount > 0) return `Claim ${claimAmount}`;
      else return `Claim at: ${claimTime}`;
    } else return "Verify Uniqueness";
  };

  return (
    <View>
      <View style={styles.container}>
        <FVModal
          sdk={sdk}
          onDismiss={() => setCheckTimer(true)}
          onRequestClose={() => setShowModal(false)}
          visible={showModal}
          firstName={firstName}
        ></FVModal>
      </View>
      <Button title={buttonTitle()} onPress={handleClaim}></Button>
    </View>
  );
};
const Web3Component = (params: PageProps) => {
  return <ClaimButton {...params} />;
};
const Page = (params: PageProps) => (
  <W3Wrapper withMetaMask={true}>
    <Web3Component {...params} />
  </W3Wrapper>
);

export default {
  title: "Claim Flow Example - Simple",
  component: Page
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = args => (
  <W3Wrapper withMetaMask={true}>
    <Web3Component {...args} />
  </W3Wrapper>
);

export const ClaimFlowExample = Template.bind({});
ClaimFlowExample.args = {
  firstName: "John"
};
