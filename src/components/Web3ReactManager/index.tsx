import React, { useEffect, useState } from 'react'
import { useAnalytics } from '@gooddollar/web3sdk-v2'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import styled from 'styled-components'
import { useAppKitState } from '@reown/appkit/react'
import { useConnectionInfo } from 'hooks/useConnectionInfo'

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

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowLoader(true)
        }, 600)

        return () => {
            clearTimeout(timeout)
        }
    }, [])

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
