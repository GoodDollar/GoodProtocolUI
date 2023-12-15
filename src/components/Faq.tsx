import React from 'react'
import { Text } from 'native-base'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { SlideDownTab } from '@gooddollar/good-design'

export const Faq = () => {
    const faqCopy = [
        {
            id: 'whatthis',
            question: i18n._(t`What is this tool?`),
            answer: i18n._(
                `The Buy G$ tool allows you to use your local currency to purchase GoodDollars. You can buy using a variety of methods which vary by your country and jurisdiction. The widget in this page is a third-party service provided by Onramper, which works with a variety of service providers that facilitate purchasing through other channels (such as banks, mobile money providers and credit cards). As such GoodDollar does not have access to any of the information you share while using this tool and cannot offer support with your transaction.`
            ),
        },
        {
            id: 'howwork',
            question: i18n._(t`How does it work?`),
            answer: i18n._(
                `1. In the widget (to the left if you’re on a desktop and above if you’re on a mobile phone), decide the value you’d like to buy and click the button “Buy CUSD.” A Onramp partner will be suggested to you according to your location.

IT IS IMPORTANT TO KEEP THE GOODDAPP WINDOW OPEN FOR THIS ENTIRE PROCESS. Do not close the GoodDapp window until after Step 4 (below).
                
                2.Start and complete the KYC process by following the steps provided by the Onramp partner. You may have to take a picture of your national ID and a selfie. Once you're verified, you'll receive e-mail confirmation from the Onramp partner and be asked to complete the purchase.
                
                3.Complete your payment through the payment provider.
                Once you have confirmation from the payment provider that your funds were successfully purchased, return to the GoodDapp window to trigger the Swap.`
            ),
        },
        {
            id: 'notarrived',
            question: i18n._(t`Why haven’t my funds arrived?`),
            answer: i18n._(
                `Verification of your transaction by Onramper may take up to 24 hours to complete. Following verification, it may take up to 3 business days for GoodDollars to be available in your wallet. In the event that the process takes longer, after receiving a confirmation email from your payment provider, please return to this screen to check the status of your transaction.

                https://docs.onramper.com/docs/support`
            ),
        },
        {
            id: 'txfail',
            question: i18n._(t`Why did my verification or transaction fail?`),
            answer: i18n._(
                `Many sellers, such as Moonpay, require you to provide information on who you are, sometimes including an upload of your ID/passport. In case you do not pass this identity verification, your order will fail.

                Additionally, your payment itself can fail for various reasons. If you’ve paid with a credit card, the most common reasons for failed orders are:
                · you used someone else’s credit card or inputted the wrong billing address
                · your issuing bank declined the credit card authorization
                · your bank does not support crypto-acquisitions
                · incorrect billing info
                If you’ve paid with a bank transfer, the most common reasons for failed orders are:
                · you’ve sent the transfer from someone else’s bank account
                · you haven’t included the reference number provided to you
                · you have sent an incorrect amount
                
                🌎 Some jurisdictions may not support crypto purchases, so your verification or transaction may have failed because of your location.
                
                💳 Some payment types (like pre-paid cards) may not be supported by all of Onramper’s service providers.`
            ),
        },
    ]

    return (
        <SlideDownTab
            tabTitle="FAQ"
            viewInteraction={{ hover: { backgroundColor: 'primary:alpha.10', borderRadius: 6 } }}
            styles={{
                titleFont: { fontSize: 'l' },
                button: { marginBottom: 25, borderRadius: 12 },
            }}
        >
            {faqCopy.map(({ id, question, answer }) => (
                <SlideDownTab
                    key={id}
                    tabTitle={question}
                    innerView={{
                        ...(id === 'txfail' && { paddingTop: 8, paddingBottom: 8 }),
                    }}
                    viewInteraction={{
                        hover: {
                            backgroundColor: 'primary:alpha.10',
                            borderRadius: 6,
                        },
                    }}
                    styles={{
                        titleFont: { fontSize: 'sm' },
                        container: { paddingTop: 8, paddingBottom: 8 },
                        button: {
                            marginBottom: 8,
                            borderRadius: 12,
                        },
                    }}
                >
                    <Text
                        pl={2}
                        pr={2}
                        w={350}
                        fontFamily="subheading"
                        fontWeight="normal"
                        color="goodGrey.400"
                        fontSize="sm"
                        mb={2}
                    >
                        {answer}
                    </Text>
                </SlideDownTab>
            ))}
        </SlideDownTab>
    )
}
