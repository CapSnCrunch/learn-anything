<template>
  <v-container no-gutters fluid class="d-flex justify-center pa-0 ma-0">
    <v-row class="d-flex justify-center w-100 ma-0 px-4" style="max-width: 1600px">
      <!-- Main Course Content -->
      <v-col
        cols="12"
        md="10"
        lg="9"
        class="d-flex flex-column align-end ma-0 pa-0"
        style="padding-top: 100px;"
      >
        <span v-if="loading" class="w-100">
          <v-row class="d-flex w-100 mt-8">
            <v-col cols="12" class="d-flex flex-column align-center mt-12">
              <h2 class="text-darkGray text-h4 text-center font-weight-bold mb-8">
                Loading your custom course...
              </h2>
              <img src="../assets/loading.gif" width="50px" height="50px" />
            </v-col>
          </v-row>
        </span>
        
        <v-row 
          v-if="!loading"
          class="d-flex align-center w-100 mb-3 mx-0"
          :class="lgAndUp ? 'justify-end' : 'justify-center'"
          style="margin-top: 75px"
        >
          <v-col cols="3" v-if="lgAndUp" class="pr-6 w-100">
          </v-col>
          <v-col
            cols="12"
            lg="9"
            xl="12"
            class="section-card d-flex flex-column align-center w-100"
            style="max-width: 800px; padding: 24px 0;"
            ref="sections"
          >
            <h2 class="text-darkGray text-h4 text-center font-weight-bold">{{ titleCase(topicId) }}</h2>
            <LAProgressBar :value="computeTotalTopicProgress(currentTopic)" class="mt-3" style="height: 18px; width: 75%;" />
          </v-col>
        </v-row>
      
        <v-row v-if="!loading"
          v-for="(subtopic, subtopicIndex) of subtopics"
          :id="`subtopic-${subtopicIndex}`"
          :key="`subtopic-${subtopicIndex}`"
          class="d-flex align-center w-100 mb-3 mx-0"
          :class="lgAndUp ? 'justify-end' : 'justify-center'"
        >
          <v-col cols="3" v-if="lgAndUp" class="pr-6 w-100">
            <img :src="mascots[subtopicIndex]" style="width: 100%; max-width: 220px;">
          </v-col>
          <v-col
            cols="12"
            lg="9"
            xl="12"
            class="section-card d-flex flex-column align-center w-100"
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

            <v-row class="d-flex w-100 mt-8 mb-6 align-center justify-center">
              <v-col v-if="sm || md" cols="4" class="w-100">
                <img :src="mascots[subtopicIndex]" style="width: 100%; max-width: 220px;">
              </v-col>
              <v-col cols="12" sm="8" lg="12">
                <v-row class="d-flex flex-wrap justify-space-around">
                  <v-col cols="3" lg="1" v-for="(quiz, quizIndex) of subtopic?.quizzes" :key="quizIndex" :class="xs ? 'px-1' : 'px-3'">
                    <nuxt-link
                      :to="quizIndex > subtopic.progress ? '' : `/assessment/${kebabCase(topicId)}/${quiz?.quizId}`"
                      class="d-flex flex-wrap text-decoration-none cursor-pointer align-center justify-center"
                    >
                      <LALessonButton
                        :color="colors[subtopicIndex]"
                        :disabled="quizIndex > subtopic.progress"
                        class="px-1 cursor-pointer"
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
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>

      <!-- Fixed Side Column -->
      <v-col
        v-if="!loading"
        cols="12"
        md="12"
        lg="3"
        class="d-flex px-4"
        :class="lgAndUp ? 'justify-start align-start' : 'justify-center align-center'"
        style="position: relative;"
        :style="lgAndUp ? 'margin-top: 100px;' : 'margin-top: 0px;'"
      >
        <div class="h-100 w-100" :class="lgAndUp ? 'side-card-section-fixed pr-8' : 'side-card-section-relative'" style="max-width: 400px">
          <div class="d-flex flex-column h-100 w-100" :class="lgAndUp ? 'pr-8' : ''">
            <div class="side-card d-flex flex-column justify-start align-center pa-6 w-100" :style="Object.keys(userProgress).length < 2 ? 'height: 250px;' : 'height: 350px;'">
              <div class="d-flex justify-center w-100 pl-10">
                <h2 class="text-darkGray text-h6 font-weight-bold pb-2 ml-auto">
                  My Courses
                </h2>
                <LAButton class="ml-auto" width="45px" height="40px" @click="settingsModalOpen = true">
                  <v-icon icon="mdi-cog" size="18px" color="darkGray" />
                </LAButton>
                <CourseSettingsModal
                  v-model="settingsModalOpen" 
                  :user-progress="userProgress"
                  :fullscreen="xs"
                  @refresh="topicId => getUserProgress(topicId)"
                  @close="settingsModalOpen = false"
                />
              </div>
              <div :class="Object.keys(userProgress).length < 3 ? 'ml-0' : 'scrollbox'" class="w-100 mt-2">
                <div v-for="([topicId, topic], index) of Object.entries(userProgress).sort()" :key="`course-button-${topicId}`" class="d-flex flex-column w-100">
                  <nuxt-link
                    :to="'/course/' + topicId"
                    class="text-decoration-none w-100"
                  >
                    <LAButton class="w-100 mt-3 mb-1" style="max-width: 350px;">
                      <div class="d-flex flex-column align-center justify-center w-100 text-center">
                        <h2 class="text-darkGray text-subtitle-1">{{ titleCase(topicId) }}</h2>
                        <LAProgressBar :value="computeTotalTopicProgress(topic)" style="height: 12px; width: 125px;" />
                      </div>
                    </LAButton>
                  </nuxt-link>
                </div>
              </div>
              <nuxt-link
                to="/welcome"
                class="d-flex text-decoration-none w-100"
              >
                <LAButton class="pt-4 w-100" style="max-width: 350px">
                    <v-icon icon="mdi-plus-thick" size="35px" color="darkGray" />
                </LAButton>
              </nuxt-link>
            </div>
            <div v-if="!user" class="side-card d-flex flex-column justify-center align-center pa-6 mt-6" style="height: 250px;">
              <h2 class="text-darkGray text-subtitle-1 font-weight-bold">
                Create an account to save your progress!
              </h2>
              <nuxt-link
                to="/signup"
                class="text-decoration-none"
              >
                <LAButton class="mt-4" width="300px">
                  <h2 class="text-darkGray font-weight-bold" style="font-size: 18px">Create an Account</h2>
                </LAButton>
              </nuxt-link>
              <nuxt-link
                to="/login"
                class="text-decoration-none"
              >
                <LAButton class="mt-4" width="300px">
                  <h2 class="text-darkGray font-weight-bold" style="font-size: 18px">Login</h2>
                </LAButton>
              </nuxt-link>
          </div>
        </div>
      </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { useCurrentUser } from "vuefire";
import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";
import { titleCase, kebabCase } from "@/server/utils/strings";
import { save, load } from "@/utils/localStorage";
import CourseSettingsModal from "~/components/CourseSettingsModal.vue";

import turtle from "@/assets/turtle.png"
import rabbit from "@/assets/rabbit.png"
import mouse from "@/assets/mouse.png"
import beaver from "@/assets/beaver.png"
import squirrel from "@/assets/squirrel.png"
import bear from "@/assets/bear.png"
import lion from "@/assets/lion.png"
import owl from "@/assets/owl.png"
import fox from "@/assets/fox.png"
import elephant from "@/assets/elephant.png"

const mascots = ref([
  turtle,
  mouse,
  rabbit,
  beaver,
  squirrel,
  bear,
  lion,
  owl,
  fox,
  elephant
])

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

const { xs, sm, md, lgAndUp } = useDisplay();
const settingsModalOpen = ref(false);

const route = useRoute();
const router = useRouter();
const topicId: string = route.params.topicId.toString();
const user = useCurrentUser();
const userProgress = ref<any>({})

const loading = ref(false);
const subtopics = ref([]);

useHead({
  title: `Learn Anything | ${titleCase(topicId)}`,
})

const computeTotalTopicProgress = (topic: any) => {
  return (topic?.progress?.reduce((a: number, b: number) => a + b, 0) * (100/70)) || 0
}

const currentTopic = computed(() => {
  return userProgress.value[topicId]
});

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
      !subtopicsResponse?.every((subtopic: any) => subtopic?.quizzes?.length > 0)
    ) {
      subtopicsResponse.forEach((subtopic: any) => {
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
  if (savedTopic?.every((subtopic: any) => subtopic?.quizzes?.length > 0)) {
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

const getUserProgress = async (deletedTopicId?: string) => {
  if (deletedTopicId == topicId) {
    router.push({ path: '/' });
  }

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
      progress: savedTopic.map((subtopic) => subtopic.progress || 0)
    }
  }

  userProgress.value = progress
}

let attempts = 0;
let maxAttempts = 2;
onMounted(async () => {
  loading.value = true;
  
  while (attempts < maxAttempts) {
    try {
      await getCourseSubtopics();
      break;
    } catch (error) {
      console.error('Failed to load course:', error);
      attempts += 1;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }


  loading.value = false;

  if (attempts === maxAttempts) {
    console.error('Failed to load course after maximum attempts');
  } else {
    getSubtopicQuizzes();
    getUserProgress();
  }
});
</script>

<style scoped>
.side-card-section-fixed {
  position: fixed;
  top: 75px;
}

.side-card-section-relative {
  position: relative;
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

@media screen and (min-width: 1280px) and (max-width: 1400px) {
  .side-card-section-fixed {
    max-width: 300px;
  }
}
</style>
