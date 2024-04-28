<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-sheet
      class="d-flex justify-center align-start px-4"
      style="padding-top: 150px; height: 100vh"
    >
      <span v-if="!started" class="d-flex flex-column w-100 align-center">
        <div :class="xs ? 'text-center' : 'text-start'">
          <h1 class="text-darkGray text-h4 font-weight-bold typingEffect">
            Welcome to <span v-if="!xs">{{ titleCase(topicId) }}!</span>
          </h1>
          <h1 v-if="xs" class="text-darkGray text-h4 font-weight-bold typingEffect">
            {{ titleCase(topicId) }}!
          </h1>
        </div>
        <div class="mt-4 text-center">
          <h2
            class="text-darkGray text-h6 font-weight-medium"
            style="max-width: 800px"
          >
            Let's get started with a basic knowledge assessment. Don't worry
            about answering anything incorrectly, just try your best!
          </h2>
        </div>
        <LAButton 
          class="mt-6 w-100"
          style="max-width: 350px"
          :colors="{
            borderColor: 'linear-gradient(90deg, rgb(7.882% 49.92% 68.824%), rgb(37.06% 60.502% 6.824%))',
            borderColorHover: 'linear-gradient(90deg, rgb(11.882% 59.92% 78.824%), rgb(47.06% 70.502% 16.824%))',
            backgroundColor: 'linear-gradient(90deg, rgb(10.98% 69.02% 96.471%), rgb(53.725% 88.627% 9.804%))',
            backgroundColorHover: 'linear-gradient(90deg, rgb(14.98% 75.02% 100%), rgb(64.725% 93.627% 20.804%))',
          }"  
        >
          <h2 class="text-white text-h6 font-weight-bold" @click="started = true">
            Let's Go!
          </h2>
        </LAButton>
        <nuxt-link
          :to="'/course/' + topicId"
          class="text-decoration-none w-100 d-flex align-center justify-center"
        >
          <LAButton style="max-width: 350px" class="mt-4 w-100">
            <h2 class="text-darkGray text-darkGray font-weight-bold" style="font-size: 18px;">
              Skip Quiz, Start with Basics
            </h2>
          </LAButton>
        </nuxt-link>
      </span>
      <span class="w-100 align-center justify-center" :class="started ? 'd-flex' : 'd-none'">
        <Quiz
          v-model="questions"
          :topicId="topicId"
          quizId="knowledge-assessment"
          :total-questions="7"
          :reveal-correct="false"
          :knowledge-assessment="true"
          :loading-message="'Generating knowledge assessment...'"
          @submitted="(event) => handleSubmitted(event)"
        >
          <template #completed-screen>
            <h2 class="text-darkGray text-h4 font-weight-bold">
              Quiz completed!
            </h2>
            <h2 class="text-darkGray text-center text-h5 font-weight-medium mt-3">
              Great, now we can get started on learning!
            </h2>
            <nuxt-link
              :to="'/course/' + topicId?.toLowerCase()"
              class="d-flex text-decoration-none align-center justify-center w-100"
              style="max-width: 350px"
            >
              <LAButton class="mt-8 w-100">
                  <h2 class="text-darkGray text-h6">Continue to Course</h2>
              </LAButton>
            </nuxt-link>
          </template>
        </Quiz>
      </span>
    </v-sheet>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";
import { useCurrentUser } from "vuefire";
import { titleCase } from "@/server/utils/strings";
import { load, save } from "@/utils/localStorage";
import Quiz from "@/components/Quiz.vue";

const { xs } = useDisplay();

useHead({
  title: 'Learn Anything | Welcome',
})

const router = useRouter();
const route = useRoute();
const topicId = route.params.topicId;
const user = useCurrentUser();

const started = ref(false);
const questionsSubmitted = ref(0);
const handleSubmitted = async (event) => {
  questionsSubmitted.value += 1;
  if (questionsSubmitted.value == 4) {
    await getCourseSubtopics();
    getSubtopicQuizzes();
  }
};

const getCourseSubtopics = async () => {
  const savedTopic = load(`learn-anything.${topicId}`);
  if (savedTopic) {
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
    return;
  }

  try {
    const response = await axios.post("/api/generateQuizzes", {
      topicId: topicId,
    });
    save(`learn-anything.${topicId}`, response?.data?.data?.subtopics);

    const savedTopicsList = load(`learn-anything.topics`) || [];
    if (!savedTopicsList.includes(topicId)) {
      savedTopicsList.push(topicId);
      save(`learn-anything.topics`, savedTopicsList);
    }
  } catch (error) {
    console.error(`Error fetching quizzes for ${topicId}:`, error);
  }
};
</script>

<style scoped>
.typingEffect {
  width: 0;
  overflow: hidden;
  border-right: 2px solid white;
  font-size: 16px;
  white-space: nowrap;
  animation: typing 2s forwards;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
