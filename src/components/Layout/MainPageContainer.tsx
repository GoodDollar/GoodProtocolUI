import React, { ReactNode } from 'react'
import { useBreakpointValue, useColorModeValue, View } from 'native-base'
import { withTheme } from '@gooddollar/good-design'

interface IMainPageContainerProps {
    children: ReactNode
    isFv: boolean
    isDashboard: boolean
    isClaim: boolean
    mainBody?: object
    flexStart?: object
    justifyBetween?: object
    dashboardBody?: object
}

export const mpContainerTheme = {
    baseStyle: {
        dashboardBody: {
            width: '80%',
            height: '100%',
            paddingTop: 50,
            paddingRight: 20,
            paddingBottom: 50,
            paddingLeft: 20,
        },
        mainBody: {
            zIndex: 0,
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            height: '100%',
            paddingTop: 16,
            paddingBottom: 16,
            overflowX: 'hidden',
            overflowY: 'auto',
        },
        flexStart: {
            justifyContent: 'flex-start',
        },
        justifyBetween: {
            justifyContent: 'space-between',
        },
    },
}

const MainPageContainer = withTheme({ name: 'MainPageContainer' })(
    ({
        children,
        mainBody,
        flexStart,
        justifyBetween,
        dashboardBody,
        isFv,
        isDashboard,
        isClaim,
    }: IMainPageContainerProps) => {
        const bgColor = useColorModeValue('white', '#222B45')
        const styles = useBreakpointValue({
            base: {
                ...mainBody,
                ...(isFv ? justifyBetween : flexStart),
                ...(isDashboard ? dashboardBody : isFv || isClaim ? {} : { paddingRight: 16, paddingLeft: 16 }),
            },
            lg: {
                ...mainBody,
                ...(isFv ? justifyBetween : flexStart),
                paddingRight: 32,
                paddingLeft: 48,
            },
        })

        return (
            <View style={styles} bgColor={bgColor}>
                {children}
            </View>
        )
    }
)

export default MainPageContainer
