<template>
  <div>
    <article v-if="isConnected" class="box">
      <div class="media">
        <aside v-if="providerName" class="media-left has-text-centered">
          <figure v-if="providerLogo" class="image is-64x64 m-2">
            <img :src="providerLogo"/>
          </figure>
          {{ providerName }}
        </aside>
        <div class="media-content">
          <p class="title is-5 is-spaced is-marginless">
            {{ account.addressFormatted }}
          </p>
          <p class="subtitle is-marginless">
            {{ account.balanceFormatted }}
          </p>
          <div class="content is-small">
            Chain ID: {{ chain.chainId }} / {{ chain.label }}
            <br>
            {{ account.address }}
            <br>
            <a @click="$wallet.disconnect()">Disconnect</a>
          </div>
        </div>
      </div>
    </article>
    <div v-if="!isConnected" class="notification is-info px-4 py-2">
      <div class="title is-4 level">
        <div class="level-left py-2">No wallet connected</div>
        <a v-show="canConnect" @click="$wallet.connect()" class="level-right button is-success">Connect</a>
      </div>
    </div>
  </div>
</template>

<script>
import { WalletState } from '../../plugins/Wallet'

export default {
  name: 'WalletDetails',

  data () {
    return {
      providerName: null,
      providerLogo: null,
      canConnect: true,
    }
  },

  computed: {
    isConnected () {
      this.updateProviderInfo()
      this.$nextTick(() => {
        // temporary workaround for vue/no-side-effects-in-computed-properties
        this.canConnect = this.$wallet.getState() === WalletState.IDLE
      })
      return this.$wallet.isConnected()
    },
    account () { return this.$wallet.getAccount() },
    chain () { return this.$wallet.getChain() }
  },

  methods: {
    updateProviderInfo () {
      const info = this.$wallet.getProviderInfo()
      if (info) {
        this.providerName = info.name
        this.providerLogo = info.logo
      }
    },
  }
}
</script>

<style scoped>

</style>
