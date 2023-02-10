import React, { FC } from "react";
import BaseButton, { BaseButtonProps } from "./BaseButton";
import { Box, ArrowForwardIcon } from "native-base";

const ArrowButton: FC<BaseButtonProps> = ({ text, onPress, ...props }: BaseButtonProps) => (
  <BaseButton text={text} onPress={onPress} variant="arrowIcon" {...props}>
    <Box w="46" h="46" mr="1.5" bg="primary" borderRadius="12" justifyContent="center" alignItems="center">
      <ArrowForwardIcon color="white" />
    </Box>
  </BaseButton>
);

export default ArrowButton;
