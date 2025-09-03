<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount, onMounted, reactive } from 'vue'

type Item = {
  type: 'image' | 'video'
  title: string
  date: string
  description?: string
  credits?: string
  category?: string
  tags?: string[]
  src?: string
  sources?: { src: string; type?: string }[]
  alt?: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}

const props = defineProps<{ items: Item[] }>()

const activeIndex = ref<number | null>(null)
const isOpen = computed(() => activeIndex.value !== null)
const current = computed(() => (activeIndex.value != null ? props.items[activeIndex.value] : null))
const modalRef = ref<HTMLElement | null>(null)

// Best-effort MIME type from file extension for <source type="...">
function mimeFromSrc(src?: string) {
  if (!src) return undefined
  const lower = src.toLowerCase()
  if (lower.endsWith('.mp4')) return 'video/mp4'
  if (lower.endsWith('.webm')) return 'video/webm'
  if (lower.endsWith('.ogv') || lower.endsWith('.ogg')) return 'video/ogg'
  if (lower.endsWith('.mov')) return 'video/quicktime'
  return undefined
}

const videoEl = ref<HTMLVideoElement | null>(null)
const videoReady = ref(false)
const videoError = ref<null | string>(null)
let errorTimer: any

function resetVideoState() {
  videoReady.value = false
  videoError.value = null
  if (errorTimer) clearTimeout(errorTimer)
}

watch(() => isOpen.value, (openNow) => {
  if (!openNow) {
    resetVideoState()
    return
  }
  // When opening, if current is video, attempt to load it proactively
  const c = current.value
  if (c && c.type === 'video') {
    resetVideoState()
    // Start a timeout to surface an error message if nothing loads
    errorTimer = setTimeout(() => {
      if (!videoReady.value) videoError.value = 'This video may not be supported by your browser.'
    }, 2500)
    queueMicrotask(() => {
      if (videoEl.value) {
        try {
          videoEl.value.load()
        } catch (e) {
          // ignore
        }
      }
    })
  }
})

onBeforeUnmount(() => {
  if (errorTimer) clearTimeout(errorTimer)
})

// Generate thumbnails for videos lacking an explicit poster by capturing their first frame
const itemEls = ref<HTMLElement[]>([])
const setItemEl = (i: number) => (el: Element | null) => {
  if (el) itemEls.value[i] = el as HTMLElement
}
const thumbs = reactive<Record<string, string>>({})
const attempted = new Set<string>()

function primarySrcOf(it: any) {
  return it?.src || (it?.sources && it.sources[0]?.src) || undefined
}

async function generateThumb(src: string) {
  if (!process.client) return
  if (!src || thumbs[src] || attempted.has(src)) return
  attempted.add(src)
  try {
    const v = document.createElement('video')
    v.preload = 'metadata'
    v.muted = true
    v.crossOrigin = 'anonymous'
    v.src = src
    await new Promise<void>((resolve, reject) => {
      const onLoaded = () => resolve()
      const onError = () => reject(new Error('video load error'))
      v.addEventListener('loadeddata', onLoaded, { once: true })
      v.addEventListener('error', onError, { once: true })
    })
    try { v.currentTime = Math.min(0.1, (v.duration || 1) - 0.1) } catch {}
    await new Promise<void>((resolve) => setTimeout(resolve, 50))
    const w = v.videoWidth || 640
    const h = v.videoHeight || 360
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(v, 0, 0, w, h)
      thumbs[src] = canvas.toDataURL('image/jpeg', 0.75)
    }
  } catch (e) {
    // ignore; will keep placeholder
  }
}

onMounted(() => {
  if (!process.client) return
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      // Find the associated item by element index
      const idx = itemEls.value.findIndex((el) => el === entry.target)
      if (idx >= 0) {
        const it: any = (props.items as any)[idx]
        if (it?.type === 'video' && !it.poster) {
          const src = primarySrcOf(it)
          if (src) generateThumb(src)
        }
      }
      io.unobserve(entry.target)
    }
  }, { rootMargin: '200px' })

  // Observe all current item elements
  queueMicrotask(() => {
    itemEls.value.forEach((el) => el && io.observe(el))
  })
})

// Routing helpers for deep-linking
function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
function slugFor(it: Item) {
  return `gallery-${slugify(`${it.title}-${it.date}`)}`
}

const route = useRoute()
const router = useRouter()

async function open(index: number) {
  activeIndex.value = index
  const it = props.items[index]
  if (it) {
    const hash = `#${slugFor(it)}`
    await router.replace({ hash })
  }
}
async function close() {
  activeIndex.value = null
  if (route.hash) await router.replace({ hash: '' })
}
function onBackdropClick(e: MouseEvent) {
  const modal = modalRef.value
  const target = e.target as Node | null
  if (!modal) return close()
  if (target && !modal.contains(target)) close()
}

// Lock scroll when modal open
watch(isOpen, (v) => {
  if (typeof document === 'undefined') return
  document.documentElement.style.overflow = v ? 'hidden' : ''
})

// Sync modal state from URL hash
watch(
  () => route.hash,
  (hash) => {
    const key = (hash || '').replace(/^#/, '')
    if (!key) {
      if (isOpen.value) activeIndex.value = null
      return
    }
    // Find item matching this slug
    const idx = props.items.findIndex((it) => slugFor(it) === key)
    if (idx !== -1) {
      activeIndex.value = idx
    }
  },
  { immediate: true }
)

// Re-evaluate deep-link when items update (e.g., after filtering/sorting/async load)
watch(
  () => props.items,
  (list) => {
    const key = (route.hash || '').replace(/^#/, '')
    if (!key || !list?.length) return
    const idx = list.findIndex((it) => slugFor(it) === key)
    if (idx !== -1) {
      activeIndex.value = idx
    }
  }
)
</script>

<template>
  <div>
    <!-- Masonry-like columns preserve DOM order (top-to-bottom, then next column) -->
    <div class="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:balance]">
      <div
        v-for="(it, i) in items"
         :key="`${it.type}-${((it as any).src || ((it as any).sources && (it as any).sources[0]?.src))}`"
  class="mb-4 break-inside-avoid rounded-md overflow-hidden border border-[#52649D23] bg-white/50 dark:bg-neutral-900/50 hover:shadow-md transition-shadow cursor-pointer"
        @click="open(i)"
  :ref="(itemEls as unknown as any[])[i]"
      >
        <template v-if="it.type === 'image'">
          <div class="relative">
            <div class="w-full aspect-video bg-black/5 dark:bg-white/5" aria-hidden="true" />
            <img :src="it.src" :alt="it.alt || it.title" class="w-full h-auto block -mt-[56.25%]" loading="eager" decoding="async" />
          </div>
        </template>
        <template v-else>
          <div class="relative">
            <div class="w-full aspect-video bg-black/5 dark:bg-white/5" aria-hidden="true" />
            <!-- Render poster if provided explicitly, else show generated thumbnail if available -->
            <img
              v-if="it.poster || thumbs[primarySrcOf(it) as string]"
              :src="it.poster || thumbs[primarySrcOf(it) as string]"
              :alt="`${it.title} poster`"
              class="w-full h-auto block -mt-[56.25%]"
              loading="eager"
              decoding="async"
              @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
            />
            <!-- Fallback: show the video's first frame using the browser if no poster/thumb available -->
            <video
              v-else
              class="w-full h-auto block -mt-[56.25%] pointer-events-none"
              preload="metadata"
              muted
              playsinline
            >
              <template v-if="(it as any).sources && (it as any).sources.length">
                <source v-for="(s, si) in (it as any).sources" :key="(s.src || si)" :src="s.src" :type="s.type || mimeFromSrc(s.src)" />
              </template>
              <template v-else>
                <source :src="(it as any).src" :type="mimeFromSrc((it as any).src)" />
              </template>
            </video>
            <!-- If no poster provided or poster fails, keep the neutral placeholder above and the play overlay below -->
            <div class="pointer-events-none absolute inset-0 grid place-items-center bg-black/10">
              <UIcon name="i-lucide-play" class="h-10 w-10 text-white drop-shadow" />
            </div>
          </div>
        </template>

        <div class="p-3">
          <div class="text-sm font-medium">{{ it.title }}</div>
          <div v-if="it.category || (it.tags && it.tags.length)" class="mt-1 flex flex-wrap gap-1.5">
            <UBadge v-if="it.category" color="primary" variant="soft" class="rounded-full">{{ it.category }}</UBadge>
            <UBadge
              v-for="t in it.tags"
              :key="t"
              color="neutral"
              variant="soft"
              class="rounded-full"
            >{{ t }}</UBadge>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox/modal -->
    <Transition name="fade" mode="out-in">
      <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" @click="onBackdropClick">
        <div class="absolute inset-0 grid place-items-center p-4 sm:p-8">
          <Transition name="pop">
            <div v-if="isOpen" ref="modalRef" class="relative w-[min(92vw,1100px)] h-[min(92vh,100svh-32px)] rounded-xl bg-white dark:bg-neutral-900 border border-[#52649D23] shadow-2xl overflow-hidden">
              <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" class="absolute top-2 right-2 z-10" @click="close" aria-label="Close" />

              <div v-if="current" class="grid h-full grid-rows-[1fr_auto]">
                <!-- Media area fits container without scroll -->
                <div class="relative min-h-0">
                  <template v-if="current.type === 'image'">
                    <img :src="current.src" :alt="current.alt || current.title" class="absolute inset-0 w-full h-full object-contain" />
                  </template>
                  <template v-else>
                    <video
                      :key="current.src"
                      :poster="current.poster"
                      class="absolute inset-0 w-full h-full object-contain"
                      :autoplay="current.autoplay ?? false"
                      :loop="current.loop ?? true"
                      :muted="current.muted ?? false"
                      :controls="current.controls ?? true"
                      preload="metadata"
                      playsinline
                      ref="videoEl"
                      @loadeddata="videoReady = true"
                      @canplay="videoReady = true"
                      @error="videoError = 'Failed to load video.'"
                    >
                      <template v-if="(current as any).sources && (current as any).sources.length">
                        <source v-for="(s, si) in (current as any).sources" :key="(s.src || si)" :src="s.src" :type="s.type || mimeFromSrc(s.src)" />
                      </template>
                      <template v-else>
                        <source :src="current.src" :type="mimeFromSrc(current.src)" />
                      </template>
                    </video>
                    <div v-if="videoError && !videoReady" class="absolute inset-0 grid place-items-center p-6 text-center">
                      <div class="text-sm text-muted-foreground">
                        {{ videoError }}
                        <div class="mt-2">
                          <a :href="current.src" target="_blank" class="underline">Open video in a new tab</a>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- Info area below, non-scrollable, clamped -->
                <div class="p-4 sm:p-5 border-t border-[#52649D23] bg-white/80 dark:bg-neutral-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div class="min-w-0">
                      <h3 class="text-base sm:text-lg font-semibold tracking-tight truncate">{{ current.title }}</h3>
                      <p v-if="current.description" class="mt-1 text-sm text-muted-foreground max-w-prose max-h-16 overflow-hidden">{{ current.description }}</p>
                    </div>
                    <div class="text-xs text-muted-foreground shrink-0">
                      <UIcon name="i-lucide-calendar" class="inline-block mr-1" />
                      {{ new Date(current.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }) }}
                    </div>
                  </div>

                  <div v-if="current.category || (current.tags && current.tags.length)" class="mt-3 flex flex-wrap gap-2">
                    <UBadge v-if="current.category" color="primary" variant="soft" class="rounded-full">{{ current.category }}</UBadge>
                    <UBadge
                      v-for="t in current.tags"
                      :key="t"
                      color="neutral"
                      variant="soft"
                      class="rounded-full"
                    >{{ t }}</UBadge>
                  </div>

                  <div v-if="current.credits" class="mt-3 text-xs text-muted-foreground truncate">
                    <UIcon name="i-lucide-circle-ellipsis" class="inline-block mr-1" />
                    {{ current.credits }}
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.pop-enter-active { animation: pop-in .18s ease; }
.pop-leave-active { animation: pop-out .16s ease forwards; }
@keyframes pop-in { from { transform: scale(.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes pop-out { from { transform: scale(1); opacity: 1; } to { transform: scale(.98); opacity: 0; } }
</style>
