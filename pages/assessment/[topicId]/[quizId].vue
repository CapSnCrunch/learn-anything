<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-sheet
      class="d-flex justify-center align-start"
      style="padding-top: 150px; height: 100vh"
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
            style="width: 55px"
            @click="backToCourseDialogIsOpen = true"
          >
            <v-icon icon="mdi-arrow-left" size="20px" color="black" />
          </LAButton>
          <LAModal
            v-model="backToCourseDialogIsOpen"
            width="600px"
            max-width="600px"
            height="300px"
            @close="backToCourseDialogIsOpen = false"
          >
            <template #title>
              <h2 class="text-darkGray text-h4 font-weight-bold">
                Back to Course Page
              </h2>
            </template>
            <template #text>
              <v-row class="d-flex flex-column px-3 mt-4">
                <h2 class="text-darkGray text-h5">
                  Are you sure you want to return to the course page?
                  <span class="font-weight-bold">
                    Your progress will not be saved.
                  </span>
                </h2>
                <v-row class="d-flex justify-end mt-12">
                  <LAButton @click="backToCourseDialogIsOpen = false">
                    <h2 class="font-weight-medium" style="width: 125px">
                      Stay Here
                    </h2>
                  </LAButton>
                  <LAButton class="ml-4" @click="exit()">
                    <h2 class="font-weight-medium" style="width: 125px">
                      Exit
                    </h2>
                  </LAButton>
                </v-row>
              </v-row>
            </template>
          </LAModal>
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useCurrentUser } from "vuefire";
import { load, save } from "@/utils/localStorage";
import Quiz from "@/components/Quiz.vue";

const router = useRouter();
const route = useRoute();
const topicId = route.params.topicId;
const quizId = route.params.quizId;
const user = useCurrentUser();

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

const backToCourseDialogIsOpen = ref(false);
const exit = () => {
  router.push({ path: `/course/${topicId}` });
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
