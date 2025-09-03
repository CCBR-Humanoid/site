<script setup lang="ts">
import { useGalleryList } from '../../composables/useGalleryList'

const { items, allTags, allCategories, selectedCategory, selectedTags, selectedType, sortKey, itemCount } = await useGalleryList()

useSeoMeta({
  title: 'Gallery',
  description: 'Photos and videos from our projects and adventures.'
})

defineOgImageComponent('Docs', {
  title: 'CCBR Gallery',
  description: 'Photos and videos from the CCBR Humanoid Collaboratory.'
})
</script>

<template>
  <UPage>
    <UPageBody>
      <div class="relative">
        <div class="pointer-events-none absolute inset-x-0 -top-10 h-48 bg-gradient-to-b from-green-500/10 to-transparent blur-2xl" />

        <UContainer>
          <!-- Hero -->
          <section class="py-8 sm:py-10">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">Gallery</h1>
                <p class="mt-2 text-sm text-muted-foreground max-w-prose">
                  Browse photos and videos. Filter by category or tags, and sort how you like.
                </p>
              </div>
              <div class="hidden sm:flex items-center gap-3">
                <UBadge color="primary" variant="soft">{{ itemCount }} item{{ itemCount === 1 ? '' : 's' }}</UBadge>
              </div>
            </div>
          </section>

          <GalleryControls
            :all-tags="allTags"
            :all-categories="allCategories"
            :selected-category="selectedCategory"
            :selected-tags="selectedTags"
            :selected-type="selectedType"
            :sort-key="sortKey"
            @update:selected-category="(v) => selectedCategory = v"
            @update:selected-tags="(v) => selectedTags = v"
            @update:selected-type="(v) => selectedType = v"
            @update:sort-key="(v) => sortKey = v"
          />

          <GalleryGrid :items="items" />
        </UContainer>
      </div>
    </UPageBody>
  </UPage>
</template>

<style scoped>
</style>
