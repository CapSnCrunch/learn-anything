<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-sheet
      class="d-flex align-center justify-center px-10"
      style="height: 100vh"
    >
      <v-row class="d-flex flex-wrap justify-center">
        <!-- Image column -->
        <v-col cols="12" lg="6" class="d-flex align-end justify-end">
          <!-- :class="lgAndUp ? 'justify-end' : 'justify-center'" -->
          <img
            src="../assets/login-image.png"
            style="width: 100%; max-width: 600px"
            class="mx-4"
          />
        </v-col>

        <!-- Content column -->
        <v-col
          :cols="xs ? 12 : 6"
          lg="6"
          class="d-flex align-center justify-start"
        >
          <!-- :class="lgAndUp ? 'justify-start' : 'justify-center'" -->
          <v-row
            class="d-flex flex-column align-center justify-center"
            style="width: 100%; max-width: 600px"
          >
            <h2 class="text-eel text-center text-h4 font-weight-bold mb-6">
              AI-crafted, personalized learning paths for any topic!
            </h2>
            <LAButton style="width: 350px">
              <nuxt-link :to="{ name: 'welcome' }" class="text-decoration-none">
                <h2 class="text-eel text-h6">Get Started</h2>
              </nuxt-link>
            </LAButton>
            <LAButton style="width: 350px">
              <nuxt-link :to="{ name: 'login' }" class="text-decoration-none">
                <h2 class="text-eel text-h6">I Already Have an Account</h2>
              </nuxt-link>
            </LAButton>
          </v-row>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script setup>
import LAButton from "@/components/LAButton.vue";
import { useDisplay } from "vuetify";

const { xs, lgAndUp } = useDisplay();
</script>
