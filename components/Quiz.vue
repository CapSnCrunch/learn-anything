<template>
  <div
    class="d-flex flex-column justify-center align-start w-100"
    style="max-width: 1200px"
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
      <v-row class="d-flex w-100 mb-6 align-center">
        <span class="ml-4">
          <slot name="back-button" />
        </span>
        <h2 class="text-darkGray ml-4 text-h4 font-weight-bold">
          {{ titleCase(topicId) }}
        </h2>
        <h2 class="text-darkGray ml-4 text-h5 font-weight-bold mt-2">
          {{ titleCase(quizId) }}
        </h2>
      </v-row>

      <LAProgressBar :value="progress" />

      <div v-if="progress < 100" class="d-flex flex-column">
        <v-row class="d-flex w-100 mt-4">
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
          <v-col cols="12" v-show="submitted" class="d-flex justify-end">
            <span v-show="submitted">
              <LAButton
                width="150px"
                height="50px"
                @click="nextQuestion()"
              >
                Next Question
              </LAButton>
            </span>
          </v-col>
        </v-row>

        <v-row class="d-flex w-100 h-100">
          <v-col cols="4">
          <div class="d-flex justify-end">
              <img :src="mascots[subtopicIndex]" style="max-height: 350px; margin-top: -30px;">
            </div>
          </v-col>
          <v-col cols="8" class="pa-6">
            <transition name="chat-bubble-transition">
              <div class="chat-bubble" :class="{ 'expanded': message != '' }">
                <div :class="{ 'triangle-left': message != '' }"></div>
                <LAInput
                  v-model="message"
                  placeholder="Ask a question..."
                  style="height: 50px"
                  smaller-input
                />
              </div>
            </transition>
          </v-col>
        </v-row>
      </div>

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
import { load} from "@/utils/localStorage";
import { defineProps, defineEmits } from "vue";
import { titleCase } from "@/server/utils/strings";
import LAButton from "@/components/LAButton.vue";
import LAProgressBar from "@/components/LAProgressBar.vue";

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

interface Answer {
  answer: string;
  correct: boolean;
}

interface Question {
  question: string;
  answers: Answer[];
}

const emits = defineEmits(["submitted", "complete"]);

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

const message = ref("")
const conversationActive = ref(false);

const subtopicIndex = computed(() => {
  let savedTopic = load(`learn-anything.${props.topicId}`) || [];
  return savedTopic.findIndex((subtopic) =>
    subtopic.quizzes.some((quiz) => quiz.quizId === props.quizId)
  ) || 0
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

const getQuizQuestions = async (count: number) => {
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
const submit = (answerIndex: number) => {
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
</script>

<style scoped>
.chat-bubble {
  display: flex;
  align-items: end;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 16px;
  height: 70px;
  transition: height 0.5s ease;
  position: relative;
}

.chat-bubble.expanded {
  height: 90%;
}

.chat-bubble-transition-enter-active,
.chat-bubble-transition-leave-active {
  transition: opacity 0.5s ease;
}

.chat-bubble-transition-enter,
.chat-bubble-transition-leave-to {
  opacity: 0;
}

.triangle-left {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #f0f0f0;
  position: absolute;
  left: -10px;
  top: 20%;
  transform: translateY(-50%);
}
</style>
