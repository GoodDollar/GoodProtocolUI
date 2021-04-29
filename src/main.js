import Vue from 'vue'
import Buefy from 'buefy'
import App from './App.vue'

import './theme/theme.scss'

Vue.config.productionTip = false
Vue.config.devtools = false

Vue.use(Buefy)

window.app = new Vue({
  render: h => h(App)
}).$mount('#app')
