<script setup lang="ts">
// Use the default layout for blog posts

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <UPage v-if="page">
    <UPageBody>
      <UContainer>
  <div class="space-y-6">
          <UPageHeader :title="page.title" :description="page.description" />

          <img
            v-if="page.cover"
            :src="page.cover"
            alt=""
            class="w-full rounded-lg border border-[--ui-border]"
          />

          <article class="prose dark:prose-invert max-w-none">
            <ContentRenderer :value="page" />
          </article>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
  
  <!-- Floating back-to-blog button -->
  <div
    v-if="page"
    class="fixed bottom-6 left-6 z-50"
  >
    <UButton
      to="/blog"
      color="neutral"
      variant="ghost"
      size="lg"
      icon="i-lucide-arrow-left"
      aria-label="Back to blog"
      class="rounded-full shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/60 border border-white/20 dark:border-white/10 hover:shadow-xl"
    >
      <span class="hidden sm:inline">Back to blog</span>
    </UButton>
  </div>
  <div v-else />
  <!-- SSR guard -->
  
</template>
