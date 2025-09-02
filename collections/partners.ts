import { defineCollection } from '@nuxt/content'
import { partnersSchema } from '../schema'

export const partnersCollection = defineCollection({
  type: 'data',
  source: 'team/partners.yaml',
  schema: partnersSchema
})