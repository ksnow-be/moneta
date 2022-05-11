<template>
  <!-- <img alt="Vue logo" src="https://static.vecteezy.com/system/resources/previews/000/548/225/original/cryptocurrency-and-blockchain-icons-or-logo-vector.jpg" height="250"/> -->
  <HelloWorld v-if="1==2" msg="Demo"/>
  <Web3Modal v-else />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Web3Modal from './components/Web3Modal.vue'



export default {
  name: 'App',
  components: {
    HelloWorld,
    Web3Modal
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
