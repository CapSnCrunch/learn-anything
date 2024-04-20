<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-sheet
      class="d-flex align-center justify-center px-10"
      style="height: 100vh"
    >
      <v-row class="d-flex flex-wrap justify-center align-center">
        <!-- Image column -->
        <v-col cols="12" lg="6" class="d-flex align-end" :class="lgAndUp ? 'justify-end' : 'justify-center'">
          <img
            src="../assets/login-image.png"
            style="width: 100%; max-width: 650px;"
          />
        </v-col>

        <!-- Content column -->
        <v-col xs="12" lg="6" class="d-flex align-center" :class="lgAndUp ? 'justify-start' : 'justify-center mt-8'">
          <v-row
            class="d-flex flex-column align-center justify-center"
            style="width: 100%; max-width: 600px"
          >
            <h2 class="text-darkGray text-center text-h4 font-weight-bold mb-6">
              AI-crafted, personalized learning paths for any topic!
            </h2>
            <LAButton 
              width="350px"
              :colors="{
                borderColor: 'linear-gradient(90deg, rgb(7.882% 49.92% 68.824%), rgb(37.06% 60.502% 6.824%))',
                borderColorHover: 'linear-gradient(90deg, rgb(7.882% 49.92% 68.824%), rgb(37.06% 60.502% 6.824%))',
                backgroundColor: 'linear-gradient(90deg, rgb(10.98% 69.02% 96.471%), rgb(53.725% 88.627% 9.804%))',
                backgroundColorHover: 'linear-gradient(90deg, rgb(10.98% 69.02% 96.471%), rgb(53.725% 88.627% 9.804%))',
              }"
            >
              <nuxt-link :to="{ name: 'welcome' }" class="text-decoration-none">
                <h2 class="text-white text-h6 font-weight-bold">Get Started</h2>
              </nuxt-link>
            </LAButton>
            <LAButton width="350px" class="mt-4">
              <nuxt-link :to="{ name: 'login' }" class="text-decoration-none">
                <h2 class="text-darkGray font-weight-bold" style="font-size: 18px">I Already Have an Account</h2>
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
