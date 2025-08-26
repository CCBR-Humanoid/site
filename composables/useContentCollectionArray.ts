import { computed, type Ref } from 'vue'

// Declare Nuxt auto-imported functions for TypeScript without depending on '#imports'
declare function useAsyncData<T>(
  key: string,
  handler: () => Promise<T>
): Promise<{ data: Ref<T> }>
declare function queryCollection(collection: string): {
  first: () => Promise<any>
}

/**
 * Load an array field from the first document of a @nuxt/content collection.
 * Returns a Ref<T[]> suitable for direct use in templates.
 */
export async function useContentCollectionArray<T>(options: {
  collection: string
  field: string
  key?: string
}): Promise<Ref<T[]>> {
  const key = options.key ?? `${options.collection}-${options.field}`
  const { data } = await useAsyncData<T[]>(key, async () => {
    const item = await queryCollection(options.collection).first()
    const arr = (item as any)?.[options.field]
    return Array.isArray(arr) ? (arr as T[]) : []
  })
  // Return a de-duplicated, stable array to avoid SSR/CSR merge duplication.
  // Use a generalized, content-based stable key that won't collapse distinct items
  // sharing a common field like "title".
  const unique = computed<T[]>(() => {
    const list = (data as Ref<T[] | undefined>).value ?? []

    function stableKey(v: any): string {
      if (v == null) return 'null'
      const t = typeof v
      if (t === 'string' || t === 'number' || t === 'boolean') return String(v)
      // Prefer truly unique identifiers when present
      if (v.id) return `id:${v.id}`
      if (v.slug) return `slug:${v.slug}`
      if (v.path) return `path:${v.path}`

      // Deterministic stringify with sorted keys
      const seen = new WeakSet()
      const stringify = (val: any): string => {
        if (val === null) return 'null'
        const type = typeof val
        if (type === 'string') return JSON.stringify(val)
        if (type === 'number' || type === 'boolean') return String(val)
        if (Array.isArray(val)) return `[${val.map(stringify).join(',')}]`
        if (type === 'object') {
          if (seen.has(val)) return '"[Circular]"'
          seen.add(val)
          const keys = Object.keys(val).sort()
          const entries = keys.map(k => `${JSON.stringify(k)}:${stringify(val[k])}`)
          return `{${entries.join(',')}}`
        }
        return JSON.stringify(String(val))
      }

      return stringify(v)
    }

    const map = new Map<string, T>()
    for (const it of list as any[]) {
      const k = stableKey(it)
      if (!map.has(k)) map.set(k, it as T)
    }
    return Array.from(map.values())
  })

  return unique as unknown as Ref<T[]>
}
