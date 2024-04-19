<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-sheet
      class="d-flex justify-center align-start"
      style="padding-top: 150px; height: 100vh"
    >
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
          <!-- <h2 class="text-darkGray text-h4 font-weight-bold">
            
          </h2> -->
          <LAButton class="mt-8" width="500px">
            <nuxt-link
              :to="'/course/' + topicId?.toLowerCase()"
              class="d-flex text-decoration-none align-center justify-center"
            >
              <h2 class="text-darkGray text-h6">Continue to Course</h2>
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
const user = useCurrentUser();

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
