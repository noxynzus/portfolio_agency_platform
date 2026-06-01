'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { leadSchema, leadUpdateSchema } from '@/lib/validations/lead'
import { checkRateLimit, getClientIP, RateLimitPresets } from '@/lib/rate-limit'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

// ============================================
// PUBLIC - Create Lead (Contact Form Submission)
// ============================================

export async function createLead(formData: FormData) {
  try {
    // Rate limiting - check IP address
    const headersList = await headers()
    const clientIP = getClientIP(headersList)
    const rateLimit = checkRateLimit(`lead:${clientIP}`, RateLimitPresets.CONTACT_FORM)

    if (!rateLimit.allowed) {
      return {
        success: false,
        error: rateLimit.message || 'Too many requests. Please try again later.',
      }
    }
    // Parse and validate form data
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      company: formData.get('company') || '',
      message: formData.get('message'),
      source: formData.get('source') || 'contact-form',
    }

    const validated = leadSchema.parse(data)

    // Save to database
    const lead = await db.lead.create({
      data: {
        ...validated,
        phone: validated.phone || null,
        company: validated.company || null,
      },
    })

    // Send Telegram notification via API route (non-blocking, fire-and-forget)
    fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/telegram-bot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || undefined,
        company: lead.company || undefined,
        message: lead.message,
        source: lead.source || 'contact-form',
        timestamp: lead.createdAt.toISOString(),
      }),
      cache: 'no-store',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          console.log('✅ Telegram notification sent successfully')
          // Mark as notified
          db.lead.update({
            where: { id: lead.id },
            data: { notified: true },
          }).catch(console.error)
        } else {
          console.warn('⚠️ Telegram notification failed:', result.error)
        }
      })
      .catch((error) => {
        console.error('❌ Failed to send Telegram notification:', error)
      })

    return { success: true, data: lead }
  } catch (error: any) {
    console.error('Create lead error:', error)
    
    if (error.name === 'ZodError') {
      return {
        success: false,
        error: 'Validation error',
        details: error.errors,
      }
    }

    return {
      success: false,
      error: error.message || 'Failed to submit form',
    }
  }
}

// ============================================
// ADMIN - Get All Leads
// ============================================

export async function getLeads(filters?: {
  status?: string
  search?: string
  limit?: number
}) {
  try {
    await requireAdmin()

    const where: any = {}

    if (filters?.status && filters.status !== 'ALL') {
      where.status = filters.status
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const leads = await db.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || undefined,
    })

    return { success: true, data: leads }
  } catch (error: any) {
    console.error('Get leads error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch leads',
    }
  }
}

// ============================================
// ADMIN - Get Single Lead
// ============================================

export async function getLeadById(id: string) {
  try {
    await requireAdmin()

    const lead = await db.lead.findUnique({
      where: { id },
    })

    if (!lead) {
      return { success: false, error: 'Lead not found' }
    }

    return { success: true, data: lead }
  } catch (error: any) {
    console.error('Get lead error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch lead',
    }
  }
}

// ============================================
// ADMIN - Update Lead Status & Notes
// ============================================

export async function updateLeadStatus(
  id: string, 
  status: string, 
  notes?: string
) {
  try {
    await requireAdmin()

    const data = {
      status,
      notes: notes || undefined,
    }

    const validated = leadUpdateSchema.parse(data)

    const lead = await db.lead.update({
      where: { id },
      data: validated,
    })

    revalidatePath('/dashboard/leads')

    return { success: true, data: lead }
  } catch (error: any) {
    console.error('Update lead error:', error)

    if (error.name === 'ZodError') {
      return {
        success: false,
        error: 'Validation error',
        details: error.errors,
      }
    }

    if (error.code === 'P2025') {
      return { success: false, error: 'Lead not found' }
    }

    return {
      success: false,
      error: error.message || 'Failed to update lead',
    }
  }
}

// ============================================
// ADMIN - Delete Lead
// ============================================

export async function deleteLead(id: string) {
  try {
    await requireAdmin()

    await db.lead.delete({
      where: { id },
    })

    revalidatePath('/dashboard/leads')

    return { success: true }
  } catch (error: any) {
    console.error('Delete lead error:', error)

    if (error.code === 'P2025') {
      return { success: false, error: 'Lead not found' }
    }

    return {
      success: false,
      error: error.message || 'Failed to delete lead',
    }
  }
}

// ============================================
// ADMIN - Get Lead Statistics
// ============================================

export async function getLeadStats() {
  try {
    await requireAdmin()

    const [total, newLeads, contacted, qualified, proposalSent, won, lost] =
      await Promise.all([
        db.lead.count(),
        db.lead.count({ where: { status: 'NEW' } }),
        db.lead.count({ where: { status: 'CONTACTED' } }),
        db.lead.count({ where: { status: 'QUALIFIED' } }),
        db.lead.count({ where: { status: 'PROPOSAL_SENT' } }),
        db.lead.count({ where: { status: 'WON' } }),
        db.lead.count({ where: { status: 'LOST' } }),
      ])

    const conversionRate = total > 0 ? ((won / total) * 100).toFixed(1) : '0'

    return {
      success: true,
      data: {
        total,
        byStatus: {
          NEW: newLeads,
          CONTACTED: contacted,
          QUALIFIED: qualified,
          PROPOSAL_SENT: proposalSent,
          WON: won,
          LOST: lost,
        },
        conversionRate: parseFloat(conversionRate),
      },
    }
  } catch (error: any) {
    console.error('Get lead stats error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch statistics',
    }
  }
}
