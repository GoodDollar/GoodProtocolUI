import React, { FC, memo } from "react";
import { Text, View, Box } from "native-base";
import { useG$Balance, useGetEnvChainId } from "@gooddollar/web3sdk-v2";
import { Fraction } from "@uniswap/sdk-core";
import { CurrencyValue, QueryParams } from "@usedapp/core";

interface BalanceGDProps {
  gdPrice?: Fraction;
  refresh?: QueryParams["refresh"];
  requiredChainId?: number;
}

const BalanceCopy = ({ heading, subHeading }: { heading: string; subHeading: string }) => (
  <Box mb="4">
    <Text fontSize="2xl" fontWeight="extrabold" fontFamily="heading" mb="0.5" color="main">
      {heading}
    </Text>
    <Text fontSize="sm" fontWeight="normal" fontFamily="subheading" color="goodGrey.500">
      {subHeading}
    </Text>
  </Box>
);

const BalanceView: FC<Required<BalanceGDProps> & { amount: CurrencyValue }> = memo(
  ({ gdPrice, amount, requiredChainId }) => {
    const network = requiredChainId === 122 ? "Fuse" : "Celo";
    const copies = [
      {
        id: "your-balance-label",
        heading: "Your Balance",
        subheading: `on ${network}`
      },
      {
        id: "your-balance-value",
        heading: amount.format({ suffix: "", prefix: amount.currency.ticker + " " }),
        subheading: "(USD " + gdPrice.multiply(amount.format({ suffix: "", thousandSeparator: "" })).toFixed(2) + ")"
      }
    ];

    return (
      <View w="full" flexDirection="column" alignItems="center">
        {copies.map(({ id, heading, subheading }) => (
          <BalanceCopy key={id} heading={heading} subHeading={subheading} />
        ))}
      </View>
    );
  }
);

const BalanceGD: FC<BalanceGDProps> = ({ gdPrice, requiredChainId, refresh = "never" }) => {
  const { chainId } = useGetEnvChainId(requiredChainId);
  const { G$ } = useG$Balance(refresh, chainId);

  return !G$ || !gdPrice ? null : (
    <BalanceView amount={G$} gdPrice={gdPrice} refresh={refresh} requiredChainId={chainId} />
  );
};

export default BalanceGD;
