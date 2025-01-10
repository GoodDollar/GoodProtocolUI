import React, { useEffect, useState } from 'react'
import { useFeatureFlagWithPayload } from 'posthog-react-native'
import { useEthers } from '@usedapp/core'

import OldClaim from './OldClaim'
import NewClaim from './Claim'
import { Spinner } from 'native-base'

const Claim = () => {
    const { account } = useEthers()
    const [, payload] = useFeatureFlagWithPayload('goodid')
    const { enabled = false, whitelist } = payload ?? {}
    const [goodIdEnabled, setGoodIdEnabled] = useState<boolean | undefined>(false)
    //todo: add country check, but not required for initial UAT

    useEffect(() => {
        if (enabled || whitelist?.includes(account)) {
            setGoodIdEnabled(true)
        }
    }, [whitelist, enabled, account])

    if (payload === undefined) return <Spinner variant="page-loader" size="lg" />

    return goodIdEnabled ? <NewClaim /> : <OldClaim />
}

export default Claim
