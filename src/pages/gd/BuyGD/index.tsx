import React, { memo, useCallback, useState } from 'react'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { Converter, SlideDownTab } from '@gooddollar/good-design'
import { Box, Text, useBreakpointValue } from 'native-base'
import { useG$Price } from '@gooddollar/web3sdk-v2'

import useSendAnalyticsData from 'hooks/useSendAnalyticsData'
import { useSmartContractWalletMonitor } from 'hooks/useSmartContractWalletMonitor'
import { PageLayout } from 'components/Layout/PageLayout'
import { CustomGdOnramperWidget } from 'components/CustomGdOnramperWidget'
import { BuyProgressBar } from 'components/BuyProgressBar'
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
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
    const [isLoading, setIsLoading] = useState(false)

    // Monitor smart contract wallet for funds and swap completion
    const handleFundsReceived = useCallback(() => {
        // Funds received: Move to step 2 without animation (static state)
        setCurrentStep(2)
        setIsLoading(false)
        // Trigger the swap animation after a brief pause
        setTimeout(() => {
            setIsLoading(true) // Start animating from step 2 to 3
        }, 1000)
    }, [])

    const handleSwapCompleted = useCallback(() => {
        // Swap completed: Move to step 3, stop animation
        setCurrentStep(3)
        setIsLoading(false)
    }, [])

    useSmartContractWalletMonitor({
        onFundsReceived: handleFundsReceived,
        onSwapCompleted: handleSwapCompleted,
        enabled: currentStep > 1, // Only monitor after step 1
    })

    const handleEvents = useCallback(
        (event: string, data?: any, error?: string) => {
            const eventData: any = { event: 'buy', action: event }
            if (data) eventData.data = data
            if (error) eventData.error = error
            sendData(eventData)

            switch (event) {
                case 'widget_clicked':
                case 'widget_opened':
                    setCurrentStep(1)
                    setIsLoading(true)
                    break
                case 'transaction_started':
                    setCurrentStep(1)
                    setIsLoading(true)
                    break
                case 'funds_received':
                    setCurrentStep(2)
                    setIsLoading(false)
                    break
                case 'transaction_sent':
                case 'swap_started':
                    setCurrentStep(2)
                    setIsLoading(true)
                    break
                case 'swap_completed':
                case 'transaction_completed':
                    setCurrentStep(3)
                    setIsLoading(false)
                    break
                case 'error':
                    setIsLoading(false)
                    break
                case 'reset':
                    setCurrentStep(1)
                    setIsLoading(false)
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
        </PageLayout>
    )
})

export default BuyGd
