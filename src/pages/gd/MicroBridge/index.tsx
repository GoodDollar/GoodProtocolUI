import React, { memo } from 'react'
import {
    SwitchChainModal,
    // ClaimCarousel,
    MicroBridgeController,
    // IClaimCard,
} from '@gooddollar/good-design'
import { Text, VStack } from 'native-base'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'

import { PageLayout } from 'components/Layout/PageLayout'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import Placeholder from 'components/gd/Placeholder'

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
            <div className="rounded max-w-3xl min-w-96 w-full mx-auto">
                <VStack maxWidth="800" minWidth="344" width="100%" alignItems="center" justifyContent="center">
                    <SwitchChainModal>
                        {account ? (
                            <MicroBridgeController withRelay={false} />
                        ) : (
                            <Placeholder className="mx-4">
                                {i18n._(t`Connect a wallet to see your portfolio`)}
                            </Placeholder>
                        )}
                    </SwitchChainModal>
                </VStack>
            </div>
        </PageLayout>
    )
})

export default MicroBridge
