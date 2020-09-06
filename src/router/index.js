import Vue from 'vue'
import Router from 'vue-router'
import TextBox from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TextBox',
      component: TextBox
    }
  ]
})
