<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-sheet class="section d-flex align-start" style="padding-top: 150px">
      <div
        class="d-flex flex-column justify-center align-start w-100"
        style="max-width: 1000px"
      >
        <span v-if="!started">
          <div class="text-start">
            <h1 class="text-darkGray text-h4 font-weight-bold typingEffect">
              Welcome to {{ formattedTopic }}!
            </h1>
          </div>
          <div class="text-start mt-4">
            <h2
              class="text-darkGray text-h6 font-weight-medium"
              style="max-width: 800px"
            >
              Let's get started with a basic knowledge assessment. Don't worry
              about answering anything incorrectly, just try your best!
            </h2>
          </div>
          <LAButton class="mt-4" style="max-width: 400px">
            <h2 class="text-darkGray text-h6" @click="started = true">
              Let's Go!
            </h2>
          </LAButton>
          <LAButton style="max-width: 400px">
            <nuxt-link
              :to="'/course/' + topic?.toLowerCase()"
              class="d-flex text-decoration-none align-center justify-center"
            >
              <h2 class="text-darkGray text-h6">
                Skip Quiz, Start with Basics
              </h2>
            </nuxt-link>
          </LAButton>
        </span>
        <span v-else class="w-100">
          <LAProgressBar :value="progress" />

          <v-row
            v-if="questionIndex < questions.length"
            class="d-flex w-100 mt-4"
          >
            <v-col cols="12" class="mb-4">
              <h2 class="text-darkGray text-h4 text-start">
                {{ currentQuestion?.question }}
              </h2>
            </v-col>
            <v-col
              cols="6"
              v-for="answer of currentQuestion?.answers"
              class="d-flex align-center justify-center px-3 py-0"
            >
              <LAButton class="w-100" @click="submit(answer)">{{
                answer
              }}</LAButton>
            </v-col>
          </v-row>

          <v-row v-else class="d-flex w-100 mt-8">
            <v-col cols="12" class="d-flex flex-column align-center">
              <h2 class="text-darkGray text-h4 font-weight-bold">
                Done with the quiz!
              </h2>
              <LAButton class="mt-8" width="500px">
                <nuxt-link
                  :to="'/course/' + topic?.toLowerCase()"
                  class="d-flex text-decoration-none align-center justify-center"
                >
                  <h2 class="text-darkGray text-h6">
                    Continue to your custom course!
                  </h2>
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
import { ref, computed } from "vue";
import LAButton from "@/components/LAButton.vue";
import LAProgressBar from "@/components/LAProgressBar.vue";

const route = useRoute();
const topic = route.params.topic;

const started = ref(false);
const questionIndex = ref(0);
const questions = ref([
  {
    question: "Question 1...",
    answers: ["A", "B", "C", "D"],
  },
  {
    question: "Question 2...",
    answers: ["A", "B", "C", "D"],
  },
  {
    question: "Question 3...",
    answers: ["A", "B", "C", "D"],
  },
  {
    question: "Question 4...",
    answers: ["A", "B", "C", "D"],
  },
  {
    question: "Question 5...",
    answers: ["A", "B", "C", "D"],
  },
]);

const currentQuestion = computed(() => {
  return questions.value[questionIndex.value];
});

const progress = computed(() => {
  return (questionIndex.value / questions.value.length) * 100;
});

const toCamelCase = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const formattedTopic = toCamelCase(topic);

const submit = (answer) => {
  questionIndex.value += 1;
};
</script>

<style>
.section {
  height: 100vh;
}

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
