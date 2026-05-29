'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { siteSettingsSchema, type SiteSettingsInput } from '@/lib/validations/settings';
import { revalidatePath } from 'next/cache';

/**
 * Get site settings (public - no auth required)
 */
export async function getSiteSettings() {
  try {
    let settings = await db.siteSettings.findUnique({
      where: { id: 'site-settings' },
    });

    // If no settings exist, create default
    if (!settings) {
      settings = await db.siteSettings.create({
        data: {
          id: 'site-settings',
          email: 'hello@techforge.dev',
          siteName: 'TechForge',
          siteDescription: 'Modern Digital Engineering Studio',
          siteUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        },
      });
    }

    return { success: true, data: settings };
  } catch (error: any) {
    console.error('Failed to get site settings:', error);
    return { success: false, error: 'Failed to fetch settings' };
  }
}

/**
 * Update site settings (admin only)
 */
export async function updateSiteSettings(data: SiteSettingsInput) {
  try {
    await requireAdmin();

    // Validate input
    const validated = siteSettingsSchema.parse(data);

    // Convert empty strings to null for optional fields
    const cleanedData = {
      ...validated,
      phone: validated.phone || null,
      address: validated.address || null,
      facebook: validated.facebook || null,
      twitter: validated.twitter || null,
      linkedin: validated.linkedin || null,
      github: validated.github || null,
      instagram: validated.instagram || null,
      ogImage: validated.ogImage || null,
    };

    // Update or create settings
    const settings = await db.siteSettings.upsert({
      where: { id: 'site-settings' },
      update: cleanedData,
      create: {
        id: 'site-settings',
        ...cleanedData,
      },
    });

    // Revalidate all pages that might use settings
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/settings');
    revalidatePath('/contact');

    return { success: true, data: settings };
  } catch (error: any) {
    console.error('Failed to update site settings:', error);

    if (error.name === 'ZodError') {
      return {
        success: false,
        error: 'Validation error',
        details: error.errors,
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to update settings',
    };
  }
}

/**
 * Toggle maintenance mode (admin only)
 */
export async function toggleMaintenanceMode() {
  try {
    await requireAdmin();

    const settings = await db.siteSettings.findUnique({
      where: { id: 'site-settings' },
    });

    if (!settings) {
      return { success: false, error: 'Settings not found' };
    }

    const updated = await db.siteSettings.update({
      where: { id: 'site-settings' },
      data: { maintenanceMode: !settings.maintenanceMode },
    });

    revalidatePath('/');
    revalidatePath('/dashboard/settings');

    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Failed to toggle maintenance mode:', error);
    return { success: false, error: 'Failed to toggle maintenance mode' };
  }
}
