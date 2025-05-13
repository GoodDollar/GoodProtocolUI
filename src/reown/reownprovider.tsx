import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import { celo, fuse } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.reown.com
const projectId = '311a541feae564aaa1df4bcb047077ea'

// 2. Create a metadata object - optional
const metadata = {
    name: 'GoodProtocolUI',
    description: 'Good Protocol UI',
    url: '', // origin must match your domain & subdomain
    icons: [''],
}

// 3. Set the networks
const networks = [celo, fuse]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,
})

createAppKit({
    adapters: [wagmiAdapter],
    networks: [celo, fuse],
    projectId,
    metadata,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
    },
})

export function AppKitProvider({ children }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}
