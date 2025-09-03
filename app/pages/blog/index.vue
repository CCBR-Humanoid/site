<script setup lang="ts">
import { pluralize } from '../../../utils/pluralize'
import { useBlogList } from '../../../composables/useBlogList'

const { items, allTags, allCategories, selectedCategory, selectedTags, sortKey, postCount } = await useBlogList()

useSeoMeta({
  title: 'Blog',
  description: 'Latest news and updates.'
})

defineOgImageComponent('Docs', {
  title: 'CCBR Blog',
  description: 'Latest news and updates from the CCBR Humanoid Collaboratory.'
})

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
                <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">
                  CCBR Blog
                </h1>
                <p class="mt-2 text-sm text-muted-foreground max-w-prose">
                  Stories from our builds, experiments, and software. Filter by category or tags, and sort how you like.
                </p>
              </div>
              <div class="hidden sm:flex items-center gap-3">
                <UBadge
                  color="primary"
                  variant="soft"
                >
                  {{ postCount }} {{ pluralize(postCount, 'post') }}
                </UBadge>
              </div>
            </div>
          </section>

          <BlogControls
            :all-tags="allTags"
            :all-categories="allCategories"
            :selected-category="selectedCategory"
            :selected-tags="selectedTags"
            :sort-key="sortKey"
            @update:selected-category="(v) => selectedCategory = v"
            @update:selected-tags="(v) => selectedTags = v"
            @update:sort-key="(v) => sortKey = v"
          />

          <!-- Active tag chips are rendered inside BlogControls -->

          <!-- Posts -->
          <UBlogPosts class="mt-2">
            <BlogPostCard
              v-for="(post, index) in items"
              :key="index"
              v-bind="post"
            />
          </UBlogPosts>
        </UContainer>
      </div>
    </UPageBody>
  </UPage>
</template>
