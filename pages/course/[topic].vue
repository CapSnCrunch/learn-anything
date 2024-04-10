<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-row class="d-flex flex-column align-center justify-center">
      <v-col
        class="d-flex flex-column align-center ma-0"
        style="padding-top: 100px"
      >
        <div
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
            <h1 class="text-eel text-subtitle-1 font-weight-bold">
              Section 1, Unit {{ subtopicIndex + 1 }}
            </h1>
            <h1 class="text-eel text-h5 font-weight-bold">
              {{ subtopic.name }}
            </h1>
            <h1 class="text-eel text-body-1 mt-1">
              {{ subtopic.description }}
            </h1>
          </div>
          <div class="d-flex justify-space-around w-100 mt-8 mb-6">
            <LALessonButton
              v-for="index of [1, 2, 3, 4, 5, 6, 7]"
              :color="colors[subtopicIndex]"
              :disabled="index != 1"
            />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import "intersection-observer";

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

const example = [
  {
    name: "Plant Cells",
    description: "Structure and function of plant cells",
    color: "rgb(53.725% 88.627% 9.804%)",
  },
  {
    name: "Plant Tissues",
    description: "Different types of plant tissues and their functions",
    color: "rgb(48.382% 86.176% 20.637%)",
  },
  {
    name: "Plant Organs",
    description:
      "Structure and function of plant organs (roots, stems, leaves, flowers)",
    color: "rgb(43.039% 83.725% 31.471%)",
  },
  {
    name: "Plant Growth",
    description: "Factors affecting plant growth and development",
    color: "rgb(37.696% 81.275% 42.304%)",
  },
  {
    name: "Plant Reproduction",
    description: "Sexual and asexual reproduction in plants",
    color: "rgb(32.353% 78.824% 53.137%)",
  },
  {
    name: "Plant Taxonomy",
    description: "Classification and identification of plants",
    color: "rgb(29.681% 77.598% 58.554%)",
  },
  {
    name: "Plant Ecology",
    description: "Interactions between plants and their environment",
    color: "rgb(27.01% 76.373% 63.971%)",
  },
  {
    name: "Plant Physiology",
    description:
      "Physiological processes in plants, such as photosynthesis and respiration",
    color: "rgb(18.995% 72.696% 80.221%)",
  },
  {
    name: "Plant Biotechnology",
    description: "Applications of biotechnology in plant science",
    color: "rgb(13.652% 70.245% 91.054%)",
  },
  {
    name: "Economic Botany",
    description: "Uses of plants for food, medicine, and other products",
    color: "rgb(10.98% 69.02% 96.471%)",
  },
];

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
    subtopics.value = response?.data?.data?.topics;
  } catch (error) {
    console.error(`Error fetching subtopics for ${topic}:`, error);
  }
  loading.value = false;
};

onMounted(async () => {
  await getCourseSubtopics();
});
</script>

<style>
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
