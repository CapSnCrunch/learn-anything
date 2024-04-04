<template>
  <div class="input-wrapper" :style="{ width: width }">
    <input
      class="input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <slot />
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: null,
  },
  width: {
    type: String, // Assuming width is passed as a string with 'px' suffix, e.g., '200px'
    default: "100%", // Default width of the input
  },
});
</script>

<style scoped>
.input-wrapper {
  width: fit-content;
  border-radius: 16px;
  border: 2px solid #e5e5e5;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
  transition: all 0.1s;
  display: inline-flex;
  padding: 12px 16px;
  cursor: pointer;
}

.input {
  outline: none;
}

.input-wrapper:hover {
  border: 2px solid #1cb0f6;
}

.input-wrapper:focus {
  border: 2px solid #1cb0f6;
}

.input-wrapper:active {
  border: 2px solid #1cb0f6;
}
</style>
