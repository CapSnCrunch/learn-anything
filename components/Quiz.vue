<template>
  <div
    class="d-flex flex-column justify-center align-start w-100"
    style="max-width: 1000px"
  >
    <span v-if="loading" class="w-100">
      <v-row class="d-flex w-100 mt-8">
        <v-col cols="12" class="d-flex flex-column align-center">
          <h2 class="text-darkGray text-h4 font-weight-bold mb-8">
            {{ loadingMessage }}
          </h2>
          <img src="../assets/loading.gif" width="50px" height="50px" />
        </v-col>
      </v-row>
    </span>

    <span v-else class="w-100">
      <v-row class="d-flex w-100 mb-4 align-center">
        <slot name="back-button" />
        <h2 class="text-darkGray ml-4 text-h4 font-weight-bold">
          {{ titleCase(topicId) }}
        </h2>
        <h2 class="text-darkGray ml-4 text-h5 font-weight-bold mt-2">
          {{ titleCase(quizId) }}
        </h2>
      </v-row>

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
          class="d-flex align-center justify-center px-3 py-0 mb-4"
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
            height="70px"
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
            height="70px"
            @click="submit(answerIndex)"
          >
            {{ answer?.answer }}
          </LAButton>
          <LAButton v-else class="w-100" height="70px" @click="submit(answerIndex)">{{
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
          <slot name="completed-screen" />
        </v-col>
      </v-row>
    </span>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { defineProps, defineEmits } from "vue";
import { titleCase } from "@/server/utils/strings";
import LAButton from "@/components/LAButton.vue";
import LAModal from "@/components/LAModal.vue";
import LAProgressBar from "@/components/LAProgressBar.vue";

const emits = defineEmits(["submitted", "complete"]);

interface Answer {
  answer: string;
  correct: boolean;
}

interface Question {
  question: string;
  answers: Answer[];
}

const props = defineProps({
  topicId: {
    type: String,
    default: "topic",
  },
  quizId: {
    type: String,
    default: "quiz",
  },
  questions: {
    type: Array as () => Question[],
    default: [],
  },
  difficulty: {
    type: Number,
    default: 5,
  },
  totalQuestions: {
    type: Number,
    default: 10,
  },
  revealCorrect: {
    type: Boolean,
    default: true,
  },
  knowledgeAssessment: {
    type: Boolean,
    default: false,
  },
  loadingMessage: {
    type: String,
    default: "Generating learning experience...",
  },
});

const loading = ref(false);
onMounted(async () => {
  loading.value = true;

  const requests = [];
  let remainingQuestions = props.totalQuestions;

  while (remainingQuestions > 0) {
    const batchSize = Math.min(remainingQuestions, 4);
    requests.push(getQuizQuestions(batchSize));
    remainingQuestions -= batchSize;
  }

  await Promise.any(requests);

  loading.value = false;
});

const getQuizQuestions = async (count) => {
  try {
    let response;
    if (props.knowledgeAssessment) {
      response = await axios.post("/api/generateKnowledgeAssessment", {
        topicId: props.topicId,
        count: count,
      });
    } else {
      response = await axios.post("/api/generateQuestions", {
        topicId: props.topicId,
        quizId: props.quizId,
        difficulty: props.difficulty,
        count: count,
      });
    }

    const responseQuestions = response?.data?.data?.questions;
    questions.value = questions.value.concat(
      responseQuestions.map((question) => {
        return {
          ...question,
          answers: question.answers.slice().sort(() => Math.random() - 0.5),
          completed: false,
        };
      })
    );
  } catch (error) {
    console.error(`Error fetching questions for ${props.quizId}:`, error);
  }
};

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

  if (props.revealCorrect) {
    submitted.value = true;
    selectedAnswers.value = [answerIndex];
    if (currentQuestion.value?.answers[answerIndex]?.correct) {
      questions.value[questionIndex.value].completed = true;
    }
  } else {
    questions.value[questionIndex.value].completed = true;
    emits("submitted", currentQuestion.value?.answers[answerIndex]?.correct);
    nextQuestion();
  }

  if (progress.value == 100) {
    emits("complete");
  }
};

const nextQuestion = () => {
  submitted.value = false;
  selectedAnswers.value = [];
  questionIndex.value += 1;

  while (
    questions.value[questionIndex.value]?.completed ||
    questionIndex.value >= props.totalQuestions
  ) {
    questionIndex.value += 1;

    if (questionIndex.value >= props.totalQuestions) {
      questionIndex.value = questions.value.findIndex(
        (question) => !question.completed
      );
    }
  }

  const newQuestion = questions.value[questionIndex.value];
  questions.value[questionIndex.value] = {
    ...newQuestion,
    answers: newQuestion.answers.slice().sort(() => Math.random() - 0.5),
  };
};

const progress = computed(() => {
  const completedQuestions = questions.value?.filter(
    (question) => question.completed
  ).length;
  return (completedQuestions / props.totalQuestions) * 100;
});

const randomizeAnswers = () => {};
</script>
