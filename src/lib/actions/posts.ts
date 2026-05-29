'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { postSchema } from '@/lib/validations/post'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// ============================================
// GET - Fetch Posts
// ============================================

export async function getPosts(filters?: {
  category?: string
  published?: boolean
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
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { excerpt: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } }
      ]
    }
    
    const posts = await db.post.findMany({
      where,
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    
    return { success: true, data: posts }
  } catch (error: any) {
    console.error('Failed to fetch posts:', error)
    return { success: false, error: 'Failed to fetch posts' }
  }
}

// ============================================
// GET - Fetch Single Post by Slug
// ============================================

export async function getPostBySlug(slug: string) {
  try {
    const post = await db.post.findUnique({
      where: { slug }
    })
    
    if (!post) {
      return { success: false, error: 'Post not found' }
    }
    
    return { success: true, data: post }
  } catch (error: any) {
    console.error('Failed to fetch post:', error)
    return { success: false, error: 'Failed to fetch post' }
  }
}

// ============================================
// GET - Fetch Single Post by ID (Admin)
// ============================================

export async function getPostById(id: string) {
  try {
    await requireAdmin()
    
    const post = await db.post.findUnique({
      where: { id }
    })
    
    if (!post) {
      return { success: false, error: 'Post not found' }
    }
    
    return { success: true, data: post }
  } catch (error: any) {
    console.error('Failed to fetch post:', error)
    return { success: false, error: error.message || 'Failed to fetch post' }
  }
}

// ============================================
// CREATE - Create New Post
// ============================================

export async function createPost(data: z.infer<typeof postSchema>) {
  try {
    await requireAdmin()
    
    // Validate data
    const validated = postSchema.parse(data)
    
    // Set publishedAt if published
    const postData: any = {
      ...validated,
      publishedAt: validated.published ? new Date() : null
    }
    
    const post = await db.post.create({
      data: postData
    })
    
    // Revalidate pages
    revalidatePath('/dashboard/blog')
    revalidatePath('/blog')
    revalidatePath('/')
    
    return { success: true, data: post }
  } catch (error: any) {
    console.error('Failed to create post:', error)
    
    if (error.name === 'ZodError') {
      return { 
        success: false, 
        error: 'Validation error', 
        details: error.errors 
      }
    }
    
    if (error.code === 'P2002') {
      return { success: false, error: 'Slug already exists' }
    }
    
    return { success: false, error: error.message || 'Failed to create post' }
  }
}

// ============================================
// UPDATE - Update Existing Post
// ============================================

export async function updatePost(id: string, data: z.infer<typeof postSchema>) {
  try {
    await requireAdmin()
    
    // Check if post exists
    const existingPost = await db.post.findUnique({
      where: { id }
    })
    
    if (!existingPost) {
      return { success: false, error: 'Post not found' }
    }
    
    // Validate data
    const validated = postSchema.parse(data)
    
    // Update publishedAt if status changed
    const postData: any = {
      ...validated,
      publishedAt: validated.published && !existingPost.published 
        ? new Date() 
        : existingPost.publishedAt
    }
    
    const post = await db.post.update({
      where: { id },
      data: postData
    })
    
    // Revalidate pages
    revalidatePath('/dashboard/blog')
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath('/')
    
    return { success: true, data: post }
  } catch (error: any) {
    console.error('Failed to update post:', error)
    
    if (error.name === 'ZodError') {
      return { 
        success: false, 
        error: 'Validation error', 
        details: error.errors 
      }
    }
    
    if (error.code === 'P2002') {
      return { success: false, error: 'Slug already exists' }
    }
    
    return { success: false, error: error.message || 'Failed to update post' }
  }
}

// ============================================
// DELETE - Delete Post
// ============================================

export async function deletePost(id: string) {
  try {
    await requireAdmin()
    
    const post = await db.post.findUnique({
      where: { id }
    })
    
    if (!post) {
      return { success: false, error: 'Post not found' }
    }
    
    await db.post.delete({
      where: { id }
    })
    
    // Revalidate pages
    revalidatePath('/dashboard/blog')
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    
    return { success: true }
  } catch (error: any) {
    console.error('Failed to delete post:', error)
    return { success: false, error: error.message || 'Failed to delete post' }
  }
}

// ============================================
// TOGGLE - Toggle Post Published Status
// ============================================

export async function togglePostPublished(id: string) {
  try {
    await requireAdmin()
    
    const post = await db.post.findUnique({
      where: { id }
    })
    
    if (!post) {
      return { success: false, error: 'Post not found' }
    }
    
    const updated = await db.post.update({
      where: { id },
      data: { 
        published: !post.published,
        publishedAt: !post.published ? new Date() : post.publishedAt
      }
    })
    
    // Revalidate pages
    revalidatePath('/dashboard/blog')
    revalidatePath('/blog')
    revalidatePath(`/blog/${updated.slug}`)
    
    return { success: true, data: updated }
  } catch (error: any) {
    console.error('Failed to toggle post status:', error)
    return { success: false, error: error.message || 'Failed to toggle post status' }
  }
}

// ============================================
// INCREMENT - Increment Post Views
// ============================================

export async function incrementPostViews(slug: string) {
  try {
    const post = await db.post.update({
      where: { slug },
      data: {
        views: {
          increment: 1
        }
      }
    })
    
    return { success: true, data: post }
  } catch (error: any) {
    console.error('Failed to increment views:', error)
    // Don't fail if view count increment fails
    return { success: false, error: 'Failed to increment views' }
  }
}

// ============================================
// GET - Get Related Posts (same category)
// ============================================

export async function getRelatedPosts(slug: string, limit: number = 3) {
  try {
    // Get current post
    const currentPost = await db.post.findUnique({
      where: { slug }
    })
    
    if (!currentPost) {
      return { success: false, error: 'Post not found' }
    }
    
    // Get related posts
    const relatedPosts = await db.post.findMany({
      where: {
        published: true,
        category: currentPost.category,
        slug: {
          not: slug // Exclude current post
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit
    })
    
    return { success: true, data: relatedPosts }
  } catch (error: any) {
    console.error('Failed to fetch related posts:', error)
    return { success: false, error: 'Failed to fetch related posts' }
  }
}

// ============================================
// GET - Get All Categories (for filtering)
// ============================================

export async function getPostCategories() {
  try {
    const categories = await db.post.findMany({
      where: {
        published: true,
        category: {
          not: null
        }
      },
      select: {
        category: true
      },
      distinct: ['category']
    })
    
    const categoryList = categories
      .map(p => p.category)
      .filter(Boolean) as string[]
    
    return { success: true, data: categoryList }
  } catch (error: any) {
    console.error('Failed to fetch categories:', error)
    return { success: false, error: 'Failed to fetch categories' }
  }
}
