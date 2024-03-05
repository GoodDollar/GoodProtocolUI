import React, { memo } from 'react'
import { SupportedChains } from '@gooddollar/web3sdk-v2'
import { usePostHog } from 'posthog-react-native'

import { UniSwap } from './SwapCelo/UniSwap'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import SwapCore from './SwapCore'
import { getNetworkEnv } from 'utils/env'

const Swap = memo(() => {
    const { chainId } = useActiveWeb3React()
    const postHog = usePostHog()
    const payload = postHog?.getFeatureFlagPayload('swap-feature')
    const { fuseEnabled, celoEnabled, reserveEnabled } = (payload as any) || {}
    const network = getNetworkEnv()
    const isProd = network.includes('production')

    const swapComponentMapping = {
        [SupportedChains.FUSE]: { component: <SwapCore />, enabled: !isProd || (isProd && fuseEnabled) },
        [SupportedChains.MAINNET]: { component: <SwapCore />, enabled: !isProd || (isProd && reserveEnabled) },
        [SupportedChains.CELO]: { component: <UniSwap />, enabled: !isProd || (isProd && celoEnabled) },
    }

    const chainConfig = swapComponentMapping[chainId as any]
    if (chainConfig && chainConfig.enabled) {
        return chainConfig.component
    }

    return <></>
})

export default Swap
