import React, { useEffect, useRef, useState } from 'react'
import { useAnalytics } from '@gooddollar/web3sdk-v2'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import styled from 'styled-components'
import { useAppKitState } from '@reown/appkit/react'
import { useAccount, useConnect } from 'wagmi'
import { waitForMiniPayProvider } from 'utils/minipay'

const MessageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20rem;
`

const Message = styled.h2`
    color: ${({ theme }) => theme.secondary1};
`

const LOADER_DELAY_MS = 600

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
    const { i18n } = useLingui()
    const [, setShowLoader] = useState(false)
    const { initialized } = useAppKitState()
    const { address } = useAccount()
    const networkError = false
    const { identify } = useAnalytics()
    const { connect, connectors } = useConnect()
    const hasConnected = useRef(false)
    const [connectionStatus, setConnectionStatus] = useState<string>('')

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowLoader(true)
        }, LOADER_DELAY_MS)

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    useEffect(() => {
        if (hasConnected.current || connectors.length === 0) {
            return
        }

        const attemptConnect = async () => {
            setConnectionStatus('Detecting MiniPay...')
            const provider = await waitForMiniPayProvider(2000)
            if (!provider) {
                setConnectionStatus('MiniPay not detected')
                return
            }

            try {
                setConnectionStatus('Connecting to MiniPay...')
                hasConnected.current = true
                connect({ connector: connectors[0] })
                setConnectionStatus('MiniPay connected successfully!')
            } catch (error) {
                console.error('MiniPay connection failed:', error)
                hasConnected.current = false
                setConnectionStatus(
                    `MiniPay connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                )
            }
        }

        void attemptConnect()
    }, [connect, connectors])

    useEffect(() => {
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

    return (
        <>
            {connectionStatus && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '16px 20px',
                        backgroundColor: '#000',
                        color: '#fff',
                        borderRadius: '12px',
                        fontSize: '14px',
                        zIndex: 10000,
                        maxWidth: '90%',
                        width: '320px',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>MiniPay Status</div>
                    <div style={{ marginBottom: address ? '8px' : '0' }}>{connectionStatus}</div>
                    {address && (
                        <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8, wordBreak: 'break-all' }}>
                            {address.slice(0, 8)}...{address.slice(-6)}
                        </div>
                    )}
                </div>
            )}
            {children}
        </>
    )
}
