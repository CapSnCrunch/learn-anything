<template>
  <div>
    <NuxtLayout>
      <v-app>
        <TheAppBar />
        <NuxtPage />
      </v-app>
    </NuxtLayout>
  </div>
</template>

<script setup>
import TheAppBar from "@/components/TheAppBar.vue";
</script>

<style>
body {
  font-family: "Nunito", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}
</style>
