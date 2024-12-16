import React from 'react'
import { useFeatureFlagWithPayload } from 'posthog-react-native'
import { useEthers } from '@usedapp/core'

import OldClaim from './OldClaim'
import NewClaim from './Claim'

const Claim = () => {
    const { account } = useEthers()
    const [, payload] = useFeatureFlagWithPayload('goodid')
    const { enabled = false, whitelist } = payload ?? {}
    //todo: add country check, but not required for initial UAT

    return <>{(!enabled && whitelist?.includes(account)) || true ? <NewClaim /> : <OldClaim />}</>
}

export default Claim
