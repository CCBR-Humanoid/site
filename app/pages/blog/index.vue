<script setup lang="ts">
// Query posts from the `blog` collection
const { data: posts } = await useAsyncData<any[]>('blog-list', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .select('title', 'description', 'path', 'date')
    .all()
)

const items = computed(() =>
  [...(posts.value || [])]
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .map((p: any) => ({
      title: p.title,
      description: p.description,
      date: p.date,
      image: (p as any).cover,
      path: p.path
    }))
)

useSeoMeta({
  title: 'Blog',
  description: 'Latest news and updates.'
})
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer>
        <UBlogPosts>
          <UBlogPost
            v-for="(post, index) in items"
            :key="index"
            v-bind="post"
            :to="post.path"
          />
        </UBlogPosts>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
