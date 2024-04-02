<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-row class="d-flex flex-column align-center justify-center">
      <v-col class="pa-0 ma-0">
        <v-sheet
          class="section d-flex align-center"
          style="padding-bottom: 200px"
        >
          <!-- Left side for image -->
          <v-col cols="6" class="d-flex justify-end align-center pr-10">
            <img src="../assets/login-image.png" width="600px" height="600px" />
          </v-col>

          <!-- Right side for login component -->
          <v-col
            cols="6"
            class="d-flex flex-column justify-start align-start pl-10"
          >
            <router-link :to="{ name: 'welcome' }" class="text-decoration-none">
              <LAButton
                text="Get Started"
                width="350px"
                class="text-decoration-none"
              />
            </router-link>
            <router-link class="text-decoration-none" to="/login">
              <LAButton text="I Already Have an Account" width="350px" />
            </router-link>
            <!-- <v-card class="pa-6">
                <v-card-title>Welcome to Learn Anything</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="login">
                    <v-text-field
                      v-model="email"
                      label="Email"
                    outlined
                              required
                            ></v-text-field>
                            <v-text-field
                              v-model="password"
                              label="Password"
                              outlined
                              required
                              type="password"
                            ></v-text-field>
                            <v-btn type="submit" color="primary">Login</v-btn>
                          </v-form>
              </v-card-text>
            </v-card> -->
          </v-col>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import LAButton from '@/components/LAButton.vue'
</script>

<style scoped>
.section {
  height: 100vh;
  display: flex !important;
  align-items: start;
  justify-content: center;
  text-align: center;
  font-size: 24px;
  border: 2px solid red;
  position: relative;
}
</style>
