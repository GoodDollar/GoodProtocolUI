import { IButtonProps, ITextProps, View } from "native-base";
import { Button, Text } from "native-base";
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";
import React from "react";
import { withTheme } from "../../theme/hoc/withTheme";
import { withThemingTools } from "../../theme/utils/themingTools";

export interface BaseButtonProps extends IButtonProps {
  /**
   * a text to be rendered in the component.
   */
  text: string;
  onPress: () => void;
  innerText?: ITextProps;
  innerView?: IViewProps;
  children?: any;
  name?: string;
}

const BaseButton = withTheme({ name: "BaseButton" })(
  ({ text, innerText, innerView, onPress, children, ...props }: BaseButtonProps) => (
    <Button onPress={onPress} px={100} {...props}>
      <View {...innerView}>
        <Text {...innerText}>{text}</Text>
        {children}
      </View>
    </Button>
  )
);

export const theme = {
  defaultProps: {},
  baseStyle: withThemingTools(({ colorModeValue }: { colorModeValue: any }) => {
    const colors = ["lightBlue.400", "lightBlue.700"];
    const [bg, bgHover] = colorModeValue(colors, [...colors].reverse());

    return {
      maxWidth: 750,
      bg,
      _hover: {
        bg: bgHover
      },
      innerText: {
        fontWeight: "hairline",
        color: "white"
      }
    };
  }),
  variants: {
    arrowIcon: () => ({
      bg: "white",
      w: 208,
      h: 58,
      innerText: {
        fontSize: "md",
        fontWeight: "medium",
        fontFamily: "subheading",
        color: "main"
      },
      innerView: {
        width: 208,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        px: 1.5,
        pl: 4,
        pr: 1.5,
        flexGrow: 0
      },
      borderRadius: 15
    })
  }
};

export default BaseButton;
