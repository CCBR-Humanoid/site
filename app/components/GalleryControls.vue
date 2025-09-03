<script setup lang="ts">
const props = defineProps<{
  allTags: string[]
  allCategories: (string | undefined)[]
  selectedCategory: string | null
  selectedTags: string[]
  selectedType: 'all' | 'image' | 'video'
  sortKey: 'newest' | 'oldest' | 'title'
}>()

const emit = defineEmits<{
  (e: 'update:selectedCategory', v: string | null): void
  (e: 'update:selectedTags', v: string[]): void
  (e: 'update:selectedType', v: 'all' | 'image' | 'video'): void
  (e: 'update:sortKey', v: 'newest' | 'oldest' | 'title'): void
}>()

function toggleTag(tag: string) {
  const next = props.selectedTags.includes(tag)
    ? props.selectedTags.filter(t => t !== tag)
    : [...props.selectedTags, tag]
  emit('update:selectedTags', next)
}
</script>

<template>
  <section class="mb-6 grid gap-3 sm:flex sm:items-center sm:justify-between">
    <div class="flex flex-wrap items-center gap-2">
      <!-- Type filter -->
      <UDropdownMenu :items="[[
        { label: 'All media', onSelect: () => emit('update:selectedType', 'all') },
        { label: 'Images', onSelect: () => emit('update:selectedType', 'image') },
        { label: 'Videos', onSelect: () => emit('update:selectedType', 'video') },
      ]]">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-image-play"
          :label="({ all: 'All media', image: 'Images', video: 'Videos' } as const)[selectedType]"
          class="rounded-full"
        />
      </UDropdownMenu>

      <!-- Category filter -->
      <UDropdownMenu
        :items="[[
          { label: 'All categories', onSelect: () => emit('update:selectedCategory', null) },
          ...allCategories.filter(Boolean).map(c => ({ label: c as string, onSelect: () => emit('update:selectedCategory', c as string) }))
        ]]"
      >
        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-filter"
          :label="selectedCategory ? `Category: ${selectedCategory}` : 'All categories'"
          class="rounded-full"
        />
      </UDropdownMenu>

      <!-- Tags filter -->
      <UDropdownMenu
        :items="[allTags.map(tag => ({
          label: tag,
          onSelect: () => toggleTag(tag)
        }))]"
      >
        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-tags"
          :label="selectedTags.length ? `${selectedTags.length} tag${selectedTags.length === 1 ? '' : 's'}` : 'Tags'"
          class="rounded-full"
        />
      </UDropdownMenu>
    </div>

    <div class="flex items-center gap-2">
      <UDropdownMenu :items="[[{ label: 'Newest', onSelect: () => emit('update:sortKey', 'newest') }, { label: 'Oldest', onSelect: () => emit('update:sortKey', 'oldest') }, { label: 'Title (A–Z)', onSelect: () => emit('update:sortKey', 'title') }]]">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-arrow-up-down"
          :label="({ newest: 'Newest', oldest: 'Oldest', title: 'Title (A–Z)' } as const)[sortKey]"
          class="rounded-full"
        />
      </UDropdownMenu>
    </div>
  </section>

  <!-- Active tag chips -->
  <div
    v-if="selectedCategory || selectedTags.length || selectedType !== 'all'"
    class="mb-4 flex flex-wrap items-center gap-2"
  >
    <UBadge
      v-if="selectedType !== 'all'"
      color="neutral"
      variant="soft"
      class="rounded-full"
    >
      {{ ({ image: 'Images', video: 'Videos' } as any)[selectedType] }}
    </UBadge>

    <UBadge
      v-if="selectedCategory"
      color="primary"
      variant="soft"
      class="rounded-full"
    >
      {{ selectedCategory }}
    </UBadge>

    <UBadge
      v-for="tag in selectedTags"
      :key="tag"
      color="neutral"
      variant="soft"
      class="rounded-full cursor-pointer select-none transition group hover:ring-2 hover:ring-[--ui-border] hover:bg-primary/10 hover:text-primary"
      :aria-label="`Remove tag ${tag}`"
      @click="emit('update:selectedTags', selectedTags.filter(t => t !== tag))"
    >
      <span class="inline-flex items-center gap-1">
        {{ tag }}
        <UIcon
          name="i-lucide-x"
          class="h-3.5 w-3.5 opacity-60 group-hover:opacity-100"
        />
      </span>
    </UBadge>

    <UButton
      color="neutral"
      variant="ghost"
      size="xs"
  @click="emit('update:selectedCategory', null); emit('update:selectedTags', []); emit('update:selectedType', 'all')"
    >
      Clear
    </UButton>
  </div>
</template>

<style scoped>
</style>
