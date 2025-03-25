import React, { memo } from 'react'
import { SupportedChains } from '@gooddollar/web3sdk-v2'
import { useFeatureFlagWithPayload } from 'posthog-react-native'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { Link, Text, useBreakpointValue, VStack } from 'native-base'

import { useNetworkModalToggle } from 'state/application/hooks'
import { UniSwap } from './SwapCelo/UniSwap'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import SwapMento from './SwapCore/mentoReserve'
import { PageLayout } from 'components/Layout/PageLayout'
import { getEnv } from 'utils/env'
import { NETWORK_LABEL } from '../../../constants/networks'

const SwapExplanationFooter = () => (
    <VStack space={1} textAlign="center">
        <Text textAlign="center">
            <Text fontFamily="subheading" fontSize="sm" color="goodGrey.600">
                {i18n._(t`Click here to learn more about GoodDollar liquidity, including how to provide liquidity.`)}
            </Text>
            {` `}
            <Link isExternal _text={{ color: 'gdPrimary' }} href="https://docs.gooddollar.org/liquidity">
                {i18n._(t`Learn more`)}
            </Link>
        </Text>
    </VStack>
)

const SwapExplanation = ({ swapWidget }) => {
    if (swapWidget === 'celoReserve') {
        return (
            <VStack space={2} textAlign="center" justifyContent="center" alignItems="center" pb={8}>
                <Text fontFamily="subheading" fontSize="sm" color="goodGrey.600" pt={4} pb={8} textAlign="center">
                    {i18n._(
                        t`Buy or sell GoodDollars using the GoodReserve directly!
The reserve creates new GoodDollars when you buy them and destroys GoodDollars when you sell them back.
You will usually get the best price to buy GoodDollars from the reserve.
Please be patient, loading information may take some time. 
Take note of indicators in the widget below for exit contribtution, price slippage and liquidity.`
                    )}
                </Text>
                <SwapExplanationFooter />
            </VStack>
        )
    }
    if (swapWidget === 'celoUniswap') {
        return (
            <VStack space={2} textAlign="center" justifyContent="center" alignItems="center" pb={8}>
                <Text fontFamily="subheading" fontSize="sm" color="goodGrey.600" pt={4} pb={8} textAlign="center">
                    {i18n._(
                        t`Convert your digital assets using the Uniswap protocol! 
Please be patient, loading information may take some time. 
Take note of indicators in the widget below for price slippage and liquidity.`
                    )}
                </Text>
                <SwapExplanationFooter />
            </VStack>
        )
    }
}
const Swap = memo((props: any) => {
    const swapWidget = props.match.params.widget
    const { chainId } = useActiveWeb3React()
    const isProd = getEnv() === 'production'
    const [, payload] = useFeatureFlagWithPayload('swap-feature')
    const { celoEnabled, reserveEnabled } = (payload as any) || {}
    const toggleNetworkModal = useNetworkModalToggle()

    const containerStyles = useBreakpointValue({
        base: {
            maxWidth: 350,
        },
        sm: {
            maxWidth: '100%',
        },
    })

    const swapComponentMapping = {
        celoReserve: {
            component: <SwapMento />,
            enabled: !isProd || celoEnabled !== false,
            chainId: SupportedChains.CELO,
        },
        celoUniswap: {
            component: <UniSwap />,
            enabled: !isProd || reserveEnabled !== false,
            chainId: SupportedChains.CELO,
        },
    }

    const chainConfig = swapComponentMapping[swapWidget]
    console.log({ props, chainConfig })
    if (!chainConfig) {
        return <></>
    }

    return (
        <PageLayout title="Swap" faqType="swap">
            {(chainId as Number) !== chainConfig.chainId ? (
                <VStack space={2} textAlign="center" justifyContent="center" alignItems="center" pb={8}>
                    <Link
                        fontFamily="subheading"
                        fontSize="sm"
                        isExternal={false}
                        onPress={toggleNetworkModal}
                        _text={{ color: 'gdPrimary' }}
                    >
                        {i18n._(t`Please switch your network to ${NETWORK_LABEL[chainConfig.chainId]} to Swap.`)}
                    </Link>
                </VStack>
            ) : (
                <VStack style={containerStyles}>
                    <SwapExplanation swapWidget={swapWidget} />
                    {chainConfig.enabled ? chainConfig.component : null}
                </VStack>
            )}
        </PageLayout>
    )
})

export default Swap
