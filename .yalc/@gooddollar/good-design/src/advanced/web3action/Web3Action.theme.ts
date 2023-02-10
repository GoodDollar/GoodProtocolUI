export const StepIndicator = {
  baseStyle: {
    color: "primary",
    fontSize: "md"
  }
};

const interactionStyles = {
  backgroundColor: "primaryHoverDark",
  transition: "background 0.25s"
};

export const Web3ActionButton = {
  baseStyle: {
    innerText: {
      fontSize: "xl",
      fontWeight: "bold",
      color: "white"
    },
    innerIndicatorText: {
      color: "white",
      fontSize: "sm",
      fontWeight: "bold"
    }
  },
  variants: {
    round: () => ({
      // return {
      shadow: 2,
      w: "200px",
      h: "200px",
      px: 2.5,
      borderRadius: "50%",
      bg: "main",
      innerText: {
        variant: "shadowed",
        fontFamily: "body",
        fontSize: "l",
        width: 144,
        lineHeight: 26.4
      }
    }),
    mobile: () => ({
      backgroundColor: "primary",
      width: "100%",
      maxWidth: "none",
      height: 75,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      py: 17,
      pt: "20px",
      transition: "background 0.25s",
      _focus: interactionStyles,
      _hover: interactionStyles,
      innerText: {
        fontSize: "md",
        fontFamily: "subheading",
        lineHeight: 25
      }
    }),
    outlined: () => ({
      backgroundColor: "white",
      borderRadius: 15,
      borderWidth: 1,
      borderColor: "borderBlue",
      width: 170,
      height: 43,
      padding: "12px 16px",
      _focus: interactionStyles,
      _hover: interactionStyles,
      innerText: {
        color: "main",
        fontSize: "sm",
        fontFamily: "subheading",
        lineHeight: 19
      }
    })
  }
};
