import React, { memo, useCallback } from 'react'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { Converter, GdOnramperWidget, SlideDownTab } from '@gooddollar/good-design'
import { Box, Text, useBreakpointValue } from 'native-base'
import { useGetEnvChainId } from '@gooddollar/web3sdk-v2'
import { g$ReservePrice } from '@gooddollar/web3sdk'

import usePromise from 'hooks/usePromise'
import useSendAnalyticsData from 'hooks/useSendAnalyticsData'
import { PageLayout } from 'components/Layout/PageLayout'

const CalculatorTab = () => {
    const [G$Price] = usePromise<number | undefined>(
        () =>
            g$ReservePrice()
                .then(({ DAI }) => +DAI.toSignificant(6))
                .catch(() => undefined),
        []
    )
    return (
        <SlideDownTab
            tabTitle="G$ Calculator"
            viewInteraction={{ hover: { backgroundColor: 'primary:alpha.10', borderRadius: 6 } }}
            styles={{
                titleFont: { fontSize: 'l', fontFamily: 'heading', fontWeight: '700', paddingLeft: 2 },
            }}
        >
            <Converter gdPrice={G$Price} />
        </SlideDownTab>
    )
}

const BuyGd = memo(() => {
    const sendData = useSendAnalyticsData()

    const { connectedEnv } = useGetEnvChainId(42220)
    const isProd = connectedEnv.includes('production')

    const handleEvents = useCallback(
        (event: string, data?: any, error?: string) => {
            sendData({ event: 'buy', action: event, ...(error && { error: error }) })
        },
        [sendData]
    )

    const containerCopy = useBreakpointValue({
        base: {
            width: 350,
            fontSize: 'sm',
        },
        lg: {
            width: '100%',
        },
    })

    const onrampWrapper = useBreakpointValue({
        base: {
            width: '110%',
        },
        lg: {
            width: '100%',
        },
    })

    return (
        <PageLayout title="Buy G$" faqType="buy" customTabs={[<CalculatorTab />]}>
            <Text
                style={containerCopy}
                alignSelf="center"
                color="goodGrey.500"
                fontFamily="subheading"
                fontWeight="normal"
                textAlign="center"
                mb={6}
            >
                {i18n._(
                    t`Support global financial inclusion and contribute to social impact by purchasing GoodDollars (G$).`
                )}
            </Text>
            <Text
                style={containerCopy}
                alignSelf="center"
                color="goodGrey.500"
                fontFamily="subheading"
                fontWeight="bold"
                textAlign="center"
                mb={6}
            >
                {i18n._(
                    t`
                Choose the currency you want to use and buy cUSD. Your cUSD is then automatically converted into G$.`
                )}
            </Text>
            {/* todo: width on mobile should be more responsive */}
            <Box style={onrampWrapper}>
                <GdOnramperWidget
                    isTesting={!isProd}
                    onEvents={handleEvents}
                    apiKey={process.env.REACT_APP_ONRAMPER_KEY}
                />
            </Box>
        </PageLayout>
    )
})

export default BuyGd
