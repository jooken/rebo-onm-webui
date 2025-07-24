const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
  ],
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    configPath: 'tailwind.config.js',
    cssPath: '~/assets/css/main.css',
  },
  app: {
    baseURL: isDev ? '/' : '/rebo/',
    head: {
      title: 'Rebo ONM WebUI',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Rebo ONM Web Application' }
      ]
    }
  }
})