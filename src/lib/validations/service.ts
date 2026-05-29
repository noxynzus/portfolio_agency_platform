import { z } from 'zod';

export const serviceSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug must not exceed 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  
  iconName: z
    .string()
    .min(1, 'Icon is required'),
  
  variant: z.enum(['cyan', 'purple', 'teal']),
  
  features: z
    .array(z.string().min(1, 'Feature cannot be empty'))
    .min(1, 'At least one feature is required')
    .max(10, 'Maximum 10 features allowed'),
  
  order: z
    .number()
    .int()
    .min(0, 'Order must be a positive number')
    .optional(),
  
  published: z.boolean().optional(),
});

export const serviceUpdateSchema = serviceSchema.partial();

export type ServiceFormData = z.infer<typeof serviceSchema>;
