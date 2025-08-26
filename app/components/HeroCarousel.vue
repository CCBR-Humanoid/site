<script setup lang="ts">
import { ref } from 'vue'

type Slide = { src: string, alt: string }

// Slides to show in the hero carousel. Uses public/ paths.
const slides = ref<Slide[]>([
  { src: '/carousel/custom_actuator_box.jpg', alt: 'Box of custom actuators' },
  { src: '/carousel/custom_actuator_external.jpg', alt: 'Custom actuator (external)' },
  { src: '/carousel/custom_actuator_internal.jpg', alt: 'Custom actuator (internal)' }
])

// Nothing else needed; UCarousel has a built-in autoplay plugin support.
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    :prev="{ color: 'primary' }"
    :next="{ variant: 'solid' }"
    :loop="true"
    :autoplay="{ delay: 3500 }"
    :items="slides"
    class="max-w-xl mx-auto rounded-lg shadow-lg overflow-hidden"
  >
    <img
      :src="item.src"
      :alt="item.alt"
      loading="lazy"
      decoding="async"
    >
  </UCarousel>
</template>

<style scoped>
/* Ensure smooth transitions */
:deep(.embla__container) {
  transition: transform 600ms ease-in-out;
}
</style>
