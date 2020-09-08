<template>
  <div id="Compose">
    <vue-mathjax v-bind:formula="input_eq" v-bind:options="options"></vue-mathjax><br>
    <textarea v-model="input_text" placeholder="E=mc^2"
rows="10" cols="50"></textarea><br>
    <input type="button" value="Share" @click="create">
    <svg ref="svgCard" width="860px" height="200px" viewBox="0 0  860 520" preserveAspectRatio="xMidYMid meet" >
      <rect id="svgEditorBackground" x="0" y="0" width="860" height="200" style="fill: none; stroke: none;"/>
    </svg>
  </div>
</template>

<script>
import { VueMathjax } from 'vue-mathjax'
import firebase from 'firebase'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyBrf8WDz4-4SGaKO6vhDDTc9yGXjUTR360',
  authDomain: 'tex2ogp.firebaseapp.com',
  databaseURL: 'https://tex2ogp.firebaseio.com',
  projectId: 'tex2ogp',
  storageBucket: 'tex2ogp.appspot.com',
  messagingSenderId: '919469548437',
  appId: '1:919469548437:web:59e5bb607e590176da8c9c',
  measurementId: 'G-6C01613YKQ'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

// svgをpngに変換
const svg2png = (svgElement, successCallback, errorCallback) => {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 630
  const ctx = canvas.getContext('2d')
  const image = new Image()
  image.onload = () => {
    ctx.drawImage(image, 0, 0, 1200, 630)
    successCallback(canvas.toDataURL())
  }
  image.onerror = (e) => {
    errorCallback(e)
  }
  let clonedSvgElement = svgElement.cloneNode(true)
  const svgData = new XMLSerializer().serializeToString(clonedSvgElement)
  image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(svgData)))
}

export default {
  name: 'Compose',
  components: {
    'vue-mathjax': VueMathjax
  },
  data: function () {
    return {
      input_text: '',
      options: {
        /*
        extensions: ['tex2jax.js', 'TeX/AMSmath.js'],
        config: ['TeX-AMS-MML_SVG.js'],
        loader: { load: ['output/svg'] },
        jax: ['input/TeX', 'output/SVG'],
        tex2jax: {
          inlineMath: [ ['$', '$'], ['\\(', '\\)'] ],
          displayMath: [ ['$$', '$$'], ['\\[', '\\]'] ],
          processEscapes: true
        },
        'HTML-CSS': {},
         */
        SVG: {
          /*
          scale: 1,
          minScale: 0.5,
          mtextInheritFont: false,
          merrorInheritFont: true,
          mathmlSpacing: false,
          skipAttributes: {},
          exFactor: 0.5,
          displayAlign: 'center',
          displayIndent: '0',
          fontCache: 'local',
          localID: null,
          internalSpeechTitles: true,
          titleID: 0
          */
          useFontCache: false,
          useGlobalCache: false
        }
      }
    }
  },
  computed: {
    input_eq: function () {
      return '$$' + this.input_text + '$$'
    }
  },
  methods: {
    uuidv4 () {
      // https://stackoverflow.com/a/2117523
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0
        var v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    async create () {
      svg2png(document.querySelector('#Compose > span > div > span > svg'), async (data) => {
        const uuid = this.uuidv4()
        const sRef = firebase.storage().ref()
        const fileRef = sRef.child(`${uuid}.png`)

        // Firebase Cloud Storageにアップロード
        await fileRef.putString(data, 'data_url')
        const url = await fileRef.getDownloadURL()

        // Firestoreに保存しておく
        const db = firebase.firestore()
        const card = db.collection('cards').doc(uuid)
        await card.set({
          url,
          message: Date.now()
        })
      })
    } // create
  } // methods
} // export default
</script>

<style>
#Compose {
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
