import React, { useEffect, useState, useRef } from 'react'
import { useAnalytics } from '@gooddollar/web3sdk-v2'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import styled from 'styled-components'
import { useAppKitState } from '@reown/appkit/react'
import { useConnectionInfo } from 'hooks/useConnectionInfo'
import { useConnect } from 'wagmi'
import { isMiniPay } from 'utils/minipay'

const MessageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20rem;
`

const Message = styled.h2`
    color: ${({ theme }) => theme.secondary1};
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
    const { i18n } = useLingui()
    // const { tried } = useOnboardConnect()
    const [, setShowLoader] = useState(false) // handle delayed loader state
    const { initialized } = useAppKitState()
    const { address } = useConnectionInfo()
    const networkError = false
    const { identify } = useAnalytics()
    const { connect, connectors } = useConnect()
    const miniPayDetected = isMiniPay()
    const autoConnectAttempted = useRef(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowLoader(true)
        }, 600)

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    // Auto-connect when MiniPay is detected (per MiniPay documentation recommendations)
    useEffect(() => {
        if (miniPayDetected && initialized && !address && !autoConnectAttempted.current) {
            // Find MiniPay connector
            const miniPayConn = connectors.find((conn) => conn.id === 'minipay')

            if (miniPayConn) {
                autoConnectAttempted.current = true
                // Auto-connect to MiniPay when detected
                // Using a small delay to ensure AppKit is fully initialized
                const timer = setTimeout(() => {
                    try {
                        connect({ connector: miniPayConn })
                    } catch (error) {
                        console.warn('Auto-connect to MiniPay failed:', error)
                        autoConnectAttempted.current = false // Allow retry on error
                    }
                }, 500)

                return () => clearTimeout(timer)
            }
        }
    }, [miniPayDetected, initialized, address, connect, connectors])

    useEffect(() => {
        // re-identify analytics when connected wallet changes
        if (initialized && address) {
            identify(address)
        }
    }, [initialized, address, identify])

    // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
    if (!initialized && networkError) {
        return (
            <MessageWrapper>
                <Message>
                    {i18n._(
                        t`Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device`
                    )}
                </Message>
            </MessageWrapper>
        )
    }

    return children
}
