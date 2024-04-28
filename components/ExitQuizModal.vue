<template>
  <LAModal
    v-model="value"
    width="600px"
    max-width="600px"
    height="300px"
    @close="close()"
  >
    <template #title>
      <h2 class="text-darkGray text-h4 font-weight-bold">
        Leave Assessment?
      </h2>
    </template>
    <template #text>
      <v-row class="d-flex flex-column px-3 mt-4">
        <h2 class="text-darkGray text-h5">
          Are you sure you want to exit the assessment?
          <span class="font-weight-bold">
            Your progress will not be saved.
          </span>
        </h2>
        <v-row class="d-flex justify-end mt-12">
          <LAButton @click="close()" width="150px">
            <h2 class="font-weight-medium">
              Stay Here
            </h2>
          </LAButton>
          <LAButton class="ml-4" @click="exit()" width="150px">
            <h2 class="font-weight-medium">
              Exit
            </h2>
          </LAButton>
        </v-row>
      </v-row>
    </template>
  </LAModal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";

const emits = defineEmits(["close", "exit"]);
const router = useRouter();
const props = defineProps({
  exitPath: {
    type: Object,
    default: () => { 
      return { path: '/' }
    }
  }
});

const value = ref(false);

function close() {
  emits("close");
}

const exit = (): void => {
  emits("close");
  emits("exit");
  router.push(props.exitPath);
};
</script>