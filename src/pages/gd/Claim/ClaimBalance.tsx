import React, { useMemo, useCallback } from 'react'
import { View, Box, Text } from 'native-base'
import { ArrowButton, BalanceGD } from '@gooddollar/good-design'
import { useSetChain } from '@web3-onboard/react'
import { SupportedChains } from '@gooddollar/web3sdk-v2'
import { ChainIdHex } from '../../../constants'
import { useClaim } from '@gooddollar/web3sdk-v2'
import usePromise from 'hooks/usePromise'
import { g$Price } from '@gooddollar/web3sdk'
import { isToday, format } from 'date-fns'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useClaiming } from 'hooks/useClaiming'

const NextClaim = ({ time }: { time: string }) => (
    <Text fontFamily="subheading" fontWeight="normal" fontSize="xs" color="main">
        Claim cycle restart every day at {time}
    </Text>
)

const ClaimTimer = () => {
    const { tillClaim } = useClaiming()

    return (
        <Box height="50" justifyContent="center" flexDirection="column" my="4">
            <Text fontFamily="subheading" fontSize="md" color="main">
                Your next claim
            </Text>
            <Text>{tillClaim}</Text>
        </Box>
    )
}

export const ClaimBalance = () => {
    const { claimTime } = useClaim('everyBlock')
    const { chainId } = useActiveWeb3React()
    const [G$Price] = usePromise(() => g$Price().then(({ DAI }) => DAI).catch(noop), [chainId])

    const formattedTime = useMemo(
        () => (isToday(claimTime) ? 'today' : 'tomorrow') + ' ' + format(claimTime, 'hh aaa'),
        [claimTime]
    )
    const [{ connectedChain }, setChain] = useSetChain()

    const network = useMemo(
        () => (connectedChain && connectedChain.id === '0x7a' ? SupportedChains[42220] : SupportedChains[122]),
        [connectedChain]
    )

    const switchChain = useCallback(() => {
        const chainId = ChainIdHex[SupportedChains[network as keyof typeof SupportedChains]]
        
        setChain({ chainId })
    }, [setChain])

    return (
        <View textAlign="center" display="flex" justifyContent="center" flexDirection="column" w="full" mb="4">
            <Box backgroundColor="goodWhite.100" borderRadius="15" p="1" w="full" h="34" justifyContent="center">
                <NextClaim time={formattedTime || ''} />
            </Box>

            <ClaimTimer />
            <Box borderWidth="1" borderColor="borderGrey" width="90%" alignSelf="center" my="2" />
            <Box>
                <BalanceGD gdPrice={G$Price} />
            </Box>
            <Box alignItems="center">
                <ArrowButton
                    borderWidth="1"
                    borderColor="borderBlue"
                    px="6px"
                    width="200"
                    text={`Claim on ${network}`}
                    onPress={switchChain}
                    innerText={{
                        fontSize: 'sm',
                    }}
                />
            </Box>
        </View>
    )
}