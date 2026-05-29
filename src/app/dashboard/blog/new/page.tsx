import { requireAdmin } from '@/lib/auth'
import PostForm from '@/components/admin/PostForm'

export const metadata = {
  title: 'Create Post - Admin Dashboard',
  description: 'Create a new blog post'
}

export default async function NewPostPage() {
  await requireAdmin()
  
  return (
    <div className="min-h-screen bg-[#050816] p-8">
      <div className="max-w-5xl mx-auto">
        <PostForm mode="create" />
      </div>
    </div>
  )
}
