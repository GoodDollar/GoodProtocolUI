import { useReserveToken as useMentoReserveToken } from '@gooddollar/web3sdk-v2'
import { Token } from '@sushiswap/sdk'
import { ethers } from 'ethers'
import { useMemo } from 'react'

export const useReserveToken = () => {
    const { chainId, address, decimals, symbol, name } = useMentoReserveToken()
    const result = useMemo(
        () =>
            new Token(
                chainId || 42220,
                address || ethers.constants.AddressZero,
                decimals || 18,
                symbol || 'USD',
                name || 'USD'
            ),
        [chainId, address, decimals, symbol, name]
    )
    return result
}
