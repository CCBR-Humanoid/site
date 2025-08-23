<script setup lang="ts">
const props = defineProps<{
  member: {
    name: string
    role: string
    avatar: string
    profileUrl: string
    socials: { icon: string; url: string }[]
  }
}>()
</script>

<template>
  <ULink :to="props.member.profileUrl" target="_blank" class="block h-full">
    <UCard
      class="text-center p-6 flex flex-col items-center h-full transition-shadow duration-300 ease-in-out hover:shadow-xl hover:-translate-y-0.5"
    >
  <UAvatar :src="props.member.avatar" :alt="props.member.name" size="3xl" class="mx-auto mb-4 w-36 h-36 sm:w-40 sm:h-40" />

      <p class="font-semibold">{{ props.member.name }}</p>
      <p class="text-sm text-gray-500">{{ props.member.role }}</p>

      <div class="mt-2 flex flex-wrap justify-center gap-3">
        <ULink
          v-for="(social, i) in props.member.socials"
          :key="i"
          :to="social.url"
          target="_blank"
        >
          <UIcon :name="social.icon" class="text-primary w-5 h-5" />
        </ULink>
      </div>
    </UCard>
  </ULink>
</template>
