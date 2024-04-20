<template>
  <div class="hover d-flex align-center justify-center text-decoration-none position-relative">
    <div class="button ma-0 align-center justify-center position-absolute"
      :style="{
        'height': height,
        'width': width,
        '--border-size': border,
        '--background-color': colors.backgroundColor,
        '--background-color-hover': colors.backgroundColorHover,
        '--border-color': colors.borderColor,
        '--border-color-hover': colors.borderColorHover,
      }"
    >
      <div class="text-darkGray">
        <slot />
      </div>
    </div>
    <div class="button-side"
      :style="{
        'height': height,
        'width': width,
        '--border-color': colors.borderColor,
        '--border-color-hover': colors.borderColorHover
      }"
    >
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "60px",
  },
  border: {
    type: String,
    default: "5px"
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
</script>

<style scoped>
.button {
  border-radius: 16px;
  transition: all 0.1s;
  display: inline-flex;
  padding: 12px 16px;
  cursor: pointer;
  border: 2px solid var(--border-color);
  bottom: var(--border-size);
  background-color: var(--background-color);
  background: var(--background-color);
}

.button:active {
  bottom: 0px;
}

.button-side {
  border-radius: 16px;
  transition: all 0.1s;
  background-color: var(--border-color);
  background: var(--border-color);
}

.hover:hover {
  .button {
    background-color: var(--background-color-hover);
    background: var(--background-color-hover);
    border: 2px solid var(--border-color-hover);
  }

  .button-side {
    background-color: var(--border-color-hover);
    background: var(--border-color-hover);
  }
}
</style>
