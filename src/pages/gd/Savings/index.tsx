import React, { useEffect, useRef, useState } from 'react'
import { VStack, Text, useBreakpointValue, Spinner } from 'native-base'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { useEthers } from '@usedapp/core'

import { PageLayout } from 'components/Layout/PageLayout'

const SavingsExplanation = () => (
    <VStack space={2} textAlign="center" justifyContent="center" alignItems="center" pb={8}>
        <Text fontFamily="subheading" fontSize="sm" color="goodGrey.600" pt={4} pb={8} textAlign="center">
            {i18n._(
                t`Earn rewards by saving your GoodDollars with Ubeswap savings products! 
Savings provides a simple way to generate yield on your digital assets.
Securely lock your assets and watch them grow over time.
Please be patient, loading information may take some time.`
            )}
        </Text>
    </VStack>
)

const SavingsWidgetContainer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const { account } = useEthers()

    const containerStyles = useBreakpointValue({
        base: {
            maxWidth: 350,
        },
        sm: {
            maxWidth: '100%',
        },
    })

    useEffect(() => {
        const loadWidget = async () => {
            try {
                setIsLoading(true)
                setHasError(false)

                // Try to load the savings widget script from CDN
                // The widget is available as a web component from GoodSDKs/savings-widget
                const script = document.createElement('script')
                script.src = 'https://unpkg.com/@gooddollar/savings-widget@latest/dist/index.js'
                script.async = true
                script.defer = true

                script.onload = () => {
                    setIsLoading(false)
                }

                script.onerror = () => {
                    console.error('Failed to load savings widget from CDN')
                    setHasError(true)
                    setIsLoading(false)
                }

                if (containerRef.current) {
                    containerRef.current.appendChild(script)
                }
            } catch (error) {
                console.error('Error loading savings widget:', error)
                setHasError(true)
                setIsLoading(false)
            }
        }

        loadWidget()

        return () => {
            // Cleanup
            if (containerRef.current) {
                const scripts = containerRef.current.querySelectorAll('script')
                scripts.forEach((script) => script.remove())
            }
        }
    }, [account])

    return (
        <VStack style={containerStyles} space={4} w="100%">
            {isLoading && (
                <VStack alignItems="center" justifyContent="center" minH="300px" w="100%">
                    <Spinner color="gdPrimary" size="lg" />
                    <Text fontSize="sm" color="goodGrey.400" mt={4}>
                        Loading savings widget...
                    </Text>
                </VStack>
            )}
            {hasError && (
                <VStack alignItems="center" justifyContent="center" minH="300px" w="100%">
                    <Text fontSize="sm" color="red.500" textAlign="center">
                        Unable to load the savings widget. Please try again later.
                    </Text>
                </VStack>
            )}
            <div
                ref={containerRef}
                id="savings-widget-container"
                style={{
                    width: '100%',
                    minHeight: '500px',
                    display: isLoading || hasError ? 'none' : 'flex',
                }}
            />
        </VStack>
    )
}

const Savings: React.FC = () => {
    return (
        <PageLayout title="Savings" faqType="savings">
            <SavingsExplanation />
            <SavingsWidgetContainer />
        </PageLayout>
    )
}

export default Savings

