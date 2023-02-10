import * as ethers from "ethers";
import { Input, StyledProps } from "native-base";
import React, { useState } from "react";
import { useMaskedInputProps } from "react-native-mask-input";

const addressMask = (() => {
  const buf = ["0", "x"];
  const len = 42;

  buf.length = len;
  return buf.fill(/[a-f0-9]/i as any, 2, len);
})();

export const isAddressValid = (v: string) => ethers.utils.isAddress(v);
export const AddressInput = ({
  address,
  onChange,
  ...props
}: { address?: string; onChange: (v: string) => void } & StyledProps) => {
  const [input, setInput] = useState<string>(address || "");
  const mask = addressMask;
  const maskedInputProps = useMaskedInputProps({
    value: input,
    onChangeText: (masked: string) => {
      setInput(masked);
      onChange(masked);
    },
    mask
  });

  return <Input isInvalid={isAddressValid(input) === false} {...maskedInputProps} {...props} />;
};
