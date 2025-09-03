import { defineCollection } from '@nuxt/content'
import { docsSchema } from '../schema'

export const docsCollection = defineCollection({
  type: 'page',
  source: {
    include: '**',
    // Exclude non-docs and data files so they don't appear in the docs nav
    exclude: [
      'index.md',
      'team.md',
      'blog/**',
      'team/**',
      'hero-carousel.yaml'
    ]
  },
  schema: docsSchema
})