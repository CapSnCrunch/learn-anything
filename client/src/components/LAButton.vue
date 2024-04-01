<template>
  <div class="button-wrapper">
    <div class="button" :style="{ width: width, margin: margin }">
      <slot />
      <p class="answer-number" v-if="number">{{ number }}</p>
      <p class="answer-choice">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  number: {
    type: Number,
    default: null,
  },
  text: String,
  width: {
    type: String, // Assuming width is passed as a string with 'px' suffix, e.g., '200px'
    default: '100%', // Default width of the button
  },
  margin: {
    type: String, // Assuming margin is passed as a string with 'px' suffix, e.g., '200px'
    default: '10px', // Default width of the button
  },
})
</script>

<style scoped>
.button-wrapper {
  width: fit-content;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.button {
  border-radius: 16px;
  border: 2px solid #e5e5e5;
  border-bottom: 6px solid #e5e5e5;
  transition: all 0.1s;
  display: inline-flex;
  padding: 12px 16px;
  cursor: pointer;
}

.button:hover {
  background-color: #ddf4ff;
  border-color: #1cb0f6;
}

.button:active {
  border-bottom: 2px solid #1cb0f6;
}

.answer-number {
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none; /* Make the number non-highlightable */
}

.answer-choice {
  width: 100%;
  text-align: center;
  font-size: 19px;
  color: #4b4b4b;
  user-select: none; /* Make the number non-highlightable */
}
</style>
