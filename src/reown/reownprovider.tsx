import React from 'react'
import { createAppKit } from '@reown/appkit/react'
import type { AppKitNetwork } from '@reown/appkit-common'
import { defineChain } from 'viem'

import { WagmiProvider } from 'wagmi'
import { celo, fuse, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { injected, coinbaseWallet } from 'wagmi/connectors'
import { APPKIT_FEATURED_WALLET_IDS, APPKIT_SOCIAL_PROVIDER_IDS } from 'utils/walletConfig'
import { SupportedChains } from '@gooddollar/web3sdk-v2'
import { getEnv } from 'utils/env'
import { sample } from 'lodash'

const queryClient = new QueryClient()

const projectId = process.env.REOWN_PROJECT_ID
if (!projectId) {
    throw new Error('REOWN_PROJECT_ID environment variable is required')
}

const metadata = {
    name: 'GoodProtocolUI',
    description: 'Good Protocol UI',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icons: typeof window !== 'undefined' ? [`${window.location.origin}/favicon.ico`] : [],
}

const localFeatureConfig = {
    networks: {
        [SupportedChains.CELO]: { networkEnabled: true },
        [SupportedChains.MAINNET]: { networkEnabled: true },
        [SupportedChains.FUSE]: { networkEnabled: true },
        [SupportedChains.XDC]: { networkEnabled: true },
    },
    globalDefaults: {
        defaultEnabled: true,
        defaultNetworkEnabled: true,
    },
}

const getAllowedNetworks = (): SupportedChains[] => {
    const isGlobalFeatureSystemDisabled = localFeatureConfig.globalDefaults.defaultEnabled === false
    const globalFeatureDefault = localFeatureConfig.globalDefaults.defaultNetworkEnabled

    // Disable globally if system or feature default is off
    if (isGlobalFeatureSystemDisabled || globalFeatureDefault === false) {
        return []
    }

    const productionNetworkIds = Object.values(SupportedChains).filter((id) => id) as SupportedChains[]
    const prodNetworks = productionNetworkIds.filter((id) => {
        const chainOverrides = localFeatureConfig.networks?.[id]
        return chainOverrides?.networkEnabled === true
    })

    const network = getEnv()
    switch (true) {
        case network === 'staging':
        case network === 'development': {
            const devNetworks = [...prodNetworks]
            if (devNetworks.indexOf(SupportedChains.XDC) === -1) {
                devNetworks.push(SupportedChains.XDC)
            }
            return devNetworks.filter((chain) => chain !== SupportedChains.MAINNET)
        }

        default:
            return prodNetworks
    }
}

const createXdcNetwork = (): AppKitNetwork => {
    const xdcRpc = sample(process.env.REACT_APP_XDC_RPC?.split(',')) ?? 'https://rpc.xdc.network'
    return defineChain({
        id: 50,
        name: 'XDC Network',
        nativeCurrency: {
            name: 'XDC',
            symbol: 'XDC',
            decimals: 18,
        },
        rpcUrls: {
            default: {
                http: [xdcRpc],
            },
        },
        blockExplorers: {
            default: {
                name: 'XDC Explorer',
                url: 'https://xdc.blocksscan.io',
            },
        },
    }) as AppKitNetwork
}

const mapSupportedChainToReownNetwork = (chain: SupportedChains): AppKitNetwork => {
    switch (chain) {
        case SupportedChains.CELO:
            return celo
        case SupportedChains.FUSE:
            return fuse
        case SupportedChains.MAINNET:
            return mainnet
        case SupportedChains.XDC:
            return createXdcNetwork()
        default:
            throw new Error(`Unsupported chain: ${chain}`)
    }
}

const allowedChains = [SupportedChains.CELO, ...getAllowedNetworks().filter((chain) => chain !== SupportedChains.CELO)]

if (allowedChains.length === 0) {
    throw new Error('No networks enabled. At least one network must be enabled.')
}

const networks = allowedChains.map(mapSupportedChainToReownNetwork) as [AppKitNetwork, ...AppKitNetwork[]]

const connectors = [
    injected(),
    coinbaseWallet({
        appName: 'GoodProtocolUI',
        appLogoUrl: '',
    }),
]

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
        analytics: true,
        socials: APPKIT_SOCIAL_PROVIDER_IDS as any,
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
