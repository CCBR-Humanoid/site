<script setup lang="ts">
import type { Partner } from '~/types/partner'

const props = defineProps<{ partner: Partner }>()
</script>

<template>
  <ULink
    :to="props.partner.url"
    target="_blank"
    class="block h-full"
  >
    <UCard
      class="text-center p-6 flex flex-col items-center h-full transform transition-all duration-500 ease-in-out
      hover:scale-105 hover:shadow-xl hover:-translate-y-1"
    >
      <NuxtImg
        :src="props.partner.logo"
        :alt="props.partner.title"
        class="mb-4 h-30 w-auto object-contain mx-auto"
      />

      <p class="font-semibold">{{ props.partner.title }}</p>
      <p
        v-if="props.partner.subtitle"
        class="text-sm text-gray-500"
      >
        {{ props.partner.subtitle }}
      </p>
    </UCard>
  </ULink>
</template>
