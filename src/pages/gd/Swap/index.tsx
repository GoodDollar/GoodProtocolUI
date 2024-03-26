import React, { memo } from 'react'
import { SupportedChains } from '@gooddollar/web3sdk-v2'
import { useFeatureFlagWithPayload } from 'posthog-react-native'

import { UniSwap } from './SwapCelo/UniSwap'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import SwapCore from './SwapCore'

const Swap = memo(() => {
    const { chainId } = useActiveWeb3React()
    const [, payload] = useFeatureFlagWithPayload('swap-feature')

    const { fuseEnabled, celoEnabled, reserveEnabled } = (payload as any) || {}

    const swapComponentMapping = {
        [SupportedChains.FUSE]: { component: <SwapCore />, enabled: fuseEnabled },
        [SupportedChains.MAINNET]: { component: <SwapCore />, enabled: reserveEnabled },
        [SupportedChains.CELO]: { component: <UniSwap />, enabled: celoEnabled },
    }

    const chainConfig = swapComponentMapping[chainId as any]
    if (chainConfig && chainConfig.enabled) {
        return chainConfig.component
    }

    return <></>
})

export default Swap
