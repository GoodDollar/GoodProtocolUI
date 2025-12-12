import React from 'react'
import { useFeatureFlagWithPayload } from 'posthog-react-native'
import { useEthers } from '@usedapp/core'
import { Spinner } from 'native-base'
import usePromise from 'react-use-promise'

import OldClaim from './OldClaim'
import NewClaim from './Claim'
import { isSupportedCountry } from '../GoodId'
import { isMiniPay } from 'utils/minipay'

const Claim = () => {
    const { account, chainId } = useEthers()
    const [, payload] = useFeatureFlagWithPayload('goodid')
    const { enabled = false, whitelist, countries = '' } = payload ?? {}
    const isMiniPayWallet = isMiniPay()

    const [isGoodIdEnabled] = usePromise(async () => {
        if (isMiniPayWallet) return false
        if (enabled || whitelist?.includes(account)) return true

        return isSupportedCountry(countries)
    }, [enabled, whitelist, countries, account, isMiniPayWallet])

    if (payload === undefined || isGoodIdEnabled === undefined) return <Spinner variant="page-loader" size="lg" />

    return isGoodIdEnabled && !isMiniPayWallet && chainId !== 50 ? <NewClaim /> : <OldClaim />
}

export default Claim
