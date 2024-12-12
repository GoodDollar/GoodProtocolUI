import { useState } from 'react'
import { useGoodId } from '@gooddollar/good-design'
import { Spinner, VStack } from 'native-base'
import { useEthers } from '@usedapp/core'
import { isEmpty } from 'lodash'
import { AsyncStorage } from '@gooddollar/web3sdk-v2'

import GoodIdDetails from './GoodIdDetails'
import { Onboard } from './Onboard'
import { PageLayout } from 'components/Layout/PageLayout'
import usePromise from 'hooks/usePromise'

const GoodId = () => {
    const { account = '' } = useEthers()
    const { certificateSubjects, isWhitelisted } = useGoodId(account)
    const [skipSegmentation, setSkipSegmentation] = useState(false)

    const [isUpgraded] = usePromise(async () => {
        if (isEmpty(certificateSubjects) && isWhitelisted !== undefined) {
            await AsyncStorage.removeItem('goodid_upgraded')
            return false
        }

        return AsyncStorage.getItem('goodid_upgraded')
    }, [certificateSubjects, isWhitelisted])

    if (isWhitelisted === undefined || isUpgraded === undefined) return <Spinner variant="page-loader" size="lg" />

    return (
        <PageLayout faqType="goodid">
            <VStack margin="auto">
                {(isWhitelisted && !isEmpty(certificateSubjects) && isUpgraded) || skipSegmentation ? (
                    <GoodIdDetails />
                ) : (
                    <Onboard onExit={() => setSkipSegmentation(true)} />
                )}
            </VStack>
        </PageLayout>
    )
}

export default GoodId
