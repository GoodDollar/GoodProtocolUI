import { G$Token, useG$Decimals } from "@gooddollar/web3sdk-v2";
import { Box, Input } from "native-base";
import React from "react";
import { NumericFormat } from "react-number-format";

export const TokenOutput = ({
  outputValue,
  token,
  requiredChainId,
  decimals = 2,
  _numericformat,
  ...props
}: {
  outputValue: string;
  token?: G$Token,
  requiredChainId?: number;
  decimals?: number,
  _numericformat?: any;
  _button?: any;
  _text?: any;
}) => {
  const tokenDecimals = useG$Decimals(token, requiredChainId);
  const _decimals = token ? tokenDecimals : decimals;

  return (
    <Box w="container" {...props} width="100%">
      <NumericFormat
        disabled
        size="xl"
        value={outputValue}
        customInput={Input}
        color="lightGrey"
        decimalScale={_decimals}
        {..._numericformat}
      />
    </Box>
  );
}
