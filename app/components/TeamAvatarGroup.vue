<script setup lang="ts">
import type { TeamMember } from '../types'
import { useContentCollectionArray } from '../../composables/useContentCollectionArray'

const props = withDefaults(defineProps<{
  limit?: number
}>(), {
  limit: 6
})

const team = await useContentCollectionArray<TeamMember>({
  collection: 'team',
  field: 'members',
  key: 'team'
})

const display = computed(() => (team.value || []).slice(0, props.limit))
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
      <UAvatar :src="m.avatar" :alt="m.name" />
    </ULink>
  </UAvatarGroup>
  
</template>

<style scoped>
</style>
