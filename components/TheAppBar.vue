<template>
  <v-app-bar app elevation="0">
    <v-container class="d-flex align-center" style="max-width: 1200px">
      <v-row class="d-flex align-center pl-4 pr-6">
        <nuxt-link :to="{ path: '/' }" class="text-decoration-none">
          <img src="../assets/logo.png" height="40px" />
        </nuxt-link>
        <v-row class="d-flex justify-end">
          <LAButton v-if="user" classes="px-4 py-1" @click="handleSignOut()">
            Logout
          </LAButton>
          <div class="d-flex" v-else>
            <nuxt-link
              :to="{ path: '/login' }"
              class="text-decoration-none mr-4"
            >
              <LAButton classes="px-4 py-1" style="width: 150px">
                Login
              </LAButton>
            </nuxt-link>
            <nuxt-link :to="{ path: '/signup' }" class="text-decoration-none">
              <LAButton classes="px-4 py-1" style="width: 150px">
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
import { signOut } from "firebase/auth";
import { useCurrentUser } from "vuefire";
import LAButton from "./LAButton.vue";
import { useRouter } from "vue-router";
import { clear } from "@/utils/localStorage";

const auth = useFirebaseAuth()!;
const user = useCurrentUser();
const router = useRouter();
const error = ref<Error | null>(null);

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
</script>
