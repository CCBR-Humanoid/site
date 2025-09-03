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
  siteName: 'CCBR'
})

const createHeader = () => ({
  title: 'CCBR',
  to: '/',
  logo: {
    alt: 'logo.svg',
    light: 'logo.svg',
    dark: 'logo.svg'
  },
  // search: true, // toggle visibility of search bar
  // colorMode: true, // toggle visibility of light/dark mode button
  links: [
    { label: 'Home', to: '/' },
    { label: 'Our Team', to: '/team' },
  { label: 'Gallery', to: '/gallery' },
    { label: 'Blog', to: '/blog' },
    { label: 'Docs', to: '/docs' }
  ],
  rightlinks: [
    {
      'icon': 'i-simple-icons-github',
      'to': C.GITHUB_ORG_URL,
      'target': '_blank',
      'aria-label': 'GitHub'
    }
  ]
})

const createFooter = () => ({
  credits: `Copyright © ${new Date().getFullYear()} ${C.TEAM_NAME}`,
  links: [
    {
      'icon': 'i-simple-icons-linkedin',
      'to': C.LINKEDIN_URL,
      'target': '_blank',
      'aria-label': `${C.TEAM_NAME} on LinkedIn`
    },
    {
      'icon': 'i-simple-icons-github',
      'to': C.GITHUB_ORG_URL,
      'target': '_blank',
      'aria-label': `${C.TEAM_NAME} on GitHub`
    }
  ]
})

// Expose for reuse in components via useAppConfig()
const createSocial = () => ({
  githubOrgUrl: C.GITHUB_ORG_URL,
  githubRepoUrl: C.GITHUB_REPO_URL
})

const createToc = () => ({
  title: 'On this page',
  bottom: {
    title: 'Community',
    // Component will append the current doc path
    edit: `${C.GITHUB_REPO_URL}/edit/main/content`,
    links: [{
      icon: 'i-lucide-star',
      label: 'Star our GitHub',
      to: C.GITHUB_ORG_URL,
      target: '_blank'
    }, {
      icon: 'i-simple-icons-linkedin',
      label: `${C.TEAM_NAME} on LinkedIn`,
      to: C.LINKEDIN_URL,
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
  toc: createToc(),
})
