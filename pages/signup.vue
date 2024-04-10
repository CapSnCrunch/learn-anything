<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-row class="d-flex flex-column align-center justify-center">
      <v-col class="pa-0 ma-0">
        <v-sheet
          class="section d-flex align-center"
          style="padding-bottom: 200px"
        >
          <!-- Right side for login component -->
          <v-col
            cols="12"
            xs="12"
            sm="10"
            md="10"
            lg="4"
            xl="3"
            xxl="3"
            class="d-flex flex-column justify-start align-start"
          >
            <h3 class="text-eel mx-auto mb-8">Sign Up</h3>

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

            <LAButton class="w-100 mt-2 mb-4" @click="signup">
              SIGN UP
            </LAButton>

            <div class="d-flex w-100 align-center justify-center mb-4">
              <hr class="flex-fill" style="border: 1px solid #afafaf" />
              <p class="text-hare text-subtitle-1 mx-4">OR</p>
              <hr class="flex-fill" style="border: 1px solid #afafaf" />
            </div>

            <v-row class="w-100" no-gutters>
              <LAButton class="w-100" margin="0px" @click="signinPopup()">
                <div class="d-flex justify-center">
                  <img src="../assets/google-icon.svg" />
                  <h4 class="pl-4 text-macaw">GOOGLE</h4>
                </div>
              </LAButton>
            </v-row>

            <v-row class="d-flex justify-center w-100">
              <h2 class="text-eel text-h6">
                Already have an account?
                <nuxt-link :to="{ path: '/login' }"> Login instead </nuxt-link>
              </h2>
            </v-row>
          </v-col>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import LAButton from "@/components/LAButton.vue";
import { GoogleAuthProvider } from "firebase/auth";
import {
  getRedirectResult,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import {
  useCurrentUser,
  useFirebaseAuth,
  useIsCurrentUserLoaded,
} from "vuefire";

definePageMeta({
  linkTitle: "Login",
  order: 2,
});

const email = ref("");
const password = ref("");

const auth = useFirebaseAuth()!;
const user = useCurrentUser();
const isUserLoaded = useIsCurrentUserLoaded();
const error = ref<Error | null>(null);
const router = useRouter();

function signinRedirect() {
  const googleAuthProvider = new GoogleAuthProvider();
  signInWithRedirect(auth, googleAuthProvider).catch((reason) => {
    console.error("Failed signinRedirect", reason);
    error.value = reason;
  });
}

function signinPopup() {
  error.value = null;
  const googleAuthProvider = new GoogleAuthProvider();
  signInWithPopup(auth, googleAuthProvider).catch((reason) => {
    console.error("Failed signinPopup", reason);
    error.value = reason;
  });
  router.push({ path: "/welcome" });
}

onMounted(() => {
  getRedirectResult(auth).catch((reason) => {
    console.error("Failed redirect result", reason);
    error.value = reason;
  });
});
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
