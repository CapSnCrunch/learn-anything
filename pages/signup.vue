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
            <h3 class="text-darkGray text-center mb-2">Sign Up</h3>
            <h4 class="text-darkGray text-body-1 text-center mb-8">
              Create an account to track your progress!
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

            <LAInput
              v-model="password"
              placeholder="Password"
              type="password"
            />

            <LAButton
              class="w-100 mt-5"
              :class="error ? 'mb-0' : 'mb-4'"
              @click="signUpWithEmailAndPassword()"
            >
              <h4 class="text-darkGray font-weight-bold" style="font-size: 18px">SIGN UP</h4>
            </LAButton>

            <div
              v-if="error"
              class="d-flex align-center justify-center w-100 mb-4"
            >
              <h2 class="text-red text-center text-subtitle-2 font-weight-bold">
                There was an error signing up.
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
                Have an account?
                <span class="font-weight-bold text-h6 text-decoration-underline cursor-pointer" @click="handleRoutingToLogin()"> Login instead </span>
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
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useFirebaseAuth, useIsCurrentUserLoaded } from "vuefire";

useHead({
  title: 'Learn Anything | Sign Up',
})

const email = ref("");
const password = ref("");

const auth = useFirebaseAuth()!;
const error = ref<Error | null>(null);
const route = useRoute();
const router = useRouter();

const handleRoutingToLogin = (): void => {
  const redirectedFrom = route?.query?.redirectedFrom || '' as string;
  const query = redirectedFrom ? { redirectedFrom, } : '';
  router.push({ path: '/login', query });
}

async function signUpWithEmailAndPassword() {
  error.value = null;
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    // Consolidate local and saved progress
    const userProgress = await saveUserProgress();
    const topicWithMostProgress = findTopicWithMostProgress(
      userProgress?.topics
    );
    if (topicWithMostProgress) {
      router.push({ path: `/course/${topicWithMostProgress}` });
    } else {
      router.push({ path: "/welcome" });
    }
  } catch (reason: any) {
    console.error("Failed signup", reason);
    error.value = reason;
  }
}

async function signInWithGooglePopup() {
  error.value = null;
  const googleAuthProvider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, googleAuthProvider);

    // Consolidate local and saved progress
    const userProgress = await saveUserProgress();
    const topicWithMostProgress = findTopicWithMostProgress(
      userProgress?.topics
    );
    if (topicWithMostProgress) {
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
}

.highlight:hover {
  color: #afafaf !important;
}
</style>
