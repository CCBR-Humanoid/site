<script setup lang="ts">
const props = defineProps<{
  statusCode: number
  statusMessage?: string
  message?: string
}>()
</script>

<template>
  <div class="mt-6 w-full max-w-3xl mx-auto show-when-tall">
    <UCard class="bg-white/70 dark:bg-white/5 backdrop-blur-md border-black/10 dark:border-white/10">
      <template #header>
        <div class="flex items-center gap-2 text-gray-900 dark:text-white">
          <UIcon name="i-lucide-terminal-square" />
          <span class="font-medium">Details</span>
        </div>
      </template>
      <div class="text-left">
        <p class="text-gray-700 dark:text-white/80">
          <strong class="text-gray-900 dark:text-white/90">Status:</strong> {{ props.statusCode }} <span v-if="props.statusMessage">— {{ props.statusMessage }}</span>
        </p>
        <p
          v-if="props.message"
          class="mt-2 whitespace-pre-wrap text-gray-600 dark:text-white/70"
        >
          {{ props.message }}
        </p>
        <p
          v-else
          class="mt-2 text-gray-500 dark:text-white/60"
        >
          No additional details were provided.
        </p>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
/* Hide the details panel on short viewports to avoid pushing the footer below the fold */
@media (max-height: 840px) {
  .show-when-tall { display: none; }
}
</style>
