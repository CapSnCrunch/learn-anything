<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-row class="d-flex flex-column align-center justify-center">
      <v-col class="pa-0 ma-0">
        <v-sheet
          class="section d-flex align-center"
          style="padding-bottom: 200px"
        >
          <v-col cols="6" class="d-flex justify-end align-center pr-10">
            <img src="../assets/login-image.png" width="600px" height="600px" />
          </v-col>

          <v-col
            cols="6"
            class="d-flex flex-column justify-start align-start pl-10"
          >
            <LAButton width="350px">
              <nuxt-link :to="{ name: 'welcome' }" class="text-decoration-none">
                <h2 class="text-eel text-h6">Get Started</h2>
              </nuxt-link>
            </LAButton>
            <LAButton width="350px">
              <nuxt-link :to="{ name: 'login' }" class="text-decoration-none">
                <h2 class="text-eel text-h6">I Already Have an Account</h2>
              </nuxt-link>
            </LAButton>
          </v-col>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import LAButton from "@/components/LAButton.vue";
</script>

<style scoped>
.section {
  height: 100vh;
  display: flex !important;
  align-items: start;
  justify-content: center;
  text-align: center;
  font-size: 24px;
  position: relative;
}
</style>
