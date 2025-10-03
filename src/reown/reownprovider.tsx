import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import { celo, fuse } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

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

// 3. Set the networks
const networks = [celo, fuse]

// 4. Create custom connectors
const connectors = [
    walletConnect({
        projectId,
        showQrModal: false, // AppKit handles the modal
        metadata: {
            name: 'GoodProtocolUI',
            description: 'Good Protocol UI',
            url: '',
            icons: [''],
        },
    }),
    injected(),
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
    networks: [celo, fuse],
    projectId,
    metadata,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
        socials: ['google'],
    },
})

export function AppKitProvider({ children }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}
