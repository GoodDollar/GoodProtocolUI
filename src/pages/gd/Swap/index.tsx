import React, { memo } from 'react'
import { SupportedChains } from '@gooddollar/web3sdk-v2'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { Link, Text, useBreakpointValue, VStack } from 'native-base'
import { useAppKitNetwork } from '@reown/appkit/react'

import { useNetworkModalToggle } from 'state/application/hooks'
import { UniSwap } from './SwapCelo/UniSwap'
import SwapMento from './SwapCore/mentoReserve'
import { PageLayout } from 'components/Layout/PageLayout'
import { getEnv } from 'utils/env'
import { NETWORK_LABEL } from '../../../constants/networks'
import { useGoodDappFeatures } from 'hooks/useFeaturesEnabled'

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

const ExplanationText = ({ children }) => (
    <Text fontFamily="subheading" fontSize="sm" color="goodGrey.600" textAlign="center">
        {children}
    </Text>
)

const Emphasis = ({ children }) => (
    <Text fontFamily="subheading" fontSize="sm" color="goodGrey.700" fontWeight="600">
        {children}
    </Text>
)

const SwapExplanation = ({ swapWidget, chainId }) => {
    if (swapWidget === 'goodReserve') {
        return (
            <VStack space={2} textAlign="center" justifyContent="center" alignItems="center" pb={8}>
                <VStack pt={4} pb={8}>
                    <ExplanationText>
                        {i18n._(t`Buy or sell `)}

                        {` `}
                        <Emphasis>{i18n._(t`GoodDollars on ${SupportedChains[chainId as number]}`)} </Emphasis>
                        {i18n._(t`using the GoodDollar Reserve.`)}
                    </ExplanationText>

                    <ExplanationText>
                        {i18n._(
                            t`The reserve creates new GoodDollars when you buy them and destroys GoodDollars when you sell them back.`
                        )}
                    </ExplanationText>
                    <ExplanationText>
                        {i18n._(t`You will usually get the best buy price from the reserve.`)}
                    </ExplanationText>
                    <ExplanationText>
                        {i18n._(t`Please be patient. Loading information may take some time.`)}
                    </ExplanationText>
                    <ExplanationText>
                        {i18n._(t`Take note of indicators in the widget below for price, slippage, and liquidity.`)}
                    </ExplanationText>
                </VStack>
                <SwapExplanationFooter />
            </VStack>
        )
    }
    if (swapWidget === 'celoUniswap') {
        return (
            <VStack space={2} textAlign="center" justifyContent="center" alignItems="center" pb={8}>
                <VStack space={1} pt={4} pb={8}>
                    <ExplanationText>
                        {i18n._(t`Convert your digital assets using the Uniswap protocol.`)}
                    </ExplanationText>
                    <ExplanationText>
                        {i18n._(t`Please be patient. Loading information may take some time.`)}
                    </ExplanationText>
                    <ExplanationText>{i18n._(t`Watch these indicators in the widget below:`)}</ExplanationText>
                    <ExplanationText>
                        <Emphasis>{i18n._(t`Price slippage`)}</Emphasis>
                        {i18n._(t`: how much your execution price can move.`)}
                    </ExplanationText>
                    <ExplanationText>
                        <Emphasis>{i18n._(t`Liquidity`)}</Emphasis>
                        {i18n._(t`: available depth for your trade size.`)}
                    </ExplanationText>
                </VStack>
                <SwapExplanationFooter />
            </VStack>
        )
    }
}
const Swap = memo((props: any) => {
    const swapWidget = props.match.params.widget
    const { chainId } = useAppKitNetwork()
    const isProd = getEnv() === 'production'
    const toggleNetworkModal = useNetworkModalToggle()
    const { activeChainFeatures } = useGoodDappFeatures()
    const reserveEnabled = activeChainFeatures['reserveEnabled']
    const dexSwapEnabled = activeChainFeatures['dexSwapEnabled']

    const faqType = swapWidget === 'celoUniswap' ? 'swap' : 'reserve'

    const containerStyles = useBreakpointValue({
        base: {
            maxWidth: 350,
        },
        sm: {
            maxWidth: '100%',
        },
    })

    const swapComponentMapping = {
        goodReserve: {
            component: <SwapMento />,
            enabled: !isProd || reserveEnabled,
            chainId: [SupportedChains.CELO, SupportedChains.XDC],
        },
        celoUniswap: {
            component: <UniSwap />,
            enabled: !isProd || dexSwapEnabled,
            chainId: [SupportedChains.CELO],
        },
    }

    const chainConfig = swapComponentMapping[swapWidget]
    if (!chainConfig) {
        return <></>
    }

    return (
        <PageLayout title={`Swap on ${SupportedChains[chainId as number]}`} faqType={faqType}>
            {chainConfig.chainId.includes(chainId) === false ? (
                <VStack space={2} textAlign="center" justifyContent="center" alignItems="center" pb={8}>
                    <Link
                        fontFamily="subheading"
                        fontSize="sm"
                        isExternal={false}
                        onPress={toggleNetworkModal}
                        _text={{ color: 'gdPrimary' }}
                    >
                        {i18n._(
                            t`Please switch your network to ${chainConfig.chainId
                                .map((_) => NETWORK_LABEL[_])
                                .join(' or ')} to Swap.`
                        )}
                    </Link>
                </VStack>
            ) : (
                <VStack style={containerStyles}>
                    <SwapExplanation swapWidget={swapWidget} chainId={chainId} />
                    {chainConfig.enabled ? chainConfig.component : null}
                </VStack>
            )}
        </PageLayout>
    )
})

export default Swap
