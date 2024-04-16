<template>
  <v-app-bar app elevation="0">
    <v-container class="d-flex align-center" style="max-width: 1200px">
      <v-row class="d-flex align-center pl-4 pr-6">
        <nuxt-link :to="{ path: '/' }" class="text-decoration-none">
          <img src="../assets/logo.png" height="40px" />
        </nuxt-link>
        <v-row class="d-flex justify-end">
          <LAButton v-if="user" classes="px-4 py-1" @click="handleSignOut()"
            >Logout</LAButton
          >
          <nuxt-link
            v-else
            :to="{ path: '/signup' }"
            class="text-decoration-none"
          >
            <LAButton classes="px-4 py-1">Create Account</LAButton>
          </nuxt-link>
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
  clear();
  try {
    await signOut(auth);
    router.push({ path: "/login" });
  } catch (e) {
    console.error("Failed signOut", e);
    error.value = e;
  }
}
</script>
