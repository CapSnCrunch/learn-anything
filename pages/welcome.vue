<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-sheet class="section d-flex align-start" style="padding-top: 150px">
      <div
        class="d-flex flex-column justify-center align-center w-100"
        style="max-width: 1000px"
      >
        <h2 class="text-eel mb-3">What do you want to learn?</h2>
        <LAInput
          v-model="inputValue"
          placeholder="I want to learn..."
          width="500px"
          class="mb-10 d-flex align-center"
          @enter="getSuggestedTopics"
        >
          <v-icon
            v-if="!loading"
            icon="mdi-magnify"
            size="20px"
            color="eel"
            @click="getSuggestedTopics"
          />
          <img v-else src="../assets/loading.gif" width="20px" height="20px" />
        </LAInput>

        <h4 class="text-eel mb-8">Not sure? Suggested topics:</h4>

        <v-row class="d-flex w-100">
          <v-col
            cols="4"
            v-for="topic of topicsToShow"
            class="d-flex align-center justify-center px-3 py-0"
          >
            <LAButton class="w-100">
              <nuxt-link
                :to="'/assessment/' + topic?.name.toLowerCase()"
                class="d-flex text-decoration-none align-center justify-center"
              >
                <h2 class="text-eel text-h6">{{ topic?.name }}</h2>
              </nuxt-link>
              <v-tooltip
                v-if="topic?.description"
                activator="parent"
                location="top"
                offset="20px"
                max-width="300px"
              >
                {{ topic?.description }}
              </v-tooltip>
            </LAButton>
          </v-col>
        </v-row>
      </div>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import LAInput from "@/components/LAInput.vue";
import LAButton from "@/components/LAButton.vue";

const loading = ref(false);
const inputValue = ref("");
const suggestedTopics = ref([]);
const defaultTopics = ref([
  {
    name: "Archaeology",
    description:
      "Study of past human societies through excavation and analysis",
  },
  {
    name: "Botany",
    description:
      "Scientific study of plants, including their structure, growth, and classification",
  },
  {
    name: "Psychology",
    description: "The scientific study of the human mind and behavior",
  },
]);

const getSuggestedTopics = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;
  try {
    const response = await axios.post("/api/generateTopics", {
      message: inputValue.value,
    });
    suggestedTopics.value = response?.data?.data?.topics;
  } catch (error) {
    console.error("Error fetching suggested topics:", error);
  }
  loading.value = false;
};

const topicsToShow = computed(() => {
  return suggestedTopics.value.length > 0
    ? suggestedTopics.value
    : defaultTopics.value;
});
</script>

<style scoped>
.section {
  height: 100vh;
}
</style>
