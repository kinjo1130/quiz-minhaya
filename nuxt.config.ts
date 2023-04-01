export default defineNuxtConfig({
  ssr: false,
  components: {
    global: true,
    dirs: [
      '~/components',
      { path: '~/fragments', prefix: 'Fragment' }
    ]
  },
  runtimeConfig: {
    public: {
      apiKey: process.env[process.env.NODE_ENV + '_' + 'apiKey'],
      authDomain: process.env[process.env.NODE_ENV + '_' + 'authDomain'],
      projectId: process.env[process.env.NODE_ENV + '_' + 'projectId'],
      storageBucket: process.env[process.env.NODE_ENV + '_' + 'storageBucket'],
      databaseURL: process.env[process.env.NODE_ENV + '_' + 'databaseURL'],
      messagingSenderId:
        process.env[process.env.NODE_ENV + '_' + 'messagingSenderId'],
      appId: process.env[process.env.NODE_ENV + '_' + 'appId'],
      vapidKey: process.env[process.env.NODE_ENV + '_' + 'vapidKey'],
      serverKey: process.env[process.env.NODE_ENV + '_' + 'serverKey']
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
