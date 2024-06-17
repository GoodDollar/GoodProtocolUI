import React, { memo } from 'react'
import {
    SwitchChainModal,
    WalletAndChainGuard,
    // ClaimCarousel,
    MicroBridgeController,
    // IClaimCard,
} from '@gooddollar/good-design'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const MicroBridge = memo(() => {
    const { account } = useActiveWeb3React()

    return (
        <div className="rounded p-14">
            {account && (
                <>
                    <SwitchChainModal>
                        <WalletAndChainGuard validChains={[122, 42220]}>
                            <MicroBridgeController withRelay={false} />
                        </WalletAndChainGuard>
                    </SwitchChainModal>
                </>
            )}
        </div>
    )
})

export default MicroBridge
