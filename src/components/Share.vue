<template>
  <div id="Share">
    <img v-bind:src="image_url" width="600">
    <p>{{ image_syntax }}</p>
    <p>{{ og_image_width }} x {{ og_image_height }}</p>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Share',
  components: {

  },
  data: function () {
    return {
      title: 'TeX2OGP',
      site_name: 'TeX2OGP',
      og_description: 'TeX2OGP',
      og_image_width: '',
      og_image_height: '',
      fb_appid: '',
      tw_description: 'TeX2OGP',
      tw_site: '',
      tw_creator: '@nowohyeah',
      db_record: ''
    }
  }, // data
  watch: {
    '$route' () {
      this.$emit('updateHead')
    },
    image_url: function (val) {
      const img = new Image()
      // capture Vue object https://stackoverflow.com/a/42590926
      var this_ = this
      img.onload = function () {
        this_.og_image_width = img.width
        this_.og_image_height = img.height
      }
      img.src = val
    }, // image_url
    og_image_width: function () {
      this.$emit('updateHead')
      console.log('emit')
    }
  }, // watch
  methods: {
    getFromFirebase () {
      const db = firebase.firestore()
      console.log(this.$route.params.id)
      db.collection('cards').doc(this.$route.params.id).get()
        .then(result => {
          if (!result.exists) {
            console.log('error')
            // res.status(404).send('404 Not Exist')
          } else {
            const data = result.data()
            this.db_record = data
            // res.set('cache-control', 'public, max-age=3600')
            // res.send(html)
          } // else
        }) // then result
    } // getFromFireabase
  }, // methods
  beforeMount () {
    this.getFromFirebase()
  },
  computed: {
    url: function () { return location.href },
    image_url: function () { return this.db_record.url },
    image_date: function () { return this.db_record.date },
    image_syntax: function () { return this.db_record.syntax }
  },
  metaInfo () {
    return {
      title: 'TeX2OGP',
      meta: [
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
        // {property: 'fb:app_id', content: this.fb_appid},
        {name: 'twitter:card', content: 'summary_large_image'},
        // {name: 'twitter:title', content: this.title},
        {name: 'twitter:description', content: this.tw_description},
        {name: 'twitter:image', content: this.image_url},
        // {name: 'twitter:site', content: this.tw_site},
        {name: 'twitter:creator', content: this.tw_creator}
      ]
    }
  } // metaInfo
} // export default
</script>

<style>
#Share {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#Compose textarea {
  padding: 10px 10px;
  margin: 20px 20px;
}
</style>
