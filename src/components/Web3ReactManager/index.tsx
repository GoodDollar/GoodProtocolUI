import React, { useEffect, useState, useRef } from 'react'
import { useAnalytics } from '@gooddollar/web3sdk-v2'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import styled from 'styled-components'
import { useAppKitState } from '@reown/appkit/react'
import { useAccount, useConnect } from 'wagmi'
import { waitForMiniPayProvider, isMiniPay } from 'utils/minipay'

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

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowLoader(true)
        }, LOADER_DELAY_MS)

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    useEffect(() => {
        if (hasConnected.current || address) {
            return
        }

        const attemptConnect = async () => {
            if (!isMiniPay()) {
                return
            }

            const provider = await waitForMiniPayProvider(2000)
            if (!provider) {
                return
            }

            try {
                hasConnected.current = true
                const miniPayConnectorInstance = connectors.find((c) => c.id === 'minipay')
                if (miniPayConnectorInstance) {
                    connect({ connector: miniPayConnectorInstance })
                }
            } catch (error) {
                console.error('MiniPay auto-connect failed:', error)
                hasConnected.current = false
            }
        }

        void attemptConnect()
    }, [address, connect, connectors])

    useEffect(() => {
        if (initialized && address) {
            identify(address)
        }
    }, [initialized, address, identify])

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

    return <>{children}</>
}
