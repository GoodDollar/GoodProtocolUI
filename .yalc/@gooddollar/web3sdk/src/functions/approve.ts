import Web3 from 'web3'
import { BigNumber } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { SwapInfo } from 'core/swap'
import { getAccount, getChainId } from 'utils/web3'
import { G$ContractAddresses } from 'constants/addresses' // todo: import from root constants
import { SupportedChainId } from 'constants/chains'
import { ERC20Contract } from 'contracts/ERC20Contract'
import * as fuse from 'contracts/FuseUniswapContract'
import { prepareValues } from 'functions/prepareValues'
import { G$ } from 'constants/tokens'

/**
 * Approve token usage.
 * @param {Web3} web3 Web3 instance.
 * @param {SwapInfo} meta Result of the method getMeta() execution.
 */
export async function approve(web3: Web3, meta: SwapInfo, type?: string): Promise<void> {
    const chainId = await getChainId(web3)
    const approve = type === 'buy' ? fuse.approveBuy : fuse.approveSell

    if (meta.trade && meta.trade.inputAmount.currency.isNative) {
        // is this needed
        console.log('approve isNative')
        return
    } else if (chainId === SupportedChainId.FUSE) {
        await approve(web3, meta.trade!)
    } else {
        const account = await getAccount(web3)
        const { input } = prepareValues(meta)
        const bigInput = BigNumber.from(input)
        const address = type === 'buy' ? meta.route[0].address : G$[chainId].address
        const erc20 = ERC20Contract(web3, address)

        const allowance = await erc20.methods
            .allowance(account, G$ContractAddresses(chainId, 'ExchangeHelper'))
            .call()
            .then((_: string) => BigNumber.from(_))

        if (bigInput.lte(allowance)) return

        await erc20.methods.approve(G$ContractAddresses(chainId, 'ExchangeHelper'), MaxUint256.toString()).send({
            from: account,
            type: '0x2' //force eip1599 on ethereum
        })
    }
}
