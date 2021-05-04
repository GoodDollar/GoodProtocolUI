<template>
  <section style="width: 80%">
    <div class="title" v-if="title">{{ title }}</div>
    <p>
      <b-skeleton width="50%"></b-skeleton>
      <b-skeleton height="80px"></b-skeleton>
    </p>
  </section>
</template>

<script>
export default {
  name: 'Stub',
  props: {
    title: { default: null }
  }
}
</script>

<style scoped>

</style>
