import React, { memo } from 'react'
import { SwitchChainModal } from '@gooddollar/good-design'
import { MPBBridgeController } from '@gooddollar/good-design/dist/apps/bridge/mpbridge'
import { useAppKitAccount } from '@reown/appkit/react'
import { PageLayout } from 'components/Layout/PageLayout'
import Placeholder from 'components/gd/Placeholder'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'

const GoodBridge = memo(() => {
    const { address } = useAppKitAccount()
    return (
        <PageLayout faqType="bridge">
            <div className="rounded max-w-3xl min-w-96 w-full mx-auto">
                <SwitchChainModal>
                    {address ? (
                        <MPBBridgeController />
                    ) : (
                        <Placeholder className="mx-4">
                            {i18n._(t`Connect a wallet to start bridging assets`)}
                        </Placeholder>
                    )}
                </SwitchChainModal>
            </div>
        </PageLayout>
    )
})

export default GoodBridge
