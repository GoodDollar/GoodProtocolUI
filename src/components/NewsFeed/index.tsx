import React, { useContext } from 'react'
import { NewsFeed } from '@gooddollar/good-design'
import { NewsFeedContext, NewsFeedProvider } from '@gooddollar/web3sdk-v2'

import { feedConfig } from 'constants/config'
import { getNetworkEnv } from 'utils/env'

export const NewsFeedWidget = ({ variant, direction = 'row' }: { variant?: string; direction?: 'row' | 'column' }) => {
    const { feed } = useContext(NewsFeedContext)

    return <NewsFeed {...{ feed, variant, direction }} />
}

export const NewsFeedWrapper = ({ children }) => {
    const network = getNetworkEnv()
    const prodOrQa = /\b(production|staging)\b/.test(network)

    return (
        <NewsFeedProvider {...(prodOrQa ? { feedFilter: feedConfig.production.feedFilter } : { env: 'qa' })}>
            {children}
        </NewsFeedProvider>
    )
}
