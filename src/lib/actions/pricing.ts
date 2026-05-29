'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { pricingSchema, type PricingFormData } from '@/lib/validations/pricing';

// Get all pricing plans with optional filters
export async function getPricingPlans(filters?: {
  published?: boolean;
  search?: string;
}) {
  try {
    const where: any = {};

    if (filters?.published !== undefined) {
      where.published = filters.published;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const plans = await db.pricingPlan.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return { success: true, data: plans };
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return { success: false, error: 'Failed to fetch pricing plans' };
  }
}

// Get pricing plan by ID (admin only)
export async function getPricingPlanById(id: string) {
  await requireAdmin();

  try {
    const plan = await db.pricingPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return { success: false, error: 'Pricing plan not found' };
    }

    return { success: true, data: plan };
  } catch (error) {
    console.error('Error fetching pricing plan:', error);
    return { success: false, error: 'Failed to fetch pricing plan' };
  }
}

// Get pricing plan by slug (public)
export async function getPricingPlanBySlug(slug: string) {
  try {
    const plan = await db.pricingPlan.findUnique({
      where: { slug, published: true },
    });

    if (!plan) {
      return { success: false, error: 'Pricing plan not found' };
    }

    return { success: true, data: plan };
  } catch (error) {
    console.error('Error fetching pricing plan:', error);
    return { success: false, error: 'Failed to fetch pricing plan' };
  }
}

// Create pricing plan (admin only)
export async function createPricingPlan(data: PricingFormData) {
  await requireAdmin();

  try {
    const validated = pricingSchema.parse(data);

    // Check if slug already exists
    const existing = await db.pricingPlan.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return { success: false, error: 'Slug already exists' };
    }

    const plan = await db.pricingPlan.create({
      data: validated,
    });

    revalidatePath('/dashboard/pricing');
    revalidatePath('/pricing');
    revalidatePath('/');

    return { success: true, data: plan };
  } catch (error: any) {
    console.error('Error creating pricing plan:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create pricing plan' 
    };
  }
}

// Update pricing plan (admin only)
export async function updatePricingPlan(id: string, data: PricingFormData) {
  await requireAdmin();

  try {
    const validated = pricingSchema.parse(data);

    // Check if slug is taken by another plan
    const existing = await db.pricingPlan.findFirst({
      where: { 
        slug: validated.slug,
        NOT: { id },
      },
    });

    if (existing) {
      return { success: false, error: 'Slug already exists' };
    }

    const plan = await db.pricingPlan.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/dashboard/pricing');
    revalidatePath('/pricing');
    revalidatePath('/');

    return { success: true, data: plan };
  } catch (error: any) {
    console.error('Error updating pricing plan:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update pricing plan' 
    };
  }
}

// Delete pricing plan (admin only)
export async function deletePricingPlan(id: string) {
  await requireAdmin();

  try {
    await db.pricingPlan.delete({
      where: { id },
    });

    revalidatePath('/dashboard/pricing');
    revalidatePath('/pricing');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    return { success: false, error: 'Failed to delete pricing plan' };
  }
}

// Toggle pricing plan published status (admin only)
export async function togglePricingPlanPublished(id: string) {
  await requireAdmin();

  try {
    const plan = await db.pricingPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return { success: false, error: 'Pricing plan not found' };
    }

    const updated = await db.pricingPlan.update({
      where: { id },
      data: { published: !plan.published },
    });

    revalidatePath('/dashboard/pricing');
    revalidatePath('/pricing');
    revalidatePath('/');

    return { success: true, data: updated };
  } catch (error) {
    console.error('Error toggling pricing plan:', error);
    return { success: false, error: 'Failed to toggle pricing plan' };
  }
}

// Update pricing plans order (admin only)
export async function updatePricingPlansOrder(
  items: Array<{ id: string; order: number }>
) {
  await requireAdmin();

  try {
    // Update all plans in a transaction
    await db.$transaction(
      items.map((item) =>
        db.pricingPlan.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath('/dashboard/pricing');
    revalidatePath('/pricing');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error updating pricing plans order:', error);
    return { success: false, error: 'Failed to update order' };
  }
}
