<template>
  <v-dialog
    v-model="value"
    :fullscreen="fullscreen"
    :width="fullscreen ? '100%' : width"
    :max-width="fullscreen ? '100%' : maxWidth"
    :height="fullscreen ? '100%' : height"
    v-bind="$attrs"
    @keydown="keyListener"
  >
    <div
      class="bg-white pa-8 h-100"
      :class="fullscreen ? '' : 'rounded-xl'"
      style="box-shadow: rgba(0, 0, 0, 20%) 0px 0px 15px 15px"
    >
      <div class="d-flex w-100 justify-space-between align-center">
        <slot name="title" />
        <v-icon
          icon="mdi-close"
          size="30px"
          color="darkGray"
          @click="close()"
        />
      </div>
      <slot name="text" />
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  width: {
    type: String,
    default: "750px",
  },
  maxWidth: {
    type: String,
    default: "750px",
  },
  height: {
    type: String,
    default: "500px",
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
});

const value = ref(false);

const emits = defineEmits(["close"]);

function keyListener(event: KeyboardEvent) {
  if (event.keyCode === 27) {
    emits("close");
  }
}

function close() {
  emits("close");
}
</script>
