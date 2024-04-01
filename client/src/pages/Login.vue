<template>
    <v-container no-gutters fluid fill-height class="pa-0 ma-0">
      <v-row class="d-flex flex-column align-center justify-center">
        <v-col class="pa-0 ma-0">
          <v-sheet
            class="section d-flex align-center"
            style="padding-bottom: 200px"
          >
            <!-- Right side for login component -->
            <v-col
              cols="12"
              xs="12"
              sm="10"
              md="10"
              lg="4"
              xl="3"
              xxl="3"
              class="d-flex flex-column justify-start align-start"
            >
                <h1 class="login-text mx-auto">Log In</h1>
                <div class="text-input-wrapper">
                    <input class="duolingo-text-input" v-model="email" data-test="email-input" type="text" placeholder="Email or username">
                    <button @click="email = ''" class="cancel-email-input-button" tabindex="-1" type="button">
                        <img src="../assets/cancel-circle.svg">
                    </button>
                </div>
                <div class="text-input-wrapper">
                    <input class="duolingo-text-input" v-model="password" data-test="email-input" type="password" placeholder="Password">
                    <router-link class="forgot-button" tabindex="-1" type="button" to="/forgot-password">
                        FORGOT?
                    </router-link>
                </div>
                <LAButton text="LOG IN" class="w-100" margin="0px"/>
                <div class="alt-login-divider">
                    <div class="horizontal-bar"></div>
                    <div class="upper-case-text-format or-styling">or</div>
                    <div class="horizontal-bar"></div>
                </div>
                <v-row class="w-100" no-gutters>
                    <v-col class="mr-2">
                        <LAButton text="FACEBOOK" class="w-100" margin="0px">
                            <img class="ml-5" src="../assets/facebook-icon.svg">
                        </LAButton>
                    </v-col>
                    <v-col class="ml-2">
                        <LAButton text="GOOGLE" class="w-100" margin="0px">
                            <img class="ml-5" src="../assets/google-icon.svg">
                        </LAButton>
                    </v-col>
                </v-row>
            </v-col>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import LAButton from '@/components/LAButton.vue'
  
  const email = ref('')
  const password = ref('')

  </script>
  
  <style scoped>
    :root {
        --input-primary-color: rgb(31, 36, 40);    
        --input-secondary-color: rgb(11, 125, 224); 
    }

    .button-wrapper .button {
        margin: 0 !important;
    }

    .section {
        height: 100vh;
        display: flex !important;
        align-items: start;
        justify-content: center;
        text-align: center;
        font-size: 24px;
        border: 2px solid red;
        position: relative;
    }
    input {
        box-shadow: none;   
    }
    input, textarea {
        -webkit-user-select: auto;
        -moz-user-select: auto;
        user-select: auto;
    }
    .duolingo-text-input {
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: none;
        border: none;
        box-sizing: border-box;
        caret-color: rgb(var(--color-macaw));
        color: var(--web-ui_input-color, rgb(var(--color-eel)));
        font: var(--text-body-weight) var(--text-body-size) / var(--text-body-line-height) din-round, sans-serif;
        font-size: var(--web-ui_input-font-size, var(--text-body-size));
        letter-spacing: var(--text-body-letter-spacing);
        line-height: var(--web-ui_input-line-height, 28px);
        min-width: 0;
        outline: none;
        padding: var(--web-ui_input-padding, 8px 6px 8px 14px);
        text-transform: var(--text-body-casing);
        width: 100%;
    }
    .login-text {
        font-size: 26px;
        margin: 10px 0 15px;
        text-align: center;
    }
    h1 {
        display: block;
        font-size: 2em;
        margin-block-start: 0.67em;
        margin-block-end: 0.67em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-weight: bold;
        unicode-bidi: isolate;
    }

    .text-input-wrapper:focus-within {
        border-color: rgb(11, 125, 224) !important;
    }

    .text-input-wrapper:not(:focus-within) .cancel-email-input-button {
        display: none;
    }

    .text-input-wrapper {
        background: rgb(var(--color-polar));
        /* border: 2px solid rgb(var(--input-primary-color)); */
        border: 2px solid rgb(31, 36, 40);
        border-radius: 12px;
        display: flex;
        overflow: hidden;
        margin-top: 8px;
        width: 100%;
    }

    .cancel-email-input {
        height: 24px;
        width: 24px;
        user-select: inherit;
        background: none;

    }

    .cancel-email-input-button {
        align-self: center;
        margin-left: 2px;
        margin-right: 6px;
        border: none;
        padding: 0;
        transition: filter .2s;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        cursor: pointer;
        display: inline-flex;
        outline: none;
        position: relative;
        touch-action: manipulation;
        transform: translateZ(0);
    }

    * :after, :before, button, button:focus, input, textarea{
        -webkit-tap-highlight-color: transparent;
        box-sizing: inherit;
        font-family: din-round, sans-serif;
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }
    img {
        overflow-clip-margin: content-box;
        overflow: clip;
    }

    .forgot-button {
        -webkit-font-smoothing: antialiased;
        align-self: center;
        color: rgb(var(--color-hare));
        font: 700 15px / 28px din-round, sans-serif;
        letter-spacing: .8px;
        margin-left: 2px;
        margin-right: 14px;
        text-decoration: none;
        text-transform: uppercase;
    }

    .alt-login-divider {
        align-items: center;
        display: flex;
        justify-content: center;
        margin: 20px 0;
        width: 100%;
    }

    .horizontal-bar {
        background: rgb(0,0,0);
        flex-grow: 1;
        height: 2px;
        display: block;
        unicode-bidi: isolate;
    }

    .or-styling {
        color: rgb(var(--color-hare));
        flex-grow: 0;
        padding: 0 8px;
    }

    .upper-case-text-format {
        font-size: 15px;
        font-weight: 700;
        letter-spacing: .8px;
        text-transform: uppercase;
    }
</style>


