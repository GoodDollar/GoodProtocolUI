import { Link, Text } from 'native-base'
import React from 'react'

export type FaqItemCopy = {
    id: string
    question: string
    answer: string
    links?: { text?: string; href: string; linkText: string }[]
    AltLink?: () => React.ReactNode
}

//TODO: revise for XDC
const faqSwapCopy: FaqItemCopy[] = [
    {
        id: 'whatsswap',
        question: `What is a Swap?`,
        answer: `A swap is when you convert one digital asset for another, allowing people to diversify their cryptocurrency holdings. \n\nThe swap on this page happens through decentralized exchanges (DEXs). When you swap, your funds are sent directly to the DEX service (such as Uniswap).`,
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
                href: 'https://celo.blockscout.com/',
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

const faqGoodIDCopy: FaqItemCopy[] = [
    {
        id: 'whatIsGoodID',
        question: `What is GoodID?`,
        answer: `GoodID is currently in its pilot stage, and therefore has limited functionality.\n\nGoodID is a decentralized identification solution (DID). This means that you own your data and credentials, and decide who can “write” new data and credentials, as well as who can “read” your data and credentials. We built GoodID to allow partners an easy access to GoodDollar's community and to distribute campaigns, funds, and other opportunities to members of the GoodDollar protocol.`,
        links: [],
    },
    {
        id: 'whatIsGoodOffers',
        question: `What is GoodOffers?`,
        answer: `GoodOffers are opportunities to earn additional income, available to you based on your GoodID information. Note that you will only see GoodOffers if you said “Yes, I accept” to the screen “You might qualify for extra money disbursements.”`,
        links: [],
    },
    {
        id: 'disputedPartOfGoodID',
        question: `What happens if I’ve disputed part of my GoodID?`,
        answer: `Information you've marked as incorrect will show as "Unverified" on your GoodID.\n\nThis will not affect your ability to claim GoodDollar UBI, but may affect your ability to receive some GoodOffers.`,
        links: [],
    },
    {
        id: 'acceptSkippedOffer',
        question: `Can I accept an offer I’ve skipped in the past?`,
        answer: `When you skip an offer, you can choose to see that offer again. It will show up next time you claim. If you chose to not be shown the offer again, you will need to delete and then redo your Face ID / GoodID upgrade to see the offer again.`,
        links: [],
    },
    {
        id: 'whyNotAllInfoDevice',
        question: `Why don’t I see all my GoodID information on my device?`,
        answer: `You will only see all GoodID upgrade info on the device you used to make the upgrade.\n\nIf you want to use another device or dapp, you can upgrade again on that device. For GoodDapp, this can simply be done by going to the claim page and click the claim button.”`,
        links: [],
    },
    {
        id: 'ageGenderDetermination',
        question: `How are my age and gender determined?`,
        answer: ``,
        AltLink: () => (
            <Text variant="sm-grey-400" lineHeight="20" mt={1}>
                We use
                <Link href="https://docs.aws.amazon.com/rekognition/latest/APIReference/API_Gender.html">
                    <Text textDecorationLine="underline"> Amazon Rekognition </Text>
                </Link>
                to predict your age and gender.
            </Text>
        ),
    },
    {
        id: 'howLocationKnown',
        question: `How do you know my location?`,
        answer: `There are two different ways that we determine location:\n\n- Using your IP address (the location through which you are accessing the internet).\n- (If you sign into GoodWallet via your mobile number) the country code of your phone number.`,
        links: [],
    },
    {
        id: 'unverifiedLocation',
        question: `Why does my location show as Unverified?`,
        answer: `There are a few reasons your location may show as Unverified:\n\n- You did not give device permissions\n- You are using a VPN\n- Due to another error, for example if we could not match your location with a country\n\nIf you would like your location to show in the future, please resolve the issue above and delete then redo your FaceID / GoodID upgrade by using another device or deleting your device or browser’s local storage.`,
        links: [],
    },
    {
        id: 'collectingMyVideo',
        question: `Why are you collecting my video?`,
        answer: `Red Tent’s offers are the first (pilot) offers utilizing GoodID and GoodOffers. As such, we are collecting some information for this short pilot period for the purpose of internal learning & refinement.\n\nYour video may be reviewed by the GoodLabs or partner teams for verification purposes. Your video will not be shared or used publicly, and will be erased after a period of time.`,
        links: [],
    },
]

const faqClaimCopy: FaqItemCopy[] = [
    {
        id: 'howToClaimGUBI',
        question: `How do I claim G$ UBI?`,
        answer: `Open GoodWallet or GoodDapp and click on “Claim”! Your newly claimed G$ will appear in your wallet. A countdown will indicate the time remaining until your next opportunity to claim.`,
        links: [],
    },
    {
        id: 'whyWaitNextClaim',
        question: `Why do I have to wait for my next claim?`,
        answer: `The claiming window resets every day at 12pm UTC. After you claim, you'll need to wait until the same time the following day to claim again. A countdown will indicate the time remaining until your next opportunity to claim.`,
        links: [],
    },
    {
        id: 'howManyGdaily',
        question: `How many G$ do I get every day (24 hours)?`,
        answer: `While G$ is distributed every day, there is no way of knowing in advance how much a GoodDollar claimer will receive on any given day.\n\nThe daily distribution of G$ is determined by the average number of active users over the past 14 days. A fixed amount of G$ is allocated as daily basic income and distributed evenly among claimers. If there are fewer claimers, each individual gets more G$, and if there are more claimers, each gets less. Any unclaimed G$ is rolled over, increasing the following day’s distribution pool.`,
        links: [
            {
                href: 'https://docs.gooddollar.org/protocol-v3-documentation/core-contracts-and-api/ubischeme',
                linkText: 'GoodDollar Documentation',
                text: '',
            },
        ],
    },
    {
        id: 'whichBlockchainsG',
        question: `What blockchains and networks does G$ operate on?`,
        answer: `GoodDollar is deployed on Ethereum, Fuse and Celo.\n\nDaily distribution happens on `,
        links: [],
        AltLink: () => (
            <Text variant="sm-grey-400" lineHeight="20" width="100%" textAlign="left" pl="2">
                <Link href="https://docs.gooddollar.org/frequently-asked-questions/web3-basic-knowledge-and-security-tips-by-consensys#what-are-sidechains">
                    <Text textDecorationLine="underline">sidechains</Text>
                </Link>
                : Celo and Fuse.
            </Text>
        ),
    },
    {
        id: 'useGdInDapps',
        question: `How do I use my G$ in dApps?`,
        answer: `G$ is a standard ERC-20 token deployed on Ethereum, Fuse, and Celo. You can use your G$ in various dApps within these ecosystems. Remember, if you want to use G$ from one chain in another, you will need to bridge them.\n\nFor a list of dApps, please consult the GoodDollar community or ecosystem resources.`,
        links: [],
    },
    {
        id: 'additionalFaqs',
        question: `Additional FAQs`,
        answer: `For more information about GoodDollar and how to use your G$`,
        links: [
            {
                href: 'https://docs.gooddollar.org/frequently-asked-questions/using-gooddollar',
                linkText: 'Please click here.',
            },
        ],
    },
]

const faqReserveCopy: FaqItemCopy[] = [
    {
        id: 'whatsswapreserve',
        question: 'What is a Swap?',
        answer: `A swap is when you convert one digital asset for another, allowing people to diversify their cryptocurrency holdings.\n\nThe swap on this page happens through the GoodDollar Reserve on Celo. The Reserve itself acts as an **Automated Market Maker (AMM)**, meaning it holds and manages liquidity for G$, allowing you to bull or sell G$ directly and permissionlessly.\n\nWhen you buy G$ from the Reserve, you’re not just swapping tokens — you’re helping mint new G$ and strengthening the global UBI economy.`,
    },
    {
        id: 'whereliqfromreserve',
        question: 'Where is the GoodDollar Reserve widget pulling the liquidity from?',
        answer: `The widget pulls liquidity directly from the **GoodDollar Reserve on Celo.**\n\nThe **GoodDollar Reserve** is the **economic engine** at the heart of the GoodDollar Protocol.\n\n**It’s a smart contract on the Celo blockchain** that holds reserve assets and uses them to **mint and redeem G$,** the protocol’s native social currency. The Reserve operates as an **Automated Market Maker (AMM)** — meaning it sets the price of G$ algorithmically based on supply and demand.\n\nWhen someone buys G$ through the Reserve, new G$ tokens are minted. A portion goes to the buyer, and another portion is distributed daily to UBI claimers around the world.`,
    },
    {
        id: 'whichnetworksreserve',
        question: 'Which networks can I swap my G$ on from the Reserve?',
        answer: `The **GoodDollar Reserve is deployed only on the Celo Network.**\n\nSwaps powered by the Reserve are available only **on Celo.**`,
    },
    {
        id: 'trackswapreserve',
        question: 'Can I track the status of my swap?',
        answer: `You can track the status of your swap transaction with your transaction hash and through the blockchain explorer.\n\nTo check transactions on Celo, check the Celo Explorer.`,
        links: [
            {
                href: 'https://celo.blockscout.com/',
                text: 'To check transactions on Celo, check the',
                linkText: 'Celo Explorer',
            },
        ],
    },
    {
        id: 'howbridgefromreserve',
        question: 'How can I bridge my G$ from one network to another?',
        answer: `To bridge is the action of transferring your assets from one network to another. To bridge your G$ between Celo and Fuse, you can use the Microbridge.`,
        links: [
            {
                href: 'https://gooddapp.org/#/microbridge',
                linkText: 'Microbridge',
            },
        ],
    },
    {
        id: 'provideliquidityreserve',
        question: 'How can I provide G$ liquidity?',
        answer: `If you are interested in learning more about GoodDollar liquidity, including how to provide liquidity,\n\n`,
        links: [
            {
                href: 'https://docs.gooddollar.org/liquidity',
                linkText: 'Please click here',
            },
        ],
    },
]

const faqSavingsCopy: FaqItemCopy[] = [
    {
        id: 'howdoesitwork',
        question: `How does the savings work?`,
        answer: `You can stake your G$ tokens in the savings contract to earn rewards. The rewards are distributed from the GoodDollar community fund.`,
    },
    {
        id: 'canunstake',
        question: `Can I unstake at any time?`,
        answer: `Yes, there is no lock-up period. You can unstake your G$ tokens whenever you want.`,
    },
]

export const faqs = {
    swap: faqSwapCopy,
    buy: faqBuyCopy,
    bridge: faqBridgeCopy,
    goodid: faqGoodIDCopy,
    claim: faqClaimCopy,
    reserve: faqReserveCopy,
    savings: faqSavingsCopy,
}
