// @ts-nocheck
export function useSearchData() {
  // Build unified search files from both docs and blog
  const { data: files } = useLazyAsyncData('search', async () => {
    const [docs, blog] = await Promise.all([
      queryCollectionSearchSections('docs'),
      queryCollectionSearchSections('blog')
    ])
    return [
      ...((docs as any[]) || []),
      ...((blog as any[]) || [])
    ]
  }, { server: false })

  // Docs index used for the shortcut group
  const { data: docsIndex } = useAsyncData('docs-index', () =>
    queryCollection('docs').path('/docs').first()
  )

  // Helper to assign icons to navigation trees
  function withIcon(nodes: any[] = [], icon: string): any[] {
    return (nodes || []).map((n: any) => ({
      ...n,
      icon,
      children: withIcon(n.children || [], icon)
    }))
  }

  // Build combined navigation for search (docs + blog) with icons
  const { data: searchNavigation } = useAsyncData('search-navigation', async () => {
    const [docsNav, blogNav] = await Promise.all([
      queryCollectionNavigation('docs'),
      queryCollectionNavigation('blog')
    ])
    const docsRoot = { title: 'Docs', path: '/docs', children: [] as any[] }
    const blogRoot = { title: 'Blog', path: '/blog', children: [] as any[] }
    const docsNavWithIcons = withIcon((docsNav as any[]) || [], 'i-lucide:book-open')
    const blogNavWithIcons = withIcon((blogNav as any[]) || [], 'i-lucide:newspaper')
    return [
      { ...docsRoot, icon: 'i-lucide:book-open' },
      ...docsNavWithIcons,
      { ...blogRoot, icon: 'i-lucide:newspaper' },
      ...blogNavWithIcons
    ]
  })

  // Search groups (shortcuts)
  const groups = computed(() => ([
    {
      id: 'docs-shortcuts',
      label: 'Docs',
      items: [
        {
          label: docsIndex.value?.title || 'Docs',
          suffix: docsIndex.value?.description || 'Centralized documentation.',
          to: '/docs',
          icon: 'i-lucide:book-open'
        }
      ]
    }
  ]))

  return { files, searchNavigation, groups }
}
