<template>
  <section class="m-3">
    <b-tabs position="is-centered" type="is-toggle-rounded">
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

export default {
  name: 'MainLayout',
  components: { Stub }
}
</script>

<style scoped>

</style>
