import React, { memo } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BalanceGD, ClaimButton, ClaimCarousel, IClaimCard, Title } from '@gooddollar/good-design'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useG$Balance } from '@gooddollar/web3sdk-v2'
import { Text, useMediaQuery, View } from 'native-base'
import { useClaiming } from 'hooks/useClaiming'
import usePromise from 'hooks/usePromise'
import { g$Price } from '@gooddollar/web3sdk'

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
        title: 'Claimed today? Time to use your G$. 👀',
        content: [
            {
                description: `You can use your GoodDollars
        to buy products, book services, and use DeFi to better your life and the live of others.`,
            },
            {
                link: {
                    linkText: 'Buy using G$',
                    linkUrl: 'https://google.com',
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

const Claim = memo(() => {
    const { i18n } = useLingui()
    const { account, chainId } = useActiveWeb3React()
    const { G$ } = useG$Balance(10)
    const { amount } = G$ || {}
    const { claimed, tillClaim, handleClaim } = useClaiming()
    const [G$Price] = usePromise(async () => {
        try {
            const data = await g$Price()
            return data.DAI
        } catch {
            return undefined
        }
    }, [chainId])

    const [isSmallScreen] = useMediaQuery({
        maxWidth: 975,
    })

    return (
        <>
            {!!tillClaim && (
                <View
                    py="4px"
                    bg="main"
                    position="absolute"
                    top="76px"
                    left={isSmallScreen ? '0' : '268px'}
                    right="0"
                    alignItems="center"
                >
                    <Text fontWeight="600" fontSize="14px" color="white">
                        Your next claim will be in {tillClaim}
                    </Text>
                </View>
            )}
            <div className="flex flex-col flex-grow w-full">
                {claimed ? (
                    amount &&
                    G$Price && (
                        <BalanceGD
                            goodDollarBalance={amount?.format({ suffix: '', prefix: amount.currency.ticker + ' ' })}
                            dollarBalance={G$Price?.multiply(
                                Number(amount?.format({ suffix: '', thousandSeparator: '' }))
                            ).toFixed(2)}
                        />
                    )
                ) : (
                    <>
                        <Title pb="8px">{i18n._(t`Claim UBI`)}</Title>

                        <span>
                            {i18n._(t`UBI is your fair share of G$ tokens, which you can claim daily on CELO.`)}
                        </span>

                        <div className="flex items-center">
                            {account ? (
                                <ClaimButton firstName="Test" method="redirect" claim={handleClaim} />
                            ) : (
                                <Text w="full" textAlign="center" p={40} fontWeight="700" fontSize="23px">
                                    {i18n._(t`CONNECT A WALLET TO CLAIM YOUR GOODDOLLARS`)}
                                </Text>
                            )}
                        </div>
                    </>
                )}

                <ClaimCarousel cards={mockedCards} />
            </div>
        </>
    )
})

export default Claim
