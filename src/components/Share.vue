<template>
  <div id="Share">
    <img v-bind:src="image_url" width="600">
    <p>{{ image_syntax }}</p>
    <a class="twitter-share-button" v-bind:href="tweet_content" data-size="large">Tweet</a>
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
      db_record: {}
    }
  }, // data
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
    image_url: function () { return this.db_record.url },
    image_date: function () { return this.db_record.date },
    image_syntax: function () { return this.db_record.syntax },
    tweet_content: function () {
      return `https://twitter.com/intent/tweet?url=https://tex2ogp.web.app/ogp/${this.$route.params.id}&hashtags=tex2ogp`
    }
  }
} // export default

// Twitter Button
window.twttr = (function (d, s, id) {
  // eslint-disable-next-line one-var
  var js, fjs = d.getElementsByTagName(s)[0]
  var t = window.twttr || {}
  if (d.getElementById(id)) return t
  js = d.createElement(s)
  js.id = id
  js.src = 'https://platform.twitter.com/widgets.js'
  fjs.parentNode.insertBefore(js, fjs)

  t._e = []
  t.ready = function (f) {
    t._e.push(f)
  }

  return t
}(document, 'script', 'twitter-wjs'))
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
#Share img {
  border: solid 1px;
}
</style>
