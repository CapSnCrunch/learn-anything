<template>
  <v-container no-gutters fluid class="d-flex justify-center pa-0 ma-0">
    <v-row class="d-flex justify-center w-100" style="max-width: 1600px">
      <v-col
        cols="9"
        class="d-flex flex-column align-end ma-0"
        style="padding-top: 100px;"
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
      
        <v-row v-else
          v-for="(subtopic, subtopicIndex) of subtopics"
          :id="`subtopic-${subtopicIndex}`"
          :key="`subtopic-${subtopicIndex}`"
          class="d-flex justify-end align-center w-100"
        >
          <div class="pr-8">
            <img :src="`../assets/mascots/${mascots[subtopicIndex]}.png`" width="200px" height="200px">
          </div>
          <div
            class="section-card d-flex flex-column align-center w-100 mb-6"
            style="max-width: 800px; height: 250px"
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
                    quizIndex > subtopic.progress
                      ? ''
                      : `/assessment/${kebabCase(topicId)}/${quiz?.quizId}`
                  "
                  class="d-flex text-decoration-none align-center justify-center"
                >
                  <LALessonButton
                    :color="colors[subtopicIndex]"
                    :disabled="quizIndex > subtopic.progress"
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
        </v-row>
      </v-col>

      <v-col
        v-if="!loading"
        cols="3"
        class="d-flex justify-start align-start px-4"
        style="margin-top: 100px; position: relative;"
      >
        <div class="side-card-section h-100 w-100 pr-8" style="max-width: 400px">
          <div class="d-flex flex-column h-100 w-100 pr-8">
            <div class="side-card d-flex flex-column justify-start align-center pa-6 w-100" :style="Object.keys(userProgress).length < 2 ? 'height: 250px;' : 'height: 524px;'">
              <h2 class="text-darkGray text-h6 font-weight-bold pb-2">
                Your Courses
              </h2>
              <div :class="Object.keys(userProgress).length < 2 ? 'ml-0' : 'ml-4 scrollbox'" class="w-100">
                <div v-for="([topicId, topic], index) of Object.entries(userProgress).sort()" :key="`course-button-${topicId}`" class="d-flex flex-column w-100">
                  <LAButton class="w-100 mt-4 mb-1" style="max-width: 300px">
                    <nuxt-link
                      :to="'/course/' + topicId"
                      class="d-flex text-decoration-none align-center justify-center"
                    >
                      <div class="d-flex flex-column align-center justify-center w-100">
                        <h2 class="text-darkGray text-h6">{{ titleCase(topicId) }}</h2>
                        <LAProgressBar :value="computeTotalTopicProgress(topic)" style="height: 12px; width: 125px;" />
                      </div>
                    </nuxt-link>
                  </LAButton>
                </div>
              </div>
              <LAButton class="pt-6 w-100" style="max-width: 300px">
                <nuxt-link
                  to="/welcome"
                  class="d-flex align-center text-decoration-none justify-center"
                >
                  <v-icon icon="mdi-plus-thick" size="35px" color="darkGray" />
                </nuxt-link>
              </LAButton>
            </div>
            <div v-if="!user" class="side-card d-flex flex-column justify-center align-center pa-6 mt-6" style="height: 250px;">
              <h2 class="text-darkGray text-subtitle-1 font-weight-bold">
                Create an account to save your progress!
              </h2>
              <LAButton class="mt-4" width="300px">
                <nuxt-link
                  to="/signup"
                  class="d-flex text-decoration-none align-center justify-center"
                >
                  <h2 class="text-darkGray font-weight-bold" style="font-size: 18px">Create an Account</h2>
                </nuxt-link>
              </LAButton>
              <LAButton class="mt-4" width="300px">
                <nuxt-link
                  to="/login"
                  class="d-flex text-decoration-none align-center justify-center"
                >
                  <h2 class="text-darkGray font-weight-bold" style="font-size: 18px">Login</h2>
                </nuxt-link>
              </LAButton>
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
import { useCurrentUser } from "vuefire";
import { titleCase, kebabCase } from "@/server/utils/strings";
import { save, load } from "@/utils/localStorage";

const colors = ref([
  "rgb(10.98% 69.02% 96.471%)",
  "rgb(13.652% 70.245% 91.054%)",
  "rgb(18.995% 72.696% 80.221%)",
  "rgb(27.01% 76.373% 63.971%)",
  "rgb(29.681% 77.598% 58.554%)",
  "rgb(32.353% 78.824% 53.137%)",
  "rgb(37.696% 81.275% 42.304%)",
  "rgb(43.039% 83.725% 31.471%)",
  "rgb(48.382% 86.176% 20.637%)",
  "rgb(53.725% 88.627% 9.804%)",
]);

const mascots = [
  "turtle",
  "rabbit",
  "mouse",
  "beaver",
  "squirrel",
  "bear",
  "lion"
]

const route = useRoute();
const topicId = route.params.topicId;
const user = useCurrentUser();
const userProgress = ref({})

const loading = ref(false);
const subtopics = ref([]);

const computeTotalTopicProgress = (topic) => {
  return (topic?.progress.reduce((a, b) => a + b, 0) * (100/70)) || 0
}

const getCourseSubtopics = async () => {
  const savedTopic = load(`learn-anything.${topicId}`);
  if (savedTopic) {
    subtopics.value = savedTopic;
    return;
  }

  try {
    const response = await axios.post("/api/generateSubtopics", {
      topicId: topicId,
    });

    let subtopicsResponse = response?.data?.data?.subtopics;
    save(`learn-anything.${topicId}`, subtopicsResponse);

    if (
      !subtopicsResponse?.every((subtopic) => subtopic?.quizzes?.length > 0)
    ) {
      subtopicsResponse.forEach((subtopic) => {
        subtopic.quizzes = Array(7).fill({});
      });
    }

    subtopics.value = subtopicsResponse;

    const savedTopicsList = load(`learn-anything.topics`) || [];
    if (!savedTopicsList.includes(topicId)) {
      savedTopicsList.push(topicId);
      save(`learn-anything.topics`, savedTopicsList);
    }
  } catch (error) {
    console.error(`Error fetching subtopics for ${topicId}:`, error);
  }
};

const getSubtopicQuizzes = async () => {
  const savedTopic = load(`learn-anything.${topicId}`);
  if (savedTopic?.every((subtopic) => subtopic?.quizzes?.length > 0)) {
    subtopics.value = savedTopic;
    return;
  }

  try {
    const response = await axios.post("/api/generateQuizzes", {
      topicId: topicId,
    });
    subtopics.value = response?.data?.data?.subtopics;
    save(`learn-anything.${topicId}`, subtopics.value);

    const savedTopicsList = load(`learn-anything.topics`) || [];
    if (!savedTopicsList.includes(topicId)) {
      savedTopicsList.push(topicId);
      save(`learn-anything.topics`, savedTopicsList);
    }
  } catch (error) {
    console.error(`Error fetching quizzes for ${topicId}:`, error);
  }
};

const getUserProgress = async () => {
  const response = await axios.get("/api/getUserProgress");
  let progress = response?.data?.data?.topics || null
  userProgress.value = progress

  if (progress) {
    return
  }

  progress = {}

  const savedTopicsList = load(`learn-anything.topics`) || [];
  for (const topicId of savedTopicsList) {
    const savedTopic = load(`learn-anything.${topicId}`)
    progress[topicId] = {
      difficulty: 5,
      progress: savedTopic.map(subtopic => subtopic.progress || 0)
    }
    console.log(topicId, progress)
  }

  userProgress.value = progress
}

onMounted(async () => {
  loading.value = true;
  await getCourseSubtopics();
  loading.value = false;
  getSubtopicQuizzes();
  getUserProgress();
});
</script>

<style scoped>
.side-card-section {
  position: fixed;
  top: 75px;
}

.side-card {
  background-color: #f0f0f0;
  border-radius: 16px;
}

.section-card {
  background-color: #f0f0f0;
  border-radius: 16px;
}

.section-card-top {
  background-color: #e5e5e5;
  padding: 15px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.scrollbox {
  overflow-y: auto;
  scrollbar-color: #afafaf #f0f0f0;
  height: 100%;
  z-index: 999;
}

.scrollbox:hover {
  box-shadow: inset 0 -10px 10px -10px rgba(0, 0, 0, 0.5);
}
</style>
