import React, { useContext } from 'react'
import { NewsFeed } from '@gooddollar/good-design'
import { NewsFeedContext } from '@gooddollar/web3sdk-v2'

export const feedConfig = {
    production: {
        feedFilter: {
            context: process.env.REACT_APP_FEEDCONTEXT_PROD,
            tag: 'publishDapp',
        },
    },
}

// todo: add lazy-loader
export const NewsFeedWidget = () => {
    const { feed } = useContext(NewsFeedContext)

    if (!feed) return null

    return <NewsFeed feed={feed} />
}
