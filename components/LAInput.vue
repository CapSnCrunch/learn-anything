<template>
  <div class="input-wrapper">
    <input
      class="input"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :style="{ width: width }"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: null,
  },
  width: {
    type: String, // Assuming width is passed as a string with 'px' suffix, e.g., '200px'
    default: '100%', // Default width of the input
  },
})
</script>

<style scoped>
.input-wrapper {
  width: fit-content;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.input {
  border-radius: 16px;
  border: 2px solid #e5e5e5;
  margin: 10px;
  transition: all 0.1s;
  display: inline-flex;
  padding: 12px 16px;
  cursor: pointer;
  outline: none;
}

.input:hover {
  border: 2px solid #1cb0f6;
}

.input:focus {
  border: 2px solid #1cb0f6;
}

.input:active {
  border: 2px solid #1cb0f6;
}
</style>
