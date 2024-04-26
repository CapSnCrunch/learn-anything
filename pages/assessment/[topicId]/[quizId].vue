<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-sheet
      class="d-flex justify-center align-start"
      style="padding-top: 100px; height: 100vh"
    >
      <Quiz
        v-model="questions"
        :topicId="topicId"
        :quizId="quizId"
        :total-questions="10"
        @complete="updateProgress()"
      >
        <template #back-button>
          <LAButton
            width="55px"
            height="50px"
            @click="backToCourseModalOpen = true"
          >
            <v-icon icon="mdi-arrow-left" size="20px" color="black" />
          </LAButton>
          <ExitQuizModal
            v-model="backToCourseModalOpen" 
            :exit-path="`/course/${topicId}`" 
            @close="backToCourseModalOpen = false"
          />
        </template>

        <template #completed-screen>
          <h2 class="text-darkGray text-h4 font-weight-bold">
            Quiz completed!
          </h2>
          <LAButton class="mt-8" width="500px">
            <nuxt-link
              :to="'/course/' + topicId?.toLowerCase()"
              class="d-flex text-decoration-none align-center justify-center"
            >
              <h2 class="text-darkGray text-h6">Back to Course</h2>
            </nuxt-link>
          </LAButton>
        </template>
      </Quiz>
    </v-sheet>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useCurrentUser } from "vuefire";
import { load, save } from "@/utils/localStorage";
import { titleCase } from "@/server/utils/strings";
import Quiz from "@/components/Quiz.vue";

const route = useRoute();
const topicId = route.params.topicId;
const quizId = route.params.quizId;
const user = useCurrentUser();
const backToCourseModalOpen = ref(false);

useHead({
  title: `Learn Anything | ${titleCase(topicId)}`,
})

const updateProgress = () => {
  if (user) {
    const response = axios.post("/api/updateProgressByQuizId", {
      topicId: topicId,
      quizIds: [quizId],
    });
  }

  // Save progress locally
  try {
    let savedTopic = load(`learn-anything.${topicId}`);
    const subtopicIndex = savedTopic.findIndex((subtopic) =>
      subtopic.quizzes.some((quiz) => quiz.quizId === quizId)
    );

    const quizIndex = savedTopic[subtopicIndex].quizzes.findIndex(
      (quiz) => quiz.quizId === quizId
    );

    if (quizIndex !== -1) {
      savedTopic[subtopicIndex].progress = Math.max(
        savedTopic[subtopicIndex].progress,
        quizIndex + 1
      );
      save(`learn-anything.${topicId}`, savedTopic);
    }
  } catch (error) {
    console.error("Error updating progress");
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
