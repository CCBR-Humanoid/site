<script setup lang="ts">
import { pluralize } from '../../../utils/pluralize'
type Post = {
  title: string
  description?: string
  path: string
  date?: string
  cover?: string
  category?: string
  tags?: string[]
}

const { data: posts } = await useAsyncData<Post[]>('blog-list', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .select('title', 'description', 'path', 'date')
    .all()
)

// Derive filters
const allTags = computed(() => Array.from(new Set((posts.value || []).flatMap(p => (p as any).tags || []))).sort())
const allCategories = computed(() => Array.from(new Set((posts.value || []).map(p => (p as any).category).filter(Boolean))).sort())

// UI state
const selectedCategory = ref<string | null>(null)
const selectedTags = ref<string[]>([])
const sortKey = ref<'newest' | 'oldest' | 'title'>('newest')

const filtered = computed(() => {
  let list = [...(posts.value || [])]
  if (selectedCategory.value) {
    list = list.filter(p => (p as any).category === selectedCategory.value)
  }
  if (selectedTags.value.length) {
    list = list.filter(p => {
      const tags = ((p as any).tags || []) as string[]
      return selectedTags.value.every(t => tags.includes(t))
    })
  }
  switch (sortKey.value) {
    case 'oldest':
      list.sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
      break
    case 'title':
      list.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
      break
    default:
      list.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
  }
  return list
})

const items = computed(() => filtered.value.map((p: any) => ({
  title: p.title,
  description: p.description,
  date: p.date,
  image: p.cover,
  path: p.path,
  category: p.category,
  tags: p.tags || []
})))

const postCount = computed(() => posts.value?.length || 0)

useSeoMeta({
  title: 'Blog',
  description: 'Latest news and updates.'
})

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Title (A–Z)', value: 'title' }
]
</script>

<template>
  <UPage>
    <UPageBody>
      <div class="relative">
        <!-- Decorative gradient backdrop -->
        <div class="pointer-events-none absolute inset-x-0 -top-10 h-48 bg-gradient-to-b from-green-500/10 to-transparent blur-2xl" />

        <UContainer>
          <!-- Hero -->
          <section class="py-8 sm:py-10">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">CCBR Blog</h1>
                <p class="mt-2 text-sm text-muted-foreground max-w-prose">
                  Stories from our builds, experiments, and software. Filter by category or tags, and sort how you like.
                </p>
              </div>
              <div class="hidden sm:flex items-center gap-3">
                <UBadge color="primary" variant="soft">{{ postCount }} {{ pluralize(postCount, 'post') }}</UBadge>
              </div>
            </div>
          </section>

          <!-- Controls -->
          <section class="mb-6 grid gap-3 sm:flex sm:items-center sm:justify-between">
            <div class="flex flex-wrap items-center gap-2">
              <!-- Category filter -->
              <UPopover>
                <UButton
                  color="neutral"
                  variant="soft"
                  icon="i-lucide-filter"
                  :label="selectedCategory ? `Category: ${selectedCategory}` : 'All categories'"
                  class="rounded-full"
                />
                <template #panel>
                  <UCommand :groups="[{
                    key: 'categories',
                    items: [{ id: 'all', label: 'All categories' }, ...allCategories.map(c => ({ id: c, label: c }))]
                  }]" @update:value="(val: string) => { selectedCategory = val === 'all' ? null : val }" />
                </template>
              </UPopover>

              <!-- Tags filter -->
              <UPopover>
                <UButton
                  color="neutral"
                  variant="soft"
                  icon="i-lucide-tags"
                  :label="selectedTags.length ? `${selectedTags.length} ${pluralize(selectedTags.length, 'tag')}` : 'Tags'"
                  class="rounded-full"
                />
                <template #panel>
                  <div class="p-2 w-64">
                    <div class="flex flex-wrap gap-2">
                      <UChip
                        v-for="tag in allTags"
                        :key="tag"
                        :label="tag"
                        :selected="selectedTags.includes(tag)"
                        @click="selectedTags = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag]"
                      />
                    </div>
                  </div>
                </template>
              </UPopover>
            </div>

            <div class="flex items-center gap-2">
              <UDropdownMenu :items="[[{ label: 'Newest', onSelect: () => sortKey = 'newest' }, { label: 'Oldest', onSelect: () => sortKey = 'oldest' }, { label: 'Title (A–Z)', onSelect: () => sortKey = 'title' }]]">
                <UButton
                  color="neutral"
                  variant="soft"
                  icon="i-lucide-arrow-up-down"
                  :label="sortOptions.find(o => o.value === sortKey)?.label || 'Sort'"
                  class="rounded-full"
                />
              </UDropdownMenu>
            </div>
          </section>

          <!-- Active tag chips -->
          <div v-if="selectedCategory || selectedTags.length" class="mb-4 flex flex-wrap items-center gap-2">
            <UBadge v-if="selectedCategory" color="primary" variant="soft" class="rounded-full">{{ selectedCategory }}</UBadge>
            <UBadge v-for="tag in selectedTags" :key="tag" color="neutral" variant="soft" class="rounded-full">{{ tag }}</UBadge>
            <UButton color="neutral" variant="ghost" size="xs" @click="selectedCategory = null; selectedTags = []">Clear</UButton>
          </div>

          <!-- Posts -->
          <UBlogPosts class="mt-2">
            <UBlogPost
              v-for="(post, index) in items"
              :key="index"
              v-bind="post"
              :to="post.path"
            >
              <template #footer>
                <div class="flex flex-wrap items-center gap-2">
                  <UBadge v-if="post.category" color="primary" variant="soft" class="rounded-full">{{ post.category }}</UBadge>
                  <UBadge v-for="tag in post.tags" :key="tag" color="neutral" variant="soft" class="rounded-full">{{ tag }}</UBadge>
                </div>
              </template>
            </UBlogPost>
          </UBlogPosts>
        </UContainer>
      </div>
    </UPageBody>
  </UPage>
</template>
