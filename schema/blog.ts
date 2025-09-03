import { z } from '@nuxt/content'
import type { infer as Infer } from 'zod'

export const blogPostSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string().describe('Published date (YYYY-MM-DD)').optional(),
  cover: z.string().describe('Cover image path or URL').optional(),
  category: z.string().describe('Post category').optional(),
  tags: z.array(z.string()).default([]).optional(),
  author: z.union([z.string(), z.array(z.string())]).optional(),
  draft: z.boolean().default(false).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional()
  }).optional()
})

// Inferred types
export type BlogPost = Infer<typeof blogPostSchema>