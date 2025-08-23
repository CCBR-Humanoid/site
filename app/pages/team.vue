<script setup lang="ts">
type SocialLink = { icon: string; url: string }
type TeamMember = { name: string; role: string; avatar: string; profileUrl: string; socials: SocialLink[] }
type Partner = { name: string; logo: string; clubs: string[]; url: string }

type TeamData = { members: TeamMember[] }
type PartnersData = { partners: Partner[] }

// Load team and partners from @nuxt/content data collections
const { data: team } = await useAsyncData<TeamMember[]>('team', async () => {
  const item = await queryCollection('team').first()
  return (item as unknown as TeamData | null)?.members ?? []
})
const { data: partners } = await useAsyncData<Partner[]>('partners', async () => {
  const item = await queryCollection('partners').first()
  return (item as unknown as PartnersData | null)?.partners ?? []
})
</script>

<template>
  <div>
    <UContainer class="py-12">
      <h1 class="text-4xl font-bold mb-8 text-center">
        Meet Our Team
      </h1>

  <div class="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] items-stretch">
        <TeamMemberCard v-for="member in team" :key="member.name" :member="member" />
      </div>
    </UContainer>

    <UContainer class="py-12">
      <h2 class="text-4xl font-bold mb-8 text-center">
        Team Affiliates
      </h2>

  <div class="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] items-stretch">
        <PartnerCard v-for="partner in partners" :key="partner.name" :partner="partner" />
      </div>
    </UContainer>
  </div>
</template>