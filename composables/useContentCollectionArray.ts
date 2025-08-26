import { computed } from 'vue'
import type { Ref } from 'vue'

// Declare Nuxt auto-imported functions for TypeScript without depending on '#imports'
declare function useAsyncData<T>(
  key: string,
  handler: () => Promise<T>
): Promise<{ data: Ref<T> }>
declare function queryCollection(collection: string): {
  first: () => Promise<Record<string, unknown> | null>
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
    const arr = item ? (item[options.field] as unknown) : undefined
    return Array.isArray(arr) ? (arr as T[]) : []
  })
  // Return a de-duplicated, stable array to avoid SSR/CSR merge duplication.
  // Use a generalized, content-based stable key that won't collapse distinct items
  // sharing a common field like "title".
  const unique = computed<T[]>(() => {
    const list = (data as Ref<T[] | undefined>).value ?? []

    function stableKey(v: unknown): string {
      if (v == null) return 'null'
      const t = typeof v
      if (t === 'string' || t === 'number' || t === 'boolean') return String(v)
      // Prefer truly unique identifiers when present
      const asAny = v as Record<string, unknown>
      if (asAny.id) return `id:${String(asAny.id)}`
      if (asAny.slug) return `slug:${String(asAny.slug)}`
      if (asAny.path) return `path:${String(asAny.path)}`

      // Deterministic stringify with sorted keys
      const seen = new WeakSet<object>()
      const stringify = (val: unknown): string => {
        if (val === null) return 'null'
        const type = typeof val
        if (type === 'string') return JSON.stringify(val as string)
        if (type === 'number' || type === 'boolean') return String(val)
        if (Array.isArray(val)) return `[${(val as unknown[]).map(stringify).join(',')}]`
        if (type === 'object') {
          const obj = val as Record<string, unknown>
          if (seen.has(obj)) return '"[Circular]"'
          seen.add(obj)
          const keys = Object.keys(obj).sort()
          const entries = keys.map(k => `${JSON.stringify(k)}:${stringify(obj[k])}`)
          return `{${entries.join(',')}}`
        }
        return JSON.stringify(String(val))
      }

      return stringify(v)
    }

    const map = new Map<string, T>()
    for (const it of list as unknown[]) {
      const k = stableKey(it)
      if (!map.has(k)) map.set(k, it as T)
    }
    return Array.from(map.values())
  })

  return unique as unknown as Ref<T[]>
}
