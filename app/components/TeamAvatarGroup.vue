<script setup lang="ts">
import type { TeamMember } from '@schema'
import { useContentCollectionArray } from '../../composables/useContentCollectionArray'

const props = withDefaults(defineProps<{
  limit?: number | string
}>(), {
  limit: 6
})

const team = await useContentCollectionArray<TeamMember>({
  collection: 'team',
  field: 'members',
  key: 'team'
})

const limit = computed(() => {
  const v = props.limit
  if (typeof v === 'string') {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }
  return v ?? 0
})

const display = computed(() => (team.value || []).slice(0, limit.value))
</script>

<template>
  <UAvatarGroup>
    <ULink
      v-for="m in display"
      :key="m.name + ':' + (m.profileUrl || '')"
      :to="m.profileUrl"
      target="_blank"
      class="hover:ring-primary transition"
      raw
    >
      <UAvatar
        :src="m.avatar"
        :alt="m.name"
      />
    </ULink>
  </UAvatarGroup>
</template>

<style scoped>
</style>
