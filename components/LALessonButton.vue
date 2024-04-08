<template>
  <div
    class="d-flex align-center justify-center text-decoration-none position-relative"
  >
    <div
      class="button ma-0 align-center justify-center position-absolute"
      style="width: 70px; height: 60px"
      :style="{ 'background-color': computedColor }"
    >
      <div class="text-eel">
        <v-icon icon="mdi-star-four-points" size="35px" color="white" />
      </div>
    </div>
    <div
      class="button-side"
      style="width: 70px; height: 60px"
      :style="{ 'background-color': computedColor }"
    >
      <div
        class="button-side"
        style="width: 70px; height: 60px"
        :style="{ 'background-color': 'rgba(0, 0, 0, 0.3)' }"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  color: {
    type: String,
    default: "#1cb0f6",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  complete: {
    type: Boolean,
    default: false,
  },
});

const computedColor = computed(() => {
  if (props.complete) {
    return "#FEBB3E";
  }
  return props.disabled ? "#AFAFAF" : props.color;
});
</script>

<style scoped>
.button {
  border-radius: 50%;
  transition: all 0.1s;
  display: inline-flex;
  padding: 12px 16px;
  cursor: pointer;
  bottom: 7px;
}

.button:active {
  bottom: 0px;
}

.button-side {
  border-radius: 50%;
  transition: all 0.1s;
}
</style>
