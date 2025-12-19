import { memo, useCallback, useState } from 'react'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import { Converter, SlideDownTab } from '@gooddollar/good-design'
import { Box, Text, useBreakpointValue } from 'native-base'
import { useG$Price } from '@gooddollar/web3sdk-v2'

import useSendAnalyticsData from 'hooks/useSendAnalyticsData'
import { PageLayout } from 'components/Layout/PageLayout'
import { CustomGdOnramperWidget } from 'components/CustomGdOnramperWidget'
import { BuyProgressBar } from 'components/BuyProgressBar'
import Placeholder from 'components/gd/Placeholder'
import './BuyGD.css'

const CalculatorTab = () => {
    const G$Price = useG$Price(3)

    return (
        <SlideDownTab
            tabTitle="G$ Calculator"
            viewInteraction={{ hover: { backgroundColor: 'gdPrimary:alpha.10', borderRadius: 6 } }}
            styles={{
                titleFont: { fontSize: 'l', fontFamily: 'heading', fontWeight: '700', paddingLeft: 2 },
            }}
        >
            <Box px={2} py={1}>
                <Converter gdPrice={Number(G$Price?.toString()) / 1e18} />
            </Box>
        </SlideDownTab>
    )
}

const BuyGd = memo(() => {
    const sendData = useSendAnalyticsData()
    const { address } = useAppKitAccount()

    // Batch state updates for better performance
    const [buyState, setBuyState] = useState({ currentStep: 1 as 1 | 2 | 3, isLoading: false })
    const { currentStep, isLoading } = buyState

    const handleEvents = useCallback(
        (event: string, data?: any, error?: string) => {
            const eventData: any = { event: 'buy', action: event }
            if (data) eventData.data = data
            if (error) eventData.error = error
            sendData(eventData)

            switch (event) {
                case 'widget_clicked':
                case 'widget_opened':
                    setBuyState({ currentStep: 1, isLoading: true })
                    break
                case 'transaction_started':
                    setBuyState({ currentStep: 1, isLoading: true })
                    break
                case 'funds_received':
                    setBuyState({ currentStep: 2, isLoading: false })
                    break
                case 'transaction_sent':
                case 'swap_started':
                    setBuyState({ currentStep: 2, isLoading: true })
                    break
                case 'swap_completed':
                case 'transaction_completed':
                    setBuyState({ currentStep: 3, isLoading: false })
                    break
                case 'error':
                    setBuyState((prev) => ({ ...prev, isLoading: false }))
                    break
                case 'reset':
                    setBuyState({ currentStep: 1, isLoading: false })
                    break
                default:
                    break
            }
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

    return (
        <PageLayout title="Buy G$" faqType="buy" customTabs={[<CalculatorTab key="calculator" />]}>
            {address ? (
                <>
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
                            t`Choose the currency you want to use and buy cUSD. Your cUSD is then automatically converted into G$.`
                        )}
                    </Text>

                    <BuyProgressBar currentStep={currentStep} isLoading={isLoading} />

                    {/* todo: width on mobile should be more responsive */}
                    <CustomGdOnramperWidget onEvents={handleEvents} apiKey={process.env.REACT_APP_ONRAMPER_KEY} />
                </>
            ) : (
                <Placeholder className="mx-4">{i18n._(t`Connect a wallet to buy G$`)}</Placeholder>
            )}
        </PageLayout>
    )
})

export default BuyGd
