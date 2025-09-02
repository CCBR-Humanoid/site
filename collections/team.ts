import { defineCollection } from '@nuxt/content'
import { teamSchema } from '../schema'

export const teamCollection = defineCollection({
  type: 'data',
  source: 'team/team.yaml',
  schema: teamSchema
})