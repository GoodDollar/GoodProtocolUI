import Web3 from "web3"
import { Contract } from 'web3-eth-contract'
import { AbiItem } from "web3-utils"
import GoodMarketMaker
  from "@gooddollar/goodprotocol/artifacts/contracts/reserve/GoodMarketMaker.sol/GoodMarketMaker.json"

import { G$ContractAddresses } from "constants/addresses"

/**
 * Returns instance of GoodMarket contract.
 * @param {Web3} web3 Web3 instance.
 * @param {string?} address Deployed contract address in given chain ID.
 * @constructor
 */
export async function goodMarketMakerContract(web3: Web3, chainId: number, address?: string): Promise<Contract> {
  address = address ?? G$ContractAddresses(chainId, 'GoodMarketMaker')

  return new web3.eth.Contract(GoodMarketMaker.abi as AbiItem[], address)
}
