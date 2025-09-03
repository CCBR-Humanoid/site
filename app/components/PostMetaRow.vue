<script setup lang="ts">
import { useContentCollectionArray } from '../../composables/useContentCollectionArray'
import type { TeamMember } from '@schema'

const props = defineProps<{
  date?: string
  author?: string | string[]
  avatarSize?: '2xs' | 'xs' | 'sm'
}>()

// Resolve authors to team members
const teamMembers = await useContentCollectionArray<TeamMember>({
  collection: 'team',
  field: 'members',
  key: 'team-for-meta'
})

const profiles = computed(() => {
  const members = teamMembers.value || []
  const names = Array.isArray(props.author)
    ? props.author
    : typeof props.author === 'string'
      ? props.author.split(',').map(s => s.trim()).filter(Boolean)
      : []
  return names
    .map((n) => members.find((m: TeamMember) => m.name?.trim() === n))
    .filter(Boolean) as Pick<TeamMember, 'name' | 'avatar'>[]
})

const displayDate = computed(() => {
  const d = props.date
  if (!d) return ''
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00` : d
  const dt = new Date(iso)
  if (Number.isNaN(dt.getTime())) return ''
  return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
})

const size = computed(() => props.avatarSize ?? 'xs')
</script>

<template>
  <div class="flex items-center justify-between text-xs text-muted-foreground">
    <div class="inline-flex items-center gap-1.5" v-if="displayDate">
      <UIcon name="i-lucide-calendar" class="h-3.5 w-3.5 opacity-60" />
      <span>{{ displayDate }}</span>
    </div>

    <div class="inline-flex items-center gap-2 ml-auto" v-if="profiles.length">
      <template v-if="profiles.length === 1">
        <UAvatar :src="profiles[0]?.avatar" :alt="profiles[0]?.name || 'Author'" :size="size" />
        <span>{{ profiles[0]?.name }}</span>
      </template>
      <UAvatarGroup v-else>
        <UAvatar
          v-for="a in profiles"
          :key="a.name"
          :src="a.avatar"
          :alt="a.name"
          :size="size"
        />
      </UAvatarGroup>
    </div>
  </div>
</template>

<style scoped>
</style>
