import React, { memo } from 'react'
import { GoodIdDetails as Details } from '@gooddollar/good-design'
import { useEthers } from '@usedapp/core'

const GoodIdDetails = memo(() => {
    const { account } = useEthers()

    return <Details withHeader account={account ?? ''} />
})

export default GoodIdDetails
