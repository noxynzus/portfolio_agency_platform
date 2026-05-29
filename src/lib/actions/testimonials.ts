'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { testimonialSchema, type TestimonialInput } from '@/lib/validations/testimonial';
import { revalidatePath } from 'next/cache';

/**
 * Get all testimonials (admin view)
 */
export async function getTestimonials(filters?: { published?: boolean }) {
  try {
    const where = filters?.published !== undefined 
      ? { published: filters.published }
      : {};

    const testimonials = await db.testimonial.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return { success: true, data: testimonials };
  } catch (error: any) {
    console.error('Failed to fetch testimonials:', error);
    return { success: false, error: 'Failed to fetch testimonials' };
  }
}

/**
 * Get published testimonials (public view)
 */
export async function getPublishedTestimonials() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });

    return { success: true, data: testimonials };
  } catch (error: any) {
    console.error('Failed to fetch published testimonials:', error);
    return { success: false, error: 'Failed to fetch testimonials' };
  }
}

/**
 * Get single testimonial by ID
 */
export async function getTestimonialById(id: string) {
  try {
    await requireAdmin();

    const testimonial = await db.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return { success: false, error: 'Testimonial not found' };
    }

    return { success: true, data: testimonial };
  } catch (error: any) {
    console.error('Failed to fetch testimonial:', error);
    return { success: false, error: error.message || 'Failed to fetch testimonial' };
  }
}

/**
 * Create new testimonial
 */
export async function createTestimonial(data: TestimonialInput) {
  try {
    await requireAdmin();

    const validated = testimonialSchema.parse(data);

    // Clean empty strings
    const cleanedData = {
      ...validated,
      avatar: validated.avatar || null,
    };

    const testimonial = await db.testimonial.create({
      data: cleanedData,
    });

    revalidatePath('/dashboard/testimonials');
    revalidatePath('/');

    return { success: true, data: testimonial };
  } catch (error: any) {
    console.error('Failed to create testimonial:', error);

    if (error.name === 'ZodError') {
      return {
        success: false,
        error: 'Validation error',
        details: error.errors,
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to create testimonial',
    };
  }
}

/**
 * Update existing testimonial
 */
export async function updateTestimonial(id: string, data: TestimonialInput) {
  try {
    await requireAdmin();

    const validated = testimonialSchema.parse(data);

    // Clean empty strings
    const cleanedData = {
      ...validated,
      avatar: validated.avatar || null,
    };

    const testimonial = await db.testimonial.update({
      where: { id },
      data: cleanedData,
    });

    revalidatePath('/dashboard/testimonials');
    revalidatePath('/');

    return { success: true, data: testimonial };
  } catch (error: any) {
    console.error('Failed to update testimonial:', error);

    if (error.name === 'ZodError') {
      return {
        success: false,
        error: 'Validation error',
        details: error.errors,
      };
    }

    if (error.code === 'P2025') {
      return { success: false, error: 'Testimonial not found' };
    }

    return {
      success: false,
      error: error.message || 'Failed to update testimonial',
    };
  }
}

/**
 * Delete testimonial
 */
export async function deleteTestimonial(id: string) {
  try {
    await requireAdmin();

    await db.testimonial.delete({
      where: { id },
    });

    revalidatePath('/dashboard/testimonials');
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete testimonial:', error);

    if (error.code === 'P2025') {
      return { success: false, error: 'Testimonial not found' };
    }

    return {
      success: false,
      error: error.message || 'Failed to delete testimonial',
    };
  }
}

/**
 * Toggle published status
 */
export async function toggleTestimonialPublished(id: string) {
  try {
    await requireAdmin();

    const testimonial = await db.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return { success: false, error: 'Testimonial not found' };
    }

    const updated = await db.testimonial.update({
      where: { id },
      data: { published: !testimonial.published },
    });

    revalidatePath('/dashboard/testimonials');
    revalidatePath('/');

    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Failed to toggle published status:', error);
    return {
      success: false,
      error: error.message || 'Failed to toggle published status',
    };
  }
}

/**
 * Reorder testimonials
 */
export async function reorderTestimonials(items: { id: string; order: number }[]) {
  try {
    await requireAdmin();

    // Update all orders in a transaction
    await db.$transaction(
      items.map((item) =>
        db.testimonial.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath('/dashboard/testimonials');
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    console.error('Failed to reorder testimonials:', error);
    return {
      success: false,
      error: error.message || 'Failed to reorder testimonials',
    };
  }
}
