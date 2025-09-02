import { z } from '@nuxt/content'
import type { infer as Infer } from 'zod'

export const carouselSlideSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
  description: z.string().optional(),
  credits: z.string().optional()
})

export const carouselSchema = z.object({
  slides: z.array(carouselSlideSchema)
})

// Inferred types
export type CarouselSlide = Infer<typeof carouselSlideSchema>
export type Carousel = Infer<typeof carouselSchema>