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

// Back button reveal/hide state
const isHidden = ref(false)
const isFocused = ref(false)
const isButtonActive = ref(false)
const isRevealed = computed(() => !isHidden.value || isButtonActive.value || isFocused.value)

onMounted(() => {
  // Hide after ~1s
  setTimeout(() => {
    isHidden.value = true
  }, 1000)
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
    class="fixed bottom-6 left-0 z-50"
  >
    <div class="relative h-12 flex items-center">
      <!-- Tiny flag: visible only when hidden and not interacting -->
      <button
        type="button"
        :tabindex="isHidden ? 0 : -1"
        aria-label="Show back button"
        class="absolute left-0 top-1/2 h-10 w-2 rounded-r bg-primary/80 transition-all duration-150 ease-out"
        :style="{
          opacity: isHidden && !isRevealed ? 1 : 0,
          transform: `translateY(-50%) translateX(${isButtonActive ? '-8px' : '0'})`
        }"
        @mouseenter="isButtonActive = true"
        @focus="isButtonActive = true; isFocused = true"
      />

      <!-- Button wrapper: slides fully off-screen when hidden -->
      <div
        class="pl-3"
        @mouseenter="isButtonActive = true"
        @mouseleave="isButtonActive = false"
        @focusin="isFocused = true; isButtonActive = true"
        @focusout="isFocused = false"
        :style="{
          transform: isRevealed ? 'translateX(0)' : 'translateX(calc(-100% - 12px))',
          transition: 'transform 200ms ease'
        }"
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
    </div>
  </div>
  <div v-else />
  <!-- SSR guard -->
  
</template>

