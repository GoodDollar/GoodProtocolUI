type FaqItemCopy = {
    id: string
    question: string
    answer: string
    links?: { text?: string; href: string; linkText: string }[]
}

const faqSwapCopy: FaqItemCopy[] = [
    {
        id: 'whereliqfrom',
        question: `Where is the GoodDapp widget pulling the liquidity from?`,
        answer: `The GoodDapp Swap widget seamlessly integrates with Fuse's Voltage Finance DEX and Celo's Uniswap DEX, allowing you to swap your assets.`,
    },
    {
        id: 'whatarefees',
        question: `What are the fees for swapping?`,
        answer: `The GoodDapp Swap widget seamlessly integrates with Fuse's Voltage Finance DEX and Celo's Uniswap DEX, allowing you to swap your assets.`,
    },
    {
        id: 'whichnetworks',
        question: `Which networks can I swap my G$ on?`,
        answer: `You can currently swap your G$ on Fuse and Celo.`,
    },
    {
        id: 'trackswapstatus',
        question: `Can I track the status of my swap?`,
        answer: `You can track the status of your swap transaction with your transaction hash and through the blockchain explorer.`,
        links: [
            {
                href: 'https://explorer.celo.org/',
                text: 'To check transactions on Celo, check the',
                linkText: 'Celo Explorer',
            },
            {
                href: 'https://explorer.fuse.io/',
                text: 'To check transactions on Fuse, check the',
                linkText: 'Fuse Explorer',
            },
        ],
    },
    {
        id: 'howtobridge',
        question: `How can I bridge my G$ from one network to another?`,
        answer: `To bridge is the action of transferring your assets from one network to another. To bridge your G$ between Celo and Fuse, you can use the microbridge in the GoodWallet.`,
        links: [
            {
                href: 'https://wallet.gooddollar.org/',
                linkText: 'GoodWallet',
            },
        ],
    },
    {
        id: 'howtobuy',
        question: `How can I buy G$?`,
        answer: `You can purchase G$ on Celo from any network and supported token via`,
        links: [
            {
                href: 'https://app.squidrouter.com/',
                linkText: 'SquidRouter',
            },
        ],
    },
    {
        id: 'howtoprovideliquidity',
        question: `How can I provide G$ liquidity?`,
        answer: `If you are interested in learning more about GoodDollar liquidity, including how to provide liquidity, please click here`,
        //todo: add links for docs + squidrouter
    },
]

const faqBuyCopy: FaqItemCopy[] = [
    {
        id: 'whatthis',
        question: `What is this tool?`,
        answer: `The Buy G$ tool allows you to use your local currency to purchase GoodDollars. You can buy using a variety of methods which vary by your country and jurisdiction. The widget in this page is a third-party service provided by Onramper, which works with a variety of service providers that facilitate purchasing through other channels (such as banks, mobile money providers and credit cards). As such GoodDollar does not have access to any of the information you share while using this tool and cannot offer support with your transaction.`,
    },
    {
        id: 'howwork',
        question: `How does it work?`,
        answer: `1. In the widget (to the left if you’re on a desktop and above if you’re on a mobile phone), decide the value you’d like to buy and click the button “Buy CUSD.” A Onramp partner will be suggested to you according to your location.
IT IS IMPORTANT TO KEEP THE GOODDAPP WINDOW OPEN FOR THIS ENTIRE PROCESS. Do not close the GoodDapp window until after Step 4 (below).

2.Start and complete the KYC process by following the steps provided by the Onramp partner. You may have to take a picture of your national ID and a selfie. Once you're verified, you'll receive e-mail confirmation from the Onramp partner and be asked to complete the purchase.

3.Complete your payment through the payment provider.
Once you have confirmation from the payment provider that your funds were successfully purchased, return to the GoodDapp window to trigger the Swap.`,
    },
    {
        id: 'notarrived',
        question: `Why haven’t my funds arrived?`,
        answer: `Verification of your transaction by Onramper may take up to 24 hours to complete. Following verification, it may take up to 3 business days for GoodDollars to be available in your wallet. In the event that the process takes longer, after receiving a confirmation email from your payment provider, please return to this screen to check the status of your transaction.

            https://docs.onramper.com/docs/support`,
    },
    {
        id: 'txfail',
        question: `Why did my verification or transaction fail?`,
        answer: `Many sellers, such as Moonpay, require you to provide information on who you are, sometimes including an upload of your ID/passport. In case you do not pass this identity verification, your order will fail.

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

💳 Some payment types (like pre-paid cards) may not be supported by all of Onramper’s service providers.`,
    },
]

export { faqBuyCopy, faqSwapCopy }
