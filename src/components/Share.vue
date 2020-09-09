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
      title: 'teste',
      site_name: 'TeX2OGP',
      og_description: 'TeX2OGP',
      og_image_width: 'aa',
      og_image_height: '',
      fb_appid: '',
      tw_description: 'TeX2OGP',
      tw_site: '',
      tw_creator: '',
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
  }
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
