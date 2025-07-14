import React, { useCallback } from 'react'

import {
    darkTheme,
    lightTheme,
    OnTxFail,
    OnTxSubmit,
    OnTxSuccess,
    RouterPreference,
    SwapWidget,
} from '@uniswap/widgets'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useConnectWallet } from '@web3-onboard/react'
import {
    AsyncStorage,
    getDevice,
    G$ContractAddresses,
    useGetEnvChainId,
    useWeb3Context,
    SupportedChains,
} from '@gooddollar/web3sdk-v2'
import { useDispatch } from 'react-redux'
import { addTransaction } from 'state/transactions/actions'
import { ChainId } from '@sushiswap/sdk'
import { isMobile } from 'react-device-detect'
import { Center, Text, Button } from 'native-base'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useApplicationTheme } from 'state/application/hooks'
import useSendAnalytics from 'hooks/useSendAnalyticsData'
import { tokens } from './celo-tokenlist.json'

// Error Boundary Component for Uniswap Widget
interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

class SwapWidgetErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('SwapWidget Error Boundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        padding: '20px',
                        textAlign: 'center',
                        border: '1px solid #ff6b6b',
                        borderRadius: '8px',
                        backgroundColor: '#fff5f5',
                        margin: '10px 0',
                    }}
                >
                    <Text fontSize="lg" color="red.500" mb={3}>
                        Swap Widget Error
                    </Text>
                    <Text fontSize="md" color="gray.600" mb={4}>
                        The swap widget encountered an error. This might be due to extreme price impact or insufficient
                        liquidity.
                    </Text>
                    <Button
                        colorScheme="blue"
                        size="sm"
                        onPress={() => this.setState({ hasError: false, error: null })}
                    >
                        Try Again
                    </Button>
                </div>
            )
        }

        return this.props.children
    }
}

const jsonRpcUrlMap = {
    122: ['https://rpc.fuse.io', 'https://fuse-pokt.nodies.app', 'https://fuse.liquify.com'],
    42220: [
        // 'https://forno.celo.org', // forno is causing gas issues with uniswap
        'https://forno.celo.org',
    ],
}

export const UniSwap = (): JSX.Element => {
    const [theme] = useApplicationTheme()
    const uniTheme = theme === 'dark' ? darkTheme : lightTheme
    const { web3Provider } = useWeb3Context()
    const { account, chainId } = useActiveWeb3React()
    const network = SupportedChains[chainId]
    const [, connect] = useConnectWallet()
    const globalDispatch = useDispatch()
    const sendData = useSendAnalytics()
    const { connectedEnv } = useGetEnvChainId(42220)

    const cusdTokenAddress = '0x765DE816845861e75A25fCA122bb6898B8B1282a'
    const gdTokenAddress = G$ContractAddresses('GoodDollar', connectedEnv) as string

    const customTheme = {
        ...uniTheme,
        primary: '#404040',
        fontFamily: 'Roboto',
        accent: '#00AEFF',
        outline: '#00AFFF',
        active: '#00AFFF',
        accentSoft: '#00AEFF',
        networkDefaultShadow: 'hsl(199deg 100% 50% / 20%)',
    }

    const tokenSymbols = {
        [gdTokenAddress]: 'G$',
    }

    const gdToken = {
        chainId: 42220,
        address: gdTokenAddress,
        name: connectedEnv.includes('production') ? 'GoodDollar' : 'GoodDollar Dev',
        symbol: 'G$',
        decimals: 18,
        logoURI:
            'https://raw.githubusercontent.com/GoodDollar/GoodProtocolUI/master/src/assets/images/tokens/gd-logo.png',
    }

    tokens.push(gdToken)

    const connectOnboard = useCallback(async () => {
        if (!account) {
            // todo: make connect onboard a generic function/merge with: useOnboardConnect
            const osName = getDevice().os.name
            // temp solution for where it tries and open a deeplink for desktop app
            if (['Linux', 'Windows', 'macOS'].includes(osName)) {
                AsyncStorage.safeRemove('WALLETCONNECT_DEEPLINK_CHOICE')
            }

            const connected = await connect()
            if (!connected) {
                return false
            }
        }
        return true
    }, [connect])

    const handleError = useCallback(
        async (e) => {
            console.error('Uniswap widget error:', e)

            // Check for division by zero or extreme price impact errors
            const errorMessage = e.message || e.toString()
            const isDivisionByZero =
                errorMessage.includes('division by zero') ||
                errorMessage.includes('Infinity') ||
                errorMessage.includes('NaN')

            const isPriceImpactError = errorMessage.includes('price impact') || errorMessage.includes('impact')

            if (isDivisionByZero || isPriceImpactError) {
                // Show user-friendly message for extreme price impact scenarios
                const userFriendlyError = {
                    message:
                        'This trade has an extremely high price impact (100% or more). This usually means insufficient liquidity for this trade amount. Please try a smaller amount or check if the tokens have enough liquidity.',
                    type: 'price_impact_error',
                }

                sendData({
                    event: 'swap',
                    action: 'swap_failed',
                    error: userFriendlyError.message,
                })

                // You could also show a toast notification here if you have a toast system
                console.warn('Extreme price impact detected:', userFriendlyError.message)
            } else {
                // Handle other errors normally
                sendData({ event: 'swap', action: 'swap_failed', error: errorMessage })
            }
        },
        [sendData]
    )

    const handleTxFailed: OnTxFail = useCallback(async (error: string, data: any) => {
        console.log('handleTxFailed -->', { error, data })
    }, [])

    const handleTxSubmit: OnTxSubmit = useCallback(
        async (txHash: string, data: any) => {
            const { info } = data
            switch (info.type) {
                //approve
                case 0: {
                    const { tokenAddress } = info
                    const symbol = tokenSymbols[tokenAddress]
                    const summary = symbol ? `Approved spending of ${symbol}` : 'Approved spending'
                    const type = symbol ? 'sell' : 'buy'
                    sendData({ event: 'swap', action: 'swap_approve', type, network })
                    globalDispatch(
                        addTransaction({
                            chainId: 42220 as ChainId,
                            hash: txHash,
                            from: account!,
                            summary,
                        })
                    )
                    break
                }
                // swap
                case 1: {
                    const { trade } = info
                    const { input, output } = trade.routes[0]
                    const {
                        inputAmount,
                        outputAmount,
                    }: { inputAmount: CurrencyAmount<Currency>; outputAmount: CurrencyAmount<Currency> } =
                        trade.swaps[0]
                    const tradeInfo = {
                        input: {
                            decimals: input.decimals,
                            symbol: input.symbol,
                        },
                        output: {
                            decimals: output.decimals,
                            symbol: output.symbol,
                        },
                    }
                    const swappedAmount = inputAmount.toSignificant(6)
                    const receivedAmount = outputAmount.toSignificant(6)
                    const summary = `Swapped ${swappedAmount} ${input.symbol} to ${receivedAmount} ${output.symbol}`
                    const type = input.symbol === 'G$' ? 'sell' : 'buy'

                    sendData({
                        event: 'swap',
                        action: 'swap_confirm',
                        amount: type === 'buy' ? receivedAmount : swappedAmount,
                        tokens: [input.symbol, output.symbol],
                        type,
                        network,
                    })

                    globalDispatch(
                        addTransaction({
                            chainId: 42220 as ChainId,
                            hash: txHash,
                            from: account!,
                            summary: summary,
                            tradeInfo: tradeInfo,
                        })
                    )
                    break
                }
            }
        },
        [account, network]
    )

    const handleTxSuccess: OnTxSuccess = useCallback(
        async (txHash: string, data: any) => {
            const { inputAmount } = data.info.trade.swaps[0]
            const type = inputAmount.currency.symbol === 'G$' ? 'sell' : 'buy'
            sendData({ event: 'swap', action: 'swap_success', type, network })
        },
        [network]
    )

    const { ethereum } = window

    const isMinipay = ethereum?.isMiniPay

    return (
        <Center w={'auto'} maxW="550" alignSelf="center">
            <SwapWidgetErrorBoundary>
                <SwapWidget
                    width={'auto'}
                    tokenList={tokens}
                    defaultInputTokenAddress={cusdTokenAddress}
                    defaultOutputTokenAddress={gdTokenAddress}
                    settings={{
                        slippage: { auto: false, max: '0.3' },
                        routerPreference: RouterPreference.API,
                        transactionTtl: 30,
                    }}
                    permit2={!isMinipay} // disable for minipay?
                    jsonRpcUrlMap={jsonRpcUrlMap}
                    routerUrl={'https://api.uniswap.org/v1/'}
                    provider={web3Provider}
                    theme={customTheme}
                    hideConnectionUI
                    onConnectWalletClick={connectOnboard}
                    onError={handleError}
                    onTxFail={handleTxFailed}
                    onTxSubmit={handleTxSubmit}
                    onTxSuccess={handleTxSuccess}
                    dialogOptions={{ pageCentered: !!isMobile }}
                />
            </SwapWidgetErrorBoundary>
        </Center>
    )
}
