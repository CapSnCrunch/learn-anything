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
            <h3 class="text-eel mx-auto mb-8">Log in</h3>

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
                <img src="../assets/cancel-circle.svg" /></button
            ></LAInput>

            <LAInput v-model="password" placeholder="Password" type="password">
              <router-link
                class="text-decoration-none text-eel font-weight-bold text-subtitle-1 highlight"
                tabindex="-1"
                type="button"
                to="/forgot-password"
              >
                FORGOT?
              </router-link></LAInput
            >

            <LAButton class="w-100 mb-8" margin="0px">LOG IN</LAButton>

            <div class="d-flex w-100 align-center justify-center mb-2">
              <hr class="flex-fill" style="border: 1px solid #afafaf" />
              <p class="text-hare text-subtitle-1 mx-4">OR</p>
              <hr class="flex-fill" style="border: 1px solid #afafaf" />
            </div>

            <v-row class="w-100" no-gutters>
              <v-col class="mr-2">
                <LAButton class="w-100" margin="0px">
                  <div class="d-flex justify-center">
                    <img src="../assets/facebook-icon.svg" />
                    <h4 class="pl-4 text-humpback">FACEBOOK</h4>
                  </div>
                </LAButton>
              </v-col>
              <v-col class="ml-2">
                <LAButton class="w-100" margin="0px">
                  <div class="d-flex justify-center">
                    <img src="../assets/google-icon.svg" />
                    <h4 class="pl-4 text-macaw">GOOGLE</h4>
                  </div>
                </LAButton>
              </v-col>
            </v-row>
          </v-col>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import LAButton from "@/components/LAButton.vue";

const email = ref("");
const password = ref("");
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

.highlight:hover {
  color: #afafaf !important;
}
</style>
