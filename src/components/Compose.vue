<template>
  <div id="Compose">
    <textarea v-model="input_text" placeholder="E=mc^2" rows="10" cols="50"></textarea><br>
    <svg id="svg-draft" width="600px" height="315px" viewBox="0 0 480 252"><rect width="100%" height="100%" fill="white" stroke="black"/></svg><br>
    <input type="button" value="Create" @click="upload2firebase"><br>
    <span id="mathjax-el" ref="mathJaxEl">{{input_syntax}}</span><br>
  </div>
</template>

<script>
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
  // for debug
  // document.body.insertBefore(canvas, document.getElementById('app'))
  // const {width, height} = svgElement.getBBox()
  // https://stackoverflow.com/a/9850384
  // var rect = svgElement.getBoundingClientRect()
  // const width = rect.width
  // const height = rect.height
  canvas.width = 1200
  canvas.height = 630

  // console.log(`${width} x ${height} -> ${canvas.width} x ${canvas.height}`)
  const ctx = canvas.getContext('2d')
  const image = new Image()
  image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    successCallback(canvas.toDataURL()) // 引数なしだと PNG
    // successCallback(canvas.toDataURL('image/jpg'))
  }
  image.onerror = (e) => {
    errorCallback(e)
  }
  // MathJax で render した結果を svg-draft にコピー
  // svg-draft は view box で見える範囲を設定して zoom している。
  // align center などにする場合は見える範囲を変える必要がある。
  var svgDraft = document.getElementById('svg-draft')
  if (svgElement == null) {
    return null
  }
  var fChild = svgDraft.firstChild
  if (fChild != null) {
    fChild.parentNode.replaceChild(svgElement.cloneNode(true), fChild)
  } else {
    svgDraft.appendChild(svgElement.cloneNode(true))
  }
  const svgData = new XMLSerializer().serializeToString(document.getElementById('svg-draft'))
  image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(svgData)))
}

export default {
  name: 'Compose',
  props: {
    safe: {
      type: Boolean,
      default: true
    }
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
          // font: 'TeX',
          // font: 'Latin-Modern',
          // font: 'STIX-Web',
          font: 'Asana-Math',
          linebreaks: {
            width: '40em'
          },
          useFontCache: false,
          useGlobalCache: false
        }
      }
    }
  },
  computed: {
    input_syntax: function () {
      // 強制的に equation mode かつ改行ありにする
      return '$$' + this.input_text + ' \\\\ ' + '$$'
    }
  },
  watch: {
    input_syntax: function () {
      this.renderMathJax()
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
    async upload2firebase () {
      svg2png(document.querySelector('#Compose > span > div > span > svg'), async (data) => {
        const uuid = this.uuidv4()
        const sRef = firebase.storage().ref()
        const fileRef = sRef.child(`${uuid}.png`)
        // const fileRef = sRef.child(`${uuid}.jpg`)

        // Firebase Cloud Storageにアップロード
        await fileRef.putString(data, 'data_url')
        const url = await fileRef.getDownloadURL()

        // Firestoreに保存しておく
        const db = firebase.firestore()
        const card = db.collection('cards').doc(uuid)
        await card.set({
          url: url,
          time: Date.now(),
          syntax: this.input_syntax
        })
        location.href = `#/s/${uuid}`
      })
    }, // upload2firebase
    async createSVG () {
      svg2png(document.querySelector('#Compose > span > div > span > svg'), () => {})
    },
    renderContent () {
      if (this.safe) {
        this.$refs.mathJaxEl.textContent = this.input_syntax
      } else {
        this.$refs.mathJaxEl.innerHTML = this.input_syntax
      }
    },
    // This part is extracted from vue-mathjax
    // https://github.com/justforuse/vue-mathjax
    renderMathJax () {
      this.renderContent()
      if (window.MathJax) {
        window.MathJax.Hub.Config({
          tex2jax: {
            inlineMath: [['$', '$'], ['(', ')']],
            displayMath: [['$$', '$$'], ['[', ']']],
            processEscapes: true,
            processEnvironments: true
          },
          // Center justify equations in code and markdown cells. Elsewhere
          // we use CSS to left justify single line equations in code cells.
          displayAlign: 'left',
          'HTML-CSS': {
            // scale: 1300,
            // styles: {
            //  '.MathJax_Display': { margin: 1000, 'text-align': 'left', 'font-size': '1000em !important' },
            //  '.MathJax': {'font-size': '1000em !important'}
            // },
            linebreaks: { automatic: true }
          },
          // CommonHTML: {
          //   scale: 1300
          // },
          // styles: {
          //   '.MathJax_Display': { margin: 1000, 'text-align': 'left', 'font-size': '1000em !important' },
          //   '.MathJax': {'font-size': '1000em !important'}
          /// },
          ...this.options
        })
        window.MathJax.Hub.Queue([
          'Typeset',
          window.MathJax.Hub,
          this.$refs.mathJaxEl
        ])
        // Queue や Hook などで SVG のレンダリング終了を取ってこれなかったため、
        // 1000 ms 待ってから SVG -> PNG の変換を行う
        // cf. https://docs.mathjax.org/en/v2.7-latest/api/callback.html#Delay
        // これはうまくいかなかった -> https://github.com/mathjax/mathjax-docs/wiki/Event-when-typesetting-is-done%3F-Rescaling-after-rendering...
        window.MathJax.Callback.Delay(1000, () => {
          svg2png(document.querySelector('#Compose > span > div > span > svg'), () => {})
        })
      }
    }
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
#svg-draft {
  border: solid 1px;
}
#mathjax-el {
  display: none;
}
</style>
