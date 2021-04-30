import Vue from 'vue'
import Buefy from 'buefy'
import App from './App.vue'
import walletGate from './plugins/Wallet'

import './theme/theme.scss'

Vue.config.productionTip = false
Vue.config.devtools = false

Vue.use(Buefy)
Vue.use(walletGate)

window.app = new Vue({
  render: h => h(App)
}).$mount('#app')
