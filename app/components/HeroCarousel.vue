<script setup lang="ts">
import { useContentCollectionArray } from '../../composables/useContentCollectionArray'
import type { CarouselSlide } from '@schema'

// Load slides array from the first document in the `carousel` collection
const slides = await useContentCollectionArray<CarouselSlide>({
  collection: 'carousel',
  field: 'slides',
  key: 'carousel'
})

// Helper to satisfy TS when accessing slot item
const asSlide = (it: unknown) => it as CarouselSlide

// Only enable hover effects when there's info to show
const hasInfo = (it: unknown) => {
  const s = asSlide(it)
  return Boolean(s.description || s.credits)
}

// Nothing else needed; UCarousel has a built-in autoplay plugin support.
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    :prev="{ color: 'primary' }"
    :next="{ variant: 'solid' }"
    :loop="true"
    :autoplay="{ delay: 3500 }"
  :items="slides"
    class="max-w-xl mx-auto rounded-lg shadow-lg overflow-hidden"
  >
    <div :class="['relative overflow-hidden', { group: hasInfo(item) }]">
      <!-- Image -->
      <img
        :src="asSlide(item).src"
        :alt="asSlide(item).alt"
        loading="lazy"
        decoding="async"
        class="block w-full h-full object-cover transition duration-500 ease-out group-hover:scale-[1.02]"
      >

      <!-- Darken overlay on hover -->
      <div
        v-if="hasInfo(item)"
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-black/0 transition duration-300 ease-out group-hover:bg-black/50"
      />

      <!-- Text overlay: description + credits -->
      <div
        v-if="hasInfo(item)"
        class="pointer-events-none absolute inset-0 flex items-end p-4 sm:p-6 opacity-0 translate-y-2 transition duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0"
      >
        <div class="text-white drop-shadow max-w-[90%]">
          <p v-if="asSlide(item).description" class="text-sm sm:text-base leading-snug text-white/95">
            {{ asSlide(item).description }}
          </p>
          <p v-if="asSlide(item).credits" class="mt-2 text-xs sm:text-sm text-white/80">
            {{ asSlide(item).credits }}
          </p>
        </div>
      </div>
    </div>
  </UCarousel>
</template>

<style scoped>
/* Ensure smooth transitions */
:deep(.embla__container) {
  transition: transform 600ms ease-in-out;
}
</style>
