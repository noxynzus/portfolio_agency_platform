import { z } from 'zod';

export const siteSettingsSchema = z.object({
  // Contact Info
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  
  // Social Media
  facebook: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  twitter: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  github: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  instagram: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  
  // SEO
  siteName: z.string().min(1, 'Site name is required').max(100),
  siteDescription: z.string().min(10, 'Description must be at least 10 characters').max(500),
  siteUrl: z.string().url('Invalid URL'),
  ogImage: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  
  // System
  maintenanceMode: z.boolean(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
