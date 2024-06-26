<template>
    <LAModal
      v-model="value"
      width="600px"
      max-width="600px"
      height="600px"
      :fullscreen="fullscreen"
      @close="close()"
    >
        <template #title>
          <h2 class="text-darkGray text-h4 font-weight-bold">
            Course Settings
          </h2>
        </template>
        <template #text>
            <v-row class="d-flex flex-column px-3 mt-4">
              <h2 class="text-darkGray text-h6 font-weight-medium">
                Visit courses or delete them by typing out their full name
              </h2>
            </v-row>
            <div class="scrollbox mt-6" style="height: 420px;">
                <div v-for="([topicId, topic], index) of Object.entries(userProgress).sort()" :key="`course-button-${topicId}`" class="d-flex flex-column w-100">
                  <v-row class="d-flex align-center w-100" :class="xs ? 'mx-0' : 'mr-1'">
                    <v-col cols="12" sm="6" :class="xs ? 'pb-2' : 'pb-2 pr-1'">
                      <nuxt-link
                        :to="'/course/' + topicId"
                        class="text-decoration-none w-100"
                      >
                        <LAButton class="w-100 mt-3 mb-1" style="max-width: 350px">
                          <div class="d-flex flex-column align-center justify-center w-100">
                          <h2 class="text-darkGray text-subtitle-1 text-center font-weight-bold">{{ titleCase(topicId) }}</h2>
                            <LAProgressBar :value="computeTotalTopicProgress(topic)" style="height: 12px; width: 125px;" />
                          </div>
                        </LAButton>
                      </nuxt-link>
                    </v-col>
                    <v-col cols="12" sm="6" class="d-flex justify-start align-center px-1" :class="xs ? 'pt-0 mb-4' : 'pt-2'">
                      <LAInput
                        v-model="inputs[index]"
                        :placeholder="`'${topicId}' to delete`"
                        class="mx-2 w-100"
                        style="height: 50px; max-width: 300px; font-size: 16px;"
                      />
                      <LAButton 
                        width="45px"
                        height="40px" 
                        :colors="isInputCorrect(index, topicId) ?
                          {
                            borderColor: '#ff4b4b',
                            borderColorHover: '#ff4b4b',
                            backgroundColor: '#ffdddd',
                            backgroundColorHover: '#ffdddd',
                          } :
                          {
                            borderColor: '#afafaf',
                            borderColorHover: '#afafaf',
                            backgroundColor: '#e5e5e5',
                            backgroundColorHover: '#e5e5e5',
                          }
                        "
                        @click="handleDelete(index, topicId)"
                      >
                        <v-icon icon="mdi-trash-can" size="25px" color="darkGray" />
                      </LAButton>
                    </v-col>
                  </v-row>
                </div>
            </div>
        </template>
    </LAModal>
</template>

<script setup lang="ts">
import axios from "axios"
import { useDisplay } from "vuetify"
import { defineProps, defineEmits } from "vue";
import { save, load, remove } from "@/utils/localStorage";
import { kebabCase, titleCase } from "@/server/utils/strings";

const { xs } = useDisplay()

const emits = defineEmits(["close", "refresh"]);
const props = defineProps({
  userProgress: {
    type: Object,
    default: {}
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
});

const value = ref(false);
const inputs = ref([])

const computeTotalTopicProgress = (topic: any) => {
  return (topic?.progress?.reduce((a: number, b: number) => a + b, 0) * (100/70)) || 0
}

const isInputCorrect = (index: number, topicId: string): boolean => {
  return kebabCase(inputs.value[index]) == topicId
}

const handleDelete = async (index: number, topicId: string): Promise<void> => {
  if (!isInputCorrect(index, topicId)) {
    return
  }

  remove(`learn-anything.${topicId}`);

  let savedTopicsList = load(`learn-anything.topics`) || [];
  let indexOfTopic = savedTopicsList.indexOf();
  if (indexOfTopic != -1) {
    savedTopicsList = savedTopicsList.splice(indexOfTopic, 1)
    save(`learn-anything.topics`, savedTopicsList)
  }

  try {
    await axios.post("/api/deleteUserTopic", {
      topicId: topicId
    });
  } catch (error) {
    console.warn(error)
  }

  inputs.value = []
  emits("refresh", topicId);
};

function close() {
  emits("close");
}
</script>

<style scoped>
.scrollbox {
  overflow-y: auto;
  scrollbar-color: #afafaf #f0f0f0;
  height: 100%;
  z-index: 999;
}
</style>