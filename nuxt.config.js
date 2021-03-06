export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // server: {
  //   port: 8000 // default: 3000
  // },

  generate: {
    fallback: true
  },

  router: {
    base: '/'
  },

  publicRuntimeConfig: {
    baseUrl: process.env.NODE_ENV === 'prod' ? 'https://earth2biomes.com' : 'http://localhost:3000',
    axios: {
      baseURL: process.env.NODE_ENV === 'prod' ? 'https://earth-2-biomes.herokuapp.com/api/public' : 'http://localhost:8080/api/public'
    }
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - Earth2Biomes',
    script: [
      { src: '/redirect.js' }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Discover the differents resources available on Earth1 to buy on Earth2.' },
      { hid: 'author', name: 'author', content: 'Waspische' },
      { hid: 'description', name: 'copyright', content: 'My own copyright' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://earth2biomes.com/' },
      { hid: 'og:title', property: 'og:title', content: 'Earth2Biomes' },
      { hid: 'og:description', property: 'og:description', content: 'Discover the differents resources available on Earth1 to buy on Earth2.' },
      { hid: 'og:image', property: 'og:image', content: 'https://earth2biomes.com/meta_image.png' },
      { hid: 'og:card', property: 'twitter:card', content: 'summary_large_image' },
      { hid: 'og:url', property: 'twitter:url', content: 'https://earth2biomes.com/' },
      { hid: 'og:title', property: 'twitter:title', content: 'Earth2Biomes' },
      { hid: 'og:description', property: 'twitter:description', content: 'Discover the differents resources available on Earth1 to buy on Earth2.' },
      { hid: 'og:image', property: 'twitter:image', content: 'https://earth2biomes.com/meta_image.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap'
      }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~plugins/vue2clipboard.js',
    '@/plugins/GoogleAnalytics'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and dist (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/moment'

  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/toast'
  ],

  toast: {
    position: 'top-right',
    duration: 3000
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    // baseURL: process.env.publicApiUrl
    // fallback if no runtime config
    baseURL: 'http://localhost:8080/api/public'
  },

  tailwindcss: {
    jit: true
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      options: {
        customProperties: true
      },
      dark: true,
      themes: {
        dark: {
          primary: '#21CFF3',
          accent: '#FF4081',
          secondary: '#ffe18d',
          success: '#4CAF50',
          info: '#2196F3',
          warning: '#FB8C00',
          error: '#FF5252'
        }
      }
    }
  }
}
