import React, { useEffect } from 'react'
import { createAppKit } from '@reown/appkit/react'
import type { AppKitNetwork } from '@reown/appkit-common'
import { defineChain, http } from 'viem'

import { fallback, WagmiProvider } from 'wagmi'
import { celo, fuse, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { injected, coinbaseWallet } from 'wagmi/connectors'
import { APPKIT_FEATURED_WALLET_IDS, APPKIT_SOCIAL_PROVIDER_IDS } from 'utils/walletConfig'
import { SupportedChains } from '@gooddollar/web3sdk-v2'
import { getEnv } from 'utils/env'
import { set } from 'lodash'
import { getMiniPayProvider } from 'utils/minipay'
import { miniPayConnector } from './minipayConnector'
import { useNetwork } from 'hooks/useWeb3'

const queryClient = new QueryClient()

const projectId = process.env.REOWN_PROJECT_ID || ''
// if (!projectId) {
//     throw new Error('REOWN_PROJECT_ID environment variable is required')
// }

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
    const xdcRpcs = process.env.REACT_APP_XDC_RPC?.split(',') ?? ['https://rpc.xdc.network']
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
                http: xdcRpcs,
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

const baseConnectors = [
    injected({
        target() {
            if (typeof window === 'undefined') return undefined
            const ethereum = (window as any).ethereum
            if (!ethereum) return undefined

            const miniPayProvider = getMiniPayProvider()

            if (Array.isArray(ethereum.providers)) {
                const nonMiniPayProvider = ethereum.providers.find((provider: any) => provider !== miniPayProvider)
                return nonMiniPayProvider || (miniPayProvider ? undefined : ethereum.providers[0])
            }

            return ethereum === miniPayProvider ? undefined : ethereum
        },
    }),
    coinbaseWallet({
        appName: 'GoodProtocolUI',
        appLogoUrl: '',
    }),
]

const connectors =
    typeof window !== 'undefined' && getMiniPayProvider() ? [miniPayConnector(), ...baseConnectors] : baseConnectors

let wagmiAdapter: WagmiAdapter = null as any
export function AppKitProvider({ children }: { children: React.ReactNode }) {
    const [initialized, setInitialized] = React.useState(false)
    const { testedRpcs } = useNetwork()
    useEffect(() => {
        if (testedRpcs === null) return
        console.log("initializing Reown's AppKitProvider with tested RPCs:", testedRpcs)
        const transports = {}
        networks.map((network) => {
            const rpcUrls = testedRpcs[network.id]
            if (rpcUrls) {
                set(network, 'rpcUrls.default.http', rpcUrls)
                console.log(`Reown: Updated RPC for ${network.name} to ${rpcUrls}`)
                transports[network.id] = fallback(rpcUrls.map((_) => http(_)))
                // network.rpcUrls = updatedNetwork.rpcUrls
            }
        })
        console.log('reown networks:', networks)
        wagmiAdapter = new WagmiAdapter({
            networks,
            projectId,
            ssr: true,
            connectors,
            transports,
        })

        console.log(`wagmiAdapter.wagmiConfig:`, wagmiAdapter.wagmiConfig)
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
        setInitialized(true)
    }, [testedRpcs === null])

    if (initialized === false) {
        return null
    }
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}
