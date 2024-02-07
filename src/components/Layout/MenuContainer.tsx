import React from 'react'
import { Platform } from 'react-native'
import { CentreBox, withTheme } from '@gooddollar/good-design'
import { useBreakpointValue, useColorModeValue } from 'native-base'

interface MenuContainerProps {
    children: React.ReactNode
    isSimpleApp?: boolean
}

export const menuContainerTheme = {
    baseStyle: {
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        width: '100%',
        ...Platform.select({
            android: {
                paddingHorizontal: 2,
            },
            web: {
                gap: 2,
            },
        }),
    },
}

export const MenuContainer = withTheme({ name: 'MenuContainer' })(
    ({ children, isSimpleApp, ...props }: MenuContainerProps) => {
        const bgColor = useColorModeValue('white', '#222B45')

        const containerHeight = useBreakpointValue({
            base: isSimpleApp ? 14 : 56,
            xl: 20,
        })

        const position = useBreakpointValue({
            base: Platform.select({
                android: 'absolute',
                web: 'fixed',
            }),
            lg: 'relative',
        })

        return (
            <CentreBox bgColor={bgColor} h={containerHeight} position={position} {...props}>
                {children}
            </CentreBox>
        )
    }
)
