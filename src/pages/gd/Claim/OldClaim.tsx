import React, { memo, useCallback, useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
    CentreBox,
    ClaimButton,
    ClaimCarousel,
    IClaimCard,
    Image,
    Title,
    useScreenSize,
    ClaimSuccessModal,
} from '@gooddollar/good-design'
import { Box, Center, Text, useBreakpointValue } from 'native-base'
import { useConnectWallet } from '@web3-onboard/react'
import {
    useClaim,
    SupportedV2Networks,
    useContractFunctionWithDefaultGasFees,
    submitReferral,
    AsyncStorage,
} from '@gooddollar/web3sdk-v2'
import { QueryParams } from '@usedapp/core'
import { noop } from 'lodash'
import { useFeatureFlagWithPayload } from 'posthog-react-native'
import moment from 'moment'

import ClaimFooterCelebration from 'assets/images/claim/claim-footer-celebration.png'
import { ClaimBalance } from './ClaimBalance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import useSendAnalyticsData from 'hooks/useSendAnalyticsData'
import { NewsFeedWidget, NewsFeedWrapper } from '../../../components/NewsFeed'

import BillyHappy from 'assets/images/claim/billysmile.png'
import BillyGrin from 'assets/images/claim/billygrin.png'
import BillyConfused from 'assets/images/claim/billyconfused.png'

import { useIsSimpleApp } from 'state/simpleapp/simpleapp'

import { useDisabledClaimingModal } from './useDisabledClaimModal'

const OldClaim = memo(() => {
    const { i18n } = useLingui()
    const [refreshRate, setRefreshRate] = useState<QueryParams['refresh']>(12)
    const claimDetails = useClaim(refreshRate)
    const { claimAmount } = claimDetails
    const { resetState, state, send } = useContractFunctionWithDefaultGasFees(claimDetails.contract, 'claim', {
        transactionName: 'Claimed UBI',
    })

    const [claimed, setClaimed] = useState<boolean | undefined>(undefined)
    const [, connect] = useConnectWallet()
    const { chainId } = useActiveWeb3React()
    const network = SupportedV2Networks[chainId]
    const sendData = useSendAnalyticsData()
    const [, payload] = useFeatureFlagWithPayload('claim-feature')
    const { enabled: claimEnabled = true, disabledMessage = '' } = (payload as any) || {}
    const { isSmallTabletView } = useScreenSize()
    const holiday = moment().format('MM-DD')
    const isHoliday = holiday >= '12-24' || holiday <= '01-01'

    const isSimpleApp = useIsSimpleApp()
    const { Dialog, showModal } = useDisabledClaimingModal(disabledMessage)

    const { ethereum } = window
    const isMinipay = ethereum?.isMiniPay

    // there are three possible scenarios
    // 1. claim amount is 0, meaning user has claimed that day
    // 2. status === success, meaning user has just claimed. Could happen that claimAmount has not been updated right after tx confirmation
    // 3. If neither is true, there is a claim ready for user or its a new user and FV will be triggered instead
    useEffect(() => {
        const hasClaimed = async () => {
            if (state.status === 'Mining') {
                // don't do anything until transaction is mined
                return
            }

            if (claimAmount?.isZero()) {
                setClaimed(true)
                setRefreshRate(12)
                resetState()
                return
            } else if (state.status === 'Success') {
                setClaimed(true)
                return
            }

            setClaimed(false)
            setRefreshRate('everyBlock')
        }
        if (claimAmount) hasClaimed().catch(noop)
        // eslint-disable-next-line react-hooks-addons/no-unused-deps, react-hooks/exhaustive-deps
    }, [claimAmount, chainId, refreshRate])

    // upon switching chain we want temporarily to poll everyBlock up untill we have the latest data
    useEffect(() => {
        setClaimed(undefined)
        setRefreshRate('everyBlock')
    }, [/* used */ chainId])

    const handleEvents = useCallback(
        (event: string) => {
            switch (event) {
                case 'switch_start':
                    sendData({ event: 'claim', action: 'network_switch_start', network })
                    break
                case 'switch_succes':
                    sendData({ event: 'claim', action: 'network_switch_success', network })
                    break
                case 'action_start':
                    sendData({ event: 'claim', action: 'claim_start', network })
                    break
                case 'finish':
                    // finish event does not handle rejected case
                    // sendData({ event: 'claim', action: 'claim_success', network })
                    break
                default:
                    sendData({ event: 'claim', action: event, network })
                    break
            }
        },
        [sendData, network]
    )

    const handleClaim = useCallback(async () => {
        setRefreshRate('everyBlock')
        if (claimEnabled || isMinipay) {
            // minipay doesnt handle gasPrice correctly, so we let it decide
            const claim = await send(isMinipay ? { gasPrice: undefined } : {})

            if (!claim) {
                return false
            }

            const isDivviDone = await AsyncStorage.getItem('GD_divvi')

            if (!isDivviDone && chainId === 42220) {
                await submitReferral({ txHash: claim.transactionHash, chainId }).then(async () => {
                    await AsyncStorage.setItem('GD_divvi', 'true')
                })
            }

            sendData({ event: 'claim', action: 'claim_success', network })
            return true
        } else {
            showModal()
        }

        return false
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [send, network, sendData, claimEnabled, isSimpleApp])

    const handleConnect = useCallback(async () => {
        if (claimEnabled) {
            const state = await connect()

            return !!state.length
        } else {
            showModal()
        }
        return false
    }, [connect, claimEnabled])

    const mainView = useBreakpointValue({
        base: {
            gap: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            width: '100%',
            mb: 2,
        },
        lg: {
            flexDirection: 'row',
            justifyContent: 'justify-evenly',
        },
    })

    const claimView = useBreakpointValue({
        base: {
            display: 'flex',
            alignItems: 'center',
            paddingTop: '2.5rem',
            width: '100%',
        },
        lg: {
            width: '50%',
        },
        xl: {
            width: '60%',
        },
        '2xl': {
            paddingRight: 24,
            alignItems: 'center',
            flexGrow: 1,
        },
    })

    const carrouselStyles = useBreakpointValue({
        base: {
            width: '100%',
            alignSelf: 'flex-start',
            marginLeft: 0,
            flexGrow: 1,
        },
        lg: {
            flex: 1,
            flexDirection: 'column',
            width: '100%',
            flexGrow: 1,
            alignSelf: 'flex-start',
            justifyContent: 'flex-start',
        },
        '2xl': {
            flex: 1,
            flexDirection: 'column',
            width: '100%',
            flexGrow: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-start',
        },
    })

    const newsFeedView = useBreakpointValue({
        base: {
            width: '100%',
            marginTop: 16,
        },
        lg: {
            paddingLeft: 24,
            width: 375,
            justifyContent: 'flex-start',
        },
    })

    const balanceContainer = useBreakpointValue({
        base: {
            display: 'flex',
            alignItems: 'center',
            width: '369px',
        },
    })

    const mockedCards: Array<IClaimCard> = [
        {
            id: 'how-does-work',
            title: {
                text: 'How does it work?',
                color: 'gdPrimary',
            },
            content: [
                {
                    subTitle: {
                        text: 'Free money, no catch, all thanks to technology.',
                        color: 'goodGrey.500',
                    },
                    description: {
                        text: 'Learn more about how the GoodDollar protocol works here.',
                        color: 'goodGrey.500',
                    },
                    ...(isSmallTabletView && { imgSrc: BillyConfused }),
                },
            ],
            externalLink: 'https://www.notion.so/gooddollar/GoodDollar-Protocol-2cc5c26cf09d40469e4570ad1d983914',
            bgColor: 'goodWhite.100',
            hide: claimed,
        },
        {
            id: 'already-claimed',
            title: {
                text: `Use your G$. 🙂`,
                color: 'white',
            },
            content: [
                {
                    description: {
                        text: `After claiming your G$, use it to support your community, buy products and services, support causes you care about, vote in the GoodDAO, and more. 
                      
Learn how here`,
                        color: 'white',
                    },
                    ...(isSmallTabletView && { imgSrc: BillyHappy }),
                },
            ],
            externalLink: 'https://www.notion.so/gooddollar/Use-G-8639553aa7214590a70afec91a7d9e73',
            bgColor: 'gdPrimary',
        },
        {
            id: 'how-to-collect',
            title: {
                text: 'How to collect G$',
                color: 'gdPrimary',
            },
            content: [
                {
                    subTitle: {
                        text: 'First time here?',
                        color: 'goodGrey.500',
                    },
                    description: {
                        text: 'Anyone in the world can collect G$. Create a wallet to get started.',
                        color: 'goodGrey.500',
                    },
                    ...(isSmallTabletView && { imgSrc: BillyGrin }),
                },
            ],
            externalLink: 'https://www.notion.so/Get-G-873391f31aee4a18ab5ad7fb7467acb3',
            bgColor: 'goodWhite.100',
            hide: claimed,
        },
    ]

    return (
        <>
            <Box w="100%" mb="8" style={mainView}>
                <Dialog />
                <CentreBox style={claimView}>
                    <div className="flex flex-col items-center text-center lg:w-1/2">
                        <Box style={balanceContainer}>
                            {claimed ? (
                                <Box justifyContent="center" display="flex" alignItems="center" textAlign="center">
                                    <ClaimBalance refresh={refreshRate} />
                                    <ClaimSuccessModal open={state?.status === 'Success'} />
                                </Box>
                            ) : (
                                <>
                                    <Title fontFamily="heading" fontSize="2xl" fontWeight="extrabold" pb="2">
                                        {i18n._(t`Collect G$`)}
                                    </Title>

                                    <Text
                                        w="340px"
                                        fontFamily="subheading"
                                        fontWeight="normal"
                                        color="goodGrey.500"
                                        fontSize="sm"
                                    >
                                        {i18n._(
                                            t`GoodDollar creates free money as a public good, G$ tokens, which you can collect daily.`
                                        )}
                                    </Text>
                                    <ClaimButton
                                        firstName="Test"
                                        method="redirect"
                                        claim={handleClaim}
                                        claimed={claimed}
                                        claiming={state}
                                        handleConnect={handleConnect}
                                        chainId={chainId}
                                        onEvent={handleEvents}
                                    />
                                    {isHoliday ? (
                                        <Center maxW="390" width="100%" mb={8}>
                                            <Image
                                                source={ClaimFooterCelebration as any}
                                                w="100%"
                                                h={isHoliday ? 190 : 140}
                                                style={{ resizeMode: isHoliday ? 'cover' : 'contain' }}
                                            />
                                        </Center>
                                    ) : null}
                                </>
                            )}
                        </Box>
                    </div>
                    <CentreBox style={carrouselStyles}>
                        <ClaimCarousel cards={mockedCards} claimed={claimed} isMobile={isSmallTabletView} />
                    </CentreBox>
                </CentreBox>
                <CentreBox style={newsFeedView}>
                    <NewsFeedWrapper>
                        <NewsFeedWidget direction="column" />
                    </NewsFeedWrapper>
                </CentreBox>
            </Box>
        </>
    )
})

export default OldClaim
