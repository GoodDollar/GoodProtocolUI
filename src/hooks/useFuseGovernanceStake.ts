import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { formatUnits } from '@ethersproject/units'
import { useReadOnlyProvider } from '@gooddollar/web3sdk-v2'
import { useAppKitAccount } from '@reown/appkit/react'
import { ERC20_ABI } from 'constants/abis/erc20'
import { FUSE_CHAIN_ID, getFuseOldGovernanceStakingAddress } from 'constants/stakeMigration'
import usePromise from 'hooks/usePromise'
import useInterval from 'hooks/useInterval'

export default function useFuseGovernanceStake() {
    const { address } = useAppKitAccount()
    const fuseProvider = useReadOnlyProvider(FUSE_CHAIN_ID)
    const stakingAddress = getFuseOldGovernanceStakingAddress()

    const [stakeAmount = 0, loading, error, refetch] = usePromise(async () => {
        if (!address || !fuseProvider) {
            return 0
        }

        const contract = new Contract(stakingAddress, ERC20_ABI, fuseProvider)
        const [balance, decimals] = await Promise.all([contract.balanceOf(address), contract.decimals()])

        return parseFloat(formatUnits(balance, decimals))
    }, [address, fuseProvider, stakingAddress])

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
            stakingAddress,
        }),
        [stakeAmount, loading, error, refetch, stakingAddress]
    )
}
