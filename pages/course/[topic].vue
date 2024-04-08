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
              :color="$vuetify.theme.current.colors?.[subtopic?.color]"
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

const example = [
  {
    name: "Plant Cells",
    description: "Structure and function of plant cells",
    color: "sage",
  },
  {
    name: "Plant Tissues",
    description: "Different types of plant tissues and their functions",
    color: "olivine",
  },
  {
    name: "Plant Organs",
    description:
      "Structure and function of plant organs (roots, stems, leaves, flowers)",
    color: "resuda",
  },
  {
    name: "Plant Growth",
    description: "Factors affecting plant growth and development",
    color: "hunter",
  },
  {
    name: "Plant Reproduction",
    description: "Sexual and asexual reproduction in plants",
    color: "umber",
  },
  {
    name: "Plant Taxonomy",
    description: "Classification and identification of plants",
    color: "coffee",
  },
  {
    name: "Plant Ecology",
    description: "Interactions between plants and their environment",
    color: "chamoisee",
  },
  {
    name: "Plant Physiology",
    description:
      "Physiological processes in plants, such as photosynthesis and respiration",
    color: "persian",
  },
  {
    name: "Plant Biotechnology",
    description: "Applications of biotechnology in plant science",
    color: "lion",
  },
  {
    name: "Economic Botany",
    description: "Uses of plants for food, medicine, and other products",
    color: "sunglow",
  },
];

const route = useRoute();
const topic = route.params.topic;

const loading = ref(false);
const subtopics = ref([]);

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
