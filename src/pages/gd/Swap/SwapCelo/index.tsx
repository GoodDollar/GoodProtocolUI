import React, { useCallback } from 'react'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useApplicationTheme } from 'state/application/hooks'
import { darkTheme, lightTheme, SwapWidget, TokenInfo } from '@uniswap/widgets'
import { useConnectWallet } from '@web3-onboard/react'
import { AsyncStorage, getDevice, G$ContractAddresses, useGetEnvChainId } from '@gooddollar/web3sdk-v2'

const jsonRpcUrlMap = {
    122: ['https://rpc.fuse.io', 'https://fuse-rpc.gateway.pokt.network'],
}

const celoTokenList: TokenInfo[] = [
    {
        name: 'Wrapped Ether',
        address: '0x2DEf4285787d58a2f811AF24755A8150622f4361',
        symbol: 'WETH',
        decimals: 18,
        chainId: 42220,
        logoURI:
            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
        extensions: {
            bridgeInfo: {
                '1': {
                    tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                },
            },
        },
    },
    // {
    //     chainId: 42220,
    //     address: '0x471EcE3750Da237f93B8E339c536989b8978a438',
    //     name: 'Celo',
    //     symbol: 'CELO',
    //     decimals: 18,
    //     logoURI: 'https://raw.githubusercontent.com/ubeswap/default-token-list/master/assets/asset_CELO.png',
    // },
]

export const UniSwap = (): JSX.Element => {
    const [theme] = useApplicationTheme()
    const uniTheme = theme === 'dark' ? darkTheme : lightTheme
    const { account, library } = useActiveWeb3React()
    const { connectedEnv } = useGetEnvChainId(42220)
    const gdTokenAddress = G$ContractAddresses('GoodDollar', connectedEnv) as string

    const gdToken = {
        chainId: 42220,
        address: gdTokenAddress,
        name: connectedEnv.includes('production') ? 'GoodDollar' : 'GoodDollar Dev',
        symbol: 'G$',
        decimals: 18,
        logoURI:
            'https://raw.githubusercontent.com/GoodDollar/GOodProtocolUI/master/src/assets/images/tokens/gd-logo.png',
    }
    celoTokenList.push(gdToken)

    const [, connect] = useConnectWallet()

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

    return (
        <div>
            <SwapWidget
                width="550px"
                tokenList={celoTokenList}
                defaultInputTokenAddress={gdTokenAddress}
                jsonRpcUrlMap={jsonRpcUrlMap}
                provider={library}
                theme={uniTheme}
                onConnectWalletClick={connectOnboard}
            />
        </div>
    )
}
