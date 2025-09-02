<script setup lang="ts">
import type { TeamMember } from '@schema'
const props = defineProps<{ member: TeamMember }>()
</script>

<template>
  <div
    class="text-center p-6 flex flex-col items-center h-full transform transition-all
           duration-500 ease-in-out hover:scale-105 hover:shadow-xl hover:-translate-y-1"
    style="border: 1px solid #ffffff20; border-radius: 0.5rem; row-gap: 20px;"
  >
    <ULink
      :to="props.member.profileUrl"
      target="_blank"
      class="flex-1 flex-col items-center w-full"
    >
      <!-- Fallback to display initials with `alt` in case of no avatar -->
      <UAvatar
        :src="props.member.avatar"
        :alt="props.member.name"
        width="840"
        height="840"
        class="mx-auto mb-4 w-36 h-36 sm:w-40 sm:h-40"
      />
      <p class="font-semibold leading-tight text-center">{{ props.member.name }}</p>
      <p class="text-sm text-gray-500">{{ props.member.role }}</p>
    </ULink>

    <div
      v-if="props.member.socials?.length"
      class="flex justify-center gap-3"
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
  </div>
</template>