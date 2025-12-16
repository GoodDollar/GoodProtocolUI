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
import { useAppKit } from '@reown/appkit/react'
import { G$ContractAddresses, useGetEnvChainId, useWeb3Context, SupportedChains } from '@gooddollar/web3sdk-v2'
import { useDispatch } from 'react-redux'
import { addTransaction } from 'state/transactions/actions'
import { ChainId } from '@sushiswap/sdk'
import { isMobile } from 'react-device-detect'
import { Center } from 'native-base'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { getSafeChainId } from 'utils/chain'

import { useApplicationTheme } from 'state/application/hooks'
import useSendAnalytics from 'hooks/useSendAnalyticsData'
import { tokens } from './celo-tokenlist.json'
import { isMiniPay } from 'utils/minipay'

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
    const { address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const network = SupportedChains[getSafeChainId(chainId)]
    const { open } = useAppKit()
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
        if (!address) {
            await open({ view: 'Connect' })
        }
        return true
    }, [address, open])

    // Propagates swap errors to analytics; UI errors are already handled by the Uniswap widget
    const handleError = useCallback(
        async (e) => {
            sendData({ event: 'swap', action: 'swap_failed', error: e?.message ?? String(e) })
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
                            from: address!,
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
                            from: address!,
                            summary: summary,
                            tradeInfo: tradeInfo,
                        })
                    )
                    break
                }
            }
        },
        [address, network]
    )

    const handleTxSuccess: OnTxSuccess = useCallback(
        async (txHash: string, data: any) => {
            const { inputAmount } = data.info.trade.swaps[0]
            const type = inputAmount.currency.symbol === 'G$' ? 'sell' : 'buy'
            sendData({ event: 'swap', action: 'swap_success', type, network })
        },
        [network]
    )

    const isMinipay = isMiniPay()

    return (
        <Center w={'auto'} maxW="550" alignSelf="center">
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
        </Center>
    )
}
