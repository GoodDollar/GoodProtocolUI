<template>
  <section class="m-3">
    <div class="columns is-multiline is-centered">
      <WalletDetails class="column is-12-tablet is-6-desktop is-4-widescreen" />
    </div>
    <b-tabs position="is-centered" type="is-toggle-rounded" class="is-hidden">
      <b-tab-item label="Swap" icon="swap-vertical-circle-outline">
        <Stub/>
      </b-tab-item>
      <b-tab-item label="Pool" icon="pool">
        <Stub/>
      </b-tab-item>
      <b-tab-item label="Vote" icon="vote">
        <Stub/>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import Stub from './atoms/Stub'
import WalletDetails from './molecules/WalletDetails'

export default {
  name: 'MainLayout',
  components: { WalletDetails, Stub }
}
</script>

<style scoped>

</style>
