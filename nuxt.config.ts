// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, 
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    // The private keys which are only available within server-side
    apiKey: process.env.NUXT_API_KEY_MOVIEDB || "",
    accessToken: process.env.NUXT_ACCESS_TOKEN_MOVIEDB || "",
    // Keys within public, will be also exposed to the client-side
    public: {
      apiBase: process.env.NUXT_ENDPOINT_MOVIEDB || "",
      apiKey: process.env.NUXT_API_KEY_MOVIEDB || "",
      accessToken: process.env.NUXT_ACCESS_TOKEN_MOVIEDB || "",
      apiBaseImages: process.env.NUXT_ENDPOINT_MOVIEDB_IMAGES || ""
    }
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
  },
  modules: ['nuxt-icons']
})
