<template>
  <b-navbar class="app-navbar">
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <span class="button is-primary">G$ Protocol</span>
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item tag="router-link" to="swap">
        Swap
      </b-navbar-item>
      <b-navbar-item tag="router-link" to="claim">
        Claim
      </b-navbar-item>
      <b-navbar-dropdown label="About G$" :arrowless="true">
        <b-navbar-item target="_blank" href="https://wallet.gooddollar.org/">
          Wallet
        </b-navbar-item>
        <b-navbar-item target="_blank" href="https://www.gooddollar.org/">
          Website
        </b-navbar-item>
        <b-navbar-item target="_blank" href="https://github.com/GoodDollar/">
          GitHub
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <WalletConnector/>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import WalletConnector from './molecules/WalletConnector'

export default {
  name: 'NavBar',
  components: { WalletConnector }
}
</script>

<style scoped>

</style>
