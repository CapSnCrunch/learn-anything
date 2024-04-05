<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-row class="d-flex flex-column align-center justify-center">
      <v-col class="pa-0 ma-0">
        <v-sheet
          class="section d-flex flex-column align-center justify-center"
          style="padding-top: 200px"
        >
          <div
            class="d-flex flex-column justify-center align-center"
            style="max-width: 1000px"
          >
            <h2 class="text-eel mb-3">What do you want to learn?</h2>
            <LAInput
              v-model="inputValue"
              placeholder="I want to learn..."
              width="500px"
              class="mb-10"
            />
            <h4 class="text-eel mb-8">Not sure? Suggested topics:</h4>
            <v-row class="d-flex justify-space-around">
              <LAButton v-for="topic of suggestedTopics" class="mx-2">
                <nuxt-link
                  :to="'/assessment/' + topic.toLowerCase()"
                  class="text-decoration-none"
                >
                  <h2 class="text-eel text-h6">{{ topic }}</h2>
                </nuxt-link>
              </LAButton>
            </v-row>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import LAInput from "@/components/LAInput.vue";

let inputValue = ref("");
let suggestedTopics = ref([]);

onMounted(async () => {
  const response = await fetch(`/api/generateTopics`, {
    method: "get",
  });
  const data = await response.json();
  suggestedTopics.value = data?.topics;
});
</script>

<style scoped>
.section {
  height: 100vh;
}
</style>
