export default defineNuxtConfig({
  ssr: false,
  components: {
    global: true,
    dirs: ['~/components', { path: '~/fragments', prefix: 'Fragment' }]
  },
  runtimeConfig: {
    public: {
      apiKey: process.env.APIKEY,
      authDomain: process.env.AUTHDOMAIN,
      projectId: process.env.PROJECTID,
      storageBucket: process.env.STORAGEBUCKET,
      databaseURL: process.env.DATABASEURL,
      messagingSenderId:
        process.env.MESSAGINGSENDERID,
      appId: process.env.APPID
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: '@import "@/assets/css/_variables.scss"; '
        }
      }
    },
    esbuild: {
      pure: ['console.log', 'console.info']
    }
  },
  nitro: {
    preset: 'firebase',
    esbuild: {
      options: {
        target: 'esnext'
      }
    },
    prerender: {
      routes: ['/']
    }
  },
  modules: ['@vueuse/nuxt']
})
