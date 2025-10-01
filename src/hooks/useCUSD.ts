import { useGetEnvChainId } from '@gooddollar/web3sdk-v2'
import contractAddresses from '@gooddollar/goodprotocol/releases/deployment.json'
import { Token } from '@sushiswap/sdk'
import { useCalls } from '@usedapp/core'
import { Contract } from 'ethers'

const tokenAbi = [
    'function decimals() external view returns (uint8)',
    'function name() external view returns (string)',
    'function symbol() external view returns (string)',
]
export default function useCUSD() {
    const { connectedEnv, chainId } = useGetEnvChainId()
    const CUSDAddress = contractAddresses[connectedEnv].CUSD || '0xCCE5f6B605164B7784b4719829d84b0f7493b906'
    const CUSDContract = new Contract(CUSDAddress, tokenAbi)
    const callResults = useCalls(
        [
            CUSDContract && {
                contract: CUSDContract,
                method: 'decimals',
                args: [],
            },
            CUSDContract && {
                contract: CUSDContract,
                method: 'symbol',
                args: [],
            },
            CUSDContract && {
                contract: CUSDContract,
                method: 'name',
                args: [],
            },
        ],
        { refresh: 'never', chainId }
    )
    const CUSD = new Token(
        chainId || 42220,
        CUSDAddress,
        getFirstOr(callResults[0]?.value, 6),
        getFirstOr(callResults[1]?.value, 'cUSD'),
        getFirstOr(callResults[2]?.value, 'Celo USD')
    )
    return CUSD
}
function getFirstOr<T>(arr: any[] | undefined, fallback: T): T {
    return arr?.[0] ?? fallback
}
