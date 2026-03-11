import React, { useEffect, useRef } from 'react'
import { VStack, Text, useBreakpointValue, Spinner, Button, Box } from 'native-base'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { useEthers } from '@usedapp/core'
import { useAppKitProvider, useAppKit } from '@reown/appkit/react'
import type { Provider } from '@reown/appkit/react'

import { PageLayout } from 'components/Layout/PageLayout'
import { useExternalScript } from 'hooks/useExternalScript'

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
    const { account } = useEthers()
    const { walletProvider } = useAppKitProvider<Provider>('eip155')
    const { open: openAppKit } = useAppKit()

    // Load the widget script once and track its status
    const scriptStatus = useExternalScript('/index.global.js')

    const containerStyles = useBreakpointValue({
        base: {
            maxWidth: 350,
        },
        sm: {
            maxWidth: '100%',
        },
    })

    // Initialize the widget when script is ready and wallet provider changes
    useEffect(() => {
        if (scriptStatus !== 'ready' || !containerRef.current) return

        try {
            const widget = document.createElement('gooddollar-savings-widget')
            
            // Pass account as an attribute
            if (account) {
                widget.setAttribute('account', account)
            }
            
            // Pass the wallet provider to the widget
            if (walletProvider) {
                (widget as any).web3Provider = walletProvider
            }
            
            // Pass the connect wallet callback
            (widget as any).connectWallet = async () => {
                await openAppKit({ view: 'Connect' })
            }
            
            // Clear container and mount widget
            containerRef.current.innerHTML = ''
            containerRef.current.appendChild(widget)
        } catch (error) {
            console.error('Error initializing widget:', error)
        }
    }, [scriptStatus, account, walletProvider, openAppKit])

    return (
        <VStack style={containerStyles} space={4} w="100%">
            {scriptStatus === 'loading' && (
                <VStack alignItems="center" justifyContent="center" minH="300px" w="100%">
                    <Spinner color="gdPrimary" size="lg" />
                    <Text fontSize="sm" color="goodGrey.400" mt={4}>
                        Loading savings widget...
                    </Text>
                </VStack>
            )}
            {scriptStatus === 'error' && (
                <VStack alignItems="center" justifyContent="center" minH="300px" w="100%">
                    <Text fontSize="sm" color="red.500" textAlign="center" mb={4} fontWeight="bold">
                        Unable to Load Savings Widget
                    </Text>
                    <Text fontSize="xs" color="goodGrey.500" textAlign="center" mb={3}>
                        The widget script is not available. To enable this feature:
                    </Text>
                    <VStack fontSize="xs" color="goodGrey.400" textAlign="left" alignItems="flex-start" space={1}>
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
            <Box
                as="div"
                ref={containerRef}
                id="savings-widget-container"
                w="100%"
                minH="500px"
                position="relative"
                display={scriptStatus === 'ready' ? 'block' : 'none'}
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

