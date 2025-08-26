import type { SocialLink } from './social-link'

export interface TeamMember {
  name: string
  role: string
  avatar: string
  profileUrl: string
  socials: SocialLink[]
}
