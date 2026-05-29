import { z } from 'zod'

// Schema for creating a new lead
export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number too long')
    .optional()
    .or(z.literal('')),
  company: z.string().max(100, 'Company name too long').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
  source: z.string().default('contact-form'),
})

export type LeadFormData = z.infer<typeof leadSchema>

// Schema for updating lead status (Admin only)
export const leadUpdateSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST']),
  notes: z.string().max(1000, 'Notes too long').optional(),
})

export type LeadUpdateData = z.infer<typeof leadUpdateSchema>
