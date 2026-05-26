import { useMemo } from 'react'
import usePromise from 'hooks/usePromise'
import useInterval from 'hooks/useInterval'
import { useAppKitAccount } from '@reown/appkit/react'
import { DAO_NETWORK, LIQUIDITY_PROTOCOL, getMyList, useEnvWeb3, useGdContextProvider } from '@gooddollar/web3sdk'
import { useG$Price } from '@gooddollar/web3sdk-v2'

export default function useFuseGovernanceStake() {
    const { address } = useAppKitAccount()
    const { web3 } = useGdContextProvider()
    const [mainnetWeb3] = useEnvWeb3(DAO_NETWORK.MAINNET, web3)
    const [fuseWeb3] = useEnvWeb3(DAO_NETWORK.FUSE, web3)
    const gdPrice = useG$Price()

    const [stakeAmount = 0, loading, error, refetch] = usePromise(async () => {
        if (!address || !mainnetWeb3 || !fuseWeb3) return 0

        const stakes = await getMyList(mainnetWeb3, fuseWeb3, address, gdPrice)
        return stakes
            .filter((stake) => stake.protocol === LIQUIDITY_PROTOCOL.GOODDAO)
            .reduce((sum, stake) => sum + parseFloat(stake.stake.amount.toExact()), 0)
    }, [address, mainnetWeb3, fuseWeb3, gdPrice])

    useInterval(
        () => {
            refetch()
        },
        address ? 30000 : null,
        false
    )

    return useMemo(
        () => ({
            stakeAmount,
            hasStake: stakeAmount > 0,
            loading,
            error,
            refetch,
        }),
        [stakeAmount, loading, error, refetch]
    )
}
