<template>
  <v-app-bar app elevation="0">
    <v-container class="d-flex align-center" style="max-width: 960px">
      <v-row>
        <v-row>
          <router-link
            :to="{ path: '/' }"
            style="text-decoration: none; color: inherit"
          >
            <h1 class="text-feather mx-4" style="font-size: 20px">
              Learn Anything
            </h1>
          </router-link>
        </v-row>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup></script>
