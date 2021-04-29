import Vue from 'vue'
import VueRouter from 'vue-router'
import MainLayout from '../components/MainLayout'
import Swap from '../components/Swap'
import Claim from '../components/Claim'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', component: MainLayout,
  },
  {
    path: '/swap', component: Swap
  },
  {
    path: '/claim', component: Claim
  }
]

export default new VueRouter({
  mode: 'abstract',
  base: '/',
  routes
})
