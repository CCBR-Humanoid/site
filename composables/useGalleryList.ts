import { computed, ref } from 'vue'
import type { Ref } from 'vue'

// Declare Nuxt auto-imported functions for TS
declare function useAsyncData<T>(
  key: string,
  handler: () => Promise<T>
): Promise<{ data: Ref<T> }>
declare function queryCollection<T = any>(collection: string): {
  select: (...fields: string[]) => ReturnType<typeof queryCollection<T>>
  first: () => Promise<T>
}

export type GalleryListItem = {
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

export async function useGalleryList() {
  const { data } = await useAsyncData<any>('gallery-data', async () => {
    const doc = await queryCollection<any>('gallery').select('items').first()
    return doc || { items: [] }
  })

  const rawItems = computed<GalleryListItem[]>(() => (data.value?.items || []) as GalleryListItem[])

  const allTags = computed(
    () => Array.from(new Set((rawItems.value || []).flatMap(p => p.tags || []))).sort()
  )
  const allCategories = computed(
    () => Array.from(new Set((rawItems.value || []).map(p => p.category).filter(Boolean))).sort()
  )

  const selectedCategory = ref<string | null>(null)
  const selectedTags = ref<string[]>([])
  const selectedType = ref<'all' | 'image' | 'video'>('all')
  const sortKey = ref<'newest' | 'oldest' | 'title'>('newest')

  const filtered = computed(() => {
    // Normalize a shallow copy to avoid mutating originals and ensure stable defaults
    let list = (rawItems.value || []).map((it) => {
      if (it.type === 'video') {
        // Determine a primary src for keys/thumbnails
        const primarySrc = it.src || it.sources?.[0]?.src
        return {
          ...it,
          src: primarySrc,
          autoplay: it.autoplay ?? false,
          loop: it.loop ?? true,
          muted: it.muted ?? false,
          controls: it.controls ?? true,
        }
      }
      return { ...it }
    })
    const toLocalDateString = (d?: string) => {
      if (!d) return undefined
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return `${d}T00:00:00`
      return d
    }
    const toTime = (d?: string) => {
      const nd = toLocalDateString(d)
      const t = nd ? new Date(nd).getTime() : NaN
      return Number.isNaN(t) ? -Infinity : t
    }
    if (selectedCategory.value) {
      list = list.filter(p => p.category === selectedCategory.value)
    }
    if (selectedType.value !== 'all') {
      list = list.filter(p => p.type === selectedType.value)
    }
    if (selectedTags.value.length) {
      list = list.filter((p) => {
        const tags = (p.tags || []) as string[]
        return selectedTags.value.every(t => tags.includes(t))
      })
    }
    switch (sortKey.value) {
      case 'oldest':
        list.sort((a, b) => toTime(a.date) - toTime(b.date))
        break
      case 'title':
        list.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
        break
      default:
        list.sort((a, b) => toTime(b.date) - toTime(a.date))
    }
    return list
  })

  const items = computed(() => filtered.value)
  const itemCount = computed(() => rawItems.value?.length || 0)

  return {
    items,
    allTags,
    allCategories,
    selectedCategory,
    selectedTags,
  selectedType,
    sortKey,
    itemCount
  }
}
