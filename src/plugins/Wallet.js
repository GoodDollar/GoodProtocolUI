import Web3Modal, { getProviderInfo } from 'web3modal'
import { ethers } from 'ethers'
import Vue from 'vue'
import Vuex from 'vuex'
import { WalletAccount } from '../modules/WalletAccount'
import { getChainById, isAllowedChain } from '../modules/EthChains'

Vue.use(Vuex)

const WalletStoreActions = {
  UPSERT_ACCOUNT: 'upsertAccount',
  CLEAR_ACCOUNTS: 'clearAccounts',
  SET_BALANCE: 'setBalance',
  SET_CHAIN: 'setChain',
  SET_STATE: 'setState',
  CLEAR: 'clear',
}

export const WalletState = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  UPDATING: 'updating',
  ERR_WRONG_CHAIN: 'wrongChain',
  ERR_GENERAL: 'generalFailure',
  ERR_NETWORK: 'networkFailure',
}

const WalletStore = {
  state () {
    return {
      state: WalletState.IDLE,
      accounts: [],
      chainId: 0x00,
    }
  },

  getters: {
    isConnected: (state) =>
      state.state === WalletState.CONNECTED
      && state.accounts.length > 0,
    state: (state) =>
      state.state,
    chainId: (state) =>
      state.chainId,
    // return latest account as default
    account: (state) =>
      state.accounts.length ? state.accounts[state.accounts.length - 1] : null
  },

  mutations: {
    /**
     * Set current state
     * @param state
     * @param walletState
     */
    [WalletStoreActions.SET_STATE] (state, walletState) {
      state.state = walletState
    },

    [WalletStoreActions.SET_CHAIN] (state, chainId) {
      state.chainId = chainId
    },

    /**
     * Insert or update wallet account with provided balance
     *
     * @param state
     * @param address
     * @param balance
     */
    [WalletStoreActions.UPSERT_ACCOUNT] (state, { address, balance }) {
      const account = state.accounts.find(a => a.account === address)
      if (!account) {
        // insert new
        state.accounts.push(new WalletAccount({
          address: address,
          balanceWei: balance
        }))
      } else {
        // update existing
        account.setBalance(balance)
      }
    },

    /**
     * Just clear all accounts
     * @param state
     */
    [WalletStoreActions.CLEAR_ACCOUNTS] (state) {
      state.accounts.splice(0, state.accounts.length)
    },

    /**
     * Set resolved balance for account
     *
     * @param state
     * @param address
     * @param balance
     */
    [WalletStoreActions.SET_BALANCE] (state, address, balance) {
      const existing = state.accounts.findIndex(a => a.account === address)
      if (existing) {
        existing.setBalance(balance)
      }
    },

    /**
     * Clear all wallet state
     *
     * @param state
     */
    [WalletStoreActions.CLEAR] (state) {
      state.accounts.splice(0, state.accounts.length)
      state.chainId = 0x0
      state.state = WalletState.IDLE
    }
  }
}

/**
 * Holds Eth Wallet
 * - wallet connection via web3modal
 * - providers (injected, Torus)
 * - wallet events
 *
 * Exposed at Vue.$wallet.
 * Uses Vuex as inner store
 *
 */
class Wallet {

  constructor () {
    this.store = new Vuex.Store(WalletStore)
  }

  // Proxying store getters
  isConnected () {
    return this.store.getters.isConnected
  }

  getState () {
    return this.store.getters.state
  }

  getAccount () {
    return this.store.getters.account
  }

  getChain () {
    return getChainById(this.store.getters.chainId)
  }

  // End

  /**
   * Provider info based on web3modal info & checks
   *
   * @returns {IProviderInfo|null}
   */
  getProviderInfo () {
    if (!this.provider) {
      return null
    }
    return getProviderInfo(this.provider)
  }

  getSigner () {
    return this.eth.getSigner()
  }

  /**
   * Initialize web3modal
   */
  init () {
    // init external wallets
    // TODO: also lazy-load torus-embed js
    const torus = typeof window.Torus !== 'undefined' ? {
      package: window.Torus,
      options: {}
    } : null

    const providerOptions = {
      torus
    }

    // setup web3modal
    this.web3modal = new Web3Modal({
      providerOptions,
      network: 'mainnet',
      // do not cache previously selected provider
      cacheProvider: false,
      // keep metamask
      disableInjectedProvider: false,
    })

    this.web3modal.clearCachedProvider()
  }

  /**
   * Load actual accounts details
   *
   * @returns {Promise<void>}
   */
  async updateAccounts (payload) {
    console.log('Accounts update', payload)
    // set state
    this.store.commit(WalletStoreActions.SET_STATE, WalletState.UPDATING)

    // get chain
    const network = await this.eth.detectNetwork()
    // check & set chain
    this._setChain(network.chainId)

    // get accounts
    const accountInfo = []
    const addresses = payload ? payload : await this.eth.listAccounts()
    // get balances
    const accountResolver = addresses.map(async (address) => {
      const balance = await this.eth.getBalance(address)
      accountInfo.push({
        address,
        balance,
      })
    })
    // wait for resolution
    await Promise.all(accountResolver)
    // clear existing accounts
    this.store.commit(WalletStoreActions.CLEAR_ACCOUNTS)
    // store data
    if (accountInfo.length) {
      accountInfo.forEach((account) => {
        this.store.commit(WalletStoreActions.UPSERT_ACCOUNT, account)
      })
      // and finalize
      this.store.commit(WalletStoreActions.SET_STATE, WalletState.CONNECTED)
    } else {
      // no effective accounts
      this.store.commit(WalletStoreActions.SET_STATE, WalletState.IDLE)
    }
  }

  /**
   * According to https://eips.ethereum.org/EIPS/eip-1193
   */
  bindProviderEvents (unbind = false) {

    this.provider.on('connect', (connectInfo) => {
      console.info('eth: Connect')
      this._setChain(connectInfo.chainId)
    })

    this.provider.on('disconnect', (error) => {
      console.info('eth: Disconnect')
      this.store.commit(WalletStoreActions.SET_STATE, WalletState.ERR_GENERAL)
    })

    this.provider.on('accountsChanged', (accounts) => {
      console.info('eth: Changed')
      this.updateAccounts(accounts)
    })

    this.provider.on('chainChanged', (chainId) => {
      console.info('eth: Chain changed', chainId)
      this.updateAccounts(null)
    })

    this.provider.on('message', (message) => {
      console.info('eth: Provider message', message)
    })
  }

  _setChain (chainId) {
    chainId = parseInt(chainId)
    if (false === isAllowedChain(chainId)) {
      this.store.commit(WalletStoreActions.SET_STATE, WalletState.ERR_WRONG_CHAIN)
      throw new Error('ChainId not allowed: ' + chainId)
    }
    this.store.commit(WalletStoreActions.SET_CHAIN, chainId)
  }

  async _connectProvider () {
    this.store.commit(WalletStoreActions.SET_STATE, WalletState.CONNECTING)
    console.log('Connecting wallet', this.web3modal)

    try {
      this.provider = await this.web3modal.connect()
      this.bindProviderEvents()
      // init ethers with network:any to prevent failure on network changes
      // see https://github.com/ethers-io/ethers.js/issues/866
      this.eth = new ethers.providers.Web3Provider(this.provider, 'any')
      // and force update
      await this.updateAccounts(false)
    } catch (e) {
      this.store.commit(WalletStoreActions.SET_STATE, WalletState.IDLE)
      console.log('Wallet connect failure', e)
    }
  }

  async disconnect () {
    // disconnect provider
    if (this.provider) {
      // unbind events
      this.provider.removeAllListeners()
      // close
      if (this.provider.close) {
        await this.provider.close()
      }
    }
    this.provider = null
    // remove cached info
    if (this.web3modal) {
      await this.web3modal.clearCachedProvider()
    }
    // wipe state
    this.store.commit(WalletStoreActions.CLEAR)
  }

  async connect () {
    // initialize if needed
    if (!this.web3modal) {
      this.init()
    }
    // disconnect previous
    if (this.store.getters.state !== WalletState.IDLE) {
      this.disconnect()
    }
    this._connectProvider()
  }

  install (Vue) {
    // register in Vue
    Vue.prototype.$wallet = this
  }
}

// single instance
export default new Wallet()
