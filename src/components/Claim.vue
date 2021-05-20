<template>
  <section>
    <div class="title">Claim GoodDollar token</div>
    <div class="columns is-flex-wrap-wrap">
      <div class="content column is-5 is-12-mobile">
        <p>As GoodDollar is UBI token that offers daily claim. Steps:</p>
        <ul class="is-lower-roman">
          <li>
            Create
            <a href="https://wallet.gooddollar.org" target="_blank">GoodDollar Wallet</a>
            and bypass verification.
          </li>
          <li>
            Install
            <a href="https://metamask.io/" target="_blank">MetaMask</a>
            app or browser extension.
          </li>
          <li>
            Import your G$ wallet into MetaMask:
            follow our
            <a target="_blank"
               href="https://help.gooddollar.org/kb/user-guides/how-to-connect-g$-address-to-metamask"
            >instruction</a>.
          </li>
          <li>
            Connect G$ wallet via MetaMask. Be sure that you switched to Fuse Network.
          </li>
          <li>
            Once per day you will able to claim your G$ income.
          </li>
        </ul>
      </div>
      <div class="column is-7 is-12-mobile">
        <WalletClaim/>
      </div>
    </div>
  </section>
</template>

<script>
import WalletClaim from './molecules/WalletClaim'

export default {
  name: 'Claim',
  components: { WalletClaim }
}
</script>

<style scoped>

</style>
