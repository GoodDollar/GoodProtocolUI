import React, { useEffect } from 'react'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import { Box, Divider, useBreakpointValue } from 'native-base'
import { AsyncStorage, isMobile as deviceDetect } from '@gooddollar/web3sdk-v2'

import { CentreBox } from '@gooddollar/good-design/dist/core/layout/CentreBox'
import { useWindowFocus } from '@gooddollar/good-design/dist/hooks'

export type OnramperCallback = (event: WebViewMessageEvent) => void

export const CustomOnramper = ({
    onEvent,
    onGdEvent,
    step,
    setStep,
    apiKey,
    widgetParams = { onlyCryptos: 'CUSD_CELO', isAddressEditable: false, supportSell: false, supportSwap: false },
    targetNetwork = 'CELO',
    targetWallet,
}: {
    onEvent?: OnramperCallback
    onGdEvent: (action: string) => void
    step: number
    setStep: (step: number) => void
    widgetParams?: any
    targetWallet?: string
    targetNetwork?: string
    apiKey?: string
}) => {
    const url = new URL('https://buy.onramper.com/')

    // Always include API key for proper authentication
    // SECURITY NOTE: Onramper API keys are designed for client-side use
    // - These are PUBLIC API keys specifically intended for browser environments
    // - They are NOT secret keys and are safe to expose in client-side code
    // - Similar to Google Maps API keys, they're restricted by domain/referrer
    // - This follows Onramper's official integration documentation
    // - See: https://docs.onramper.com for official security guidelines
    if (apiKey) {
        url.searchParams.set('apiKey', apiKey)
    } else {
        console.warn('Onramper: No API key provided')
    }
    url.searchParams.set('networkWallets', `${targetNetwork}:${targetWallet}`)
    Object.entries(widgetParams).forEach(([k, v]: [string, any]) => {
        url.searchParams.set(k, v)
    })

    const { title } = useWindowFocus()

    const uri = url.toString()

    const isMobile = deviceDetect()

    // Responsive dimensions for the widget
    const widgetDimensions = useBreakpointValue({
        base: {
            maxWidth: '100%',
            width: '95vw',
            height: 500,
            webViewWidth: '100%',
            webViewHeight: 500,
        },
        sm: {
            maxWidth: 400,
            width: '90%',
            height: 550,
            webViewWidth: 380,
            webViewHeight: 550,
        },
        md: {
            maxWidth: 450,
            width: '80%',
            height: 600,
            webViewWidth: 430,
            webViewHeight: 600,
        },
        lg: {
            maxWidth: 480,
            width: '100%',
            height: 630,
            webViewWidth: 480,
            webViewHeight: 630,
        },
        xl: {
            maxWidth: 480,
            width: '200%',
            height: 630,
            webViewWidth: 480,
            webViewHeight: 630,
        },
    })

    // on page load check if a returning user is awaiting funds
    useEffect(() => {
        const isOnramping = async () => {
            const isOnramping = await AsyncStorage.getItem('gdOnrampSuccess')
            if (isOnramping === 'true') {
                setStep(2)
            }
        }

        void isOnramping()
    }, [])

    useEffect(() => {
        if (title === 'Onramper widget' && step === 0) {
            onGdEvent('buy_start')
            setStep(1)
        }
    }, [title, step, onGdEvent, setStep])

    if (!targetWallet) {
        return (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'red' }}>
                Wallet not found. Please select a valid wallet to continue.
            </div>
        )
    }

    return (
        <Box mb={6} alignItems="center" w="100%">
            <CentreBox
                maxWidth={widgetDimensions?.maxWidth}
                w={widgetDimensions?.width}
                h={widgetDimensions?.height}
                mb={6}
            >
                <WebView
                    testID="onramper-widget-iframe-test"
                    style={{
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: '#58585f',
                        borderStyle: 'solid',
                        margin: 'auto',
                        width: '100%',
                        height: '100%',
                    }}
                    scrollEnabled={false}
                    webviewDebuggingEnabled={true}
                    source={{ uri }}
                    onMessage={onEvent}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent
                        console.error('Onramper WebView error:', nativeEvent)
                    }}
                    onHttpError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent
                        console.error('Onramper HTTP error:', nativeEvent.statusCode, nativeEvent.description)
                    }}
                    height={widgetDimensions?.webViewHeight}
                    width={widgetDimensions?.webViewWidth}
                    title="Onramper widget"
                    allow="accelerometer; autoplay; camera; gyroscope; payment"
                />
            </CentreBox>
            {isMobile && <Divider orientation="horizontal" w="100%" bg="borderGrey" mb={6} />}
        </Box>
    )
}
