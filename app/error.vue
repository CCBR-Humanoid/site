<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps<{
  error: NuxtError
}>()

useHead({ htmlAttrs: { lang: 'en' } })

// Note: SEO is set below based on the actual error (404 vs others)

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

provide('navigation', navigation)

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

useSeoMeta({ title: pageTitle, description: pageDescription })

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
</script>

<template>
  <UApp>
    <div class="min-h-screen flex flex-col">
      <AppHeader />
      
      <ErrorContent
        :status-code="statusCode"
        :headline="headline"
        :subcopy="subcopy"
        :is-404="is404"
        :issue-url="issueUrl"
        :status-message="error?.statusMessage"
        :message="error?.message"
        @goBack="goBack"
        @reload="reload"
      />
      <AppFooter />
    </div>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>

<style scoped></style>
