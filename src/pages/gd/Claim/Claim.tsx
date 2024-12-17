import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { ClaimProvider, ClaimWizard } from '@gooddollar/good-design'
import { NewsFeedProvider, SupportedChains } from '@gooddollar/web3sdk-v2'
import { noop } from 'lodash'
import { useEthers } from '@usedapp/core'
import { useConnectWallet } from '@web3-onboard/react'
import { Spinner, VStack } from 'native-base'
import { useFeatureFlagWithPayload } from 'posthog-react-native'

import { getNetworkEnv } from 'utils/env'

import { feedConfig } from 'components/NewsFeed'

import { PageLayout } from 'components/Layout/PageLayout'
import { useDisabledClaimingModal } from './useDisabledClaimModal'

const goodIdExplorerUrls = {
    CELO: process.env.REACT_APP_GOODID_CELO_EXPLORER ?? 'https://api.celoscan.io/api?&',
    FUSE: process.env.REACT_APP_GOODID_FUSE_EXPLORER ?? 'https://explorer.fuse.org/api?&',
    MAINNET: process.env.REACT_APP_GOODID_MAINNET_EXPLORER ?? '',
    GOODCOLLECTIVE: process.env.REACT_APP_GOOD_GOODCOLLECTIVE_EXPLORER ?? '',
}

const ClaimPage = () => {
    const { account, chainId } = useEthers()
    const [, connect] = useConnectWallet()
    const history = useHistory()
    const networkEnv = getNetworkEnv()
    const [, claimPayload] = useFeatureFlagWithPayload('claim-feature')
    const [, goodidPayload] = useFeatureFlagWithPayload('goodid')
    const { enabled: claimEnabled, disabledMessage = '' } = (claimPayload as any) || {}
    const { whitelist } = (goodidPayload as any) || {}
    const { Dialog, showModal } = useDisabledClaimingModal(disabledMessage)

    // const { tasks } = nxTasks

    // const onClaimSuccess = useCallback(async () => {
    //     // if (isEmpty(tasks)) {
    //     //     return
    //     // }
    //     // const today = moment().format('YYYY-MM-DD')
    //     // const shownTasksToday = await AsyncStorage.getItem('shownTasksToday')
    //     // if (shownTasksToday === today) {
    //     //     return
    //     // }
    //     // await AsyncStorage.setItem('shownTasksToday', today)
    //     // show a task dialog
    // }, [])

    const handleConnect = useCallback(async () => {
        if (claimEnabled) {
            const state = await connect()

            return !!state.length
        } else {
            showModal()
        }
        return false
    }, [connect, claimEnabled])

    const onUpgrade = () => history.push('/goodid')

    const onNews = () => history.push('/news')

    if (chainId === undefined) return <Spinner variant="page-loader" size="lg" />

    return (
        <PageLayout title="Claim" faqType="claim">
            <Dialog />
            <VStack maxWidth="500" margin="auto" mt={0}>
                <ClaimProvider
                    activePoolAddresses={
                        process.env.REACT_APP_UBIPOOL_ADDRESSES
                            ? JSON.parse(process.env.REACT_APP_UBIPOOL_ADDRESSES)
                            : {}
                    }
                    explorerEndPoints={goodIdExplorerUrls}
                    supportedChains={[SupportedChains.CELO, SupportedChains.FUSE]}
                    onNews={onNews}
                    withNewsFeed
                    onConnect={handleConnect}
                    // onSuccess={onClaimSuccess}
                    onUpgrade={onUpgrade}
                    withSignModals
                >
                    <NewsFeedProvider
                        {...(networkEnv !== 'development'
                            ? { feedFilter: feedConfig.production.feedFilter }
                            : { env: 'qa' })}
                        limit={1}
                    >
                        <ClaimWizard
                            account={account ?? ''}
                            chainId={chainId}
                            onExit={noop}
                            isDev={networkEnv === 'development' || whitelist?.includes(account)}
                            withNavBar={false}
                        />
                    </NewsFeedProvider>
                </ClaimProvider>
            </VStack>
        </PageLayout>
    )
}

export default ClaimPage
