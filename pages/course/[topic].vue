<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-row class="d-flex flex-column align-center justify-center">
      <v-col
        class="d-flex flex-column align-center pa-0 ma-0"
        style="position: relative"
      >
        <div
          class="d-flex align-center justify-center w-100"
          style="
            position: fixed;
            top: 175px;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 1000px;
          "
        >
          <div class="section-card">
            <v-col cols="9" class="pa-0 ma-0">
              <h1 class="text-eel text-subtitle-1 font-weight-bold">
                Section 1, Unit {{ currentSubtopicIndex + 1 }}
              </h1>
              <h1 class="text-eel text-h5 font-weight-bold">
                {{ currentSubtopic.name }}
              </h1>
              <h1 class="text-eel text-body-1 mt-1">
                {{ currentSubtopic.description }}
              </h1>
            </v-col>
            <v-col cols="3"> </v-col>
          </div>
        </div>

        <v-sheet
          v-for="(subtopic, index) of subtopics"
          :id="`subtopic-${index}`"
          :key="`subtopic-${index}`"
          class="d-flex flex-column align-center h-screen w-100"
          style="padding-top: 150px; max-width: 800px"
          ref="sections"
        >
          <div class="d-flex flex-column justify-center align-center w-75">
            <div class="d-flex w-100 align-center justify-center mb-2">
              <hr class="flex-fill" style="border: 1px solid #afafaf" />
              <p class="text-eel text-h5 font-weight-bold mx-4">
                {{ subtopic?.name }}
              </p>
              <hr class="flex-fill" style="border: 1px solid #afafaf" />
            </div>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import "intersection-observer";

const route = useRoute();
const topic = route.params.topic;

const loading = ref(false);
const subtopics = ref([]);
const currentSubtopic = ref("");
const currentSubtopicIndex = ref(0);

const getCourseSubtopics = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;
  try {
    const response = await axios.post("/api/generateSubtopics", {
      topic: topic,
    });
    subtopics.value = response?.data?.data?.topics;
  } catch (error) {
    console.error(`Error fetching subtopics for ${topic}:`, error);
  }
  loading.value = false;
};

onMounted(async () => {
  await getCourseSubtopics();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = subtopics.value.findIndex(
            (_, index) => entry.target.id === `subtopic-${index}`
          );
          if (sectionIndex !== -1) {
            currentSubtopic.value = subtopics.value[sectionIndex];
            currentSubtopicIndex.value = sectionIndex;
          }
        }
      });
    },
    { threshold: 0.95 }
  );

  subtopics.value.forEach((_, index) => {
    const section = document.getElementById(`subtopic-${index}`);
    if (section) {
      observer.observe(section);
    }
  });
});

onBeforeUnmount(() => {
  observer.disconnect();
});
</script>

<style>
.section-card {
  display: flex;
  flex-direction: column;
  height: 150px;
  width: 80%;
  background-color: #f0f0f0;
  border-radius: 16px;
  border: 2px solid #e5e5e5;
  padding: 20px;
}
</style>
