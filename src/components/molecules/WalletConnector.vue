<template>
  <div>
    <a v-if="!isConnected" @click="$wallet.connect()" :class="'button '+currentState.class">
      {{ currentState.label }}
    </a>
    <b-navbar-dropdown v-if="isConnected" :right="true" :arrowless="true">
      <div slot="label">
        <span class="icon has-text-success"><i class="mdi mdi-account"></i></span>
        {{ account.addressFormatted }}
      </div>
      <b-navbar-item tag="div">
        {{ chain.label }}
      </b-navbar-item>
      <b-navbar-item tag="div">
        <b>Balance: </b> {{ account.balanceFormatted }}
      </b-navbar-item>
      <b-navbar-item tag="div">
        <a @click="$wallet.disconnect()" class="button is-warning">Disconnect</a>
      </b-navbar-item>
    </b-navbar-dropdown>
  </div>
</template>

<script>
import { WalletState } from '../../plugins/Wallet'

export default {
  name: 'WalletConnector',

  computed: {
    isConnected () { return this.$wallet.isConnected() },
    account () { return this.$wallet.getAccount() },
    chain () { return this.$wallet.getChain() },
    currentState () {
      const _state = {
        label: 'Connect wallet',
        class: 'is-light'
      }

      switch (this.$wallet.getState()) {
        case WalletState.IDLE:
          // noop, defaults
          break
        case WalletState.CONNECTED:
          // shown if no accounts
          _state.label = 'Connected'
          break
        case WalletState.CONNECTING:
          _state.label = 'Connecting...'
          _state.class = 'is-warning'
          break
        case WalletState.UPDATING:
          _state.label = 'Updating...'
          _state.class = 'is-warning'
          break
        case WalletState.ERR_WRONG_CHAIN:
          _state.label = 'Wrong network'
          _state.class = 'is-danger'
          break
        default:
          // general error or unhandled state
          _state.label = this.$wallet.getState()
          _state.class = 'is-warning'
      }

      return _state
    }
  },

}
</script>
