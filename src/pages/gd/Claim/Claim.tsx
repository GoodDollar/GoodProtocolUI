import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { ClaimProvider, ClaimWizard } from '@gooddollar/good-design'
import { noop } from 'lodash'
import { useAppKit } from '@reown/appkit/react'
import { useConnectionInfo } from 'hooks/useConnectionInfo'
import { Spinner, VStack } from 'native-base'
import { useFeatureFlagWithPayload } from 'posthog-react-native'

import { getEnv, getNetworkEnv } from 'utils/env'

import { feedConfig } from 'constants/config'

import { PageLayout } from 'components/Layout/PageLayout'
import { useDisabledClaimingModal } from './useDisabledClaimModal'

const goodIdExplorerUrls = {
    CELO:
        process.env.REACT_APP_GOODID_CELO_EXPLORER ??
        `https://api.etherscan.io/v2/api?chainid=42220&apikey=${process.env.REACT_APP_ETHERSCAN_KEY}&`,
    FUSE: process.env.REACT_APP_GOODID_FUSE_EXPLORER ?? 'https://explorer.fuse.org/api?&',
    MAINNET: process.env.REACT_APP_GOODID_MAINNET_EXPLORER ?? '',
    // Using XDC BlocksScan API as it's the official XDC network explorer
    // Previously used etherscan.io API which doesn't support XDC network properly
    XDC: process.env.REACT_APP_GOODID_XDC_EXPLORER ?? 'https://xdc.blocksscan.io/api?&',
}

const ClaimPage = () => {
    const { address: account, chainId } = useConnectionInfo()
    const { open } = useAppKit()
    const history = useHistory()
    const networkEnv = getNetworkEnv()
    const env = getEnv()
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
            await open({ view: 'Connect' })
            return true
        } else {
            showModal()
        }
        return false
    }, [open, claimEnabled])

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
                    onNews={onNews}
                    withNewsFeed
                    newsProps={{ env, feedFilter: env === 'production' ? feedConfig.production.feedFilter : undefined }}
                    onConnect={handleConnect}
                    // onSuccess={onClaimSuccess}
                    onUpgrade={onUpgrade}
                    withSignModals
                >
                    <ClaimWizard
                        account={account ?? ''}
                        chainId={+(chainId ?? 1)}
                        onExit={noop}
                        isDev={networkEnv === 'development' || whitelist?.includes(account)}
                        withNavBar={false}
                    />
                </ClaimProvider>
            </VStack>
        </PageLayout>
    )
}

export default ClaimPage
