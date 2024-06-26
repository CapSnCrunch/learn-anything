<template>
  <v-container no-gutters fluid fill-height class="d-flex justify-center pa-0 ma-0">
    <v-row class="d-flex flex-column align-center justify-center px-2" style="max-width: 100vw">
      <v-col class="pa-0 ma-0" style="max-width: 1200px;">
        <v-sheet class="section d-flex align-center justify-center">
          <v-col
            cols="12"
            sm="7"
            md="5"
            lg="4"
            class="d-flex flex-column justify-center align-center ma-0"
            style="max-width: 100vw"
          >
            <h3 class="text-darkGray mb-2">Log In</h3>
            <h4 class="text-darkGray text-body-1 text-center mb-8">
              Welcome back!
            </h4>

            <LAInput
              v-model="email"
              placeholder="Email"
              type="text"
              class="mb-4"
            >
              <button
                @click="email = ''"
                class="d-inline-flex align-self-center highlight"
                type="button"
              >
                <img src="../assets/cancel-circle.svg" />
              </button>
            </LAInput>

            <LAInput v-model="password" placeholder="Password" type="password">
              <h2
                class="highlight text-gray font-weight-bold mt-1"
                style="font-size: 16px;"
                @click="resetPassword()"
              >
                FORGOT?
              </h2>
            </LAInput>

            <LAButton
              class="w-100 mt-5"
              :class="error || message ? 'mb-0' : 'mb-4'"
              @click="signInWithEmailPassword()"
            >
              <h4 class="text-darkGray font-weight-bold" style="font-size: 18px">LOGIN</h4>
            </LAButton>

            <div
              v-if="message"
              class="d-flex align-center justify-center w-100 mb-4"
            >
              <h2
                class="text-green text-center text-subtitle-2 font-weight-bold"
              >
                {{ message }}
              </h2>
            </div>

            <div
              v-if="error"
              class="d-flex align-center justify-center w-100 my-4"
            >
              <h2 class="text-red text-center text-subtitle-2 font-weight-bold">
                There was an error logging in.
              </h2>
            </div>

            <div class="d-flex w-100 align-center justify-center mb-4">
              <hr class="flex-fill" style="border: 1px solid #e5e5e5" />
              <p class="text-hare text-subtitle-1 mx-4">OR</p>
              <hr class="flex-fill" style="border: 1px solid #e5e5e5" />
            </div>

            <v-row class="w-100" no-gutters>
              <LAButton class="w-100 mt-1" @click="signInWithGooglePopup()">
                <div class="d-flex justify-center">
                  <img src="../assets/google-icon.svg" />
                  <h2 class="pl-4 text-darkGray font-weight-bold" style="font-size: 18px">GOOGLE</h2>
                </div>
              </LAButton>
            </v-row>

            <v-row class="d-flex justify-center w-100 mt-6">
              <h2 class="text-darkGray text-h6">
                Don't have an account?
                <span class="font-weight-bold text-h6 text-decoration-underline cursor-pointer" @click="handleRoutingToSignup()"> Create one </span>
              </h2>
            </v-row>
          </v-col>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { load, clear } from "@/utils/localStorage";
import LAButton from "@/components/LAButton.vue";
import { GoogleAuthProvider } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { useFirebaseAuth } from "vuefire";

useHead({
  title: 'Learn Anything | Login',
})

const email = ref("");
const password = ref("");

const auth = useFirebaseAuth()!;
const error = ref<Error | null>(null);
const message = ref<string>("");
const route = useRoute();
const router = useRouter();

const handleRoutingToSignup = (): void => {
  const redirectedFrom = route?.query?.redirectedFrom || '' as string;
  const query = redirectedFrom ? { redirectedFrom, } : '';
  router.push({ path: '/signup', query });
}

async function signInWithEmailPassword() {
  try {
    error.value = null;
    message.value = "";
    const credential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    // Consolidate local and saved progress
    const userProgress = await saveUserProgress();
    const topicWithMostProgress = findTopicWithMostProgress(
      userProgress?.topics
    );

    const redirectedFrom = route?.query?.redirectedFrom as string | undefined;

    if (redirectedFrom) {
      router.push({ path: `${redirectedFrom}` });
    } else if (topicWithMostProgress) {
      router.push({ path: `/course/${topicWithMostProgress}` });
    } else {
      router.push({ path: "/welcome" });
    }
  } catch (reason: any) {
    console.error("Failed signin with email and password", reason);
    error.value = reason;
  }
}

async function signInWithGooglePopup() {
  error.value = null;
  message.value = "";
  const googleAuthProvider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, googleAuthProvider);

    // Consolidate local and saved progress
    const userProgress = await saveUserProgress();
    const topicWithMostProgress = findTopicWithMostProgress(
      userProgress?.topics
    );

    const redirectedFrom = route?.query?.redirectedFrom as string | undefined;

    if (redirectedFrom) {
      router.push({ path: `${redirectedFrom}` });
    } else if (topicWithMostProgress) {
      router.push({ path: `/course/${topicWithMostProgress}` });
    } else {
      router.push({ path: "/welcome" });
    }
  } catch (reason: any) {
    console.error("Failed signinPopup", reason);
    error.value = reason;
  }
}

const saveUserProgress = async () => {
  // Set new user's progress to their current local progress
  let localProgress: any = {};

  const savedTopicsList = load("learn-anything.topics") || [];
  for (const topic of savedTopicsList) {
    let savedTopic = load(`learn-anything.${topic}`);
    localProgress[topic] = savedTopic;
  }

  const response = await axios.post("/api/updateProgressByLocalProgress", {
    localProgress: localProgress,
  });

  clear();

  return response?.data?.data;
};

async function resetPassword() {
  error.value = null;
  message.value = "";
  try {
    await sendPasswordResetEmail(auth, email.value);
    message.value = "Password reset email sent.";
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}

const findTopicWithMostProgress = (topics: any[]) => {
  let maxTotalProgress = -1;
  let topicWithMaxProgress = "";

  for (const topic in topics) {
    let totalProgress = topics[topic].progress.reduce(
      (total: number, value: number) => total + value,
      0
    );
    if (totalProgress > maxTotalProgress) {
      maxTotalProgress = totalProgress;
      topicWithMaxProgress = topic;
    }
  }

  return topicWithMaxProgress;
};
</script>

<style>
.section {
  height: 100vh;
  display: flex !important;
  align-items: start;
  justify-content: center;
  text-align: center;
  font-size: 24px;
  position: relative;
}

.highlight:hover {
  color: #afafaf !important;
}
</style>