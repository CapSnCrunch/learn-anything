<template>
  <v-app-bar app elevation="0">
    <v-container class="d-flex align-center" style="max-width: 1200px">
      <v-row class="d-flex align-center pl-4 pr-4">
        <nuxt-link :to="{ path: '/' }" class="d-flex align-center text-decoration-none">
          <img src="../public/favicon.ico" height="30px" class="mr-2" />
          <img src="../assets/logo.png" height="40px" />
        </nuxt-link>
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
            <nuxt-link
              :to="{ path: '/login' }"
              class="text-decoration-none mr-2"
            >
              <LAButton :width="xs ? '45px' : '150px'" :height="xs ? '40px' : '35px'">
                <v-icon v-if="xs" icon="mdi-login" size="20px" color="darkGray" />
                <span v-else>Login</span>
              </LAButton>
            </nuxt-link>
            <nuxt-link v-if="!xs" :to="{ path: '/signup' }" class="text-decoration-none">
              <LAButton width="150px" height="35px">
                Create Account
              </LAButton>
            </nuxt-link>
          </div>
        </v-row>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import axios from "axios";
import { signOut } from "firebase/auth";
import { computed } from "vue";
import { useCurrentUser } from "vuefire";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";
// import { load, clear } from "../utils/localStorage";
import LAButton from "@/components/LAButton.vue";

const { xs, lgAndUp } = useDisplay();

const auth = useFirebaseAuth()!;
const user = useCurrentUser();
const router = useRouter();
const error = ref<Error | null>(null);

const savedTopicsList = ref([])

async function handleSignOut() {
  error.value = null;
  try {
    await signOut(auth);
    clear();
    router.push({ path: "/" });
  } catch (e) {
    console.error("Failed signOut", e);
    error.value = e;
  }
}

async function handleMyCourses() {
  const response = await axios.get("/api/getUserProgress");
  let progress = response?.data?.data?.topics || null

  let topicToRouteTo;
  if (progress) {
    topicToRouteTo = findTopicWithMostProgress(progress);
  }

  if (topicToRouteTo) {
    router.push({ path: "/course/" + topicToRouteTo });
  } else {
    router.push({ path: "/welcome" });
  }
  
};

const findTopicWithMostProgress = (topics) => {
  let maxTotalProgress = 0;
  let topicWithMaxProgress = "";

  for (const topic in topics) {
    let totalProgress = topics[topic].progress.reduce(
      (total, value) => total + value,
      0
    );
    if (totalProgress > maxTotalProgress) {
      maxTotalProgress = totalProgress;
      topicWithMaxProgress = topic;
    }
  }

  return topicWithMaxProgress;
};

onMounted(async () => {
  savedTopicsList.value = load(`learn-anything.topics`) || []
});
</script>
