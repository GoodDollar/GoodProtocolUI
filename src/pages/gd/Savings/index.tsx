import '@goodsdks/savings-widget'
import { useEffect, useRef, useCallback } from 'react'
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import type { Provider } from '@reown/appkit/react'
import { PageLayout } from 'components/Layout/PageLayout'

export default function Savings() {
    const widgetRef = useRef<any>(null)
    const { open: openAppKit } = useAppKit()
    const { address } = useAppKitAccount()
    const { walletProvider } = useAppKitProvider<Provider>('eip155')

    const handleConnectWallet = useCallback(async () => {
        await openAppKit({ view: 'Connect' })
    }, [openAppKit])

    useEffect(() => {
        const widget = widgetRef.current
        if (!widget) return

        // Assign connect wallet handler unconditionally
        widget.connectWallet = handleConnectWallet

        // Update web3 provider when connected
        if (address && walletProvider) {
            widget.web3Provider = walletProvider
        }
    }, [walletProvider, handleConnectWallet, address])

    // Clear provider on disconnect
    useEffect(() => {
        const widget = widgetRef.current
        if (!widget) return

        if (!address) {
            widget.web3Provider = null
        }
    }, [address])

    return (
        <PageLayout title="Savings" faqType="savings">
            <gooddollar-savings-widget ref={widgetRef} />
        </PageLayout>
    )
}
