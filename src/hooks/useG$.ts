import { getTokens } from '@gooddollar/web3sdk'
import { useEffect, useState } from 'react'
import { Token } from '@sushiswap/sdk'
import { Token as UToken } from '@uniswap/sdk-core'
import { ethers } from 'ethers'
import { useAppKitNetwork } from '@reown/appkit/react'

export default function useG$() {
    const { chainId } = useAppKitNetwork()
    const [token, setToken] = useState<Token>(
        new Token(+(chainId ?? 1), ethers.constants.AddressZero, 18, 'G$', 'GoodDollar')
    )

    useEffect(() => {
        if (!chainId) return
        void (async () => {
            const [tokens] = await getTokens(chainId as any)
            const G$ = tokens.get('G$') as UToken | undefined
            if (G$) {
                setToken(new Token(+(chainId ?? 1), G$.address, G$.decimals, G$.symbol, G$.name))
            }
        })()
    }, [chainId])

    return token
}
