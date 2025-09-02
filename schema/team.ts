import { z } from '@nuxt/content'
import type { infer as Infer } from 'zod'

export const socialLinkSchema = z.object({
  icon: z.string(),
  url: z.string()
})

export const teamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
  profileUrl: z.string(),
  socials: z.array(socialLinkSchema).default([])
})

export const teamSchema = z.object({
  members: z.array(teamMemberSchema).default([])
})

// Inferred types
export type SocialLink = Infer<typeof socialLinkSchema>
export type TeamMember = Infer<typeof teamMemberSchema>
export type Team = Infer<typeof teamSchema>