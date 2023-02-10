import {
  SupportedChains, useBridge,
  useBridgeHistory, useG$Balance, useGetBridgeData, useGetEnvChainId,
  useRefreshOrNever, useRelayTx,
  useWithinBridgeLimits
} from "@gooddollar/web3sdk-v2";

import { useEthers } from "@usedapp/core";
import { noop, sortBy } from "lodash";
import { ArrowForwardIcon, Box, Button, Flex, Heading, HStack, Stack, Text } from "native-base";
import React, { FC, useCallback, useState } from "react";
import { ExplorerLink } from "../../core/web3/ExplorerLink";
import { useSignWalletModal } from "../../hooks/useSignWalletModal";
import { MicroBridge } from "./MicroBridge";

export const useBalanceHook = (chain: "fuse" | "celo") => {
  const refresh = useRefreshOrNever(12);
  const { G$ } = useG$Balance(refresh, chain === "fuse" ? SupportedChains.FUSE : SupportedChains.CELO);

  return G$?.toString() ?? "0";
};

const useCanBridge = (chain: "fuse" | "celo", amountWei: string) => {
  const { chainId } = useGetEnvChainId(chain === "fuse" ? SupportedChains.FUSE : SupportedChains.CELO);
  const { account } = useEthers();
  const canBridge = useWithinBridgeLimits(chainId, account || "", amountWei);

  return canBridge;
};

const MicroBridgeHistory = () => {
  const { fuseHistory, celoHistory } = useBridgeHistory();

  const historySorted = sortBy(
    (fuseHistory?.value || []).concat(celoHistory?.value || []),
    _ => _.data.from === "account"
  );

  const relayTx = useRelayTx();
  const [relaying, setRelaying] = useState<{ [key: string]: boolean }>({});

  const triggerRelay = useCallback(
    async (i: any) => {
      setRelaying({ ...relaying, [i.transactionHash]: true });
      try {
        const relayResult = await relayTx(
          i.data.targetChainId.toNumber() === 42220 ? 122 : 42220,
          i.data.targetChainId.toNumber(),
          i.transactionHash
        );
        if (!relayResult.relayPromise) {
          setRelaying({ ...relaying, [i.transactionHash]: false });
        }
      } catch (e) {
        setRelaying({ ...relaying, [i.transactionHash]: false });
      }
    },
    [setRelaying, relayTx]
  );

  return (
    <Box borderRadius="md" mt="4" borderWidth="1" padding="5">
      <Heading size="sm">Transactions History</Heading>
      <Stack
        direction={["column", "column", "row"]}
        alignContent="center"
        alignItems="center"
        justifyContent="center"
        mt="5"
      >
        <Flex flex="1 1"></Flex>
        <Flex flex="2 1">
          <Heading size="xs">Transaction Hash</Heading>
        </Flex>
        <Flex flex="2 0">
          <Heading size="xs">From</Heading>
        </Flex>
        <Flex flex="2 0">
          <Heading size="xs">To</Heading>
        </Flex>
        <Flex flex="1 0">
          <Heading size="xs">Amount</Heading>
        </Flex>
        <Flex flex="1 0">
          <Heading size="xs">Status</Heading>
        </Flex>
      </Stack>

      {historySorted.map(i => (
        <Stack
          direction={["column", "column", "row"]}
          alignContent="center"
          alignItems={["flex-start", "flex-start", "center"]}
          mt={2}
          key={i.transactionHash}
          space="2"
          borderWidth={["1", "1", "0"]}
          padding={["2", "2", "0"]}
          borderRadius={["md", "md", "none"]}
        >
          <HStack flex="1 1" alignItems="center">
            <Text flex="1 0">{i.data.targetChainId.toNumber() === 122 ? "Celo" : "Fuse"}</Text>
            <ArrowForwardIcon size="3" color="black" ml="1" mr="1" flex="auto 0" />
            <Text flex="1 0">{i.data.targetChainId.toNumber() === 122 ? "Fuse" : "Celo"}</Text>
          </HStack>
          <Flex flex={["1 1", "1 1", "2 0"]} maxWidth="100%">
            <ExplorerLink
              chainId={i.data.targetChainId.toNumber() === 122 ? 42220 : 122}
              addressOrTx={i.transactionHash}
            />
          </Flex>
          <Flex flex={["1 1", "1 1", "2 0"]} maxWidth="100%">
            <ExplorerLink chainId={i.data.targetChainId.toNumber() === 122 ? 42220 : 122} addressOrTx={i.data.from} />
          </Flex>
          <Flex flex={["1 1", "1 1", "2 0"]} maxWidth="100%">
            <ExplorerLink chainId={i.data.targetChainId.toNumber() === 122 ? 42220 : 122} addressOrTx={i.data.to} />
          </Flex>
          <Flex flex={["1 1", "1 1", "1 0"]} maxWidth="100%">
            <Text>{i.data.amount.toNumber() / 100} G$</Text>
          </Flex>
          <Flex flex={["1 1", "1 1", "1 0"]} maxWidth="100%">
            {(i as any).relayEvent ? (
              <ExplorerLink
                chainId={i.data.targetChainId.toNumber()}
                addressOrTx={(i as any).relayEvent.transactionHash}
                text="Completed"
              />
            ) : (
              <Button isLoading={relaying[i.transactionHash]} onPress={() => triggerRelay(i)}>
                Relay
              </Button>
            )}
          </Flex>
        </Stack>
      ))}
    </Box>
  );
};

interface IMicroBridgeControllerProps {
  withRelay?: boolean;
  onBridgeStart?: () => void;
  onBridgeSuccess?: () => void;
  onBridgeFailed?: (e: Error) => void;
}

export const MicroBridgeController: FC<IMicroBridgeControllerProps> = ({ 
  withRelay = false, 
  onBridgeStart = noop, 
  onBridgeSuccess = noop, 
  onBridgeFailed = noop 
}: IMicroBridgeControllerProps) => {
  const { sendBridgeRequest, bridgeRequestStatus, relayStatus, selfRelayStatus } = useBridge();
  const { bridgeFees: fuseBridgeFees, bridgeLimits: fuseBridgeLimits } = useGetBridgeData(SupportedChains.FUSE, "");
  const { bridgeFees: celoBridgeFees, bridgeLimits: celoBridgeLimits } = useGetBridgeData(SupportedChains.CELO, "");
  const { SignWalletModal } = useSignWalletModal();

  return (
    <>
      <MicroBridge
        onBridge={sendBridgeRequest}
        useBalanceHook={useBalanceHook}
        useCanBridge={useCanBridge}
        bridgeStatus={bridgeRequestStatus}
        relayStatus={relayStatus}
        selfRelayStatus={selfRelayStatus}
        limits={{ fuse: fuseBridgeLimits, celo: celoBridgeLimits }}
        fees={{ fuse: fuseBridgeFees, celo: celoBridgeFees }}
        onBridgeStart={onBridgeStart}
        onBridgeSuccess={onBridgeSuccess}
        onBridgeFailed={onBridgeFailed}
      />
      {withRelay && <MicroBridgeHistory />}
      <SignWalletModal txStatus={bridgeRequestStatus.status} />
      <SignWalletModal txStatus={selfRelayStatus?.status} />
    </>
  );
};
