import { useCallback, useState } from 'react'
import { useGoodId } from '@gooddollar/good-design'
import { Spinner, VStack } from 'native-base'
import { useEthers } from '@usedapp/core'
import { isEmpty } from 'lodash'
import { AsyncStorage } from '@gooddollar/web3sdk-v2'
import { useFeatureFlagWithPayload } from 'posthog-react-native'
import usePromise from 'react-use-promise'

import GoodIdDetails from './GoodIdDetails'
import { Onboard } from './Onboard'
import { PageLayout } from 'components/Layout/PageLayout'
import { retry } from 'utils/retry'

export const isSupportedCountry = async (supportedCountries = '') => {
    if (!supportedCountries) return false

    const country = await retry(() => fetch('https://get.geojs.io/v1/ip/country.json'), {
        n: 3,
        minWait: 500,
        maxWait: 1500,
    })
        .promise.then((_) => _.json())
        .then((data) => data.country)
        .catch(() => false)

    return supportedCountries?.split(',')?.includes(country)
}

const GoodId = () => {
    const { account = '' } = useEthers()
    const { certificateSubjects, isWhitelisted } = useGoodId(account)
    const [skipSegmentation, setSkipSegmentation] = useState<boolean | undefined>(false)
    const [, payload] = useFeatureFlagWithPayload('goodid')
    const { enabled = false, whitelist = [], countries = '' } = payload ?? {}

    const [isUpgraded] = usePromise(async () => {
        if (isEmpty(certificateSubjects) && isWhitelisted !== undefined) {
            await AsyncStorage.removeItem('goodid_upgraded')
            return false
        }

        return await AsyncStorage.getItem('goodid_upgraded')
    }, [certificateSubjects, isWhitelisted])

    const [isGoodIdEnabled] = usePromise(async () => {
        if (enabled || whitelist?.includes(account)) return true

        return isSupportedCountry(countries)
    }, [enabled, whitelist, countries, account])

    const onExit = useCallback(() => {
        setSkipSegmentation(isUpgraded === true)
    }, [isUpgraded])

    if (isGoodIdEnabled === undefined || isWhitelisted === undefined || isUpgraded === undefined)
        return <Spinner variant="page-loader" size="lg" />

    return (
        <PageLayout faqType="goodid">
            <VStack margin="auto" mt="0" maxW="650">
                {(isWhitelisted && !isEmpty(certificateSubjects) && isUpgraded) ||
                skipSegmentation ||
                !isGoodIdEnabled ? (
                    <GoodIdDetails />
                ) : (
                    <Onboard onExit={onExit} />
                )}
            </VStack>
        </PageLayout>
    )
}

export default GoodId
