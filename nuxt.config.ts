// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtConfig } from "nuxt/schema";

const config = {
  devtools: { enabled: true },
  app: {
    head: {
      title: "Open Map Maker",
      bodyAttrs: {
        tabIndex: "-1"
      },
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
      ],
    },
  },
  buildModules: ["@nuxtjs/pwa"],
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

