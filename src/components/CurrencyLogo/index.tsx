import { ChainId, Currency, ETHER, Token } from '@sushiswap/sdk'
import React, { useMemo } from 'react'
import { getTokens } from '@gooddollar/web3sdk'
import usePromise from 'hooks/usePromise'
import { useAppKitNetwork } from '@reown/appkit/react'

import styled from 'styled-components'
import XdcLogo from '../../assets/images/xdc-logo.svg'
import CeloLogo from '../../assets/images/celo-logo.png'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import FuseLogo from '../../assets/images/fuse-logo.png'
import { AdditionalChainId, FUSE, CELO, XDC } from '../../constants'
import { getFuseTokenLogoURL } from '../../constants/fuseTokenMapping'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from 'types/WrappedTokenInfo'
import Logo from '../Logo'

export const getTokenLogoURL = (address: string, chainId: any) => {
    let imageURL
    if (chainId === ChainId.MAINNET) {
        imageURL = getFuseTokenLogoURL(address) //defaults to trustwallet logos
    } else if (chainId === ChainId.BSC) {
        imageURL = `https://v1exchange.pancakeswap.finance/images/coins/${address}.png`
    } else if (chainId === AdditionalChainId.FUSE) {
        imageURL = getFuseTokenLogoURL(address)
    } else {
        imageURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
    }
    return imageURL
}

const StyledNativeCurrencyLogo = styled.img<{ size: string }>`
    width: ${({ size }) => size};
    height: ${({ size }) => size};
`

const StyledLogo = styled(Logo)<{ size: string }>`
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    // border-radius: ${({ size }) => size};
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
    border-radius: 50%;
    // background-color: ${({ theme }) => theme.white};
`

const logo: { readonly [chainId in ChainId | AdditionalChainId]?: string } = {
    [ChainId.MAINNET]: EthereumLogo,
    [AdditionalChainId.XDC]: XdcLogo,
    [AdditionalChainId.FUSE]: FuseLogo,
    [AdditionalChainId.CELO]: CeloLogo,
}

export default function CurrencyLogo({
    currency,
    size = '24px',
    style,
}: {
    currency?: Currency
    size?: string
    style?: React.CSSProperties
}) {
    const { chainId } = useAppKitNetwork()
    const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
    const [tokenList] = usePromise<[Map<string, Currency>, Map<string, string>]>(() => getTokens(chainId) as any) // solve uniswap/sushiswap type issue

    const srcs: string[] = useMemo(() => {
        if (currency === ETHER) return []

        if (tokenList?.[1] && tokenList?.[1].has(currency?.symbol || '')) {
            return [tokenList[1].get(currency?.symbol || '')]
        }
        if (currency instanceof Token) {
            if (currency instanceof WrappedTokenInfo) {
                return [...uriLocations, getTokenLogoURL(currency.address, chainId)]
            }

            return [getTokenLogoURL(currency.address, chainId)]
        }
        return []
    }, [chainId, currency, uriLocations, tokenList])

    if ((currency === ETHER || currency === FUSE || currency === CELO || currency === XDC) && chainId) {
        return <StyledNativeCurrencyLogo src={logo[chainId] ?? logo[ChainId.MAINNET]} size={size} style={style} />
    }

    return (
        <StyledLogo
            size={size}
            srcs={srcs}
            alt={`${currency?.getSymbol(+(chainId ?? 1)) ?? 'token'} logo`}
            style={style}
        />
    )
}
