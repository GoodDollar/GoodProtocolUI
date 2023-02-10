import { useEffect, useState, useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { getContract } from 'utils/getContract'
import GovernanceStaking from '@gooddollar/goodprotocol/artifacts/contracts/governance/GovernanceStaking.sol/GovernanceStaking.json'
import { DAO_NETWORK, SupportedChainId } from 'constants/chains'
import { Stake, getReserveSocialAPY } from 'core/staking'
import { G$, GDAO } from 'constants/tokens'
import { LIQUIDITY_PROTOCOL } from 'constants/protocols'
import { CurrencyAmount, Fraction } from '@uniswap/sdk-core'
import { useEnvWeb3 } from '../useEnvWeb3'
import { getNetworkEnv } from 'constants/addresses'
import { noop } from 'lodash'

export const useGovernanceStaking = (activeWeb3?: any, chainId?: number): Array<Stake> => {
    const [mainnetWeb3, mainnetChainId] = useEnvWeb3(DAO_NETWORK.MAINNET, activeWeb3, chainId)
    const [fuseWeb3] = useEnvWeb3(DAO_NETWORK.FUSE, activeWeb3, chainId)
    const [stakes, setStakes] = useState<Array<Stake>>([])

    const networkType = getNetworkEnv()
    // console.log('useGovernanceStaking networkType -->', {networkType})

    const stakingContractV2 = useMemo(
      () => fuseWeb3 && networkType === 'production' && getContract(SupportedChainId.FUSE, 'GovernanceStakingV2', GovernanceStaking.abi, fuseWeb3),
      [fuseWeb3, networkType]
    )

    const stakingContractV1 = useMemo(
      () => fuseWeb3 && networkType !== 'production' && getContract(SupportedChainId.FUSE, 'GovernanceStaking', GovernanceStaking.abi, fuseWeb3),
      [fuseWeb3, networkType]
    )

    const stakingContract = stakingContractV2 || stakingContractV1

    useEffect(() => {
        const readData = async () => {
            if (mainnetWeb3 && stakingContract) {
                const [goodRewardsPerYear, totalStaked] = await Promise.all([
                  stakingContract.getRewardsPerBlock().then((_: BigNumber) => _.mul(12 * 60 * 24 * 365)),
                  stakingContract.totalSupply()
                ])

                const socialAPY = await getReserveSocialAPY(mainnetWeb3, mainnetChainId)

                const stakeData: Stake = {
                    address: stakingContract.address,
                    socialAPY: socialAPY,
                    protocol: LIQUIDITY_PROTOCOL.GOODDAO,
                    rewards: {
                        G$: CurrencyAmount.fromRawAmount(G$[SupportedChainId.FUSE] as any, 0),
                        GDAO: CurrencyAmount.fromRawAmount(GDAO[SupportedChainId.FUSE] as any, goodRewardsPerYear)
                    },
                    liquidity: new Fraction(totalStaked, 100),
                    tokens: { A: G$[SupportedChainId.FUSE], B: G$[SupportedChainId.FUSE] }
                }
                setStakes([stakeData])
            }
        }
        
        readData().catch(noop)
    }, [stakingContract, setStakes, mainnetWeb3, mainnetChainId])
    
    return stakes
}
