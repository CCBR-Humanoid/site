<script setup lang="ts">
const props = defineProps<{
  statusCode: number
  headline: string
  subcopy: string
  is404: boolean
  issueUrl: string
}>()

const emit = defineEmits<{
  (e: 'goBack' | 'reload'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center text-center gap-6">
    <div class="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 text-xs text-black/80 dark:text-white/80 backdrop-blur-sm">
      <UIcon
        name="i-lucide-triangle-alert"
        class="h-4 w-4 text-amber-400"
      />
      <span class="tabular-nums">Error {{ props.statusCode }}</span>
    </div>

    <h1 class="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 dark:from-green-400 dark:via-emerald-400 dark:to-green-200 bg-clip-text text-transparent drop-shadow">
      {{ props.headline }}
    </h1>
    <p class="max-w-2xl text-gray-700 dark:text-white/80">
      {{ props.subcopy }}
    </p>

    <div class="mt-2 flex flex-wrap items-center justify-center gap-3">
      <UButton
        color="primary"
        size="lg"
        icon="i-lucide-home"
        to="/"
      >
        Go home
      </UButton>
      <UButton
        color="neutral"
        variant="soft"
        size="lg"
        icon="i-lucide-arrow-left"
        @click="emit('goBack')"
      >
        Go back
      </UButton>
      <UButton
        v-if="!props.is404"
        color="primary"
        variant="outline"
        size="lg"
        icon="i-lucide-refresh-cw"
        @click="emit('reload')"
      >
        Reload
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        size="lg"
        icon="i-lucide-bug"
        :to="props.issueUrl"
        target="_blank"
      >
        Report issue
      </UButton>
    </div>
  </div>
</template>
