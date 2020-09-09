// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App'
import VueHead from 'vue-head'

Vue.config.productionTip = false
Vue.use(VueHead)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  // HTML の <head> 要素を vue-head で記述する
  head: {
    title: {
      inner: 'TeX2OGP'
    },
    meta: function () {
      return [
        {name: 'description', content: 'TeX2OGP'},
        {property: 'og:locale', content: 'ja_JP'},
        {property: 'og:type', content: 'website'},
        {property: 'og:url', content: this.url},
        {property: 'og:title', content: this.title},
        {property: 'og:site_name', content: this.site_name},
        {property: 'og:description', content: this.og_description},
        {property: 'og:image', content: this.image_url},
        {property: 'og:image:width', content: this.og_image_width},
        {property: 'og:image:height', content: this.og_image_height},
        {property: 'fb:app_id', content: this.fb_appid},
        {name: 'twitter:card', content: 'summary_large_image'},
        {name: 'twitter:title', content: this.title},
        {name: 'twitter:description', content: this.tw_description},
        {name: 'twitter:image', content: this.url},
        {name: 'twitter:site', content: this.tw_site},
        {name: 'twitter:creator', content: this.tw_creator}
      ]
    }
  } // head
}).$mount('#app')
