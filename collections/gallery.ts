import { defineCollection } from '@nuxt/content'
import { gallerySchema } from '../schema'

export const galleryCollection = defineCollection({
  type: 'data',
  source: 'gallery.yaml',
  schema: gallerySchema
})
