import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "nuxt-vuefire",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: true,
    },
    config: {
      apiKey: "AIzaSyDLv7fDcq0lKfpBURi0shnzgiMjGX5-jtQ",
      authDomain: "learn-anything-63265.firebaseapp.com",
      projectId: "learn-anything-63265",
      storageBucket: "learn-anything-63265.appspot.com",
      messagingSenderId: "205593743745",
      appId: "1:205593743745:web:2b8632a3cb4ddd9426d880",
    },
  },
});
