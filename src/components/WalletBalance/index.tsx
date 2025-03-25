import React, { memo, useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { Fragment } from 'react'
import { noop } from 'lodash'
import { LoadingPlaceHolder } from 'theme/components'
import { AsyncStorage, G$Balances, useG$Balance, useG$Tokens } from '@gooddollar/web3sdk-v2'
import { Box, Text, useColorModeValue } from 'native-base'
import { BasePressable, CentreBox } from '@gooddollar/good-design'
import { isMobile } from 'react-device-detect'

import usePromise from 'hooks/usePromise'
import { getScreenWidth } from 'utils/screenSizes'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { AdditionalChainId } from '../../constants'
import useMetaMask from 'hooks/useMetaMask'

//assets
import { ReactComponent as WalletBalanceIcon } from '../../assets/images/walletBalanceIcon.svg'
import { ReactComponent as MetaMaskIcon } from '../../assets/svg/mm-icon.svg'
import { ReactComponent as DoubleBars } from '../../assets/svg/double-bars.svg'

export type WalletBalanceProps = {
    balances: G$Balances
    chainId: ChainId
}

const chains = Object.values(AdditionalChainId)

export const WalletBalanceWrapper = ({ toggleView }: { toggleView: typeof noop }) => {
    const { ethereum } = window
    const { chainId } = useActiveWeb3React()
    const metaMaskInfo = useMetaMask()
    const balances = useG$Balance(5)
    const [G$, GOOD] = useG$Tokens()
    const bgWalletBalance = useColorModeValue('goodWhite.100', '#1a1f38')
    const textColor = useColorModeValue('goodGrey.700', 'goodGrey.300')
    const [imported, setImported] = useState<boolean>(false)
    const { i18n } = useLingui()
    const scrWidth = getScreenWidth()
    const isMinipay = ethereum?.isMiniPay

    const importToMetamask = async () => {
        const allTokens: any[] = [
            {
                type: 'ERC20',
                options: {
                    address: G$.address,
                    symbol: G$.ticker,
                    decimals: G$.decimals,
                    image: 'https://raw.githubusercontent.com/GoodDollar/GoodProtocolUI/master/src/assets/images/tokens/gd-logo.png',
                },
            },
            {
                type: 'ERC20',
                options: {
                    address: GOOD.address,
                    symbol: GOOD.ticker,
                    decimals: GOOD.decimals,
                    image: 'https://raw.githubusercontent.com/GoodDollar/GoodProtocolUI/master/src/assets/images/tokens/good-logo.png',
                },
            },
        ]

        // if (!SupportedV2Networks[chainId] && balances.GDX)
        //     allTokens.push({
        //         type: 'ERC20',
        //         options: {
        //             address: GDX.address,
        //             symbol: GDX.ticker,
        //             decimals: GDX.decimals,
        //             image: 'https://raw.githubusercontent.com/GoodDollar/GoodProtocolUI/master/src/assets/images/tokens/gdx-logo.png',
        //         },
        //     })

        void Promise.all(
            allTokens.map(async (token) => {
                // todo: fix multiple requests bug after succesfully adding all assets.
                //IE. wallet_watchAsset auto triggered when switching chain
                metaMaskInfo.isMultiple
                    ? ethereum?.selectedProvider?.request &&
                      (await ethereum.selectedProvider.request({
                          method: 'wallet_watchAsset',
                          params: token,
                      }))
                    : ethereum?.request &&
                      (await ethereum.request({
                          method: 'wallet_watchAsset',
                          params: token,
                      }))
            })
        ).then(async () => {
            setImported(true)
            await AsyncStorage.setItem(`${chainId}_metamask_import_status`, true)
        })
    }

    const [loading] = usePromise(async () => {
        const imported = await AsyncStorage.getItem(`${chainId}_metamask_import_status`)
        setImported(imported)
        return imported
    }, [chainId])

    return (
        <Box
            px={4}
            paddingBottom={2}
            paddingTop={30}
            w={isMobile ? scrWidth : 375}
            position="absolute"
            right={0}
            top={isMinipay ? 25 : 4}
            bg={bgWalletBalance}
            borderRadius="12px"
            borderBottomLeftRadius={12}
            borderBottomRightRadius={12}
            borderTopRightRadius={0}
            borderTopLeftRadius={0}
            shadow={1}
        >
            <Box
                display="flex"
                flexDir="row"
                alignItems="flex-start"
                justifyContent="flex-start"
                px={2}
                pt={4}
                pb={2}
                bgColor="white"
                borderTopLeftRadius={12}
                borderTopRightRadius={12}
            >
                <WalletBalanceIcon fill="#00AFFF" />
                <Text ml={2} fontFamily="subheading" fontSize="sm" fontWeight="500" color={textColor}>
                    {i18n._(t`Wallet balance`)}
                </Text>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                pl={2}
                pb={2}
                bgColor="white"
                borderBottomLeftRadius={12}
                borderBottomRightRadius={12}
            >
                <WalletBalance balances={balances} chainId={chainId} />
                {/* todo: retest this flow */}
                {!loading && !imported && !isMinipay && (
                    <Box flexDir="row" mt={4}>
                        <MetaMaskIcon />
                        <Text pl={2} fontFamily="subheading" fontSize="xs" onPress={importToMetamask} color="gdPrimary">
                            Import to Metamask
                        </Text>
                    </Box>
                )}
            </Box>
            <Box alignItems="center" paddingTop={2}>
                <BasePressable width="100%" alignItems="center" onPress={toggleView}>
                    <DoubleBars />
                </BasePressable>
            </Box>
        </Box>
    )
}

export const WalletBalance = memo(({ balances, chainId }: WalletBalanceProps): JSX.Element | null => {
    const textColor = useColorModeValue('goodGrey.700', 'goodGrey.300')

    return (
        <div className="flex flex-col">
            {balances &&
                Object.entries(balances).map((balance) => {
                    const ticker = balance[0]
                    const amount = balance[1]

                    if (balance[0] === 'GDX' && chains.includes(chainId as any)) {
                        return <div key={ticker}></div>
                    }
                    return (
                        <Fragment key={ticker}>
                            <span className="flex">
                                {!amount ? (
                                    <LoadingPlaceHolder />
                                ) : (
                                    <CentreBox flexDir="row" justifyContent="space-between" width="100%" pr={2}>
                                        <Text fontFamily="subheading" fontSize="sm" color={textColor}>
                                            {' '}
                                            {amount?.currency?.ticker}
                                        </Text>
                                        <Text fontFamily="subheading" color={textColor} fontSize="sm">
                                            {amount?.format({
                                                useFixedPrecision: true,
                                                suffix: '',
                                                prefix: amount.currency?.ticker + ' ',
                                            })}
                                        </Text>
                                    </CentreBox>
                                )}
                            </span>
                        </Fragment>
                    )
                })}
        </div>
    )
})

export default WalletBalanceWrapper
