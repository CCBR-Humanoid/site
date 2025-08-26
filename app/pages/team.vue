<script setup lang="ts">
import { useContentCollectionArray } from '../../composables/useContentCollectionArray'
import type { Partner, TeamMember } from '~/types'

// Load team and partners from @nuxt/content data collections
const team = await useContentCollectionArray<TeamMember>({
  collection: 'team',
  field: 'members',
  key: 'team'
})

const partners = await useContentCollectionArray<Partner>({
  collection: 'partners',
  field: 'partners',
  key: 'partners'
})
</script>

<template>
  <div>
    <GridSection
      title="Meet Our Team"
      :items="team"
      item-key="name"
      min-width="220px"
      :heading-level="1"
    >
      <template #item="{ item }">
        <TeamMemberCard :member="item" />
      </template>
    </GridSection>

    <GridSection
      title="Team Affiliates"
      :items="partners"
      item-key="url"
      min-width="220px"
      :heading-level="2"
    >
      <template #item="{ item }">
        <PartnerCard :partner="item" />
      </template>
    </GridSection>
  </div>
</template>
