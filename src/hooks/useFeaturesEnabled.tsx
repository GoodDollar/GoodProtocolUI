import React, { createContext, useContext, useMemo } from 'react'
import { useEthers } from '@usedapp/core'
import { SupportedChains } from '@gooddollar/web3sdk-v2'
import { useFeatureFlagWithPayload } from 'posthog-react-native'

interface ChainFeatureConfig {
    [featureName: string]: boolean | undefined
}

interface FeatureConfigPayload {
    networks: Record<SupportedChains, ChainFeatureConfig>
    globalDefaults: Record<string, boolean | undefined>
}

interface FeatureContextValue {
    isFeatureActive: (featureName: string, chainId?: SupportedChains) => boolean
    activeNetworksByFeature: Record<string, SupportedChains[]>
    activeChainFeatures: Record<string, boolean>
}

const supportedFeatureKeys = [
    'networkEnabled',
    'microBridgeEnabled',
    'lzBridgeEnabled',
    'reserveEnabled',
    'claimEnabled',
    'dexSwapEnabled',
    'stakingEnabled',
    'governanceEnabled',
]

const localFeatureConfig: FeatureConfigPayload = {
    networks: {
        [SupportedChains.CELO]: {
            networkEnabled: true,
            microBridgeEnabled: true,
            lzBridgeEnabled: false,
            reserveEnabled: true,
            claimEnabled: true,
            dexSwapEnabled: true,
        },
        [SupportedChains.MAINNET]: {
            networkEnabled: true,
            microBridgeEnabled: false,
            lzBridgeEnabled: false,
            reserveEnabled: false,
            claimEnabled: false,
            stakingEnabled: false,
        },
        [SupportedChains.FUSE]: {
            networkEnabled: true,
            microBridgeEnabled: true,
            lzBridgeEnabled: false,
            reserveEnabled: false,
            claimEnabled: true,
            governanceEnabled: true,
        },
        [SupportedChains.XDC]: {
            networkEnabled: false,
            microBridgeEnabled: false,
            lzBridgeEnabled: false,
            reserveEnabled: false,
            claimEnabled: false,
        },
    },
    globalDefaults: {
        defaultEnabled: true,
        defaultNetworkEnabled: true,
        defaultMicroBridgeEnabled: true,
        defaultLzBridgeEnabled: true,
        defaultReserveEnabled: true,
        defaultClaimEnabled: true,
    },
}

const GoodDappFeatureContext = createContext<FeatureContextValue | undefined>(undefined)

export const GoodDappFeatureProvider: React.FC<{
    featureConfig?: FeatureConfigPayload
    children: React.ReactNode
}> = ({ children }) => {
    const { chainId } = useEthers()
    const [, payload] = useFeatureFlagWithPayload('gooddapp-feature-config')
    const featureConfig = (payload as FeatureConfigPayload | undefined) ?? localFeatureConfig

    const contextValue: FeatureContextValue = useMemo(() => {
        const isGlobalFeatureSystemDisabled = featureConfig.globalDefaults.defaultEnabled === false
        const productionNetworkIds = Object.values(SupportedChains).filter(
            (id) => typeof id === 'number'
        ) as SupportedChains[]

        const activeNetworksByFeature: Record<string, SupportedChains[]> = {}

        for (const featureName of supportedFeatureKeys) {
            const globalFeatureDefault =
                featureConfig.globalDefaults[`default${featureName[0].toUpperCase()}${featureName.slice(1)}`]

            // Disable globally if system or feature default is off
            if (isGlobalFeatureSystemDisabled || globalFeatureDefault === false) {
                activeNetworksByFeature[featureName] = []
                continue
            }

            activeNetworksByFeature[featureName] = productionNetworkIds.filter((id) => {
                const chainOverrides = featureConfig.networks?.[id]
                return chainOverrides?.[featureName] === true
            })
        }

        const isFeatureActive = (featureName: string, targetChainId = chainId): boolean => {
            if (!targetChainId) return false
            return activeNetworksByFeature[featureName]?.includes(targetChainId as SupportedChains) ?? false
        }

        const activeChainFeatures = Object.fromEntries(
            supportedFeatureKeys.map((feature) => [feature, isFeatureActive(feature, chainId)])
        )

        return {
            isFeatureActive,
            activeNetworksByFeature,
            activeChainFeatures,
        }
    }, [featureConfig, chainId])

    return <GoodDappFeatureContext.Provider value={contextValue}>{children}</GoodDappFeatureContext.Provider>
}

export const useGoodDappFeatures = (): FeatureContextValue => {
    const context = useContext(GoodDappFeatureContext)
    if (!context) {
        throw new Error('useGoodDappFeatures must be used inside a GoodDappFeatureProvider')
    }
    return context
}
