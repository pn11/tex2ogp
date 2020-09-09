<template>
  <div id="app">
    <h2>TeX2OGP</h2>
    <router-view/>
    <br>
    <i class="fab fa-github"></i> <a href="https://github.com/pn11/tex2ogp">Source code</a>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
