<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-sheet
      class="d-flex justify-center align-start"
      style="padding-top: 150px; height: 100vh"
    >
      <div
        class="d-flex flex-column justify-center align-start w-100"
        style="max-width: 1000px"
      >
        <span v-if="loading" class="w-100">
          <v-row class="d-flex w-100 mt-8">
            <v-col cols="12" class="d-flex flex-column align-center">
              <h2 class="text-darkGray text-h4 font-weight-bold mb-8">
                Generating learning experience...
              </h2>
              <img src="../assets/loading.gif" width="50px" height="50px" />
            </v-col>
          </v-row>
        </span>

        <span v-else class="w-100">
          <LAProgressBar :value="progress" />

          <v-row v-if="progress < 100" class="d-flex w-100 mt-4">
            <v-col cols="12" class="mb-4">
              <h2 class="text-darkGray text-h5 text-start">
                {{ currentQuestion?.question }}
              </h2>
            </v-col>
            <v-col
              cols="6"
              v-for="(answer, answerIndex) of currentQuestion?.answers"
              class="d-flex align-center justify-center px-3 py-0"
            >
              <LAButton
                v-if="submitted && answer?.correct"
                :colors="{
                  borderColor: '#58cc02',
                  borderColorHover: '#58cc02',
                  backgroundColor: '#ddffde',
                  backgroundColorHover: '#ddffde',
                }"
                class="w-100"
                @click="submit(answerIndex)"
              >
                {{ answer?.answer }}
              </LAButton>
              <LAButton
                v-else-if="submitted && selectedAnswers.includes(answerIndex)"
                :colors="{
                  borderColor: '#ff4b4b',
                  borderColorHover: '#ff4b4b',
                  backgroundColor: '#ffdddd',
                  backgroundColorHover: '#ffdddd',
                }"
                class="w-100"
                @click="submit(answerIndex)"
              >
                {{ answer?.answer }}
              </LAButton>
              <LAButton v-else class="w-100" @click="submit(answerIndex)">{{
                answer?.answer
              }}</LAButton>
            </v-col>
            <v-col cols="12" class="d-flex justify-end">
              <LAButton
                v-if="submitted"
                style="width: 200px"
                @click="nextQuestion()"
              >
                Next Question
              </LAButton>
            </v-col>
          </v-row>

          <v-row v-else class="d-flex w-100 mt-8">
            <v-col cols="12" class="d-flex flex-column align-center">
              <h2 class="text-darkGray text-h4 font-weight-bold">
                Quiz completed!
              </h2>
              <LAButton class="mt-8" width="500px">
                <nuxt-link
                  :to="'/course/' + topic?.toLowerCase()"
                  class="d-flex text-decoration-none align-center justify-center"
                >
                  <h2 class="text-darkGray text-h6">Back to course</h2>
                </nuxt-link>
              </LAButton>
            </v-col>
          </v-row>
        </span>
      </div>
    </v-sheet>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { ref, computed } from "vue";
import LAButton from "@/components/LAButton.vue";
import LAProgressBar from "@/components/LAProgressBar.vue";

const route = useRoute();
const topic = route.params.topic;
const quiz = route.params.quiz;

const questionIndex = ref(0);
const questions = ref([]);
const currentQuestion = computed(() => {
  return questions.value[questionIndex.value];
});

const selectedAnswers = ref([]);
const submitted = ref(false);
const submit = (answerIndex) => {
  if (submitted.value) {
    return;
  }

  submitted.value = true;
  selectedAnswers.value = [answerIndex];
  if (currentQuestion.value?.answers[answerIndex]?.correct) {
    questions.value[questionIndex.value].completed = true;
  }
};

const nextQuestion = () => {
  submitted.value = false;
  selectedAnswers.value = [];
  questionIndex.value += 1;

  while (
    questions.value[questionIndex.value]?.completed ||
    questionIndex.value >= totalQuestions
  ) {
    questionIndex.value += 1;

    if (questionIndex.value >= totalQuestions) {
      questionIndex.value = questions.value.findIndex(
        (question) => !question.completed
      );
    }
  }
};

const totalQuestions = 10;
const progress = computed(() => {
  const completedQuestions = questions.value.filter(
    (question) => question.completed
  ).length;
  return (completedQuestions / totalQuestions) * 100;
});

const loading = ref(false);
const getQuizQuestions = async (count) => {
  try {
    const response = await axios.post("/api/generateQuestions", {
      topicId: topic,
      quizId: quiz,
      difficulty: 5,
      count: count,
    });

    const responseQuestions = response?.data?.data?.questions;
    questions.value = questions.value.concat(
      responseQuestions.map((question) => {
        return {
          ...question,
          completed: false,
        };
      })
    );
  } catch (error) {
    console.error(`Error fetching questions for ${quiz}:`, error);
  }
};

onMounted(async () => {
  loading.value = true;
  await getQuizQuestions(3);
  loading.value = false;
  getQuizQuestions(3);
  getQuizQuestions(4);
});
</script>

<style scoped>
.typingEffect {
  width: 0;
  overflow: hidden; /* Ensure the text is not visible until the typewriter effect*/
  border-right: 2px solid white; /* The cursor*/
  font-size: 16px;
  white-space: nowrap; /* Keeps the text on a single line */
  animation: typing 2s forwards;
}

/* The typing animation */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
