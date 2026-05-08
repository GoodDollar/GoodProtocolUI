import '@goodsdks/savings-widget'
import { useEffect, useRef, useCallback } from 'react'
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import type { Provider } from '@reown/appkit/react'
import { PageLayout } from 'components/Layout/PageLayout'

export default function Savings() {
    const widgetRef = useRef<
        HTMLElement & {
            connectWallet?: () => void
            web3Provider?: unknown | null
        }
    >(null)
    const { open: openAppKit } = useAppKit()
    const { address } = useAppKitAccount()
    const { walletProvider } = useAppKitProvider<Provider>('eip155')

    const handleConnectWallet = useCallback(async () => {
        await openAppKit({ view: 'Connect' })
    }, [openAppKit])

    // Assign connect wallet handler
    useEffect(() => {
        const widget = widgetRef.current
        if (!widget) return
        widget.connectWallet = handleConnectWallet
    }, [handleConnectWallet])

    // Update web3 provider based on wallet connection state
    useEffect(() => {
        const widget = widgetRef.current
        if (!widget) return
        widget.web3Provider = address && walletProvider ? walletProvider : null
    }, [address, walletProvider])

    return (
        <PageLayout title="Savings" faqType="savings">
            <gooddollar-savings-widget ref={widgetRef} />
        </PageLayout>
    )
}
