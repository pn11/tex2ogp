import Vue from 'vue'
import VueRouter from 'vue-router'

import Compose from '@/components/Compose'
import Share from '@/components/Share'

Vue.use(VueRouter)

export default new VueRouter({
  // これをやると /s/:id とかが Firebase 上で動かなくなる。
  // mode: 'history', // https://stackoverflow.com/a/34624803
  routes: [
    {
      path: '/c/',
      name: 'Compose',
      component: Compose
    },
    {
      path: '/s/:id',
      name: 'Share',
      component: Share
    },
    {
      path: '*',
      name: 'Not Found',
      component: Compose
    }
  ]
})
