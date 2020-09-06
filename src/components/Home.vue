<template>
  <div id="TextBox">
    <textarea v-model="input_text" placeholder="$E=mc^2$"
      rows="10" cols="50"></textarea><br>
    <vue-mathjax v-bind:formula="input_text"></vue-mathjax>
  </div>
</template>

<script>
import { VueMathjax } from 'vue-mathjax'

export default {
  name: 'TextBox',
  components: {
    'vue-mathjax': VueMathjax
  },
  data: function () {
    return {
      input_text: ''
    }
  },
  computed: {
    processed_svg: function () {
      return this.input_text + '(processed).'
    }
  }
}
</script>

<style>
#TextBox {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#TextBox textarea {
  padding: 10px 10px;
  margin: 20px 20px;
}
</style>
