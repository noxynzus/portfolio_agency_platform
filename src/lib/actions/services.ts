'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { serviceSchema, type ServiceFormData } from '@/lib/validations/service';

// Get all services with optional filters
export async function getServices(filters?: {
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
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const services = await db.service.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return { success: true, data: services };
  } catch (error) {
    console.error('Error fetching services:', error);
    return { success: false, error: 'Failed to fetch services' };
  }
}

// Get service by ID (admin only)
export async function getServiceById(id: string) {
  await requireAdmin();

  try {
    const service = await db.service.findUnique({
      where: { id },
    });

    if (!service) {
      return { success: false, error: 'Service not found' };
    }

    return { success: true, data: service };
  } catch (error) {
    console.error('Error fetching service:', error);
    return { success: false, error: 'Failed to fetch service' };
  }
}

// Get service by slug (public)
export async function getServiceBySlug(slug: string) {
  try {
    const service = await db.service.findUnique({
      where: { slug, published: true },
    });

    if (!service) {
      return { success: false, error: 'Service not found' };
    }

    return { success: true, data: service };
  } catch (error) {
    console.error('Error fetching service:', error);
    return { success: false, error: 'Failed to fetch service' };
  }
}

// Create service (admin only)
export async function createService(data: ServiceFormData) {
  await requireAdmin();

  try {
    const validated = serviceSchema.parse(data);

    // Check if slug already exists
    const existing = await db.service.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return { success: false, error: 'Slug already exists' };
    }

    const service = await db.service.create({
      data: validated,
    });

    revalidatePath('/dashboard/services');
    revalidatePath('/services');
    revalidatePath('/');

    return { success: true, data: service };
  } catch (error: any) {
    console.error('Error creating service:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create service' 
    };
  }
}

// Update service (admin only)
export async function updateService(id: string, data: ServiceFormData) {
  await requireAdmin();

  try {
    const validated = serviceSchema.parse(data);

    // Check if slug is taken by another service
    const existing = await db.service.findFirst({
      where: { 
        slug: validated.slug,
        NOT: { id },
      },
    });

    if (existing) {
      return { success: false, error: 'Slug already exists' };
    }

    const service = await db.service.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/dashboard/services');
    revalidatePath('/services');
    revalidatePath('/');

    return { success: true, data: service };
  } catch (error: any) {
    console.error('Error updating service:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update service' 
    };
  }
}

// Delete service (admin only)
export async function deleteService(id: string) {
  await requireAdmin();

  try {
    await db.service.delete({
      where: { id },
    });

    revalidatePath('/dashboard/services');
    revalidatePath('/services');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: 'Failed to delete service' };
  }
}

// Toggle service published status (admin only)
export async function toggleServicePublished(id: string) {
  await requireAdmin();

  try {
    const service = await db.service.findUnique({
      where: { id },
    });

    if (!service) {
      return { success: false, error: 'Service not found' };
    }

    const updated = await db.service.update({
      where: { id },
      data: { published: !service.published },
    });

    revalidatePath('/dashboard/services');
    revalidatePath('/services');
    revalidatePath('/');

    return { success: true, data: updated };
  } catch (error) {
    console.error('Error toggling service:', error);
    return { success: false, error: 'Failed to toggle service' };
  }
}

// Update services order (admin only)
export async function updateServicesOrder(
  items: Array<{ id: string; order: number }>
) {
  await requireAdmin();

  try {
    // Update all services in a transaction
    await db.$transaction(
      items.map((item) =>
        db.service.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath('/dashboard/services');
    revalidatePath('/services');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error updating services order:', error);
    return { success: false, error: 'Failed to update order' };
  }
}
