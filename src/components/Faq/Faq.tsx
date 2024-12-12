import React from 'react'
import { Link, Text, VStack } from 'native-base'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { SlideDownTab, useScreenSize } from '@gooddollar/good-design'

import { faqBuyCopy, faqBridgeCopy, faqSwapCopy, faqGoodIDCopy, faqClaimCopy } from './copies'

const faqs = {
    swap: faqSwapCopy,
    buy: faqBuyCopy,
    bridge: faqBridgeCopy,
    goodid: faqGoodIDCopy,
    claim: faqClaimCopy,
}

const FaqItem = ({ id, question, answer, links, AltLink }) => {
    const { isDesktopView } = useScreenSize()

    return (
        <SlideDownTab
            tabTitle={i18n._(t`${question}`)}
            mb={2}
            viewInteraction={{
                hover: {
                    backgroundColor: 'gdPrimary:alpha.10',
                    borderRadius: 6,
                },
            }}
            styles={{
                container: { marginBottom: 8 },
                titleFont: { fontSize: 'sm' },
                button: {
                    marginBottom: 8,
                    borderRadius: 12,
                },
                innerButton: {
                    height: 'auto',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 2,
                },
            }}
        >
            <Text
                pl={isDesktopView ? 2 : 0}
                pr={2}
                w={350}
                fontFamily="subheading"
                fontWeight="normal"
                color="goodGrey.400"
                fontSize="sm"
            >
                {i18n._(t`${answer}`)}
            </Text>
            {links ? (
                <VStack w="100%">
                    {links.map(({ text, href, linkText }) => (
                        <Text
                            key={id}
                            pl={2}
                            width="100%"
                            fontFamily="subheading"
                            fontWeight="normal"
                            color="goodGrey.400"
                            fontSize="sm"
                        >
                            {text}
                            <Link key={id} isExternal href={href} color="main">
                                {i18n._(t` ${linkText}`)}
                            </Link>
                        </Text>
                    ))}
                </VStack>
            ) : null}
            {AltLink ? <AltLink /> : null}
        </SlideDownTab>
    )
}

export const Faq = ({ type }: { type: 'swap' | 'buy' | 'bridge' | 'goodid' | 'claim' }) => {
    const copies = faqs[type]

    return (
        <SlideDownTab
            tabTitle="FAQ"
            viewInteraction={{ hover: { backgroundColor: 'main:alpha.10', borderRadius: 6 } }}
            styles={{
                titleFont: { fontSize: 'l', fontFamily: 'heading', fontWeight: '700', paddingLeft: 2 },
                button: { marginBottom: 25, borderRadius: 12 },
                innerButton: { height: 10 },
                container: { marginTop: 16, marginBottom: 100 },
            }}
        >
            {copies.map(({ id, question, answer, links, AltLink }) => (
                <FaqItem {...{ id, question, answer, links, AltLink }} />
            ))}
        </SlideDownTab>
    )
}
