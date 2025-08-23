import type { NuxtError } from '#app'
import { computed, useHead, useSeoMeta, useRoute, useRouter } from '#imports'

export function useErrorPage (error: NuxtError) {
  const route = useRoute()
  const router = useRouter()

  const statusCode = computed(() => error?.statusCode || 404)
  const is404 = computed(() => statusCode.value === 404)
  const headline = computed(() => is404.value ? 'Page not found' : (error?.statusMessage || 'Something went wrong'))
  const subcopy = computed(() => is404.value
    ? 'We couldn\'t find the page you\'re looking for. Try searching or head back home.'
    : 'An unexpected error occurred. You can go back, reload, or search the docs.')

  const pageTitle = computed(() => is404.value ? 'Page not found' : `Error ${statusCode.value}`)
  const pageDescription = computed(() => is404.value
    ? 'We are sorry but this page could not be found.'
    : 'An unexpected error occurred while loading this page.')

  useSeoMeta({
    title: pageTitle,
    description: pageDescription
  })

  useHead({
    meta: [
      { name: 'robots', content: 'noindex' }
    ]
  })

  function goBack () {
    if (history.length > 1) router.back()
    else router.push('/')
  }

  function reload () {
    if (typeof window !== 'undefined') window.location.reload()
  }

  const issueUrl = computed(() => {
    const title = encodeURIComponent(`Error ${statusCode.value} on ${route.fullPath}`)
    const body = encodeURIComponent(`I encountered an error on ${route.fullPath}\n\nStatus: ${statusCode.value}\nMessage: ${error?.message || ''}`)
    return `https://github.com/willcforte/ccbr-docs/issues/new?title=${title}&body=${body}`
  })

  return {
    statusCode,
    is404,
    headline,
    subcopy,
    pageTitle,
    pageDescription,
    issueUrl,
    goBack,
    reload
  }
}
