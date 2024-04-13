<template>
  <div class="button-wrapper text-decoration-none">
    <div class="button ma-0" :class="classes" :style="styleObject">
      <div class="content text-eel">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  text: String,
  classes: {
    type: String,
    default: "w-100",
  },
  colors: {
    type: Object,
    default: () => ({
      borderColor: "#e5e5e5",
      borderColorHover: "#1cb0f6",
      backgroundColor: "#ffffff",
      backgroundColorHover: "#ddf4ff",
    }),
  },
});

const styleObject = computed(() => {
  return {
    "--border-color": props.colors?.borderColor,
    "--border-color-hover": props.colors?.borderColorHover,
    "--background-color": props.colors?.backgroundColor,
    "--background-color-hover": props.colors?.backgroundColorHover,
  };
});
</script>

<style scoped>
.button-wrapper {
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.button {
  background-color: var(--background-color);
  border-radius: 16px;
  border: 2px solid var(--border-color);
  border-bottom: 6px solid var(--border-color);
  transition: all 0.1s;
  display: inline-flex;
  padding: 12px 16px;
  cursor: pointer;
}

.button:hover {
  background-color: var(--background-color-hover);
  border-color: var(--border-color-hover);
}

.button:active {
  border-bottom: 2px solid var(--border-color-hover);
}

.content {
  width: 100%;
  text-align: center;
  font-size: 16px;
  color: #4b4b4b;
  user-select: none;
}

.answer-number {
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
</style>
