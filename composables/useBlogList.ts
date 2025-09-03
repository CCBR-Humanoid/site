import { computed, ref } from 'vue'
import type { Ref } from 'vue'

// Declare Nuxt auto-imported functions for TypeScript without depending on '#imports'
declare function useAsyncData<T>(
  key: string,
  handler: () => Promise<T>
): Promise<{ data: Ref<T> }>
declare function queryCollection<T = any>(collection: string): {
  where: (field: string, op: string, value: unknown) => ReturnType<typeof queryCollection<T>>
  select: (...fields: string[]) => ReturnType<typeof queryCollection<T>>
  all: () => Promise<T[]>
}

type Post = {
  title: string
  description?: string
  path: string
  date?: string
  cover?: string
  category?: string
  tags?: string[]
  author?: string | string[]
}

export async function useBlogList() {
  const { data: posts } = await useAsyncData<Post[]>('blog-list', () =>
    queryCollection('blog')
      .where('draft', '=', false)
      .select('title', 'description', 'path', 'date', 'category', 'cover', 'tags', 'author')
      .all()
  )

  const allTags = computed(
    () => Array.from(new Set(((posts.value || []) as Post[]).flatMap(p => p.tags || []))).sort()
  )
  const allCategories = computed(
    () => Array.from(new Set(((posts.value || []) as Post[]).map(p => p.category).filter(Boolean))).sort()
  )

  const selectedCategory = ref<string | null>(null)
  const selectedTags = ref<string[]>([])
  const sortKey = ref<'newest' | 'oldest' | 'title'>('newest')

  const filtered = computed(() => {
    let list = [...((posts.value || []) as Post[])]
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

  const items = computed(() => filtered.value.map((p: Post) => ({
    title: p.title,
    description: p.description,
    date: p.date && /^\d{4}-\d{2}-\d{2}$/.test(p.date) ? `${p.date}T00:00:00` : p.date,
    image: p.cover,
    path: p.path,
    category: p.category,
    tags: p.tags || [],
    author: p.author
  })))

  const postCount = computed(() => posts.value?.length || 0)

  return {
    posts,
    items,
    allTags,
    allCategories,
    selectedCategory,
    selectedTags,
    sortKey,
    postCount
  }
}
