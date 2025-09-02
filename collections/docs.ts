import { defineCollection } from '@nuxt/content'
import { docsSchema } from '../schema'

export const docsCollection = defineCollection({
  type: 'page',
  source: {
    include: '**',
    exclude: ['index.md', 'team.md', 'blog/**', 'team/**', 'hardware.md', 'software.md']
  },
  schema: docsSchema
})