<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
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

// Store discovered video durations (seconds) by slide index
const videoDurations: Record<number, number> = {}

// If a video slide has no poster, capture the first frame and set it.
// Also capture the video duration (D) on metadata.
const setupVideoPoster = (el: Element | { $el?: Element } | null, it: unknown, index?: number) => {
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

  const captureDuration = () => {
    if (typeof index === 'number' && isFinite(video.duration) && video.duration > 0) {
      videoDurations[index] = video.duration
      // If this is the active slide, reschedule advance to honor expressions with D
      if (activeIndex.value === index) {
        scheduleAdvance(index)
      }
    }
  }

  if (video.readyState >= 2) {
    // Frame already available
    capture()
    captureDuration()
  } else {
    const onLoaded = () => {
      video.removeEventListener('loadeddata', onLoaded)
      capture()
    }
    video.addEventListener('loadeddata', onLoaded, { once: true })

    const onMeta = () => {
      video.removeEventListener('loadedmetadata', onMeta)
      captureDuration()
    }
    video.addEventListener('loadedmetadata', onMeta, { once: true })
  }
}

// Only enable hover effects when there's info to show
const hasInfo = (it: unknown) => {
  const s = asSlide(it)
  return Boolean(s.description || s.credits)
}

// Defaults and timers
const defaultSlideDurationMs = 3500 // 3.5s default as requested
// Mobile: auto-show info briefly when a slide becomes active
// Delay showing overlay until after the slide transition (~600ms) to ensure a clear fade-in on each slide
// Keep this roughly in sync with :deep(.embla__container) transition duration below
const mobileInfoShowDelayMs = 650
const isMobile = ref(false)
const activeMobileInfoIndex = ref<number | null>(null)
let mobileShowTimer: ReturnType<typeof setTimeout> | null = null
let mobileHideTimer: ReturnType<typeof setTimeout> | null = null
let advanceTimer: ReturnType<typeof setTimeout> | null = null
const activeIndex = ref(0)

// Carousel ref to access Embla API
const carousel = useTemplateRef('carousel')

const updateIsMobile = () => {
  if (typeof window === 'undefined') return
  // Heuristic: treat coarse pointer/no hover as mobile
  isMobile.value = window.matchMedia('(hover: none), (pointer: coarse)').matches
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
  // Start timers for initial slide
  onSelect(0)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
  if (mobileShowTimer) { clearTimeout(mobileShowTimer); mobileShowTimer = null }
  if (mobileHideTimer) { clearTimeout(mobileHideTimer); mobileHideTimer = null }
  if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null }
})

function getSlide(index: number) {
  return (slides as unknown as { value: CarouselSlide[] }).value[index]
}

// Evaluate a math expression with optional variable D (video duration seconds)
function evalExprSeconds(input: number | string | undefined, vars: { D?: number }, fallbackSeconds: number): number {
  if (typeof input === 'number') {
    return input > 0 ? input : fallbackSeconds
  }
  if (typeof input !== 'string') return fallbackSeconds
  const expr = input.trim()
  // Only allow digits, whitespace, operators, parentheses, dot, and 'D'
  if (!/^[0-9+\-*/(). D]+$/.test(expr)) return fallbackSeconds
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('D', `return (${expr})`)
    const val = Number(fn(vars.D))
    if (!Number.isFinite(val) || val <= 0) return fallbackSeconds
    return val
  } catch {
    return fallbackSeconds
  }
}

function getSlideDurationMs(index: number): number {
  const s = getSlide(index)
  const fallbackS = defaultSlideDurationMs / 1000
  const seconds = evalExprSeconds((s as any)?.duration, { D: s?.type === 'video' ? videoDurations[index] : undefined }, fallbackS)
  return Math.max(500, Math.round(seconds * 1000))
}

function getInfoDurationMs(index: number): number {
  const s = getSlide(index)
  const slideSeconds = evalExprSeconds((s as any)?.duration, { D: s?.type === 'video' ? videoDurations[index] : undefined }, defaultSlideDurationMs / 1000)
  const fallbackInfo = Math.max(1.2, slideSeconds * 0.6)
  const seconds = evalExprSeconds((s as any)?.info_duration, { D: s?.type === 'video' ? videoDurations[index] : undefined }, fallbackInfo)
  return Math.round(seconds * 1000)
}

function scheduleAdvance(index: number) {
  if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null }
  const ms = getSlideDurationMs(index)
  advanceTimer = setTimeout(() => {
    // Advance to next slide (looping is enabled on component)
    const api = (carousel as any)?.value?.emblaApi
    if (api?.canScrollNext?.()) api.scrollNext()
    else api?.scrollTo?.(0)
  }, ms)
}

const onSelect = (index: number) => {
  activeIndex.value = index
  // Always schedule slide auto-advance
  scheduleAdvance(index)
  if (!isMobile.value) return
  // Show info for current slide briefly (only if there is info)
  const slide = getSlide(index)
  // Always reset pending timers and visibility first
  if (mobileShowTimer) { clearTimeout(mobileShowTimer); mobileShowTimer = null }
  if (mobileHideTimer) { clearTimeout(mobileHideTimer); mobileHideTimer = null }
  activeMobileInfoIndex.value = null

  if (!slide || !hasInfo(slide)) {
    return
  }

  // Delay so the slide is fully in view; then fade in overlay, then schedule fade out
  mobileShowTimer = setTimeout(() => {
    activeMobileInfoIndex.value = index
  const infoMs = getInfoDurationMs(index)

    mobileHideTimer = setTimeout(() => {
      if (activeMobileInfoIndex.value === index) {
        activeMobileInfoIndex.value = null
      }
    }, infoMs)
  }, mobileInfoShowDelayMs)

  // Slide auto-advance already scheduled above
}

// Desktop: pause auto-advance while hovering to read overlays
const onMouseEnterRoot = () => {
  if (isMobile.value) return
  if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null }
}
const onMouseLeaveRoot = () => {
  if (isMobile.value) return
  scheduleAdvance(activeIndex.value)
}

</script>

<template>
  <UCarousel
    ref="carousel"
    v-slot="{ item, index }"
    :prev="{ color: 'primary' }"
    :next="{ variant: 'solid' }"
    :loop="true"
    :items="slides"
    @select="onSelect"
    class="max-w-xl mx-auto rounded-lg shadow-lg overflow-hidden"
    @mouseenter="onMouseEnterRoot"
    @mouseleave="onMouseLeaveRoot"
  >
  <div
      :class="['relative overflow-hidden aspect-square', { group: hasInfo(item), 'is-mobile-active': hasInfo(item) && activeMobileInfoIndex === index }]"
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
          :ref="el => setupVideoPoster(el, item, index)"
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
        :class="[
          'pointer-events-none absolute inset-0 transition duration-300 ease-out',
          // hover shows overlay
          'group-hover:bg-black/50',
          // mobile auto-visibility
          activeMobileInfoIndex === index ? 'bg-black/50' : 'bg-black/0'
        ]"
      />

      <!-- Text overlay: description + credits -->
      <div
        v-if="hasInfo(item)"
        :class="[
          'pointer-events-none absolute inset-0 flex items-end p-4 sm:p-6 transition duration-300 ease-out',
          // hover visibility
          'group-hover:opacity-100 group-hover:translate-y-0',
          // base hidden state
          activeMobileInfoIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        ]"
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
