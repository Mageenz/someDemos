<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import layout from './components/layout'

export default {
  name: 'App',
  components: {
    layout
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
</style>
