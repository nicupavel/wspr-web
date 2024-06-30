<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Menu from './components/Menu.vue'
</script>

<template>
  <header>
    <Menu msg="WSPR Tracking" />
  </header>
  <RouterView />
</template>

<style scoped>
header {
  margin-bottom: 1rem;
}

nav {
  width: 100%;
  font-size: 1rem;
  margin-top: 1rem;
}

nav a {
  display: inline-block;
  padding: 1rem 1rem;
  font-size: 1rem;
}
</style>
