<script setup lang="ts">
const props = defineProps<{
  partner: {
    name: string
    logo: string
    clubs: string[]
    url: string
  }
}>()
</script>

<template>
  <ULink :to="props.partner.url" target="_blank">
    <UCard
      class="text-center p-6 flex flex-col items-center transform transition-all duration-500 ease-in-out
      hover:scale-105 hover:shadow-xl hover:-translate-y-1"
    >
      <img
        :src="props.partner.logo"
        :alt="props.partner.name + ' logo'"
        class="mb-4 h-30 w-auto object-contain mx-auto"
      />

      <p class="font-semibold">{{ props.partner.name }}</p>
      <p class="text-sm text-gray-500">
        <template v-for="(club, i) in props.partner.clubs" :key="club">
          {{ club }}<span v-if="i < props.partner.clubs.length - 1"> &amp; </span>
        </template>
      </p>
    </UCard>
  </ULink>
</template>
