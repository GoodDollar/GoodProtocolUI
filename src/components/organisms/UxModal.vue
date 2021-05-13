<template>
  <div class="uxmodal-container">
    <b-modal v-model="isVisible" :width="width">
      <div class="card">
        <div class="card-content">
          <div class="title is-4" :class="titleClass">{{ title }}</div>
          <div class="content" v-html="content"></div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'UxModal',
  data () {
    return {
      isVisible: false,
      title: '',
      titleClass: '',
      content: '',
      width: 400,
    }
  },
  methods: {
    setupModal (options) {
      // set modal data from options as is
      Object.keys(options).forEach((k) => {
        this.$set(this.$data, k, options[k])
      })
      return this
    },
    // toggle modal to foreground
    show () {
      this.isVisible = true
    },
    // toggle modal back to background
    hide () {
      this.isVisible = false
    },
  }
}
</script>

<style scoped>

</style>
