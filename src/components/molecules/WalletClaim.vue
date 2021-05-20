<template>
  <div>
    <div class="card">
      <div class="card-header">
        <div class="card-header-title is-justify-content-space-between	">
          <div>UBI Claim</div>
          <div class="tags has-addons">
            <span class="tag">Status</span>
            <span class="tag" :class="eligibility.css" v-html="eligibility.text"></span>
          </div>
        </div>
      </div>
      <div v-show="eligibility.showForm" class="card-content columns is-multiline">
        <div class="column is-12-tablet is-6-widescreen">
          <div class="notification is-primary has-text">
            <p class="title is-1">
              <span v-if="balance!==null">{{ formatBalance(balance, 'gd') }}</span>
              <b-skeleton v-else></b-skeleton>
            </p>
            <p class="subtitle is-4">Current balance</p>
          </div>
        </div>
        <div class="column is-12-tablet is-6-widescreen">
          <div class="notification is-warning is-light has-text">
            <p class="title is-1">
              <span v-if="availableAmount!==null">{{ formatBalance(availableAmount, 'gd') }}</span>
              <b-skeleton v-else></b-skeleton>
            </p>
            <p class="subtitle is-4">
              <button v-if="availableAmount>0"
                      class="button is-small is-success" @click="doClaim()">Claim now
              </button>
              <span v-else>Nothing to claim</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <b-modal v-model="showModal"
             :can-cancel="false"
             class="columns"
    >
      <div class="columns p-3" style="justify-content: center">
        <div class="card column is-4">
          <div class="card-content">
            <progress class="progress is-large is-info" max="100">30%</progress>
            <div class="transaction-progress">
              <p class="has-text-success">Preparing transaction</p>
              <p class="has-text-success">Signing</p>
              <p class="has-text-success">Waiting for confirmation</p>
              <p class="has-text-danger">Failed: chain rejection</p>
            </div>
          </div>
          <div class="card-footer">
            <button class="button card-footer-item" @click="showModal=false">Close</button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { formatterMixin } from '../../modules/Mixins'
import GoodChain from '../../modules/GoodChain'
import Logger from '../../plugins/Logger'

export default {
  name: 'WalletClaim',

  mixins: [formatterMixin],

  data () {
    return {
      showModal: false,
      balance: null,
      availableAmount: null,
      isEligible: false,
      isClaiming: false,
      chain: new GoodChain({ network: GoodChain.Network.PROD })
    }
  },

  watch: {
    account (newAccount) {
      if (newAccount) {
        this.updateGoodBalance()
      }
    }
  },

  computed: {
    account () { return this.$wallet.getAccount() },
    eligibility () {
      const cases = {
        changeChain: {
          css: 'is-danger',
          text: 'Switch chain',
          showForm: false,
        },
        notEligible: {
          css: 'is-danger',
          text: 'Non eligible',
          showForm: false,
        },
        connectWallet: {
          css: 'is-danger',
          text: 'Connect wallet',
          showForm: false,
        },
        pending: {
          css: 'is-warning',
          text: 'Checking...',
          showForm: true,
        },
        eligible: {
          css: 'is-success',
          text: 'Eligible',
          showForm: true,
        }
      }

      const chain = this.$wallet.getChain()
      if (!chain) {
        return cases.connectWallet
      }
      if (!chain.canClaim) {
        return cases.changeChain
      }
      if (!this.account) {
        return cases.pending
      }

      this.$nextTick(() => {
        this.checkEligibility()
      })

      return this.isEligible ? cases.eligible : cases.notEligible
    },
  },

  methods: {
    async doClaim () {
      //.showModal = true
      if (!this.isEligible) {
        return
      }

      const ubi = this.chain.getUbiContract(this.$wallet.getSigner())
      await ubi.claim()
    },

    // todo: move to common functions
    async updateGoodBalance () {
      let balance = null
      try {
        const token = this.chain.getTokenContract(this.$wallet.eth)
        balance = await token.balanceOf(this.account.address)
      } catch (e) {
        balance = 0
        Logger.warn('Balance update failed', e)
      }
      this.balance = balance
    },

    async checkEligibility () {
      this.availableAmount = null

      const identity = this.chain.getIdentityContract(this.$wallet.eth)
      const ubi = this.chain.getUbiContract(this.$wallet.getSigner())

      const isAllowed = await identity.isWhitelisted(this.account.address)

      if (isAllowed) {
        const availableToClaim = await ubi.checkEntitlement()
        this.availableAmount = availableToClaim.toBigInt()
      }

      this.isEligible = isAllowed
    }
  },
}
</script>

<style scoped>
.card {
  min-width: 300px;
}

.b-sleleton > .b-skeleton-item {
  line-height: 1;
}

.is-opaque {
  opacity: 0;
}
</style>
