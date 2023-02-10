export const withThemingTools = (styleFactory: (opts: any) => any) => (baseTools: { colorMode: string; }) => {
  const { colorMode } = baseTools
  const colorModeValue: <T, >(lightValue: T, darkValue: T) => T =
    colorMode === "dark"
      ? (_, darkValue) => darkValue
      : lightValue => lightValue;

  return styleFactory({ ...baseTools, colorModeValue })
}
