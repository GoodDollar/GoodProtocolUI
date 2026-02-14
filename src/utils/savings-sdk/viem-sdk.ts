import { PublicClient, WalletClient, getContract, erc20Abi } from 'viem'
import { celo } from 'viem/chains'
import { G$ContractAddresses } from '@gooddollar/web3sdk'
import { abi as STAKING_REWARDS_ABI } from '@uniswap/liquidity-staker/build/StakingRewards.json'

// Use Celo as default chain
const CHAIN_ID = celo.id

export class GooddollarSavingsSDK {
    public publicClient: PublicClient // Made public to be accessible if needed
    public walletClient?: WalletClient
    public contractAddress: `0x${string}`

    constructor(publicClient: PublicClient, walletClient?: WalletClient) {
        this.publicClient = publicClient
        this.walletClient = walletClient
        // Attempt to get address from SDK for 'GoodDollarStaking' or similar
        // Fallback to a hardcoded address if dynamic lookup fails
        this.contractAddress = '0x9136757d5Be83D995F77328004fF42C14028cd27'

        try {
            const addr = G$ContractAddresses(CHAIN_ID, 'GoodDollarStaking')
            if (addr) this.contractAddress = addr as unknown as `0x${string}`
        } catch (e) {
            console.warn('Could not load GoodDollarStaking address from SDK, using default:', this.contractAddress)
        }
    }

    private getContract(walletClient?: WalletClient) {
        return getContract({
            address: this.contractAddress,
            abi: STAKING_REWARDS_ABI,
            client: { public: this.publicClient, wallet: walletClient || this.walletClient },
        })
    }

    async getGlobalStats() {
        const contract = this.getContract()
        const totalStaked = (await contract.read.totalSupply()) as bigint
        const rewardRate = (await contract.read.rewardRate()) as bigint

        // APR = (RewardRate * 31536000) / TotalStaked * 100
        // Simplified APR calculation assuming 1:1 price
        // Note: Accurate APR requires token prices
        let annualAPR = 0
        if (totalStaked > 0n) {
            // Calculate APR with 2 decimals precision
            const yearlyRewards = rewardRate * 31536000n
            const aprBasisPoints = (yearlyRewards * 10000n) / totalStaked
            annualAPR = Number(aprBasisPoints) / 100
        }

        return {
            totalStaked,
            annualAPR,
        }
    }

    async getUserStats() {
        if (!this.walletClient) {
            // Return empty stats if no wallet connected
            return {
                walletBalance: 0n,
                currentStake: 0n,
                unclaimedRewards: 0n,
                userWeeklyRewards: 0n,
            }
        }
        const [account] = await this.walletClient.getAddresses()
        if (!account) return { walletBalance: 0n, currentStake: 0n, unclaimedRewards: 0n, userWeeklyRewards: 0n }

        const contract = this.getContract()

        // Fetch staking token address
        const stakingTokenAddress = (await contract.read.stakingToken()) as `0x${string}`

        // Fetch user balance of staking token
        const tokenContract = getContract({
            address: stakingTokenAddress,
            abi: erc20Abi,
            client: { public: this.publicClient },
        })
        const walletBalance = (await tokenContract.read.balanceOf([account])) as bigint

        const currentStake = (await contract.read.balanceOf([account])) as bigint
        const unclaimedRewards = (await contract.read.earned([account])) as bigint

        // Calculate user weekly rewards based on their share
        const totalSupply = (await contract.read.totalSupply()) as bigint
        const rewardRate = (await contract.read.rewardRate()) as bigint
        let userWeeklyRewards = 0n

        if (totalSupply > 0n) {
            const weeklyRewardsTotal = rewardRate * 60n * 60n * 24n * 7n
            userWeeklyRewards = (weeklyRewardsTotal * currentStake) / totalSupply
        }

        return {
            walletBalance,
            currentStake,
            unclaimedRewards,
            userWeeklyRewards,
        }
    }

    async stake(amount: bigint) {
        if (!this.walletClient) throw new Error('Wallet not connected')
        const [account] = await this.walletClient.getAddresses()
        const contract = getContract({
            address: this.contractAddress,
            abi: STAKING_REWARDS_ABI,
            client: { public: this.publicClient, wallet: this.walletClient },
        })

        // Check allowance
        const stakingTokenAddress = (await contract.read.stakingToken()) as `0x${string}`
        const tokenContract = getContract({
            address: stakingTokenAddress,
            abi: erc20Abi,
            client: { public: this.publicClient, wallet: this.walletClient },
        })

        const allowance = await tokenContract.read.allowance([account, this.contractAddress])
        if (allowance < amount) {
            const approveHash = await tokenContract.write.approve([this.contractAddress, amount], {
                account,
                chain: celo,
            })
            await this.publicClient.waitForTransactionReceipt({ hash: approveHash })
        }

        const hash = await contract.write.stake([amount], { account, chain: celo })
        const receipt = await this.publicClient.waitForTransactionReceipt({ hash })
        return receipt
    }

    async unstake(amount: bigint) {
        if (!this.walletClient) throw new Error('Wallet not connected')
        const [account] = await this.walletClient.getAddresses()
        const contract = getContract({
            address: this.contractAddress,
            abi: STAKING_REWARDS_ABI,
            client: { public: this.publicClient, wallet: this.walletClient },
        })

        const hash = await contract.write.withdraw([amount], { account, chain: celo })
        const receipt = await this.publicClient.waitForTransactionReceipt({ hash })
        return receipt
    }

    async claimReward() {
        if (!this.walletClient) throw new Error('Wallet not connected')
        const [account] = await this.walletClient.getAddresses()
        const contract = getContract({
            address: this.contractAddress,
            abi: STAKING_REWARDS_ABI,
            client: { public: this.publicClient, wallet: this.walletClient },
        })

        const hash = await contract.write.getReward([], { account, chain: celo })
        const receipt = await this.publicClient.waitForTransactionReceipt({ hash })
        return receipt
    }
}
