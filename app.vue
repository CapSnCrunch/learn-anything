<template>
  <div style="width: 100%">
    <NuxtLayout>
      <v-app>
        <TheAppBar />
        <NuxtPage />
      </v-app>
    </NuxtLayout>
    <TheFooter />
  </div>
</template>

<script setup>
import TheAppBar from "@/components/TheAppBar.vue";
import TheFooter from "@/components/TheFooter.vue";
</script>

<style>
body {
  font-family: "Nunito", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}
</style>
