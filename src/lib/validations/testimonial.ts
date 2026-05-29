import { z } from 'zod';

export const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  role: z.string().min(1, 'Role is required').max(100),
  company: z.string().min(1, 'Company is required').max(100),
  content: z.string().min(10, 'Content must be at least 10 characters').max(1000),
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
  rating: z.number().int().min(1).max(5).optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
