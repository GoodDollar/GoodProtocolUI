import { ChainId } from '@sushiswap/sdk'

// Centralized wallet and chain configuration
export const WALLET_CONFIG = {
    // Supported chains with their details
    SUPPORTED_CHAINS: {
        [ChainId.MAINNET]: {
            id: ChainId.MAINNET,
            name: 'Ethereum',
            rpcUrl: 'https://mainnet.infura.io/v3/',
            blockExplorer: 'https://etherscan.io',
            nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
            },
        },
        [122]: {
            // FUSE chain ID
            id: 122,
            name: 'Fuse',
            rpcUrl: 'https://rpc.fuse.io',
            blockExplorer: 'https://explorer.fuse.org',
            nativeCurrency: {
                name: 'Fuse Token',
                symbol: 'FUSE',
                decimals: 18,
            },
        },
        [ChainId.CELO]: {
            id: ChainId.CELO,
            name: 'Celo',
            rpcUrl: 'https://forno.celo.org',
            blockExplorer: 'https://explorer.celo.org',
            nativeCurrency: {
                name: 'Celo',
                symbol: 'CELO',
                decimals: 18,
            },
        },
    },

    // Wallet prioritization as per requirements
    WALLET_PRIORITY: {
        walletConnect: ['GoodWallet', 'Valora'],
        social: ['Google'],
        injected: ['MetaMask', 'MiniPay'],
    },

    // Connection timeout settings
    CONNECTION_TIMEOUT: 30000, // 30 seconds

    // Error messages
    ERROR_MESSAGES: {
        UNSUPPORTED_CHAIN: 'Unsupported network. Please switch to Celo, Fuse, or Ethereum.',
        CONNECTION_FAILED: 'Failed to connect wallet. Please try again.',
        TRANSACTION_FAILED: 'Transaction failed. Please check your wallet and try again.',
        INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction.',
    },
} as const

export type SupportedChainId = keyof typeof WALLET_CONFIG.SUPPORTED_CHAINS

export const isSupportedChain = (chainId: number): chainId is SupportedChainId => {
    return chainId in WALLET_CONFIG.SUPPORTED_CHAINS
}

export const getChainConfig = (chainId: number) => {
    return WALLET_CONFIG.SUPPORTED_CHAINS[chainId as SupportedChainId]
}

export const APPKIT_FEATURED_WALLET_IDS = ['gooddollar', 'valora']

export const APPKIT_SOCIAL_PROVIDER_IDS = ['google']
