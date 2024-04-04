import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify, type VuetifyOptions } from "vuetify";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          dark: false,
          colors: {
            // Primary Colors
            feather: "#58cc02",
            mask: "#89e219",
            // Secondary Colors
            macaw: "#1cb0f6", // Blue
            cardinal: "#ff4b4b", // Red
            bee: "#ffc800", // Yellow
            fox: "#ff9600", // Orange
            beetle: "#ce82ff", // Purple
            humpback: "#2b70c9", // Dark Blue
            // Grayscale Colors
            eel: "#4b4b4b", // Black
            wolf: "#777777", // Dark Gray
            hare: "#afafaf", // Gray
            swan: "#e5e5e5", // Light Gray
            polar: "#f7f7f7", // Ligher Gray
            snow: "#ffffff", // white
          },
        },
      },
    },
  } as VuetifyOptions);

  app.vueApp.use(vuetify);
});
