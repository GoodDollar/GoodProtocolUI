import React, { memo } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ClaimButton, ClaimCarousel, IClaimCard, Title } from '@gooddollar/good-design'
import { Text } from 'native-base'
import { useClaiming } from 'hooks/useClaiming'
import { ClaimBalance } from './ClaimBalance'

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

const Claim = memo(() => {
    const { i18n } = useLingui()
    const { claimed, handleClaim } = useClaiming()

    return (
        <>
            <div className="flex flex-col items-center justify-center flex-grow w-full mb-8 lg2:flex-row lg:px-10 lg2:px-20 xl:px-40">
                <div className="flex flex-col w-full pt-4 text-center lg:w-1/3 lg:px-4 lg:pt-0">
                    {claimed ? (
                        <ClaimBalance />
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
