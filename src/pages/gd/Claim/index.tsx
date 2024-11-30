import React from 'react'
import { useFeatureFlagWithPayload } from 'posthog-react-native'
import { useEthers } from '@usedapp/core'

import OldClaim from './OldClaim'
import NewClaim from './Claim'

const Claim = () => {
    const { account } = useEthers()
    const [, payload] = useFeatureFlagWithPayload('goodid-claim')
    const { enabled = true, whitelist } = payload ?? {}

    return <>{whitelist?.includes(account) || enabled || true ? <NewClaim /> : <OldClaim />}</>
}

export default Claim
