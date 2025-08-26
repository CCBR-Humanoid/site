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
  // Prefer a stable key if present: id -> name -> title -> JSON string.
  const unique = computed<T[]>(() => {
    const list = (data as Ref<T[] | undefined>).value ?? []
    // Use Map to keep last occurrence and preserve order of first occurrences
    const map = new Map<string, T>()
    for (const it of list as any[]) {
      const k = (
        (it && (it.id as string)) ||
        (it && (it.name as string)) ||
        (it && (it.title as string)) ||
        JSON.stringify(it)
      )
      if (!map.has(k)) map.set(k, it as T)
    }
    return Array.from(map.values())
  })

  return unique as unknown as Ref<T[]>
}
