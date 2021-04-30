import { compactAddress } from '../plugins/Utils'
import { ethers } from 'ethers'

export class WalletAccount {
  /**
   * Wallet address, as is
   * @type {string}
   */
  address = ''
  /**
   * Compact wallet address, like 0x9AFa...d3aD
   * @type {string}
   */
  addressFormatted = ''
  /**
   * Balance in ether
   * @type {string}
   */
  balance = ''
  /**
   * Raw balance value from network in minimal units (wei)
   * @type {BigInt}
   */
  balanceWei
  /**
   * Formatted balance
   * @type {string}
   */
  balanceFormatted = ''

  constructor ({ address, balanceWei }) {
    this.address = address
    this.addressFormatted = compactAddress(address)

    if (typeof balanceWei !== 'undefined') {
      this.setBalance(balanceWei)
    }
  }

  setBalance (balanceWei) {
    this.balanceWei = balanceWei
    this.balance = ethers.utils.formatEther(balanceWei)
    this.balanceFormatted = parseFloat(this.balance).toFixed(5)
  }
}
