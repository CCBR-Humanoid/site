<script setup lang="ts">
import { useSearchData } from '../composables/useSearchData'

const { seo } = useAppConfig()

// Sidebar/header navigation remains docs-only
const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))

// Centralized search data (files, navigation, groups)
const { files, searchNavigation, groups } = useSearchData()

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image'
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="searchNavigation"
        :groups="groups"
      />
    </ClientOnly>
  </UApp>
</template>
