<template>
  <v-app-bar app elevation="0">
    <v-container class="d-flex align-center" style="max-width: 1200px">
      <v-row class="d-flex align-center pl-4 pr-4">
        <div class="d-flex align-center text-decoration-none cursor-pointer" @click="handleHomeButton()">
          <img src="../public/favicon.ico" height="30px" class="mr-2" />
          <img src="../assets/logo.png" height="40px" />
        </div>
        <v-row class="d-flex justify-end">
          <LAButton v-if="!xs" class="mr-2" width="150px" height="40px" @click="handleMyCourses()">
            My Courses
          </LAButton>
          <div v-if="user" class="d-flex">
            <LAButton :width="xs ? '45px' : '150px'" height="40px" class="pr-4" @click="handleSignOut()">
              <v-icon v-if="xs" icon="mdi-logout" size="20px" color="darkGray" />
              <span v-else>Logout</span>
            </LAButton>
          </div>
          <div class="d-flex" v-else>
            <LAButton :class="xs ? 'mr-4' : 'mr-2'" :width="xs ? '45px' : '150px'" height="40px" @click="handleLogin()">
              <v-icon v-if="xs" icon="mdi-login" size="20px" color="darkGray" />
              <span v-else>Login</span>
            </LAButton>
            <LAButton v-if="!xs" width="150px" height="40px" @click="handleCreateAccount()">
              Create Account
            </LAButton>
          </div>
        </v-row>
        <ExitQuizModal
          v-model="backToCourseModalOpen" 
          :exit-path="exitPath"
          :fullscreen="xs"
          @close="backToCourseModalOpen = false"
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

const exitPath = ref({ path: "/" })
const backToCourseModalOpen = ref<boolean>(false);

const savedProgress = ref<any>([])

const accountRoutes = ['login', 'signup']
const assessmentRoutes = ['welcome-topicId', 'assessment-topicId-quizId']

const handleSignOut = async (): Promise<void> => {
  exitPath.value = { path: '/' }
  error.value = null;
  try {
    await signOut(auth);
    clear();
    savedProgress.value = []
    router.push(exitPath.value);
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
  if (accountRoutes.includes(route.name?.toString() || '')) {
    const redirectedFrom = route?.query?.redirectedFrom || '' as string;
    handleRoutingForAction('/login', redirectedFrom);
  } else {
    handleRoutingForAction('/login', route.path);
  }
}

const handleCreateAccount = (): void => {
  if (accountRoutes.includes(route.name?.toString() || '')) {
    const redirectedFrom = route?.query?.redirectedFrom || '' as string;
    handleRoutingForAction('/signup', redirectedFrom);
  } else {
    handleRoutingForAction('/signup', route.path);
  }
}

const handleRoutingForAction = (path: string, redirectedFrom?: string): void => {
  let query: string | { redirectedFrom: string } = ''
  if (redirectedFrom != '/') {
    query = redirectedFrom ? { redirectedFrom, } : '';
  }
  exitPath.value = { path: path, query }
  if (assessmentRoutes.includes(route.name?.toString() || '')) {
    backToCourseModalOpen.value = true
  } else {
    router.push(exitPath.value);
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
