<script setup lang="ts">
import { ref } from 'vue'
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

// Type guards
const isVideo = (it: unknown): it is CarouselSlide & { type: 'video' } => {
  const s = asSlide(it)
  return (s as any).type === 'video'
}

// If a video slide has no poster, capture the first frame and set it.
const setupVideoPoster = (el: Element | { $el?: Element } | null, it: unknown) => {
  if (!el || !isVideo(it)) return
  const slide = asSlide(it) as any
  const rawEl = (el as any)?.$el ? (el as any).$el as Element : (el as Element)
  if (!(rawEl instanceof HTMLVideoElement)) return
  const video = rawEl as HTMLVideoElement
  if (slide.poster) return

  const autoPlay = slide.autoplay ?? true

  const capture = async () => {
    try {
      if (video.readyState < 2 /* HAVE_CURRENT_DATA */) return
      const wasPaused = video.paused
      if (!wasPaused) video.pause()

      const w = video.videoWidth || 0
      const h = video.videoHeight || 0
      if (!w || !h) {
        if (!wasPaused && autoPlay) video.play().catch(() => {})
        return
      }

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        if (!wasPaused && autoPlay) video.play().catch(() => {})
        return
      }
      ctx.drawImage(video, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      // Setting poster after first frame captured
      video.setAttribute('poster', dataUrl)

      if (!wasPaused && autoPlay) video.play().catch(() => {})
    } catch {
      // Ignore capture errors (e.g., cross-origin). Video will render normally.
    }
  }

  if (video.readyState >= 2) {
    // Frame already available
    capture()
  } else {
    const onLoaded = () => {
      video.removeEventListener('loadeddata', onLoaded)
      capture()
    }
    video.addEventListener('loadeddata', onLoaded, { once: true })
  }
}

// Only enable hover effects when there's info to show
const hasInfo = (it: unknown) => {
  const s = asSlide(it)
  return Boolean(s.description || s.credits)
}

// Pause carousel autoplay when hovering a slide that has info
const isHovered = ref(false)
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    :prev="{ color: 'primary' }"
    :next="{ variant: 'solid' }"
    :loop="true"
    :autoplay="isHovered ? false : { delay: 3500 }"
  :items="slides"
    class="max-w-xl mx-auto rounded-lg shadow-lg overflow-hidden"
  >
  <div
      :class="['relative overflow-hidden aspect-square', { group: hasInfo(item) }]"
      @mouseenter="hasInfo(item) && (isHovered = true)"
      @mouseleave="isHovered = false"
    >
      <!-- Media: Image or Video -->
      <template v-if="!isVideo(item)">
        <img
          :src="asSlide(item).src"
          :alt="asSlide(item).alt"
          loading="lazy"
          decoding="async"
          class="block w-full h-full object-cover transition duration-500 ease-out group-hover:scale-[1.02]"
        >
      </template>
      <template v-else>
        <video
          :ref="el => setupVideoPoster(el, item)"
          :src="asSlide(item).src"
          :poster="(asSlide(item) as any).poster"
          :autoplay="(asSlide(item) as any).autoplay ?? true"
          :loop="(asSlide(item) as any).loop ?? true"
          :muted="(asSlide(item) as any).muted ?? true"
          :controls="(asSlide(item) as any).controls ?? false"
          preload="metadata"
          playsinline
          class="block w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </template>

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
