<template>
  <v-app>
    <TheAppBar :class="{ 'fixed-background': isTop }" />
    <v-main><router-view /></v-main>
  </v-app>
</template>

<script setup>
import TheAppBar from '@/components/TheAppBar.vue'
</script>

<style>
body {
  font-family: 'Nunito', sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}
</style>
