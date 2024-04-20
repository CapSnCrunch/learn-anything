<template>
  <div class="progress-bar">
    <div class="progress" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  value: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100,
  },
});

const progress = computed(() => props.value);
</script>

<style scoped>
.progress-bar {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 16px;
  border: 2px solid #e5e5e5;
  padding: 1px 2px;
  transition: all 0.1s;
  overflow: hidden;
}

.progress {
  height: 100%;
  border-radius: 16px;
  transition: width 0.3s ease;
  background-image: linear-gradient(
    270deg,
    rgb(53.725% 88.627% 9.804%) 0%,
    rgb(51.054% 87.402% 15.221%) 6.25%,
    rgb(48.382% 86.176% 20.637%) 12.5%,
    rgb(45.711% 84.951% 26.054%) 18.75%,
    rgb(43.039% 83.725% 31.471%) 25%,
    rgb(40.368% 82.5% 36.887%) 31.25%,
    rgb(37.696% 81.275% 42.304%) 37.5%,
    rgb(35.025% 80.049% 47.721%) 43.75%,
    rgb(32.353% 78.824% 53.137%) 50%,
    rgb(29.681% 77.598% 58.554%) 56.25%,
    rgb(27.01% 76.373% 63.971%) 62.5%,
    rgb(24.338% 75.147% 69.387%) 68.75%,
    rgb(21.667% 73.922% 74.804%) 75%,
    rgb(18.995% 72.696% 80.221%) 81.25%,
    rgb(16.324% 71.471% 85.637%) 87.5%,
    rgb(13.652% 70.245% 91.054%) 93.75%,
    rgb(10.98% 69.02% 96.471%) 100%
  );
}
</style>
