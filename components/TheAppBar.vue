<template>
  <v-app-bar app elevation="0">
    <v-container class="d-flex align-center" style="max-width: 1200px">
      <v-row class="d-flex align-center pl-4 pr-4">
        <div class="d-flex align-center text-decoration-none cursor-pointer" @click="handleHomeButton()">
          <img src="../public/favicon.ico" height="30px" class="mr-2" />
          <img src="../assets/logo.png" height="40px" />
        </div>
        <v-row class="d-flex justify-end">
          <LAButton class="mr-2" width="150px" :height="xs ? '40px' : '35px'" @click="handleMyCourses()">
            My Courses
          </LAButton>
          <div v-if="user" class="d-flex">
            <LAButton :width="xs ? '45px' : '150px'" :height="xs ? '40px' : '35px'" class="pr-4" @click="handleSignOut()">
              <v-icon v-if="xs" icon="mdi-logout" size="20px" color="darkGray" />
              <span v-else>Logout</span>
            </LAButton>
          </div>
          <div class="d-flex" v-else>
            <LAButton class="mr-2" :width="xs ? '45px' : '150px'" :height="xs ? '40px' : '35px'" @click="handleLogin()">
              <v-icon v-if="xs" icon="mdi-login" size="20px" color="darkGray" />
              <span v-else>Login</span>
            </LAButton>
            <LAButton width="150px" height="35px" @click="handleCreateAccount()">
              Create Account
            </LAButton>
          </div>
        </v-row>
        <ExitQuizModal
          v-model="backToCourseDialogIsOpen" 
          :exit-path="exitPath"
          @close="backToCourseDialogIsOpen = false"
        />
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import axios from "axios";
import { signOut } from "firebase/auth";
import { useCurrentUser } from "vuefire";
import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";
import { load, clear } from "../utils/localStorage";
import LAButton from "@/components/LAButton.vue";

const { xs } = useDisplay();

const auth = useFirebaseAuth()!;
const user = useCurrentUser();
const error = ref<Error | null>(null);

const route = useRoute();
const router = useRouter();

const exitPath = ref<string>("/")
const backToCourseDialogIsOpen = ref<boolean>(false);

const savedProgress = ref<any>([])

const assessmentRoutes = ['welcome-topicId', 'assessment-topicId-quizId']

const handleSignOut = async (): Promise<void> => {
  error.value = null;
  try {
    await signOut(auth);
    clear();
    router.push({ path: exitPath.value });
  } catch (e: any) {
    console.error("Failed signOut", e);
    error.value = e;
  }
}

const handleMyCourses = async (): Promise<void> => {
  const response = await axios.get("/api/getUserProgress");
  let progress = response?.data?.data?.topics || savedProgress.value || []

  let topicToRouteTo;
  if (progress) {
    topicToRouteTo = findTopicWithMostProgress(progress);
  }

  if (topicToRouteTo) {
    handleRoutingForAction('/course/' + topicToRouteTo)
  } else {
    handleRoutingForAction('/welcome')
  }
};

const handleHomeButton = (): void => {
  handleRoutingForAction('/')
}

const handleLogin = async (): Promise<void> => {
  handleRoutingForAction('/login')
}

const handleCreateAccount = (): void => {
  handleRoutingForAction('/signup')
}

const handleRoutingForAction = (path: string): void => {
  exitPath.value = path || '/'
  if (assessmentRoutes.includes(route.name?.toString() || '')) {
    backToCourseDialogIsOpen.value = true
  } else {
    router.push({ path: exitPath.value });
  }
}

const findTopicWithMostProgress = (topics: any[]): string => {
  let maxTotalProgress = -1;
  let topicWithMaxProgress = "";

  for (const topic in topics) {
    let totalProgress = topics[topic]?.progress?.reduce(
      (total: number, value: number) => total + value,
      0
    ) || 0;
    if (totalProgress > maxTotalProgress) {
      maxTotalProgress = totalProgress;
      topicWithMaxProgress = topic;
    }
  }

  return topicWithMaxProgress;
};

onMounted(async () => {
  let localProgress: any = {};

  const savedTopicsList = load("learn-anything.topics") || [];
  for (const topic of savedTopicsList) {
    let savedTopic = load(`learn-anything.${topic}`);
    localProgress[topic] = savedTopic;
  }

  savedProgress.value = localProgress

});
</script>
