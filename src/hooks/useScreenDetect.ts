import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

import { getScreenWidth } from 'utils/screenSizes'

export const useScreenDetect = () => {
    const [isTabletView, setIsTabletView] = useState(getScreenWidth() < 1010)
    const [isSmallTablet, setIsSmallTablet] = useState(getScreenWidth() < 650)
    const [isMobileView, setIsMobileView] = useState(getScreenWidth() < 480)

    useEffect(() => {
        const onChange = ({ window }) => {
            setIsTabletView(window.width < 1010)
            setIsSmallTablet(window.width < 650)
            setIsMobileView(window.width < 480)
        }

        const subscription = Dimensions.addEventListener('change', onChange)

        return () => {
            subscription.remove()
        }
    }, [/*used*/ isTabletView, /*used*/ isSmallTablet, /*used*/ isMobileView])

    return { isTabletView, isSmallTablet, isMobileView }
}
