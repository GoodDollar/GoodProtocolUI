export const SelectBox = {
  defaultProps: {},
  baseStyle: {
    borderColor:"blue.500",
    borderWidth: 1,
    borderRadius:"lg",
    flexDirection: "row",
    w:40,
    h:16,
    p:1,
    _hover: {
      bgColor: "mainDarkContrast:alpha.20"
    },
    display: "flex"
  },
  variants: {
    button: (props:any) => {
      const { isListOpen } = props;
      const radius = isListOpen ? 0 : "lg"
      return {
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius
      } 
    },
    list: (props: any) => {
      const { isListOpen } = props;
      const radius = isListOpen ? 0 : "lg"
      return {
        display: isListOpen ? "flex" : "none",
        backgroundColor: isListOpen ? "#F2F2F2" : "inherit",
        borderTopRightRadius: radius,
        borderTopLeftRadius: radius
      }
    }
  }
}
