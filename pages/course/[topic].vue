<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-row class="d-flex flex-column align-center justify-center">
      <v-col
        class="d-flex flex-column align-center ma-0"
        style="padding-top: 100px"
      >
        <span v-if="loading" class="w-100">
          <v-row class="d-flex w-100 mt-8">
            <v-col cols="12" class="d-flex flex-column align-center">
              <h2 class="text-darkGray text-h4 font-weight-bold mb-8">
                Loading your custom course...
              </h2>
              <img src="../assets/loading.gif" width="50px" height="50px" />
            </v-col>
          </v-row>
        </span>

        <div
          v-else
          v-for="(subtopic, subtopicIndex) of subtopics"
          :id="`subtopic-${subtopicIndex}`"
          :key="`subtopic-${subtopicIndex}`"
          class="section-card d-flex flex-column justify-center align-center w-75 mb-8"
          style="max-width: 800px"
          ref="sections"
        >
          <div
            class="section-card-top d-flex flex-column w-100 align-start justify-center"
          >
            <h1 class="text-darkGray text-subtitle-1 font-weight-bold">
              Section 1, Unit {{ subtopicIndex + 1 }}
            </h1>
            <h1 class="text-darkGray text-h5 font-weight-bold">
              {{ subtopic.name }}
            </h1>
            <h1 class="text-darkGray text-body-1 mt-1">
              {{ subtopic.description }}
            </h1>
          </div>
          <div class="d-flex justify-space-around w-100 mt-8 mb-6">
            <div v-for="(quiz, quizIndex) of subtopic?.quizzes">
              <nuxt-link
                :to="
                  quizIndex == 0
                    ? `/assessment/${kebabCase(topic)}/${quiz?.quizId}`
                    : ''
                "
                class="d-flex text-decoration-none align-center justify-center"
              >
                <LALessonButton
                  :color="colors[subtopicIndex]"
                  :disabled="quizIndex != 0"
                />
              </nuxt-link>
              <v-tooltip
                v-if="quiz?.description"
                activator="parent"
                location="top"
                offset="20px"
                max-width="300px"
              >
                {{ quiz?.description }}
              </v-tooltip>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { kebabCase } from "@/server/utils/strings";

const colors = ref([
  "rgb(53.725% 88.627% 9.804%)",
  "rgb(48.382% 86.176% 20.637%)",
  "rgb(43.039% 83.725% 31.471%)",
  "rgb(37.696% 81.275% 42.304%)",
  "rgb(32.353% 78.824% 53.137%)",
  "rgb(29.681% 77.598% 58.554%)",
  "rgb(27.01% 76.373% 63.971%)",
  "rgb(18.995% 72.696% 80.221%)",
  "rgb(13.652% 70.245% 91.054%)",
  "rgb(10.98% 69.02% 96.471%)",
]);

const route = useRoute();
const topic = route.params.topic;

const loading = ref(false);
const subtopics = ref();

const getCourseSubtopics = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;
  try {
    const response = await axios.post("/api/generateSubtopics", {
      topic: topic,
    });
    subtopics.value = response?.data?.data?.subtopics;
  } catch (error) {
    console.error(`Error fetching subtopics for ${topic}:`, error);
  }
  loading.value = false;
};

onMounted(async () => {
  await getCourseSubtopics();
});
</script>

<style scoped>
.section-card {
  display: flex;
  flex-direction: column;
  width: 80%;
  background-color: #f0f0f0;
  border-radius: 16px;
}

.section-card-top {
  background-color: #e5e5e5;
  padding: 15px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
</style>
