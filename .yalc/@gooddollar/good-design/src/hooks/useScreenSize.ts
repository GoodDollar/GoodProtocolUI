import { useBreakpointValue } from "native-base"

const useScreenSize = () => {
  const isLargeScreen = useBreakpointValue({ base: false, lg: true })
  const isMediumScreen = useBreakpointValue({ base: false, md: true })
  const isSmallScreen = !isLargeScreen && !isMediumScreen

  return { isSmallScreen, isLargeScreen, isMediumScreen }
}

export default useScreenSize;
