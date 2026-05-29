import { requireAdmin } from '@/lib/auth'
import { getPosts } from '@/lib/actions/posts'
import PostsTable from '@/components/admin/PostsTable'

export const metadata = {
  title: 'Blog - Admin Dashboard',
  description: 'Manage your blog posts'
}

export default async function BlogPage() {
  // Require admin authentication
  await requireAdmin()
  
  // Fetch all posts
  const result = await getPosts()
  
  if (!result.success) {
    return (
      <div className="min-h-screen bg-[#050816] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-8 rounded-2xl text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-white/60">{result.error}</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#050816] p-8">
      <div className="max-w-7xl mx-auto">
        <PostsTable initialPosts={result.data || []} />
      </div>
    </div>
  )
}
