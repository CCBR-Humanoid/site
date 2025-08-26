<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { header } = useAppConfig()

const route = useRoute()

function capitalizeWords(str: string) {
  return str.replace(/(^|\s|[-_/])([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase()).replace(/[-_]/g, ' ')
}

const currentMenuLabel = computed(() => {
  const path = route.path || '/'
  const links = (header?.links || []) as Array<{ label?: string, to?: string }>
  // Longest prefix match against configured links
  const match = links
    .filter(l => typeof l.to === 'string' && l.to)
    .slice()
    .sort((a, b) => String(b.to).length - String(a.to).length)
    .find(l => path === l.to || path.startsWith(String(l.to) + '/'))

  if (match?.label) return match.label
  if (path === '/') return 'Home'
  const seg = path.split('/').filter(Boolean)[0]
  return seg ? capitalizeWords(seg) : 'Menu'
})
</script>

<template>
  <UHeader
    :ui="{ center: 'flex-1' }"
    :to="header?.to || '/'"
  >
    <UContentSearchButton
      :collapsed="false"
      :block="true"
    />

    <template #title>
      <UColorModeImage
        v-if="header?.logo?.dark || header?.logo?.light"
        :light="header?.logo?.light!"
        :dark="header?.logo?.dark!"
        :alt="header?.logo?.alt"
        class="h-6 w-auto shrink-0"
      />

      <span v-else-if="header?.title">
        {{ header.title }}
      </span>
    </template>

    <template #right>
      <UDropdownMenu
        :items="header.links"
        :modal="false"
        size="xs"
      >
        <UButton
          :label="currentMenuLabel"
          variant="subtle"
          trailing-icon="i-lucide-chevron-down"
          size="xs"
          class="rounded-full"
        />
      </UDropdownMenu>

      <!-- Desktop/tablet links -->
      <!--
      <div v-if="header?.links" class="hidden md:flex flex-wrap items-center gap-1">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </div>
      -->

      <!-- Mobile menu for links -->
      <!--
      <UDropdownMenu
        v-if="header?.links"
        class="md:hidden"
        :items="header.links"
        :modal="false"
        size="xs"
      >
        <UButton
          label="Menu"
          variant="subtle"
          trailing-icon="i-lucide-chevron-down"
          size="xs"
          class="rounded-full"
        />
      </UDropdownMenu>
      -->

      <UColorModeButton />
    </template>

    <template #body>
      <div class="overflow-x-auto">
        <UContentNavigation
          highlight
          :navigation="navigation"
        />
      </div>
    </template>
  </UHeader>
</template>

<style scoped>
/* Additionally hide title/logo on short viewports to save vertical space */
@media (max-height: 700px) {
  .title-or-logo { display: none; }
}
</style>
