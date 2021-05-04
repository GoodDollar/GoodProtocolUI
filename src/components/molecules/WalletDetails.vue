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
        <div class="media-right is-flex is-flex-direction-column">
          <a @click="contractIsWhitelisted" class="button is-info">Identity.isWhitelisted</a>
          <a @click="contractClaim" class="button is-success">UBI.claim</a>
        </div>
      </div>
    </article>
    <div v-if="!isConnected" class="notification is-info px-4 py-2">
      <div class="title is-4 level">
        <div class="level-left py-2">No wallet connected</div>
        <a v-show="canConnect" @click="$wallet.connect()" class="level-right button is-success">Connect</a>
      </div>
    </div>
    <pre v-if="dump" v-html="dump"></pre>
  </div>
</template>

<script>
import { WalletState } from '../../plugins/Wallet'
import GoodChain from '../../modules/GoodChain'

export default {
  name: 'WalletDetails',

  data () {
    return {
      providerName: null,
      providerLogo: null,
      canConnect: true,
      dump: '',
      gch: new GoodChain({ network: GoodChain.Network.PROD })
    }
  },

  computed: {
    isConnected () {
      this.updateProviderInfo()
      this.canConnect = this.$wallet.getState() === WalletState.IDLE
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

    async contractIsWhitelisted () {
      this.dump = 'Starting'
      try {
        const identity = this.gch.getIdentityContract(this.$wallet.eth)
        const reply = await identity.isWhitelisted(this.account.address)
        this.dump = 'Fulfilled\n' + reply
      } catch (e) {
        this.dump = 'Rejected\n' + e.toString()
      }
    },

    async contractClaim () {
      this.dump = 'Starting'
      try {
        const ubi = this.gch.getUbiContract(this.$wallet.getSigner())
        window.ubi = ubi
        let reply = await ubi.claim()
        window.ubiReply = reply
        this.dump = 'Fulfilled\n' + reply
      } catch (e) {
        this.dump = 'Rejected\n' + (e.message || e.toString())
      }
    }
  }
}
</script>

<style scoped>
pre {
  white-space: break-spaces;
  word-break: break-word;
}
</style>
