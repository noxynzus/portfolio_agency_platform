'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { projectSchema } from '@/lib/validations/project'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// ============================================
// GET - Fetch Projects
// ============================================

export async function getProjects(filters?: {
  category?: string
  published?: boolean
  featured?: boolean
  search?: string
}) {
  try {
    const where: any = {}
    
    if (filters?.category) {
      where.category = filters.category
    }
    
    if (filters?.published !== undefined) {
      where.published = filters.published
    }
    
    if (filters?.featured !== undefined) {
      where.featured = filters.featured
    }
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }
    
    const projects = await db.project.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })
    
    return { success: true, data: projects }
  } catch (error: any) {
    console.error('Failed to fetch projects:', error)
    return { success: false, error: 'Failed to fetch projects' }
  }
}

// ============================================
// GET - Fetch Single Project by Slug
// ============================================

export async function getProjectBySlug(slug: string) {
  try {
    const project = await db.project.findUnique({
      where: { slug }
    })
    
    if (!project) {
      return { success: false, error: 'Project not found' }
    }
    
    return { success: true, data: project }
  } catch (error: any) {
    console.error('Failed to fetch project:', error)
    return { success: false, error: 'Failed to fetch project' }
  }
}

// ============================================
// GET - Fetch Single Project by ID (Admin)
// ============================================

export async function getProjectById(id: string) {
  try {
    await requireAdmin()
    
    const project = await db.project.findUnique({
      where: { id }
    })
    
    if (!project) {
      return { success: false, error: 'Project not found' }
    }
    
    return { success: true, data: project }
  } catch (error: any) {
    console.error('Failed to fetch project:', error)
    return { success: false, error: error.message || 'Failed to fetch project' }
  }
}

// ============================================
// CREATE - Create New Project
// ============================================

export async function createProject(data: unknown) {
  try {
    // 1. Require admin authentication
    await requireAdmin()
    
    // 2. Validate input data
    const validated = projectSchema.parse(data)
    
    // 3. Create project in database
    const project = await db.project.create({
      data: validated
    })
    
    // 4. Revalidate affected pages
    revalidatePath('/dashboard/projects')
    revalidatePath('/portfolio')
    revalidatePath('/')
    
    return { 
      success: true, 
      data: project,
      message: 'Project created successfully'
    }
  } catch (error: any) {
    console.error('Failed to create project:', error)
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Validation error', 
        details: error.issues 
      }
    }
    
    // Handle Prisma unique constraint violation
    if (error.code === 'P2002') {
      return { 
        success: false, 
        error: 'A project with this slug already exists' 
      }
    }
    
    return { 
      success: false, 
      error: error.message || 'Failed to create project' 
    }
  }
}

// ============================================
// UPDATE - Update Existing Project
// ============================================

export async function updateProject(id: string, data: unknown) {
  try {
    // 1. Require admin authentication
    await requireAdmin()
    
    // 2. Check if project exists
    const existing = await db.project.findUnique({
      where: { id }
    })
    
    if (!existing) {
      return { success: false, error: 'Project not found' }
    }
    
    // 3. Validate input data
    const validated = projectSchema.parse(data)
    
    // 4. Update project
    const project = await db.project.update({
      where: { id },
      data: validated
    })
    
    // 5. Revalidate affected pages
    revalidatePath('/dashboard/projects')
    revalidatePath('/portfolio')
    revalidatePath(`/portfolio/${project.slug}`)
    revalidatePath('/')
    
    return { 
      success: true, 
      data: project,
      message: 'Project updated successfully'
    }
  } catch (error: any) {
    console.error('Failed to update project:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Validation error', 
        details: error.issues 
      }
    }
    
    if (error.code === 'P2002') {
      return { 
        success: false, 
        error: 'A project with this slug already exists' 
      }
    }
    
    return { 
      success: false, 
      error: error.message || 'Failed to update project' 
    }
  }
}

// ============================================
// DELETE - Delete Project
// ============================================

export async function deleteProject(id: string) {
  try {
    // 1. Require admin authentication
    await requireAdmin()
    
    // 2. Check if project exists
    const existing = await db.project.findUnique({
      where: { id }
    })
    
    if (!existing) {
      return { success: false, error: 'Project not found' }
    }
    
    // 3. Delete project
    await db.project.delete({
      where: { id }
    })
    
    // 4. Revalidate affected pages
    revalidatePath('/dashboard/projects')
    revalidatePath('/portfolio')
    revalidatePath('/')
    
    return { 
      success: true,
      message: 'Project deleted successfully'
    }
  } catch (error: any) {
    console.error('Failed to delete project:', error)
    return { 
      success: false, 
      error: error.message || 'Failed to delete project' 
    }
  }
}

// ============================================
// TOGGLE - Toggle Published Status
// ============================================

export async function toggleProjectPublished(id: string) {
  try {
    // 1. Require admin authentication
    await requireAdmin()
    
    // 2. Fetch current project
    const project = await db.project.findUnique({
      where: { id }
    })
    
    if (!project) {
      return { success: false, error: 'Project not found' }
    }
    
    // 3. Toggle published status
    const updated = await db.project.update({
      where: { id },
      data: { published: !project.published }
    })
    
    // 4. Revalidate affected pages
    revalidatePath('/dashboard/projects')
    revalidatePath('/portfolio')
    revalidatePath(`/portfolio/${updated.slug}`)
    revalidatePath('/')
    
    return { 
      success: true, 
      data: updated,
      message: updated.published ? 'Project published' : 'Project unpublished'
    }
  } catch (error: any) {
    console.error('Failed to toggle published:', error)
    return { 
      success: false, 
      error: error.message || 'Failed to toggle published status' 
    }
  }
}

// ============================================
// TOGGLE - Toggle Featured Status
// ============================================

export async function toggleProjectFeatured(id: string) {
  try {
    // 1. Require admin authentication
    await requireAdmin()
    
    // 2. Fetch current project
    const project = await db.project.findUnique({
      where: { id }
    })
    
    if (!project) {
      return { success: false, error: 'Project not found' }
    }
    
    // 3. Toggle featured status
    const updated = await db.project.update({
      where: { id },
      data: { featured: !project.featured }
    })
    
    // 4. Revalidate affected pages
    revalidatePath('/dashboard/projects')
    revalidatePath('/portfolio')
    revalidatePath('/')
    
    return { 
      success: true, 
      data: updated,
      message: updated.featured ? 'Project featured' : 'Project unfeatured'
    }
  } catch (error: any) {
    console.error('Failed to toggle featured:', error)
    return { 
      success: false, 
      error: error.message || 'Failed to toggle featured status' 
    }
  }
}

// ============================================
// UTILITY - Get Project Categories
// ============================================

export async function getProjectCategories() {
  try {
    const categories = await db.project.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ['category']
    })
    
    return { 
      success: true, 
      data: categories.map((c: any) => c.category) 
    }
  } catch (error: any) {
    console.error('Failed to fetch categories:', error)
    return { success: false, error: 'Failed to fetch categories' }
  }
}
