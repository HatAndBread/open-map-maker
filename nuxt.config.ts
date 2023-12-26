// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtConfig } from "nuxt/schema";


const config = {
  modules: ["@vite-pwa/nuxt"],
  buildModules: [
    'nuxt-vite'
  ],
  devtools: { enabled: true },
  app: {
    head: {
      title: "Open Map Maker",
      bodyAttrs: {
        tabIndex: "-1",
      },
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
        // { rel: "manifest", href: "manifest.json" },
        { rel: "apple-touch-icon", href: "apple-touch-icon-180x180.png" },
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  pwa: {
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 20,
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
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
  },
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

