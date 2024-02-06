import React from 'react'
import { Platform } from 'react-native'
import { CentreBox, withTheme } from '@gooddollar/good-design'
import { useBreakpointValue } from 'native-base'

interface MenuContainerProps {
    children: React.ReactNode
    isSimpleApp?: boolean
}

export const menuContainerTheme = {
    baseStyle: {
        ...Platform.select({
            android: {
                position: 'absolute',
            },
            web: {
                position: 'fixed',
            },
        }),
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
}

export const MenuContainer = withTheme({ name: 'MenuContainer' })(
    ({ children, isSimpleApp, ...props }: MenuContainerProps) => {
        const containerHeight = useBreakpointValue({
            base: isSimpleApp ? 14 : 56,
            xl: 20,
        })
        return (
            <CentreBox h={containerHeight} {...props}>
                {children}
            </CentreBox>
        )
    }
)
