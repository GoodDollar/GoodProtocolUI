import protocolAddressList from '@gooddollar/goodcontracts/releases/deployment.json'
import stakeAddressList from '@gooddollar/goodcontracts/stakingModel/releases/deployment.json'
import identityAbi from '@gooddollar/goodcontracts/build/contracts/Identity.json'
import ubiAbi from '@gooddollar/goodcontracts/build/contracts/UBI.json'
import { ethers } from 'ethers'

class GoodChain {

  static Network = {
    DEV: 'fuse',
    PROD: 'production',
  }

  network = GoodChain.Network.DEV

  identityContract = null
  ubiContract = null

  constructor ({ network }) {
    this.network = network
  }

  getContractAddress (subset, contractType) {
    switch (subset) {
      case 'protocol':
        return protocolAddressList[this.network][contractType] ?? null
      case 'stake':
        return stakeAddressList[this.network][contractType] ?? null
    }
    return null
  }

  getIdentityContract (provider) {
    if (!this.identityContract) {
      if (!provider) {
        provider = ethers.getDefaultProvider()
      }

      this.identityContract = new ethers.Contract(
        this.getContractAddress('protocol', 'Identity'),
        identityAbi.abi,
        provider
      )
    }

    return this.identityContract
  }

  getUbiContract (signer) {
    if (!this.ubiContract) {
      this.ubiContract = new ethers.Contract(
        this.getContractAddress('stake', 'UBIScheme'),
        ubiAbi.abi,
        signer
      )
    }

    return this.ubiContract
  }

}

export default GoodChain
