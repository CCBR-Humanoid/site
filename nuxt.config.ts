// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
//    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Default color scheme follows the user's system preference
  colorMode: {
    preference: 'system',
    fallback: 'dark',
    classSuffix: ''
  },

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        }
      }
    }
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
    },
    routeRules: {
      '/hardware': { redirect: '/docs' },
      '/software': { redirect: '/docs' }
    }
  },

  // eslint: {
  //   config: {
  //     stylistic: {
  //       commaDangle: 'never',
  //       braceStyle: '1tbs'
  //     }
  //   }
  // },

  icon: {
    provider: 'iconify'
  },

  llms: {
    domain: 'https://ccbr.ai/',
    title: 'CCBR Docs',
    description: 'Open-source robotics docs from the CCBR Humanoid Collaboratory.',
    full: {
      title: 'CCBR Docs - Full Documentation',
      description: 'The full documentation for the CCBR Humanoid Collaboratory projects.'
    },
    sections: [
    ]
  }
})
