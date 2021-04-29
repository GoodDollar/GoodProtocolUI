<template>
  <div>
    <NavBar/>
    <router-view class="app-router-view m-3" />
  </div>
</template>
<script>
import NavBar from './components/NavBar'
import router from './plugins/Router'

export default {
  router,
  components: { NavBar },
  mounted () {
    this.$router.replace('/')
  }
}
</script>
