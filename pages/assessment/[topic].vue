<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-row class="d-flex flex-column align-center justify-center">
      <v-col class="pa-0 ma-0">
        <v-sheet
          class="section d-flex align-center"
          style="padding-bottom: 200px"
        >
          <v-col
            cols="12"
            class="d-flex flex-column align-center justify-center"
          >
            <h1 class="text-eel">Welcome to {{ formattedTopic }}!</h1>
          </v-col>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute();
const topic = route.params.topic;

const toCamelCase = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const formattedTopic = toCamelCase(topic);
</script>

<style scoped>
.section {
  height: 100vh;
}
</style>
