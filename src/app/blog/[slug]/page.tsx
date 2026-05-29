import { getPostBySlug, incrementPostViews, getRelatedPosts, getPosts } from '@/lib/actions/posts'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BlogDetailClient from './BlogDetailClient'

// ISR: Revalidate every 1 hour
export const revalidate = 3600

interface BlogDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all published posts at build time
export async function generateStaticParams() {
  try {
    const result = await getPosts({ published: true })
    
    if (!result.success || !result.data) {
      return []
    }
    
    return result.data.map((post) => ({
      slug: post.slug
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getPostBySlug(slug)
  
  if (!result.success || !result.data) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }
  
  const post = result.data
  
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || post.content.slice(0, 160),
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author],
      images: post.coverImage ? [post.coverImage] : [],
      tags: post.tags
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || post.content.slice(0, 160),
      images: post.coverImage ? [post.coverImage] : []
    }
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  
  // Fetch post
  const result = await getPostBySlug(slug)
  
  if (!result.success || !result.data || !result.data.published) {
    notFound()
  }
  
  const post = result.data
  
  // Increment view count (fire and forget)
  incrementPostViews(slug).catch(console.error)
  
  // Fetch related posts
  const relatedResult = await getRelatedPosts(slug, 3)
  const relatedPosts = relatedResult.success ? (relatedResult.data || []) : []
  
  return <BlogDetailClient post={post} relatedPosts={relatedPosts} />
}
