import { z } from '@nuxt/content'
import type { infer as Infer } from 'zod'

export const partnerSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  logo: z.string(),
  url: z.string()
})

export const partnersSchema = z.object({
  partners: z.array(partnerSchema).default([])
})

// Inferred types
export type Partner = Infer<typeof partnerSchema>
export type Partners = Infer<typeof partnersSchema>