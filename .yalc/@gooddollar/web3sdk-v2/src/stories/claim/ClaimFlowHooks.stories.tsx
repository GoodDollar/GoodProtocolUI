import React, { useEffect, useState } from "react";
import { View, Button, Modal, Text, StyleSheet, Linking, ModalProps } from "react-native";
import { W3Wrapper } from "../W3Wrapper";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useClaim, useFVLink } from "../../sdk/claim/react";
import { noop } from "lodash";

export interface PageProps {
  address?: string;
  firstName: string;
}

const FVModal = (params: ModalProps & { firstName: string }) => {
  const fvlink = useFVLink();
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
            let link;
            if (method === "popup") {
              link = await fvlink?.getLink(params.firstName, undefined, true);
              const popup = window.open(link, "_blank", "width: '800px', height: 'auto'");
            } else {
              link = fvlink?.getLink(params.firstName, document.location.href, false);
              link && Linking.openURL(link);
            }
            // console.log({ link });
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

const ClaimButton = ({ address, firstName }: PageProps) => {
  // const library = useSDK(true, "claim");
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { isWhitelisted, claimAmount, claimTime, claimCall } = useClaim(refresh ? "everyBlock" : "never");
  const handleClaim = async () => {
    if (isWhitelisted) {
      await claimCall.send();
    } else {
      setShowModal(true);
    }
  };

  // const onClaim = usePressOrSwitchChain({ chainId: 122, onPress: handleClaim });
  useEffect(() => {
    if (!isWhitelisted || claimCall.state.status === "Mining" || claimCall.state.status === "PendingSignature") {
      setRefresh(true);
    } else setRefresh(false);
  }, [isWhitelisted, claimCall.state]);

  const buttonTitle = () => {
    if (isWhitelisted) {
      if (claimAmount.toNumber() > 0) return `Claim ${claimAmount}`;
      else return `Claim at: ${claimTime}`;
    } else return "Verify Uniqueness";
  };

  return (
    <View>
      <View style={styles.container}>
        <Text>isWhitelisted: {String(isWhitelisted)}</Text>
        <Text>Claim time: {claimTime.toString()}</Text>
        <Text>Claim amount: {claimAmount.toString()}</Text>
        <FVModal visible={showModal} onRequestClose={() => setShowModal(false)} firstName={firstName}></FVModal>
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
  title: "Claim Flow Example - Hooks",
  component: Page
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = args => (
  <W3Wrapper withMetaMask={true}>
    <Web3Component {...args} />
  </W3Wrapper>
);

export const ClaimFlowExample = Template.bind({});
ClaimFlowExample.args = {
  address: "",
  firstName: "John"
};
