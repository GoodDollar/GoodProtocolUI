import React, { useEffect, useRef, useState } from 'react'
import { VStack, Text, useBreakpointValue, Spinner, Button } from 'native-base'
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
    const scriptLoadedRef = useRef(false)

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
            if (scriptLoadedRef.current) return
            
            try {
                setIsLoading(true)
                setHasError(false)

                // Load the widget script from public folder
                const script = document.createElement('script')
                script.src = '/index.global.js'
                script.type = 'text/javascript'
                script.async = true

                script.onload = () => {
                    scriptLoadedRef.current = true
                    
                    // Use a timeout to ensure the custom element is registered
                    const initWidget = () => {
                        try {
                            if (!containerRef.current) return
                            
                            const widget = document.createElement('gooddollar-savings-widget')
                            if (account) {
                                widget.setAttribute('account', account)
                            }
                            widget.style.width = '100%'
                            widget.style.minHeight = '500px'
                            
                            containerRef.current.innerHTML = ''
                            containerRef.current.appendChild(widget)
                            setIsLoading(false)
                        } catch (error) {
                            console.error('Error initializing widget:', error)
                            setHasError(true)
                            setIsLoading(false)
                        }
                    }
                    
                    // Try immediately first
                    if (customElements.get('gooddollar-savings-widget')) {
                        initWidget()
                    } else {
                        // Wait for the element to be defined
                        customElements.whenDefined('gooddollar-savings-widget').then(() => {
                            initWidget()
                        }).catch((error) => {
                            console.error('Custom element error:', error)
                            setHasError(true)
                            setIsLoading(false)
                        })
                        
                        // Timeout fallback after 3 seconds
                        setTimeout(() => {
                            if (customElements.get('gooddollar-savings-widget')) {
                                initWidget()
                            }
                        }, 3000)
                    }
                }

                script.onerror = (event) => {
                    console.error('Failed to load savings widget script', event)
                    setHasError(true)
                    setIsLoading(false)
                }

                document.head.appendChild(script)

                // Overall timeout fallback
                const timeout = setTimeout(() => {
                    if (!scriptLoadedRef.current) {
                        console.error('Widget script did not load within timeout')
                        setHasError(true)
                        setIsLoading(false)
                    }
                }, 5000)

                return () => clearTimeout(timeout)
            } catch (error) {
                console.error('Error loading savings widget:', error)
                setHasError(true)
                setIsLoading(false)
            }
        }

        void loadWidget()
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
                    <Text fontSize="sm" color="red.500" textAlign="center" mb={4} fontWeight="bold">
                        Unable to Load Savings Widget
                    </Text>
                    <Text fontSize="xs" color="goodGrey.500" textAlign="center" mb={3}>
                        The widget script is not available. To enable this feature:
                    </Text>
                    <VStack fontSize="xs" color="goodGrey.400" textAlign="left" alignItems="flex-start" spacing={1}>
                        <Text>1. Clone GoodSDKs/packages/savings-widget</Text>
                        <Text>2. Run: yarn install && yarn build</Text>
                        <Text>3. Copy dist/index.global.js to public/</Text>
                        <Text>4. Restart the development server</Text>
                    </VStack>
                    <Button 
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        mt={3}
                        onPress={() => window.open('https://github.com/GoodDollar/GoodSDKs/tree/main/packages/savings-widget', '_blank')}
                    >
                        View Build Instructions →
                    </Button>
                </VStack>
            )}
            <div
                ref={containerRef}
                id="savings-widget-container"
                style={{
                    width: '100%',
                    minHeight: '500px',
                    display: isLoading || hasError ? 'none' : 'block',
                    position: 'relative',
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

