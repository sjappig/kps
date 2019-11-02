<template>
  <div id="app">
    <KPS/>
  </div>
</template>

<script>
import KPS from './components/KPS.vue'

export default {
  name: 'app',
  components: {
    KPS
  },
  async mounted() {
    await window.ethereum.enable();
  }
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
