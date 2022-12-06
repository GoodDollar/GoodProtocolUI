import { useSendAnalytics, IAnalyticsConfig, IAppProps } from '@gooddollar/web3sdk-v2/dist/sdk/analytics'

import { assign, isArray } from 'lodash'
import { useCallback } from 'react'

import { getEnv, osVersion } from 'utils/env'
import { version } from '../../package.json'

export const analyticsConfig: IAnalyticsConfig = {
    google: { enabled: true },
    amplitude: { apiKey: process.env.REACT_APP_AMPLITUDE_KEY, enabled: !!process.env.REACT_APP_AMPLITUDE_KEY },
    indicative: { apiKey: process.env.REACT_APP_INDICATIVE_KEY, enabled: !!process.env.REACT_APP_INDICATIVE_KEY },
}

export const appInfo: IAppProps = {
    env: getEnv(),
    version,
    osVersion,
}

export interface IAnalyticsData {
    event: string
    action: string
    type?: string
    amount?: string | number
    tokens?: [string | undefined, string | undefined]
    network?: string
    token?: string
}

function useSendAnalyticsData(): (data: IAnalyticsData) => void {
    const send = useSendAnalytics()

    return useCallback(
        (data: IAnalyticsData): void => {
            const { event, tokens, ...trackData } = data

            if (isArray(tokens)) {
                assign(trackData, { tokens: [...tokens] })
            }

            send(event, trackData)
        },
        [send]
    )
}

export default useSendAnalyticsData
