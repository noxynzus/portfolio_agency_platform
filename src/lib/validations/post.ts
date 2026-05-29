import { z } from 'zod'

// Schema for creating/updating blog posts
export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(500, 'Excerpt too long').optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  coverImage: z.string().optional(),
  category: z.string().min(1, 'Category is required').optional(),
  tags: z.array(z.string()),
  author: z.string().optional(),
  metaTitle: z.string().max(60, 'Meta title too long (max 60 chars)').optional(),
  metaDescription: z.string().max(160, 'Meta description too long (max 160 chars)').optional(),
  published: z.boolean(),
  publishedAt: z.string().optional() // Will be set on server
})

export type PostFormData = z.infer<typeof postSchema>

// Partial schema for updates
export const postUpdateSchema = postSchema.partial()
