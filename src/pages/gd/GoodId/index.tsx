import { useGoodId } from '@gooddollar/good-design'
import { Spinner, VStack } from 'native-base'
import { useEthers } from '@usedapp/core'
import { isEmpty } from 'lodash'

import GoodIdDetails from './GoodIdDetails'
import { Onboard } from './Onboard'
import { PageLayout } from 'components/Layout/PageLayout'
import usePromise from 'hooks/usePromise'
import { AsyncStorage } from '@gooddollar/web3sdk-v2'

const GoodId = () => {
    const { account = '' } = useEthers()
    const { certificateSubjects, isWhitelisted } = useGoodId(account)
    const [isUpgraded] = usePromise(() => AsyncStorage.getItem('goodid_upgraded'), [])

    if (isWhitelisted === undefined || isUpgraded === undefined) return <Spinner variant="page-loader" size="lg" />

    return (
        <PageLayout faqType="goodid">
            <VStack maxWidth="600" margin="auto">
                {isWhitelisted && !isEmpty(certificateSubjects) && isUpgraded ? <GoodIdDetails /> : <Onboard />}
            </VStack>
        </PageLayout>
    )
}

export default GoodId
