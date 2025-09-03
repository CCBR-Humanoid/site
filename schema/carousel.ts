import { z } from '@nuxt/content'
import type { infer as Infer } from 'zod'

// Base fields shared by image and video slides
const baseSlide = z.object({
  src: z.string(),
  alt: z.string().optional(),
  description: z.string().optional(),
  credits: z.string().optional()
})

// Image slide.
const imageSlideSchema = baseSlide.extend({
  type: z.literal('image')
})

// Video slide. Use local files under /public or full URLs.
const videoSlideSchema = baseSlide.extend({
  type: z.literal('video'),
  poster: z.string().optional(),
  autoplay: z.boolean().optional(),
  loop: z.boolean().optional(),
  muted: z.boolean().optional(),
  controls: z.boolean().optional()
})

export const carouselSlideSchema = z.union([
  videoSlideSchema,
  imageSlideSchema
])

export const carouselSchema = z.object({
  slides: z.array(carouselSlideSchema)
})

// Inferred types
export type CarouselSlide = Infer<typeof carouselSlideSchema>
export type Carousel = Infer<typeof carouselSchema>