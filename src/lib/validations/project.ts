import { z } from 'zod'

// Schema for creating/updating projects
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  tech: z.array(z.string()).min(1, 'At least one technology is required'),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  results: z.string().optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()),
  videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  demoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  gradient: z.string().optional(),
  accentColor: z.string().optional(),
  metrics: z.record(z.string(), z.string()).optional(),
  featured: z.boolean(),
  published: z.boolean(),
  order: z.number().int()
})

export type ProjectFormData = z.infer<typeof projectSchema>

// Partial schema for updates
export const projectUpdateSchema = projectSchema.partial()
