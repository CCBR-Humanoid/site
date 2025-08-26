<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  items?: any[]
  itemKey?: string
  minWidth?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}>(), {
  minWidth: '200px',
  headingLevel: 2
})

const headingTag = computed(() => `h${props.headingLevel}` as const)
const gridStyle = computed(() => ({ '--min': props.minWidth } as CSSProperties))
const safeItems = computed<any[]>(() => props.items ?? [])

defineSlots<{
  item(props: { item: any; index: number }): any
}>()
</script>

<template>
  <UContainer class="py-12">
    <component :is="headingTag" class="text-4xl font-bold mb-8 text-center">
      {{ title }}
    </component>

    <div
      class="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(var(--min),1fr))] items-stretch"
      :style="gridStyle"
    >
  <template v-for="(item, idx) in safeItems" :key="props.itemKey ? (item as any)?.[props.itemKey] : idx">
        <slot name="item" :item="item" :index="idx" />
      </template>
    </div>
  </UContainer>
</template>