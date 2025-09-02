import { z } from '@nuxt/content'
import type { infer as Infer } from 'zod'

export const docsLinkSchema = z.object({
  label: z.string(),
  icon: z.string(),
  to: z.string(),
  target: z.string().optional()
})

export const docsSchema = z.object({
  links: z.array(docsLinkSchema).optional()
})

// Inferred types
export type DocsLink = Infer<typeof docsLinkSchema>
export type Docs = Infer<typeof docsSchema>