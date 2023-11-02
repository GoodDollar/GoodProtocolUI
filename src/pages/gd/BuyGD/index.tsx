import React, { memo } from 'react'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { Converter, OnramperController, SlideDownTab, Title } from '@gooddollar/good-design'
import { Box, Text } from 'native-base'
import { g$Price } from '@gooddollar/web3sdk'
import usePromise from 'hooks/usePromise'

const BuyGd = memo(() => {
    const [G$Price] = usePromise(
        () =>
            g$Price()
                .then(({ DAI }) => +DAI.toSignificant(6))
                .catch(() => undefined),
        []
    )
    return (
        <Box w="100%" mb="8">
            <Title fontFamily="heading" fontSize="2xl" fontWeight="extrabold" pb="2" textAlign="center">
                {i18n._(t`Buy G$`)}
            </Title>

            <Text mb="6" w={350} fontFamily="subheading" fontWeight="normal" color="goodGrey.500" fontSize="sm">
                {i18n._(
                    t`Support global financial inclusion and contribute to social impact by purchasing GoodDollars (G$).`
                )}
            </Text>
            <Text w={350} fontFamily="subheading" fontWeight="bold" color="goodGrey.500" fontSize="sm" mb={6}>
                {i18n._(
                    t`
                Choose the currency you want to use and buy cUSD. Your cUSD is then automatically converted into G$.`
                )}
            </Text>
            <Box>
                <OnramperController />
            </Box>
            <Box w="100%" mb={6}>
                <SlideDownTab tabTitle="G$ Calculator">
                    <Converter gdPrice={G$Price} />
                </SlideDownTab>
            </Box>
            <Box w="100%" mb={6}>
                <SlideDownTab tabTitle="FAQ">
                    <Text
                        textAlign="center"
                        w={350}
                        fontFamily="subheading"
                        fontWeight="bold"
                        color="goodGrey.500"
                        fontSize="sm"
                        mb={10}
                        mt={4}
                    >
                        {i18n._(t`Why haven't my funds arrived yet?`)}
                    </Text>
                    <Text w={350} fontFamily="subheading" fontWeight="normal" color="goodGrey.400" fontSize="sm">
                        {i18n._(
                            t`The widget in this page is a third-party service provided by Onramper. Please note that the verification of your transaction by Onramper may take up to 24 hours to complete. Following verification, it may take up to 3 business days for GoodDollars to be available in your wallet. In the event that the process takes longer, after receiving a confirmation email from your payment provider, please return to this screen to check the status of your transaction.`
                        )}
                    </Text>
                </SlideDownTab>
            </Box>
        </Box>
    )
})

export default BuyGd
