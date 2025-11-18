import React from 'react'
import { createAppKit } from '@reown/appkit/react'
import type { AppKitNetwork } from '@reown/appkit-common'

import { WagmiProvider } from 'wagmi'
import { celo, fuse, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { injected, coinbaseWallet } from 'wagmi/connectors'
import { APPKIT_FEATURED_WALLET_IDS, APPKIT_SOCIAL_PROVIDER_IDS } from 'utils/walletConfig'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.REOWN_PROJECT_ID
if (!projectId) {
    throw new Error('REOWN_PROJECT_ID environment variable is required')
}

// 2. Create a metadata object - optional
const metadata = {
    name: 'GoodProtocolUI',
    description: 'Good Protocol UI',
    url: '', // origin must match your domain & subdomain
    icons: [''],
}

// 3. Set the networks - AppKit handles WalletConnect natively, so we don't need walletConnect connector
// Networks from @reown/appkit/networks are already AppKitNetwork type, but we need to assert tuple type
const networks = [celo, fuse, mainnet] as [AppKitNetwork, ...AppKitNetwork[]]

// 4. Create custom connectors - removed walletConnect as AppKit handles it natively
const connectors = [
    injected(), // For MetaMask and other injected wallets
    coinbaseWallet({
        appName: 'GoodProtocolUI',
        appLogoUrl: '',
    }),
]

// 5. Create Wagmi Adapter with connectors
const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,
    connectors,
})

createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
        socials: APPKIT_SOCIAL_PROVIDER_IDS as any, // Type assertion needed for social providers
    },
    featuredWalletIds: [...APPKIT_FEATURED_WALLET_IDS],
})

export function AppKitProvider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}
