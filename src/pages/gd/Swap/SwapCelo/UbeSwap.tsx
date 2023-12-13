import { Web3Provider } from '@ethersproject/providers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useEffect, useState } from 'react'
import { useApplicationTheme } from 'state/application/hooks'
import Swap from 'ubeswap-swap-dev'
import { useConnectWallet } from '@web3-onboard/react'
import { G$ContractAddresses, useGetEnvChainId } from '@gooddollar/web3sdk-v2'

interface AccountInfo {
    account: string
    explorerUrl: string
    chainId: number
    provider: Web3Provider
}

export const UbeSwap = (): JSX.Element => {
    const [theme] = useApplicationTheme()
    const { account, library } = useActiveWeb3React()
    const { connectedEnv } = useGetEnvChainId(42220)
    const gdToken = G$ContractAddresses('GoodDollar', connectedEnv)
    const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>(undefined)
    const [, connect] = useConnectWallet()

    useEffect(() => {
        if (account && library) {
            setAccountInfo({
                account: account,
                explorerUrl: import.meta.env.REACT_APP_CELO_RPC ?? 'https://forno.celo.org',
                chainId: 42220,
                provider: library,
            })
        }
    }, [account, library])

    return (
        <div
            className="flex flex-col items-center justify-center w-full h-5/6 rounded-3xl"
            style={{
                padding: '50px 5px',
            }}
        >
            <Swap
                onConnectWallet={connect}
                accountInfo={accountInfo}
                theme={{
                    fontFamily: 'Roboto',
                    primaryColor: '#00b0ff',
                    userDarkMode: theme === 'dark',
                }}
                defaultSwapToken={{
                    address: gdToken as unknown as string,
                    name: 'GoodDollar',
                    symbol: 'G$',
                    chainId: 42220,
                    decimals: 18,
                    logoURI:
                        'https://raw.githubusercontent.com/GoodDollar/GOodProtocolUI/master/src/assets/images/tokens/gd-logo.png',
                }}
            />
            <span className="flex flex-row items-center justify-center w-full h-2 mt-1 italic font-bold text-gray-400">
                Powered by UbeSwap
            </span>
        </div>
    )
}
