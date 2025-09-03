<script setup lang="ts">
// Props
const props = defineProps<{ title: string, category?: string, date?: string }>()

// Deterministic palette index from title
const index = computed(() => {
  let h = 0
  for (let i = 0; i < props.title.length; i++) {
    h = (h * 31 + props.title.charCodeAt(i)) >>> 0
  }
  return h
})

const palettes = [
  { from: 'from-emerald-500/20', to: 'to-teal-700/25', ring: 'ring-emerald-500/30' },
  { from: 'from-indigo-500/20', to: 'to-violet-700/25', ring: 'ring-indigo-500/30' },
  { from: 'from-cyan-500/20', to: 'to-sky-700/25', ring: 'ring-cyan-500/30' },
  { from: 'from-rose-500/20', to: 'to-pink-700/25', ring: 'ring-rose-500/30' },
  { from: 'from-amber-500/20', to: 'to-orange-700/25', ring: 'ring-amber-500/30' },
  { from: 'from-fuchsia-500/20', to: 'to-purple-700/25', ring: 'ring-fuchsia-500/30' }
] as const

type Palette = (typeof palettes)[number]
const palette = computed((): Palette => palettes[index.value % palettes.length]!)

const initial = computed(() => (props.title?.trim()?.[0] || '?').toUpperCase())

// Normalize date-only format for display without timezone shift
const displayDate = computed(() => {
  if (!props.date) return null
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(props.date) ? `${props.date}T00:00:00` : props.date
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
})
</script>

<template>
  <div
    class="w-full aspect-[16/9] overflow-hidden rounded-md border border-[--ui-border] relative bg-gradient-to-br"
    :class="[palette.from, palette.to]"
    aria-hidden="true"
  >
    <!-- Soft grid pattern overlay -->
    <div class="absolute inset-0 opacity-20 mix-blend-overlay pattern" />

    <!-- Accent ring glow -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -inset-6 rounded-2xl blur-2xl ring-1" :class="palette.ring" />
    </div>

    <!-- Top-left: category -->
    <div class="absolute top-2 left-2 flex items-center gap-2">
      <div v-if="category" class="inline-flex items-center gap-1.5 rounded-full bg-black/10 dark:bg-white/10 px-2 py-1 text-[11px] font-medium text-white/90 shadow-sm backdrop-blur">
        <UIcon name="i-lucide-tag" class="h-3.5 w-3.5 opacity-80" />
        <span class="truncate">{{ category }}</span>
      </div>
    </div>

    <!-- Lettermark -->
    <div class="absolute inset-0 grid place-items-center select-none">
      <div class="relative flex items-center justify-center">
        <div class="text-6xl sm:text-7xl md:text-8xl font-semibold tracking-tight text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
          {{ initial }}
        </div>
      </div>
    </div>

    <!-- Bottom-right: date -->
    <div v-if="displayDate" class="absolute bottom-2 right-2 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/10 dark:bg-white/10 px-2 py-1 text-[11px] font-medium text-white/90 shadow-sm backdrop-blur">
      <UIcon name="i-lucide-calendar" class="h-3.5 w-3.5 opacity-80" />
      <span>{{ displayDate }}</span>
    </div>
  </div>
</template>

<style scoped>
.pattern {
  background-image:
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0),
    radial-gradient(circle at 1px 1px, rgba(0,0,0,0.25) 1px, transparent 0);
  background-size: 16px 16px, 16px 16px;
  background-position: 0 0, 8px 8px;
}
</style>
