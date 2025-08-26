<script setup lang="ts">
const props = defineProps<{
  statusCode: number
  headline: string
  subcopy: string
  is404: boolean
  issueUrl: string
  statusMessage?: string
  message?: string
}>()

const emit = defineEmits<{
  (e: 'goBack' | 'reload'): void
}>()
</script>

<template>
  <main class="relative flex-1">
    <ErrorBackground />

    <UContainer class="py-12 sm:py-16">
      <section class="min-h-[45vh] flex flex-col items-center justify-center">
        <ErrorHero
          :status-code="props.statusCode"
          :headline="props.headline"
          :subcopy="props.subcopy"
          :is-404="props.is404"
          :issue-url="props.issueUrl"
          @go-back="emit('goBack')"
          @reload="emit('reload')"
        />
      </section>

      <ErrorDetails
        :status-code="props.statusCode"
        :status-message="props.statusMessage"
        :message="props.message"
      />
    </UContainer>
  </main>
</template>
