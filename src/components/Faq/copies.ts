type FaqItemCopy = {
    id: string
    question: string
    answer: string
    links?: { text?: string; href: string; linkText: string }[]
}

const faqSwapCopy: FaqItemCopy[] = [
    {
        id: 'whatsswap',
        question: `What is a Swap?`,
        answer: `A swap is when you convert one digital asset for another, allowing people to diversify their cryptocurrency holdings. \n\nThe swap on this page happens through decentralized exchanges (DEXs). When you swap, your funds are sent directly to the DEX service (Voltage on Fuse Network or Uniswap on Celo Network).`,
    },
    {
        id: 'whereliqfrom',
        question: `Where is the GoodDapp widget pulling the liquidity from?`,
        answer: `The GoodDapp Swap widget seamlessly integrates with Fuse's Voltage Finance DEX and Celo's Uniswap DEX, allowing you to swap your assets.`,
    },
    {
        id: 'whatarefees',
        question: `What are the fees for swapping?`,
        answer: `The fee structure is based on factors such as transaction volume and network fees. You can view the applicable fees before confirming you transactions. \n\n GoodDapp does not charge extra fees.`,
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
        answer: `If you are interested in learning more about GoodDollar liquidity, including how to provide liquidity, \n`,
        links: [
            {
                href: 'https://docs.gooddollar.org/liquidity',
                linkText: 'Please click here',
            },
        ],
    },
]

const faqBridgeCopy: FaqItemCopy[] = [
    {
        id: 'whatismicrobridge',
        question: `What is the MicroBridge?`,
        answer: `A bridge is a tool built to transfer assets from one network to another. It’s also a verb, used to describe that action: “I bridged my G$ from Fuse to Celo.” \n\nGoodDollar operates across Ethereum, Celo and Fuse networks, and G$ tokens can be bridged across those networks. \n\nThanks to the MicroBridge you can easily move G$ on Fuse to G$ on Celo and vice versa. Other GoodDollar bridges are visible on`,
        links: [
            {
                href: 'http://gooddapp.org',
                linkText: 'Gooddapp.org',
            },
        ],
    },
    {
        id: 'whocanuse',
        question: `Who can use it?`,
        answer: `Anyone can use the MicroBridge, but there are a few requirements to ensure a smooth transfer of your G$ tokens:\n\n1. Wallet Compatibility: Verify that your wallet is compatible with both the Fuse and Celo networks. Sending G$ to incompatible wallets will result in the loss of funds.\n\n2. Fees and Gas: Using the MicroBridge requires G$ tokens for fees and native tokens to cover gas fees on these networks. Make sure you have sufficient balances. See below “What are the fees for using the MicroBridge?” for more details.\n\n3. Transaction Limits: You may bridge up to 5M G$ per transaction, with a daily limit of 30M G$ per wallet.`,
    },
    {
        id: 'howdoesitwork',
        question: `How does it work?`,
        answer: `The MicroBridge is a combination of 2 smart contracts: one deployed on each chain that allows for cross-chain transfers of value. Your funds are sent to one contract which burns them on the source chain and mints them on the destination chain.`,
    },
    {
        id: 'whatfeesmicrobridge',
        question: `What are the fees for using the MicroBridge?`,
        answer: `The fee for using the MicroBridge is 0.15% per transaction (minimum 10 G$, maximum 1M G$), which covers operation of the MicroBridge node. All MicroBridge transactions incur gas fees in the native network tokens (Fuse or Celo).\n\nIf you choose to Self-Relay to expedite your transaction, 50% of the MicroBridge fee will be refunded. However please note that Self-Relaying will cause you to incur additional gas fees.`,
    },
    {
        id: 'whatarethelimits',
        question: `What are the limits?`,
        answer: `You may bridge up to 5M G$ per transaction, with a daily limit of 30M G$ per wallet.`,
    },
    {
        id: 'trackbridge',
        question: `Can I track the status of my bridge transaction?`,
        answer: `The MicroBridge interface provides information about your bridge transaction in “Recent Transactions.”`,
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

export { faqBuyCopy, faqBridgeCopy, faqSwapCopy }
