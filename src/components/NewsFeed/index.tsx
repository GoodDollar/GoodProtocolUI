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

export const NewsFeedWidget = ({ variant }: { variant?: string }) => {
    const { feed } = useContext(NewsFeedContext)

    return <NewsFeed feed={feed} variant={variant} />
}
