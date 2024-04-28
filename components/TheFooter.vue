<template>
    <div class="footer-top" :style="xs ? 'height: 300px;' : 'height: 250px;'">
        <div class="d-flex flex-column align-center justify-center px-4">
            <h2 class="d-flex align-center justify-center text-white text-h6">
                <img
                    v-if="!xs"
                    src="../assets/icon-white.png"
                    width="25px"
                    class="mr-3"
                />
                <span class="text-center">
                    <a href="https://github.com/CapSnCrunch/learn-anything" target="_blank" class="ml-1 text-white text-decoration-none cursor-pointer font-weight-bold">Learn Anything</a> is a project by
                    <a href="https://capsncrunch.github.io/" target="_blank" class="ml-1 text-white text-decoration-none cursor-pointer font-weight-bold">Samuel Perales</a>
                </span>
            </h2>
            <h2 class="d-flex align-center justify-center text-white text-subtitle-1" :class="xs ? 'mt-3' : 'mt-6'">
                <span class="text-center">
                    This project is a submission for the <a href="https://googleai.devpost.com/" target="_blank" class="ml-1 text-white text-decoration-none cursor-pointer font-weight-bold">Google AI Hackathon on Devpost</a>.
                    <span v-if="xs" class="text-center">
                        Please report bugs on the <a href="https://github.com/CapSnCrunch/learn-anything/issues" target="_blank" class="ml-1 text-white text-decoration-none cursor-pointer font-weight-bold">GitHub Repo</a>. Happy Learning!
                    </span>
                </span>
            </h2>
            <h2 v-if="!xs" class="d-flex align-center justify-center text-white text-subtitle-1">
                <span class="text-center">
                    Please report bugs on the <a href="https://github.com/CapSnCrunch/learn-anything/issues" target="_blank" class="ml-1 text-white text-decoration-none cursor-pointer font-weight-bold">GitHub Repo</a>. Happy Learning!
                </span>
            </h2>
            <img
                v-if="xs"
                src="../assets/icon-white.png"
                width="35px"
                class="mt-6"
            />
        </div>
    </div>
</template>

<script setup>
import { useDisplay } from "vuetify"

const { xs } = useDisplay()

</script>
  
<style scoped>
.footer-top {
    width: 100%;
    height: 250px;
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #45bfc3;
}
</style>