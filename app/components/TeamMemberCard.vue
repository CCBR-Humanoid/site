<script setup lang="ts">
import type { TeamMember } from '~/types/team-member'

const props = defineProps<{ member: TeamMember }>()
</script>

<template>
  <UCard
    class="text-center p-6 flex flex-col items-center h-full transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl hover:-translate-y-1"
  >
    <ULink
      :to="props.member.profileUrl"
      target="_blank"
      class="flex flex-col items-center flex-1 w-full min-h-[16rem]"
    >
      <UAvatar
        :src="props.member.avatar"
        :alt="props.member.name"
        size="3xl"
        class="mx-auto mb-4 w-36 h-36 sm:w-40 sm:h-40"
      />
      <p class="font-semibold leading-tight text-center">{{ props.member.name }}</p>
      <p class="text-sm text-gray-500">{{ props.member.role }}</p>
    </ULink>

    <div
      v-if="props.member.socials?.length"
      class="mt-4 flex flex-wrap justify-center gap-3 mt-auto"
    >
      <ULink
        v-for="(social, i) in props.member.socials"
        :key="i"
        :to="social.url"
        target="_blank"
      >
        <UIcon
          :name="social.icon"
          class="text-primary w-5 h-5"
        />
      </ULink>
    </div>
  </UCard>
</template>
