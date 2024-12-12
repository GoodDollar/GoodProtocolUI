import React from 'react'
import { useHistory } from 'react-router-dom'
import { OnboardController } from '@gooddollar/good-design'
import { AsyncStorage } from '@gooddollar/web3sdk-v2'
import { Spinner, VStack } from 'native-base'
import { useEthers } from '@usedapp/core'
import { useFeatureFlagWithPayload } from 'posthog-react-native'

import { getNetworkEnv } from 'utils/env'

export const Onboard = ({ onExit }: { onExit: () => void }) => {
    const { account } = useEthers()
    const [, payload] = useFeatureFlagWithPayload('uat-goodid-flow')
    const { whitelist } = payload ?? {}
    const networkEnv = getNetworkEnv()
    const history = useHistory()

    const goToClaim = async () => {
        await AsyncStorage.setItem('goodid_upgraded', 'true')
        history.push('/claim')
    }

    if (account === undefined) return <Spinner variant="page-loader" size="lg" />
    return (
        <VStack margin="auto">
            <OnboardController
                account={account}
                onSkip={onExit}
                onDone={goToClaim}
                onExit={onExit}
                isDev={networkEnv === 'development' || whitelist?.includes(account)}
                isWallet={true}
                withNavBar={false}
            />
        </VStack>
    )
}
