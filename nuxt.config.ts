// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      mapboxKey: process.env.MAPBOX_KEY
    }
  }
})

// export default {
  // publicRuntimeConfig: {
    // myPublicVariable: process.env.PUBLIC_VARIABLE,
  // },
  // privateRuntimeConfig: {
    // myPrivateToken: process.env.PRIVATE_TOKEN
  // }
// }

