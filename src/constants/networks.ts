import { ChainId } from '@sushiswap/sdk'
import Mainnet from '../assets/networks/mainnet-network.jpg'
import Fuse from '../assets/networks/fuse-network.png'
import Celo from '../assets/networks/celo-network.png'
import XDC from '../assets/networks/xdc-network.svg'
import { AdditionalChainId } from './index'

export const NETWORK_ICON = {
    [ChainId.MAINNET]: Mainnet,
    [AdditionalChainId.FUSE]: Fuse,
    [AdditionalChainId.CELO]: Celo,
    [AdditionalChainId.XDC]: XDC,
}

export const NETWORK_LABEL: { [chainId in ChainId | AdditionalChainId]?: string } = {
    [ChainId.MAINNET]: 'Ethereum',
    [AdditionalChainId.FUSE]: 'FUSE',
    [AdditionalChainId.CELO]: 'CELO',
    [AdditionalChainId.XDC]: 'XDC',
}
