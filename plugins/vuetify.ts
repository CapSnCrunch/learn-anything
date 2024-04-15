import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify, type VuetifyOptions } from "vuetify";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          dark: false,
          colors: {
            // Grayscale Colors
            darkGray: "#4b4b4b", // Black
            gray: "#777777", // Dark Gray
            lightGray: "#afafaf", // Gray
          },
        },
      },
    },
  } as VuetifyOptions);

  nuxtApp.vueApp.use(vuetify);
});
