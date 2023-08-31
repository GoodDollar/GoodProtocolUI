import React, { memo, useCallback } from 'react'
import { GoodIdModal } from '@gooddollar/good-design'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useHistory } from 'react-router-dom'

const GoodId = memo(() => {
    const { account } = useActiveWeb3React()
    const history = useHistory()

    const navigateToClaim = useCallback(() => {
        history.push('/claim')
    }, [history])

    return <GoodIdModal onClose={navigateToClaim} account={account ?? ''} />
})

export default GoodId
