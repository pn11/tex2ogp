import Vue from 'vue'
import Router from 'vue-router'
import Compose from '@/components/Compose'
import Share from '@/components/Share'

Vue.use(Router)

export default new Router({
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
    }
  ]
})
