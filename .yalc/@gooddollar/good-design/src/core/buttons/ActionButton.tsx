import { Button, IButtonProps } from "native-base";
import React from "react";
import { withTheme } from "../../theme/hoc/withTheme";

interface IBasicButtonProps extends IButtonProps {
  text: string;
  onPress: () => void;
}

const ActionButton = withTheme({ name: "ActionButton" })(({ text, ...props }: IBasicButtonProps) => (
  <Button
    alignItems="center"
    justifyContent="center"
    minWidth="100%"
    height={71}
    paddingX={5}
    paddingY={5}
    borderRadius={20}
    textAlign="center"
    {...props}
  >
    {text}
  </Button>
));

export const theme = {
  defaultProps: {},
  baseStyle: {
    fontSize: "xl",
    lineHeight: "2xs",
    fontWeight: "black",
    textTransform: "capitalize",
    boxShadow: "3px 3px 10px -1px rgba(11, 27, 102, 0.304824)",
    backgroundColor: "#00B0FF",
    transition: "background 0.25s",
    userSelect: "none"
  }
};

export default ActionButton;
