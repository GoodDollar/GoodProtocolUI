import React, { memo, useMemo, useCallback } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BalanceGD, ClaimButton, ClaimCarousel, IClaimCard, Title, ArrowButton } from '@gooddollar/good-design'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { SupportedChains, useClaim } from '@gooddollar/web3sdk-v2'
import { Text, View, Box } from 'native-base'
import { useClaiming } from 'hooks/useClaiming'
import usePromise from 'hooks/usePromise'
import { g$Price } from '@gooddollar/web3sdk'
import { isToday, format } from 'date-fns'
import { useSetChain } from '@web3-onboard/react'
import { ChainIdHex } from '../../../constants'

const mockedCards: Array<IClaimCard> = [
    {
        title: 'How to claim G$',
        content: [
            { description: 'First time here? Watch this video to learn the basics about GoodDollar:' },
            {
                imageUrl:
                    'https://1.bp.blogspot.com/-t6rZyF0sJvc/YCe0-Xx2euI/AAAAAAAADt8/ZVlJPzwtayoLezt1fKE833GRX-n8_MHWwCLcBGAsYHQ/s400-rw/Screenshot_20210213-113418.png',
            },
        ],
    },
    {
        title: `Claimed 
today? 
Time to use your G$. 👀`,
        content: [
            {
                description: `You can use your GoodDollars to buy products, book services, and use DeFi to better your life and the live of others.`,
            },
            {
                link: {
                    linkText: 'Buy using G$',
                    linkUrl: 'https://goodmarkets.xyz/',
                },
            },
        ],
    },
    {
        title: 'GoodDollar by numbers',
        content: [
            {
                list: [
                    { key: '🪂 Total UBI Distributed', value: '$327.5k' },
                    { key: '💰 Unique UBI Claimers', value: '$475k' },
                    { key: '🚢  Market Capitalization', value: '$876k' },
                ],
            },
        ],
    },
]

const NextClaim = ({ time }: { time: string }) => {
    return (
        <Text fontFamily="subheading" fontWeight="normal" fontSize="xs" color="main">
            Claim cycle restart every day at {time}
        </Text>
    )
}

const ClaimTimer = () => {
    const timer = '21:00:00'
    return (
        <Box height="50" justifyContent="center" flexDirection="column" my="4">
            <Text fontFamily="subheading" fontSize="md" color="main">
                Your next claim
            </Text>
            <Text>{timer}</Text>
        </Box>
    )
}

const Claim = memo(() => {
    const { i18n } = useLingui()
    const { chainId } = useActiveWeb3React()
    const [{ connectedChain }, setChain] = useSetChain()
    const { claimed, handleClaim } = useClaiming()
    const { claimTime } = useClaim('everyBlock')

    const [G$Price] = usePromise(async () => {
        try {
            const data = await g$Price()
            return data.DAI
        } catch {
            return undefined
        }
    }, [chainId])

    const formattedTime = useMemo(
        () => claimed && (isToday(claimTime) ? 'today' : 'tomorrow') + ' ' + format(claimTime, 'hh aaa'),
        [claimed, claimTime]
    )

    const network = useMemo(
        () => (connectedChain && connectedChain.id === '0x7a' ? SupportedChains[42220] : SupportedChains[122]),
        [connectedChain]
    )

    const switchChain = useCallback(() => {
        const chain = ChainIdHex[SupportedChains[network as keyof typeof SupportedChains]]
        void setChain({ chainId: chain })
    }, [setChain])

    return (
        <>
            <div className="flex flex-col items-center justify-center flex-grow w-full mb-8 lg2:flex-row lg:px-10 lg2:px-20 xl:px-40">
                <div className="flex flex-col w-full pt-4 text-center lg:w-1/3 lg:px-4 lg:pt-0">
                    {claimed ? (
                        <View
                            textAlign="center"
                            display="flex"
                            justifyContent="center"
                            flexDirection="column"
                            w="full"
                            mb="4"
                        >
                            <Box
                                backgroundColor="goodWhite.100"
                                borderRadius="15"
                                p="1"
                                w="full"
                                h="34"
                                justifyContent="center"
                            >
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
                    ) : (
                        <>
                            <Title fontFamily="heading" fontSize="2xl" fontWeight="extrabold" pb="2">
                                {i18n._(t`Claim G$`)}
                            </Title>

                            <Text fontFamily="subheading" fontWeight="normal" color="goodGrey.500" fontSize="sm">
                                {i18n._(t`UBI is your fair share of G$ tokens, which you can claim daily on CELO.`)}
                            </Text>
                        </>
                    )}

                    <div className="flex items-center">
                        <ClaimButton firstName="Test" method="redirect" claim={handleClaim} claimed={claimed} />
                    </div>
                </div>
                <div className="lg:flex lg:flex-col lg:w-4/5 lg2:w-2/5 xl:w-80">
                    <ClaimCarousel cards={mockedCards} />
                </div>
            </div>
        </>
    )
})

export default Claim
