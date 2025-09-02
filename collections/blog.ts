import { defineCollection } from '@nuxt/content'
import { blogPostSchema } from '../schema'

export const blogCollection = defineCollection({
  type: 'page',
  source: 'blog/**',
  schema: blogPostSchema
})