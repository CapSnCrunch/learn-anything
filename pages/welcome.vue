<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-row class="d-flex flex-column align-center justify-center">
      <v-col class="pa-0 ma-0">
        <v-sheet
          class="section d-flex flex-column align-center"
          style="padding-top: 150px"
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
            >
              <v-btn
                variant="plain"
                density="compact"
                icon="mdi-magnify"
                size="x-large"
                @click="getSuggestedTopics"
              ></v-btn>
            </LAInput>

            <h4 class="text-eel mb-8">Not sure? Suggested topics:</h4>
            <v-row class="d-flex w-100">
              <v-col
                cols="4"
                v-for="topic of suggestedTopics"
                class="d-flex align-center justify-center px-3 py-0"
              >
                <LAButton class="w-100">
                  <nuxt-link
                    :to="'/assessment/' + topic.toLowerCase()"
                    class="text-decoration-none"
                  >
                    <h2 class="text-eel text-h6">{{ topic }}</h2>
                  </nuxt-link>
                </LAButton>
              </v-col>
            </v-row>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import LAInput from "@/components/LAInput.vue";

let inputValue = ref("");
let suggestedTopics = ref(["Archaeology", "Algebra", "Psychology"]);

const getSuggestedTopics = async () => {
  try {
    const response = await axios.post("/api/generateTopics", {
      message: inputValue.value,
    });
    suggestedTopics.value = response?.data?.data?.topics;
  } catch (error) {
    console.error("Error fetching suggested topics:", error);
  }
};
</script>

<style scoped>
.section {
  height: 100vh;
}
</style>
