import { Token } from '@sushiswap/sdk'
import { ethers } from 'ethers'
import { useMemo } from 'react'
import { useAppKitNetwork } from '@reown/appkit/react'

export const useReserveToken = () => {
    const { chainId } = useAppKitNetwork()
    const result = useMemo(() => {
        const cusdAddresses: Record<number, string> = {
            42220: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
            122: '0x28ea52f3ee46CaC5a72f72e8B3A387C0291d586d',
            50: '0x5eE1b0F7FbAd2D10E00a0E0773D45840f73C5A1C',
        }
        const numericChainId = typeof chainId === 'number' ? chainId : typeof chainId === 'string' ? Number.parseInt(chainId, 10) : 42220
        const address = cusdAddresses[numericChainId] || ethers.constants.AddressZero
        return new Token(numericChainId, address, 18, 'cUSD', 'Celo Dollar')
    }, [chainId])
    return result
}
