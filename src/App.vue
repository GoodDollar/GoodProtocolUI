<template>
  <div>
    <NavBar/>
    <router-view class="app-router-view m-3"/>
    <UxModal ref="uxModal"/>
  </div>
</template>
<script>
import NavBar from './components/NavBar'
import router from './plugins/Router'
import UxModal from './components/organisms/UxModal'
import UxEvents from './modules/UxEvents'

export default {
  router,
  components: { UxModal, NavBar },
  created () {
    UxEvents.setUiApp(this)
  },
  mounted () {
    this.$router.replace('/')
  }
}
</script>
