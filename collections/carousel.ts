import { defineCollection } from '@nuxt/content'
import { carouselSchema } from '../schema'

export const carouselCollection = defineCollection({
  type: 'data',
  source: 'hero-carousel.yaml',
  schema: carouselSchema
})