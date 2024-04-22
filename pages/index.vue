<template>
  <v-container no-gutters fluid class="pa-0 ma-0">
    <v-sheet class="d-flex flex-column align-center justify-center" style="height: 100vh;">
      <v-row class="d-flex flex-wrap justify-center align-center h-100 pt-8">
        <v-col cols="12" lg="6" class="d-flex align-end ma-0 pa-4" :class="lgAndUp ? 'justify-end' : 'justify-center mt-8'">
          <img
            src="../assets/login-image.png"
            style="width: 100%; max-width: 650px;"
          />
        </v-col>

        <v-col xs="12" lg="6" class="d-flex align-center ma-0 pa-0" :class="lgAndUp ? 'justify-start' : 'justify-center mt-2'">
          <v-row
            class="d-flex flex-column align-center justify-center"
            :class="lgAndUp ? 'px-0' : 'mx-4 ml-6'"
            style="width: 100%; max-width: 600px"
          >
            <h2 class="text-darkGray text-center text-h4 font-weight-bold mb-6">
              AI-crafted, personalized learning paths for any topic!
            </h2>
            <LAButton 
              width="350px"
              :colors="{
                borderColor: 'linear-gradient(90deg, rgb(7.882% 49.92% 68.824%), rgb(37.06% 60.502% 6.824%))',
                borderColorHover: 'linear-gradient(90deg, rgb(11.882% 59.92% 78.824%), rgb(47.06% 70.502% 16.824%))',
                backgroundColor: 'linear-gradient(90deg, rgb(10.98% 69.02% 96.471%), rgb(53.725% 88.627% 9.804%))',
                backgroundColorHover: 'linear-gradient(90deg, rgb(14.98% 75.02% 100%), rgb(64.725% 93.627% 20.804%))',
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
      <v-row class="d-flex w-100 ma-0 pa-0" :class="lgAndUp ? 'pb-8' : 'pt-8'">
        <Vue3Marquee style="height: 80px;" duration="80">
          <LAButton v-for="topic in topics" width="300px" height="50px" class="mx-2 pt-2">
            <nuxt-link :to="'/welcome/' + topic.topicId" class="text-decoration-none">
              <h2 class="text-darkGray font-weight-bold" style="font-size: 18px">{{ topic.name }}</h2>
            </nuxt-link>
          </LAButton>
        </Vue3Marquee>
      </v-row>
    </v-sheet>
    <!-- <v-sheet
      class="d-flex align-center justify-center px-10"
      style="height: 100vh"
    >
      <v-row class="d-flex flex-column flex-wrap justify-center align-center">
        <v-col xs="12" lg="6" class="d-flex align-center justify-center">
          <h2>test</h2>
        </v-col>
        <v-col xs="12" lg="6" class="d-flex align-center justify-center">
          <h2>test</h2>
        </v-col>
        <v-col xs="12" lg="6" class="d-flex align-center justify-center">
          <h2>test</h2>
        </v-col>
        <v-col xs="12" lg="6" class="d-flex align-center justify-center">
          <h2>test</h2>
        </v-col>
      </v-row>
    </v-sheet> -->
  </v-container>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useDisplay } from "vuetify";
import LAButton from "@/components/LAButton.vue";

const { xs, lgAndUp } = useDisplay();
const topics = ref([])

onMounted(async () => {
  const response = await axios.post("/api/getRandomTopics", {
    count: 20,
  });
  topics.value = response?.data?.data
})

</script>
