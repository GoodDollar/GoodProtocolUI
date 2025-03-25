import React, { useCallback, useEffect, useState } from 'react'
import { View, Box, Text } from 'native-base'
import { ArrowButton, BalanceGD } from '@gooddollar/good-design'
import { SupportedChains, useHasClaimed, useSwitchNetwork } from '@gooddollar/web3sdk-v2'
import { useG$Price } from '@gooddollar/web3sdk-v2'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useClaiming } from 'hooks/useClaiming'
import { useNetworkModalToggle } from 'state/application/hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { QueryParams } from '@usedapp/core'
import { useIsSimpleApp } from 'state/simpleapp/simpleapp'
import { Fraction } from '@uniswap/sdk-core'

const NextClaim = ({ time }: { time: string }) => (
    <Text fontFamily="subheading" fontWeight="normal" fontSize="xs" color="main">
        Claim again {time}
    </Text>
)

export const ClaimBalance = ({ refresh }: { refresh: QueryParams['refresh'] }) => {
    const { chainId } = useActiveWeb3React()
    const rawPrice = useG$Price()
    const G$Price = +new Fraction(rawPrice?.toString() || 0, 1e18).toSignificant(6)

    const { ethereum } = window
    const isMinipay = ethereum?.isMiniPay

    const { tillClaim } = useClaiming()
    const showUsdPrice = true // (useFeatureFlag('show-gd-price') as boolean | undefined)

    const claimedCelo = useHasClaimed('CELO')
    const claimedFuse = useHasClaimed('FUSE')
    const [claimedAlt, setClaimedAlt] = useState(true)
    const toggleNetworkModal = useNetworkModalToggle()

    const { switchNetwork } = useSwitchNetwork()

    // don't show claim on alternative chain for simple mode
    const isSimpleApp = useIsSimpleApp()

    //we select the alternative chain where a user is able to claim their UBI
    const altChain = chainId === (SupportedChains.FUSE as number) ? SupportedChains[42220] : SupportedChains[122]

    // if claimed on alt chain, don't show claim on other chain button
    useEffect(() => {
        chainId === (SupportedChains.FUSE as number)
            ? setClaimedAlt((claimedCelo as unknown as BigNumber)?.isZero())
            : setClaimedAlt((claimedFuse as unknown as BigNumber)?.isZero())
    }, [chainId, claimedFuse, claimedCelo])

    const switchChain = useCallback(() => {
        // 4902: Network is not added, and should be done manually
        // explanation to user is shown through network modal
        switchNetwork(SupportedChains[altChain as keyof typeof SupportedChains]).catch((e: any) => {
            if (e.code === 4902) {
                toggleNetworkModal()
            }
        })
    }, [switchNetwork, altChain, toggleNetworkModal])

    return (
        <View
            textAlign="center"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            w="full"
            mb="4"
        >
            <Box
                backgroundColor="goodWhite.100"
                borderRadius="15"
                mb="24px"
                p="1"
                w="90%"
                h="34"
                justifyContent="center"
                alignItems="center"
            >
                <NextClaim time={tillClaim || ''} />
            </Box>
            <Box alignItems="center" textAlign="center">
                <BalanceGD gdPrice={G$Price} refresh={refresh} showUsd={showUsdPrice} />
            </Box>
            <Box alignItems="center">
                {!isSimpleApp && !isMinipay && !claimedAlt && (
                    <ArrowButton
                        borderWidth="1"
                        borderColor="borderBlue"
                        px="6px"
                        w="220px"
                        text={`Claim on ${altChain}`}
                        onPress={switchChain}
                        innerText={{
                            fontSize: 'sm',
                        }}
                        textInteraction={{ hover: { color: 'white' } }}
                    />
                )}
            </Box>
        </View>
    )
}
