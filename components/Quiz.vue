<template>
  <div
    class="d-flex flex-column justify-center align-start w-100 px-4"
    style="max-width: 1200px"
  >
    <span class="w-100">
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

      <span v-if="loading || questions.length < 1 || currentQuestion == null" class="w-100">
        <v-row class="d-flex w-100 mt-8">
          <v-col cols="12" class="d-flex flex-column align-center">
            <h2 class="text-darkGray text-h4 font-weight-bold mb-8">
              {{ loadingMessage }}
            </h2>
            <img src="../assets/loading.gif" width="50px" height="50px" />
          </v-col>
        </v-row>
      </span>

      <div v-else-if="progress < 100" class="d-flex flex-column">
        <v-row class="d-flex w-100 mt-4">
          <v-col cols="12" class="mb-4">
            <h2 class="text-darkGray text-h5 text-start">
              {{ currentQuestion.question }}
            </h2>
          </v-col>
          <v-col
            cols="6"
            v-for="(answer, answerIndex) of currentQuestion.answers"
            class="d-flex align-center justify-center px-1 py-0 mb-3"
          >
            <LAButton
              v-if="submitted && answer.correct"
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
          <v-col cols="12" v-show="submitted" class="d-flex justify-end pa-0">
            <span v-show="submitted">
              <LAButton
                width="150px"
                height="50px"
                :colors="canGoToNextQuestion ? 
                  {
                    borderColor: '#e5e5e5',
                    borderColorHover: '#1cb0f6',
                    backgroundColor: '#ffffff',
                    backgroundColorHover: '#ddf4ff',
                  } :
                  {
                    borderColor: '#afafaf',
                    borderColorHover: '#afafaf',
                    backgroundColor: '#e5e5e5',
                    backgroundColorHover: '#e5e5e5',
                  }
                "
                @click="nextQuestion()"
              >
                Next Question
              </LAButton>
            </span>
          </v-col>
        </v-row>

        <v-row v-if="!knowledgeAssessment" class="d-flex w-100 h-100 pt-4">
          <v-col cols="4">
          <div class="d-flex justify-end">
              <img :src="mascots[subtopicIndex]" style="max-height: 350px; margin-top: -30px;">
            </div>
          </v-col>
          <v-col cols="8" class="pa-6" style="max-height: 500px; margin-top: -30px;">
            <transition name="chat-bubble-transition h-100">
              <div class="chat-bubble" :class="{ 'expanded': conversation?.length > 0 }">
                <div :class="{ 'triangle-left': conversation?.length > 0 }"></div>
                <div class="scrollbox" ref="scrollbox">
                  <div v-for="chat of conversation" :class="chat.role == 'user' ? 'chat-message-user' : 'chat-message-assistant'">
                    {{ chat.message }}
                  </div>  
                  <div v-if="chatLoading" class="chat-message-assistant d-flex justify-center align-center py-3" style="width: 75px;">
                    <img src="../assets/message-loading.gif" height="10px"/>
                  </div>  
                </div>
                <LAInput
                  v-model="message"
                  placeholder="Ask a question..."
                  style="height: 50px"
                  smaller-input
                  @enter="chatWithAssistant()"
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
import { load } from "@/utils/localStorage";
import { watch, nextTick, defineProps, defineEmits } from "vue";
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
  questionId: number;
  question: string;
  answers: Answer[];
  explanation: string;
  difficulty: number;
  completed: boolean;
}

interface Chat {
  role: "user" | "assistant";
  message: string;
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
  knowledgeAssessment: {
    type: Boolean,
    default: false,
  },
  loadingMessage: {
    type: String,
    default: "Generating learning experience...",
  },
});

const message = ref<string>("")
const conversation = ref<Chat[]>([])
const chatLoading = ref<boolean>(false)

const scrollbox = ref<HTMLInputElement | null>(null);
watch(conversation, () => {
  nextTick(() => {
    if (scrollbox.value) {
      scrollbox.value.scrollTop = scrollbox.value.scrollHeight;
    }
  });
}, {deep: true});

const chatWithAssistant = async () => {
  if (!message.value || chatLoading.value) {
    return
  }

  chatLoading.value = true
  conversation.value.push({
    role: 'user',
    message: message.value
  })
  message.value = ""

  const response = await axios.post("/api/chatWithAssistant", {
    topicId: props.topicId,
    quizId: props.quizId,
    question: {
      question: currentQuestion.value.question,
      answers: currentQuestion.value.answers.map(answer => answer.answer)
    },
    conversation: conversation.value
  });

  conversation.value.push({
    role: 'assistant',
    message: response?.data?.data?.response || 'Sorry, can you ask that again?'
  })
  chatLoading.value = false
}

const subtopicIndex = computed(() => {
  let savedTopic = load(`learn-anything.${props.topicId}`) || [];
  let index = savedTopic.findIndex((subtopic: any) =>
    subtopic.quizzes.some((quiz: any) => quiz.quizId === props.quizId)
  )
  return index < 0 ? 0 : index
});

const loading = ref(false);
onMounted(async () => {
  loading.value = true;

  await getQuizQuestions(2);

  loading.value = false;
});

let attempts = 0;
let maxAttempts = 15;
const getQuizQuestions = async (count: number) => {
  try {
    let response;
    let questionIds = questions.value.map(question => question.questionId)

    if (props.knowledgeAssessment) {
      response = await axios.post("/api/generateKnowledgeAssessment", {
        topicId: props.topicId,
        count: count,
      });
    } else {
      response = await axios.post("/api/getQuestions", {
        topicId: props.topicId,
        quizId: props.quizId,
        questionIds: questionIds,
        difficulty: props.difficulty,
        count: count,
      });
    }

    const responseQuestions = response?.data?.data;
    const filteredResponseQuestions = responseQuestions.filter(
      (question: Question) => !questionIds.includes(question.questionId)
    )

    questions.value = questions.value.concat(
      filteredResponseQuestions?.map((question: any) => {
        return {
          ...question,
          answers: question.answers.slice().sort(() => Math.random() - 0.5),
          completed: false,
        };
      })
    );

    // Cap the questions at totalQuestions
    if (questions.value.length > props.totalQuestions) {
      questions.value = questions.value.slice(0, props.totalQuestions);
    }
  } catch (error) {
    console.error(`Error fetching questions for ${props.quizId}:`, error);
  }

  if (questions.value.length < props.totalQuestions && attempts < maxAttempts) {
    const wait = props.knowledgeAssessment ? 1000 : 4000
    setTimeout(() => {
      attempts += 1
      getQuizQuestions(2)
    }, wait);
  }
};

const questionIndex = ref<number>(0);
const questions = ref<Question[]>([]);
const currentQuestion = computed((): Question => {
  return questions.value[questionIndex.value];
});

const canGoToNextQuestion = ref(false)
watch(currentQuestion, () => {
  canGoToNextQuestion.value = false;
  setTimeout(() => {
    canGoToNextQuestion.value = true
  }, 1250);
});

const selectedAnswers = ref<Number[]>([]);
const submitted = ref(false);
const submit = (answerIndex: number) => {
  if (submitted.value) {
    return;
  }

  if (!props.knowledgeAssessment) {
    submitted.value = true;
    selectedAnswers.value = [answerIndex];
    const correct: boolean = currentQuestion.value?.answers[answerIndex]?.correct;
    if (correct) {
      questions.value[questionIndex.value].completed = true;
    }

    const correctOptions: string[] = ['Nice!', 'Correct!', 'Well done!', 'Exactly right!', 'You got it!']
    const incorrectOptions: string[] = ['Not quite!', 'Alomst there, but not quite.', 'Close, but not correct.']
    conversation.value.push({
      role: 'assistant',
      message: correct ? 
        correctOptions[Math.floor(Math.random() * correctOptions.length)] : 
        incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)]
    })

    const explanation: string = currentQuestion.value?.explanation
    if (explanation) {
      conversation.value.push({
        role: 'assistant',
        message: explanation
      })
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
  if (!canGoToNextQuestion.value) {
    return
  }

  submitted.value = false;
  selectedAnswers.value = [];
  questionIndex.value += 1;
  conversation.value = []

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
  )?.length;
  return (completedQuestions / props.totalQuestions) * 100;
});
</script>

<style scoped>
.chat-bubble {
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 16px;
  height: 65px;
  transition: height 0.5s ease;
  position: relative;
}

.chat-bubble.expanded {
  height: 95%;
}

.chat-bubble-transition-enter-active,
.chat-bubble-transition-leave-active {
  transition: opacity 0.5s ease;
}

.chat-bubble-transition-enter,
.chat-bubble-transition-leave-to {
  opacity: 0;
}

.chat-message-user {
  padding: 4px 10px;
  align-self: end;
  background-color: #e5e5e5;
  border-radius: 8px;
  max-width: 70%;
  margin-bottom: 5px;
}

.chat-message-assistant {
  padding: 8px;
  background-color: #e5e5e5;
  border-radius: 8px;
  max-width: 70%;
  margin-bottom: 5px;
}

.scrollbox {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-color: #afafaf #f0f0f0;
  height: 100%;
  z-index: 999;
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
