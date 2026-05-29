'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Loader2,
  Calendar,
  BarChart3
} from 'lucide-react'
import { deletePost, togglePostPublished } from '@/lib/actions/posts'
import { toast } from 'sonner'

// Type for Post from database
type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  category: string | null
  tags: string[]
  author: string
  metaTitle: string | null
  metaDescription: string | null
  published: boolean
  publishedAt: Date | null
  views: number
  createdAt: Date
  updatedAt: Date
}

interface PostsTableProps {
  initialPosts: Post[]
}

export default function PostsTable({ initialPosts }: PostsTableProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isPending, startTransition] = useTransition()
  
  // Get unique categories
  const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)))
  
  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'published' && post.published) ||
      (statusFilter === 'draft' && !post.published)
    
    return matchesSearch && matchesCategory && matchesStatus
  })
  
  // Handle delete
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    
    startTransition(async () => {
      const result = await deletePost(id)
      if (result.success) {
        setPosts(prev => prev.filter(p => p.id !== id))
        toast.success('Post deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete post')
      }
    })
  }
  
  // Handle toggle published
  const handleTogglePublished = async (id: string) => {
    startTransition(async () => {
      const result = await togglePostPublished(id)
      if (result.success && result.data) {
        setPosts(prev => prev.map(p => p.id === id ? result.data! : p))
        toast.success(`Post ${result.data.published ? 'published' : 'unpublished'} successfully`)
      } else {
        toast.error(result.error || 'Failed to update')
      }
    })
  }
  
  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold neon-text">Blog Posts</h1>
          <p className="text-white/60 mt-1">
            Manage your blog content
          </p>
        </div>
        <Link
          href="/dashboard/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>
      
      {/* Filters */}
      <div className="glass p-4 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
            />
          </div>
          
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category || ''}>
                {category}
              </option>
            ))}
          </select>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Total Posts</div>
          <div className="text-2xl font-bold neon-text">{posts.length}</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Published</div>
          <div className="text-2xl font-bold text-green-400">{posts.filter(p => p.published).length}</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Total Views</div>
          <div className="text-2xl font-bold text-cyan-400">{posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}</div>
        </div>
      </div>
      
      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-white/60">No posts found</p>
            {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('all')
                  setStatusFilter('all')
                }}
                className="mt-4 text-cyan-400 hover:text-cyan-300 transition"
              >
                Clear filters
              </button>
            ) : (
              <Link
                href="/dashboard/blog/new"
                className="mt-4 inline-block text-cyan-400 hover:text-cyan-300 transition"
              >
                Create your first post
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/60 font-medium">Title</th>
                  <th className="text-left p-4 text-white/60 font-medium">Category</th>
                  <th className="text-left p-4 text-white/60 font-medium">Status</th>
                  <th className="text-left p-4 text-white/60 font-medium">Views</th>
                  <th className="text-left p-4 text-white/60 font-medium">Published</th>
                  <th className="text-right p-4 text-white/60 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr 
                    key={post.id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-4">
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-white/40 mt-1">/{post.slug}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-white/5 rounded text-sm">
                        {post.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        post.published 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <BarChart3 className="w-4 h-4" />
                        {post.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Published */}
                        <button
                          onClick={() => handleTogglePublished(post.id)}
                          disabled={isPending}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                          title={post.published ? 'Unpublish' : 'Publish'}
                        >
                          {post.published ? (
                            <Eye className="w-4 h-4 text-green-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-white/40" />
                          )}
                        </button>
                        
                        {/* Edit */}
                        <Link
                          href={`/dashboard/blog/${post.id}/edit`}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-cyan-400" />
                        </Link>
                        
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={isPending}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Loading Overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass p-6 rounded-xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  )
}
