<template>
  <div class="input-wrapper" :class="smallerInput ? 'smaller-input' : ''" :style="{ width: width }">
    <input
      class="input d-flex w-100"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.enter="handleEnterKey"
    />
    <slot />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

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
    type: String,
    default: "100%",
  },
  smallerInput: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["enter"]);

const handleEnterKey = (event) => {
  if (event.key === "Enter") {
    emits("enter");
  }
};
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

.smaller-input {
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 16px;
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
