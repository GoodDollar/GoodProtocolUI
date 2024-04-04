import React, { FC, PropsWithChildren } from 'react'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'

import { Box, useBreakpointValue } from 'native-base'
import { CentreBox, Title } from '@gooddollar/good-design'
import { Faq } from 'components/Faq/Faq'

interface PageLayoutProps {
    title: string
    faqType?: 'buy' | 'swap'
    customTabs?: JSX.Element[]
}

export const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({ title, faqType, customTabs, children }) => {
    const mainView = useBreakpointValue({
        base: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            width: '100%',
            mb: 2,
        },
        lg: {
            flexDirection: 'row',
            justifyContent: 'justify-evenly',
        },
    })

    const leftContainer = useBreakpointValue({
        base: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        lg: {
            width: '50%',
            paddingRight: 24,
            alignItems: 'stretch',
            borderRightWidth: 1,
            flexGrow: 1,
            justifyContent: 'flex-start',
            textAlign: 'center',
        },
    })

    const rightContainer = useBreakpointValue({
        base: {
            marginTop: 32,
            width: '100vw',
            borderColor: '#52525254',
            borderTopWidth: 1,
            height: '20vh',
            paddingTop: 4,
        },
        lg: {
            paddingLeft: 24,
            paddingTop: 48,
            width: 375,
        },
    })

    const sideTabs = useBreakpointValue({
        base: {
            alignItems: 'center',
        },
        lg: {
            alignItems: 'flex-start',
        },
    })

    return (
        <Box w="100%" mb="8" style={mainView}>
            <CentreBox borderColor="borderGrey" style={leftContainer}>
                <Title fontFamily="heading" fontSize="2xl" fontWeight="extrabold" pb="2" textAlign="center">
                    {i18n._(t`${title}`)}
                </Title>
                {children}
            </CentreBox>
            <CentreBox w="100%" justifyContent="flex-start" style={rightContainer}>
                {customTabs
                    ? customTabs.map((tab: JSX.Element) => (
                          <Box w="100%" mb={2} style={sideTabs}>
                              {tab}
                          </Box>
                      ))
                    : null}
                {faqType ? (
                    <Box w="100%" mb={2} style={sideTabs}>
                        <Faq type={faqType} />
                    </Box>
                ) : null}
            </CentreBox>
        </Box>
    )
}
