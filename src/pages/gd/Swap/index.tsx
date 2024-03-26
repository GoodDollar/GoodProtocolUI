import React, { memo } from 'react'
import { SupportedChains, useGetEnvChainId } from '@gooddollar/web3sdk-v2'
import { usePostHog } from 'posthog-react-native'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { Box, HStack, Link, Text, useBreakpointValue, VStack } from 'native-base'
import { CentreBox, Title } from '@gooddollar/good-design'

import { useNetworkModalToggle } from 'state/application/hooks'
import { UniSwap } from './SwapCelo/UniSwap'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import SwapCore from './SwapCore'
import { Faq } from 'components/Faq/Faq'

const Swap = memo(() => {
    const { chainId } = useActiveWeb3React()
    const { connectedEnv } = useGetEnvChainId(chainId)
    const isProd = connectedEnv.includes('production')
    const postHog = usePostHog()
    const payload = postHog?.getFeatureFlagPayload('swap-feature')
    const { fuseEnabled, celoEnabled, reserveEnabled } = (payload as any) || {}
    const toggleNetworkModal = useNetworkModalToggle()

    //todo: make container component
    const mainView = useBreakpointValue({
        base: {
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

    const leftContainer = useBreakpointValue({
        lg: {
            width: '50%',
            paddingRight: 24,
            alignItems: 'stretch',
            borderRightWidth: 1,
            flexGrow: 1,
            justifyContent: 'flex-start',
            textAlign: 'center',
        },
    })

    const rightContainer = useBreakpointValue({
        lg: {
            paddingLeft: 24,
            paddingTop: 48,
            width: 375,
        },
    })

    const sideTabs = useBreakpointValue({
        base: {
            alignItems: 'center',
        },
        lg: {
            alignItems: 'flex-start',
        },
    })

    const swapComponentMapping = {
        [SupportedChains.FUSE]: { component: <SwapCore />, enabled: !isProd || (isProd && fuseEnabled) },
        [SupportedChains.MAINNET]: { component: <SwapCore />, enabled: isProd && reserveEnabled },
        [SupportedChains.CELO]: { component: <UniSwap />, enabled: !isProd || (isProd && celoEnabled) },
    }

    const chainConfig = swapComponentMapping[chainId as any]

    if (!chainConfig) {
        return <></>
    }

    return (
        <Box w="100%" mb="8" style={mainView}>
            <CentreBox borderColor="borderGrey" style={leftContainer}>
                <Title fontFamily="heading" fontSize="2xl" fontWeight="extrabold" pb="2" textAlign="center">
                    {i18n._(t`Swap`)}
                </Title>
                {(chainId as Number) === SupportedChains.MAINNET ? (
                    <VStack space={2} textAlign="center" justifyContent="center" alignItems="center" pb={8}>
                        <Text fontFamily="subheading" fontSize="sm" color="goodGrey.600">
                            {i18n._(t`GoodDapp currently does not support Swap on Ethereum.`)}
                        </Text>
                        <Link isExternal={false} onPress={toggleNetworkModal} _text={{ color: 'primary' }}>
                            {i18n._(t`Please switch your network to Fuse or Celo to Swap.`)}
                        </Link>
                        <HStack space={1}>
                            <Text>{i18n._(t`Click here to learn how to switch your network.`)}</Text>
                            <Link isExternal _text={{ color: 'primary' }} href="https://docs.gooddollar.org/liquidity">
                                {i18n._(t`Learn more`)}
                            </Link>
                        </HStack>
                    </VStack>
                ) : (
                    <VStack space={2} textAlign="center" justifyContent="center" alignItems="center" pb={8}>
                        <Text
                            fontFamily="subheading"
                            fontSize="sm"
                            color="goodGrey.600"
                            pt={4}
                            pb={8}
                            textAlign="center"
                        >
                            {i18n._(
                                t`Please be patient, loading information in the Swap widget may take some time. Thanks for waiting!`
                            )}
                        </Text>
                    </VStack>
                )}
                {chainConfig.enabled ? chainConfig.component : null}
            </CentreBox>
            <CentreBox w="100%" justifyContent="flex-start" style={rightContainer}>
                <Box w="100%" mb={2} style={sideTabs}>
                    <Faq type="swap" />
                </Box>
            </CentreBox>
        </Box>
    )
})

export default Swap
