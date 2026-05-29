import { getPostById } from '@/lib/actions/posts'
import PostForm from '@/components/admin/PostForm'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic'

interface EditPostPageProps {
  params: Promise<{
    id: string
  }>
}

// Dynamic metadata based on post data
export async function generateMetadata({ params }: EditPostPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    const result = await getPostById(id)
    
    if (result.success && result.data) {
      return {
        title: `Edit "${result.data.title}" - Admin Dashboard`,
        description: `Edit blog post: ${result.data.excerpt || result.data.title}`
      }
    }
  } catch (error) {
    // Fallback to default metadata on error
  }
  
  return {
    title: 'Edit Post - Admin Dashboard',
    description: 'Edit blog post'
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  
  const result = await getPostById(id)
  
  if (!result.success || !result.data) {
    notFound()
  }
  
  // Transform Prisma Post to PostFormData format
  const post = result.data
  const formData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? undefined,
    content: post.content,
    coverImage: post.coverImage ?? undefined,
    category: post.category ?? undefined,
    tags: post.tags,
    author: post.author,
    metaTitle: post.metaTitle ?? undefined,
    metaDescription: post.metaDescription ?? undefined,
    published: post.published,
    publishedAt: post.publishedAt?.toISOString()
  }
  
  return (
    <div className="min-h-screen bg-[#050816] p-8">
      <div className="max-w-5xl mx-auto">
        <PostForm 
          mode="edit" 
          initialData={formData} 
        />
      </div>
    </div>
  )
}
