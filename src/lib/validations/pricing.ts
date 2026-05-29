import { z } from 'zod';

export const pricingSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters'),
  
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must not exceed 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  
  description: z
    .string()
    .max(200, 'Description must not exceed 200 characters')
    .optional()
    .nullable(),
  
  price: z
    .string()
    .min(1, 'Price is required')
    .max(50, 'Price must not exceed 50 characters'),
  
  period: z.enum(['project', 'month', 'year']).optional(),
  
  features: z
    .array(z.string().min(1, 'Feature cannot be empty'))
    .min(1, 'At least one feature is required')
    .max(20, 'Maximum 20 features allowed'),
  
  recommended: z.boolean().optional(),
  
  order: z
    .number()
    .int()
    .min(0, 'Order must be a positive number')
    .optional(),
  
  published: z.boolean().optional(),
});

export const pricingUpdateSchema = pricingSchema.partial();

export type PricingFormData = z.infer<typeof pricingSchema>;
