import React, { useContext } from 'react'
import { NewsFeed } from '@gooddollar/good-design'
import { NewsFeedContext, NewsFeedProvider } from '@gooddollar/web3sdk-v2'

import { feedConfig } from 'constants/config'
import { getEnv } from 'utils/env'

export const NewsFeedWidget = ({ variant, direction = 'row' }: { variant?: string; direction?: 'row' | 'column' }) => {
    const { feed } = useContext(NewsFeedContext)

    return <NewsFeed {...{ feed, variant, direction }} />
}

export const NewsFeedWrapper = ({ children }) => {
    const env = getEnv()
    const prod = /production/.test(env)

    return (
        <NewsFeedProvider {...{ feedFilter: prod ? feedConfig.production.feedFilter : undefined, env }}>
            {children}
        </NewsFeedProvider>
    )
}
