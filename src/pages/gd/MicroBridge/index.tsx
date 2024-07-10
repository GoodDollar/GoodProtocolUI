import React, { memo } from 'react'
import {
    SwitchChainModal,
    WalletAndChainGuard,
    // ClaimCarousel,
    MicroBridgeController,
    // IClaimCard,
} from '@gooddollar/good-design'
import { Text, VStack } from 'native-base'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { PageLayout } from 'components/Layout/PageLayout'

const MicroBridge = memo(() => {
    const { account } = useActiveWeb3React()

    return (
        <PageLayout title="Micro Bridge" faqType="bridge">
            <VStack space={2} textAlign="center" justifyContent="center" alignItems="center" pb={2}>
                <Text fontFamily="subheading" fontSize="sm" color="goodGrey.600" pt={4} pb={8} textAlign="center">
                    {i18n._(
                        t`Seamlessly convert between Fuse G$ tokens to Celo and vice versa, 
enabling versatile use of G$ tokens across various platforms and 
ecosystems`
                    )}
                </Text>
            </VStack>
            <div className="rounded px-14 py-4">
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
        </PageLayout>
    )
})

export default MicroBridge
