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
            class="d-flex flex-column justify-center align-center"
          >
            <h3 class="text-eel mx-auto mb-8">Log In</h3>

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
                class="highlight text-subtitle-1 font-weight-bold"
                @click="resetPassword()"
              >
                FORGOT?
              </h2>
            </LAInput>

            <LAButton
              class="w-100 mt-2"
              :class="error || message ? 'mb-0' : 'mb-4'"
              @click="signInWithEmailPassword()"
            >
              <h4 class="text-wolf font-weight-bold">LOGIN</h4>
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
              class="d-flex align-center justify-center w-100 mb-4"
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
              <LAButton class="w-100" @click="signInWithGooglePopup()">
                <div class="d-flex justify-center">
                  <img src="../assets/google-icon.svg" />
                  <h4 class="pl-4 text-wolf font-weight-bold">GOOGLE</h4>
                </div>
              </LAButton>
            </v-row>

            <v-row class="d-flex justify-center w-100">
              <h2 class="text-eel text-h6">
                Don't have an account?
                <nuxt-link :to="{ path: '/signup' }"> Create one </nuxt-link>
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
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { useFirebaseAuth } from "vuefire";

const email = ref("");
const password = ref("");

const auth = useFirebaseAuth()!;
const error = ref<Error | null>(null);
const message = ref("");
const router = useRouter();

async function signInWithEmailPassword() {
  try {
    error.value = null;
    message.value = null;
    const credential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    router.push({ path: "/welcome" });
  } catch (reason) {
    console.error("Failed signin with email and password", reason);
    error.value = reason;
  }
}

async function resetPassword() {
  try {
    error.value = null;
    message.value = null;
    await sendPasswordResetEmail(auth, email.value);
    message.value = "Password reset email sent.";
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}

async function signInWithGooglePopup() {
  error.value = null;
  message.value = null;
  const googleAuthProvider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, googleAuthProvider);
    router.push({ path: "/welcome" });
  } catch (reason) {
    console.error("Failed signinPopup", reason);
    error.value = reason;
  }
}
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
