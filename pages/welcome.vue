<template>
  <v-container no-gutters fluid fill-height class="pa-0 ma-0">
    <v-row class="d-flex flex-column align-center justify-center">
      <v-col class="pa-0 ma-0">
        <v-sheet
          class="section d-flex justify-start align-start"
          style="padding-top: 200px"
        >
          <v-col
            cols="12"
            class="d-flex flex-column justify-center align-center pl-10"
          >
            <h2 class="mb-3">What do you want to learn?</h2>
            <LAInput
              v-model="inputValue"
              placeholder="I want to learn..."
              width="500px"
              class="mb-10"
            />
            <h4 class="mb-5 text-blue-grey-lighten-3">
              Not sure? Suggested topics:
            </h4>
          </v-col>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import LAInput from '@/components/LAInput.vue'

let inputValue = ref('')
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
