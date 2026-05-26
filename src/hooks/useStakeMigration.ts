import { useCallback, useMemo, useState } from 'react'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useWeb3Context } from '@gooddollar/web3sdk-v2'
import { Web3Provider } from '@ethersproject/providers'
import { ERC20_ABI } from 'constants/abis/erc20'
import {
    FUSE_CHAIN_ID,
    getFuseOldGovernanceStakingAddress,
    getStakeMigrationApiToken,
    getStakeMigrationApiUrl,
    getStakeMigrationOperator,
    StakeMigrationApiResult,
} from 'constants/stakeMigration'
import { getContract } from 'utils'
import useFuseGovernanceStake from 'hooks/useFuseGovernanceStake'

export class StakeMigrationPendingError extends Error {
    retryAfter?: number

    constructor(message: string, retryAfter?: number) {
        super(message)
        this.name = 'StakeMigrationPendingError'
        this.retryAfter = retryAfter
    }
}

async function submitMigrationApproval(approvalTxHash: string): Promise<StakeMigrationApiResult> {
    const url = getStakeMigrationApiUrl()
    if (!url) {
        throw new Error('Stake migration API is not configured')
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const token = getStakeMigrationApiToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ approvalTxHash }),
    })

    const data = (await response.json()) as StakeMigrationApiResult

    if (response.status === 409) {
        throw new StakeMigrationPendingError(data.error ?? 'Migration already in progress', data.retryAfter)
    }

    if (!response.ok) {
        throw new Error(data.error ?? response.statusText)
    }

    return data
}

export default function useStakeMigration() {
    const { address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const { web3Provider: library } = useWeb3Context() as { web3Provider: Web3Provider | undefined }
    const { stakeAmount, hasStake, loading: stakeLoading, refetch } = useFuseGovernanceStake()
    const [migrating, setMigrating] = useState(false)
    const [error, setError] = useState<string | undefined>()

    const operator = getStakeMigrationOperator()
    const apiConfigured = Boolean(getStakeMigrationApiUrl() && operator)

    const onFuse = (chainId as number) === FUSE_CHAIN_ID

    const migrate = useCallback(async () => {
        setError(undefined)

        if (!address || !library) {
            throw new Error('Connect your wallet on Fuse to migrate')
        }

        if (!operator) {
            throw new Error('Migration operator is not configured')
        }

        if (!getStakeMigrationApiUrl()) {
            throw new Error('Migration API is not configured')
        }

        if ((chainId as number) !== FUSE_CHAIN_ID) {
            throw new Error('Switch to Fuse network to approve your stake for migration')
        }

        setMigrating(true)

        const stakingAddress = getFuseOldGovernanceStakingAddress()

        try {
            const readContract = getContract(stakingAddress, ERC20_ABI, library)
            const writeContract = getContract(stakingAddress, ERC20_ABI, library, address)
            const stakeBalance: { toString: () => string } = await readContract.balanceOf(address)

            if (stakeBalance.toString() === '0') {
                throw new Error('No Fuse governance stake found')
            }

            const approveTx = await writeContract.approve(operator, stakeBalance)
            const receipt = await approveTx.wait()
            const approvalTxHash = receipt.transactionHash as string

            const result = await submitMigrationApproval(approvalTxHash)

            if (result.skipped) {
                throw new Error(result.skipReason ?? 'Migration was skipped')
            }

            refetch()
            return { approvalTxHash, result }
        } finally {
            setMigrating(false)
        }
    }, [address, library, chainId, operator, refetch])

    const stakingAddress = getFuseOldGovernanceStakingAddress()

    return useMemo(
        () => ({
            stakeAmount,
            hasStake,
            stakeLoading,
            migrating,
            error,
            setError,
            migrate,
            refetch,
            operator,
            apiConfigured,
            onFuse,
            stakingAddress,
        }),
        [
            stakeAmount,
            hasStake,
            stakeLoading,
            migrating,
            error,
            migrate,
            refetch,
            operator,
            apiConfigured,
            onFuse,
            stakingAddress,
        ]
    )
}
