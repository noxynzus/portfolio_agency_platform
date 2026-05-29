import { getPosts, getPostCategories } from '@/lib/actions/posts'
import BlogClient from './BlogClient'

export const metadata = {
  title: 'Blog - TechForge',
  description: 'Engineering articles, case studies, and tech insights from our team.'
}

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPage() {
  // Fetch published posts and categories
  const [postsResult, categoriesResult] = await Promise.all([
    getPosts({ published: true }),
    getPostCategories()
  ])
  
  if (!postsResult.success) {
    return (
      <div className="min-h-screen bg-cyber-black pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass p-8 rounded-2xl text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-white/60">{postsResult.error}</p>
          </div>
        </div>
      </div>
    )
  }
  
  const posts = postsResult.data || []
  const categories = categoriesResult.success ? (categoriesResult.data || []) : []
  
  // Show empty state if no posts
  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-cyber-black pt-20">
        <div className="relative py-20 bg-cyber-dark border-b border-white/[0.06] overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
              Blog & <span className="neon-text">Insights</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Engineering articles, case studies, and tech insights from our team.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass p-12 rounded-2xl text-center">
            <p className="text-white/60 text-lg">No articles published yet. Check back soon!</p>
          </div>
        </div>
      </div>
    )
  }
  
  return <BlogClient initialPosts={posts} categories={categories} />
}
