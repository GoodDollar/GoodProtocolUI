import React from "react";
import { TokenInput } from "../../../core/inputs/TokenInput";
import { NativeBaseProvider } from "native-base";

export default {
  title: "Core/TokenInput",
  component: TokenInput,
  argTypes: {
    decimals: {
      description: "Token decimals"
    },
    balance: {
      description: "Token decimals"
    },
    size: {
      control: {
        type: "inline-radio",
        options: ["sm", "md", "lg"]
      }
    }
  }
};

export const TokenInputStory = {
  args: {
    size: "md",
    decimals: 10,
    balance: 300
  }
};
