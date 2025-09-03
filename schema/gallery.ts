import { z } from '@nuxt/content'
import type { infer as Infer } from 'zod'

// Base fields shared by image and video gallery items
const baseItem = z.object({
  title: z.string(),
  date: z.string().describe('Published date (YYYY-MM-DD)'),
  description: z.string().optional(),
  credits: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]).optional()
})

// Image item
const imageItemSchema = baseItem.extend({
  type: z.literal('image'),
  src: z.string(),
  alt: z.string().optional()
})

// Video item
const videoSource = z.object({
  src: z.string(),
  type: z.string().optional()
})

const videoItemSchema = baseItem.extend({
  type: z.literal('video'),
  // Support either a single src or multiple sources. At least one required via refine below.
  src: z.string().optional(),
  sources: z.array(videoSource).optional(),
  poster: z.string().optional(),
  autoplay: z.boolean().optional(),
  loop: z.boolean().optional(),
  muted: z.boolean().optional(),
  controls: z.boolean().optional()
}).refine(v => Boolean(v.src) || Boolean(v.sources && v.sources.length > 0), {
  message: 'Video item requires either src or sources[]'
})

export const galleryItemSchema = z.union([
  imageItemSchema,
  videoItemSchema
])

export const gallerySchema = z.object({
  items: z.array(galleryItemSchema)
})

// Inferred types
export type GalleryItem = Infer<typeof galleryItemSchema>
export type Gallery = Infer<typeof gallerySchema>
