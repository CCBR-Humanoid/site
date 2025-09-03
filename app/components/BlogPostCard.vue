<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  title: string
  description?: string
  path: string
  date?: string
  image?: string
  category?: string
  tags?: string[]
  author?: string | string[]
}>()

// Normalize date-only and format for overlay
const displayDate = computed(() => {
  if (!props.date) return null
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(props.date) ? `${props.date}T00:00:00` : props.date
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
})
</script>

<template>
  <UBlogPost :to="props.path" :title="props.title" :description="props.description">
    <template #header>
      <div v-if="props.image" class="relative">
        <img
          :src="props.image"
          :alt="props.title"
          class="w-full aspect-[16/9] object-cover"
          loading="lazy"
          decoding="async"
        >
        <!-- Dim overlay -->
        <div class="absolute inset-0 bg-black/20" />
        <!-- Top-left: category -->
        <div class="absolute top-2 left-2 flex items-center gap-2">
          <div v-if="props.category" class="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2 py-1 text-[11px] font-medium text-white/90 shadow-sm backdrop-blur">
            <UIcon name="i-lucide-tag" class="h-3.5 w-3.5 opacity-80" />
            <span class="truncate">{{ props.category }}</span>
          </div>
        </div>
        <!-- Bottom-right: date -->
        <div v-if="displayDate" class="absolute bottom-2 right-2 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2 py-1 text-[11px] font-medium text-white/90 shadow-sm backdrop-blur">
          <UIcon name="i-lucide-calendar" class="h-3.5 w-3.5 opacity-80" />
          <span>{{ displayDate }}</span>
        </div>
      </div>
      <BlogCoverFallback
        v-else
        :title="props.title"
        :category="props.category"
        :date="props.date || undefined"
      />
      <div class="px-4 pt-3">
        <PostMetaRow :date="props.date as any" :author="props.author as any" />
      </div>
    </template>

    <template #footer>
      <div class="flex flex-wrap items-center gap-2 px-4 pb-4">
        <UBadge
          v-if="props.category"
          color="primary"
          variant="soft"
          class="rounded-full"
        >
          {{ props.category }}
        </UBadge>
        <UBadge
          v-for="tag in props.tags"
          :key="tag"
          color="neutral"
          variant="soft"
          class="rounded-full"
        >
          {{ tag }}
        </UBadge>
      </div>
    </template>
  </UBlogPost>
  
</template>

<style scoped>
</style>
