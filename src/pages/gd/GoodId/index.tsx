import React, { memo } from 'react'
import { GoodIdModal } from '@gooddollar/good-design'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const GoodId = memo(() => {
    const { account } = useActiveWeb3React()

    return <GoodIdModal account={account ?? ''} />
})

export default GoodId
