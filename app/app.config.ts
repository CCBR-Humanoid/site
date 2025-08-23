// Centralized constants
import * as C from './constants'

// Small builders for each app config section
const createUi = () => ({
  colors: {
    primary: 'green',
    neutral: 'slate'
  }
})

const createUiPro = () => ({
  footer: {
    slots: {
      root: 'border-t border-default',
      left: 'text-sm text-muted'
    }
  }
})

const createSeo = () => ({
  siteName: 'Nuxt Docs Template'
})

const createHeader = () => ({
  title: '',
  to: '/',
  logo: {
    alt: '',
    light: '',
    dark: ''
  },
  search: true, // to remove default search bar
  colorMode: true,
  links: [
    { label: 'Our Team', to: '/team' },
    { label: 'Blog', to: '/blog' },
    { label: 'Hardware', to: '/hardware' },
    { label: 'Software', to: '/software' }
  ],
  rightlinks: [
    {
      icon: 'i-simple-icons-github',
      to: C.GITHUB_ORG_URL,
      target: '_blank',
      'aria-label': 'GitHub'
    }
  ]
})

const createFooter = () => ({
  credits: `Copyright © ${new Date().getFullYear()} ${C.TEAM_NAME}`,
  colorMode: false,
  links: [
    // Uncomment for Discord button in footer
    /*
    {
      icon: 'i-simple-icons-discord',
      to: 'https://discord.com/invite/ps2h6QT',
      target: '_blank',
      'aria-label': 'Nuxt UI on Discord'
    },
    */
    {
      icon: 'i-simple-icons-github',
      to: C.GITHUB_ORG_URL,
      target: '_blank',
      'aria-label': `${C.TEAM_NAME} on GitHub`
    }
  ]
})

// Expose for reuse in components via useAppConfig()
const createSocial = () => ({
  githubOrgUrl: C.GITHUB_ORG_URL
})

const createToc = () => ({
  title: 'Table of Contents',
  bottom: {
    title: 'Community',
    edit: 'https://github.com/nuxt-ui-pro/docs/edit/main/content',
    links: [{
      icon: 'i-lucide-star',
      label: 'Star on GitHub',
      to: 'https://github.com/nuxt/ui',
      target: '_blank'
    }, {
      icon: 'i-lucide-book-open',
      label: 'Nuxt UI Pro docs',
      to: 'https://ui.nuxt.com/getting-started/installation/pro/nuxt',
      target: '_blank'
    }, {
      icon: 'i-simple-icons-nuxtdotjs',
      label: 'Purchase a license',
      to: 'https://ui.nuxt.com/pro/purchase',
      target: '_blank'
    }]
  }
})

// Assemble final app config
export default defineAppConfig({
  ui: createUi(),
  uiPro: createUiPro(),
  seo: createSeo(),
  header: createHeader(),
  footer: createFooter(),
  social: createSocial(),
  toc: createToc()
})