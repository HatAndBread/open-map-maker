// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtConfig } from "nuxt/schema";

const config = {
  devtools: { enabled: true },
  app: {
    head: {
      title: "Open Map Maker",
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      mapboxKey: process.env.MAPBOX_KEY,
    },
  },
}
export default defineNuxtConfig(config);

