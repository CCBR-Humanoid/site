<script setup lang="ts">
defineProps<{
  title: string
  src: string
  type: 'image' | 'video'
  category?: string
  tags?: string[]
}>()
</script>

<template>
  <div class="rounded-md overflow-hidden border border-[--ui-border] bg-white/50 dark:bg-neutral-900/50">
    <img v-if="type==='image'" :src="src" :alt="title" class="w-full h-auto block" loading="lazy" decoding="async" />
    <video v-else :src="src" class="w-full h-auto block" preload="metadata" muted playsinline />
    <div class="p-3">
      <div class="text-sm font-medium">{{ title }}</div>
      <div v-if="category || (tags && tags.length)" class="mt-1 flex flex-wrap gap-1.5">
        <UBadge v-if="category" color="primary" variant="soft" class="rounded-full">{{ category }}</UBadge>
        <UBadge v-for="t in tags" :key="t" color="neutral" variant="soft" class="rounded-full">{{ t }}</UBadge>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
