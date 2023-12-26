// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtConfig } from "nuxt/schema";

const pwa = {
  registerType: "autoUpdate",
  includeAssets: ["logo.svg"],
  client: {
    installPrompt: true,
  },
  manifest: {
    name: "Open Map Maker",
    description: "Free Open Source GPX Mapping Software",
    theme_color: "#ffffff",
    lang: "en",
    short_name: "MapMaker",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    icons: [
      {
        src: "pwa-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
  workbox: {
    navigateFallback: null,
  },
  devOptions: {
    enabled: true,
    type: "module",
  },
  icon: {
    source: "icon.svg",
  },
};


const config = {
  devtools: { enabled: true },
  app: {
    head: {
      title: "Open Map Maker",
      bodyAttrs: {
        tabIndex: "-1",
      },
      link: [{ rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    },
  },
  css: ["~/assets/css/main.css"],
  buildModules: ["nuxt-vite", ],
  modules: ["@vite-pwa/nuxt"],
  pwa,
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
};
export default defineNuxtConfig(config);

