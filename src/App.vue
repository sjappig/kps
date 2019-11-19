<template>
  <div id="app">
    <selection-view></selection-view>
  </div>
</template>

<script>
import SelectionView from '@/views/SelectionView'

export default {
  name: 'Rock-paper-scissors',
  components: {
    SelectionView
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
