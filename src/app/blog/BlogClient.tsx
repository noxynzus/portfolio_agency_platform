'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import Image from 'next/image'

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
  published: boolean
  publishedAt: Date | null
  views: number
  createdAt: Date
  updatedAt: Date
}

interface BlogClientProps {
  initialPosts: Post[]
  categories: string[]
}

export default function BlogClient({ initialPosts, categories }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter posts
  const filteredPosts = initialPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })
  
  // Calculate read time (200 words per minute)
  const calculateReadTime = (content: string) => {
    const wordCount = content.trim().split(/\s+/).length
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} min`
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
  
  // Get gradient based on category
  const getCategoryGradient = (category: string | null) => {
    const gradients: Record<string, string> = {
      'Web Development': 'from-blue-500/20 to-indigo-500/10',
      'System Design': 'from-cyan-500/20 to-blue-500/10',
      'AI': 'from-orange-500/20 to-amber-500/10',
      'UI/UX': 'from-pink-500/20 to-rose-500/10',
      'Case Study': 'from-emerald-500/20 to-teal-500/10',
      'Performance': 'from-purple-500/20 to-violet-500/10'
    }
    return gradients[category || ''] || 'from-gray-500/20 to-slate-500/10'
  }
  
  // Get accent color based on category
  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      'Web Development': '#3B82F6',
      'System Design': '#00F5FF',
      'AI': '#F97316',
      'UI/UX': '#EC4899',
      'Case Study': '#06B6D4',
      'Performance': '#8B5CF6'
    }
    return colors[category || ''] || '#6B7280'
  }
  
  const [featured, ...rest] = filteredPosts

  return (
    <div className="min-h-screen bg-cyber-black pt-20">
      {/* Hero */}
      <div className="relative py-20 bg-cyber-dark border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-eyebrow mb-4 inline-flex"
          >
            Knowledge Hub
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-5"
          >
            Blog &{' '}
            <span className="neon-text">Insights</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            Engineering articles, case studies, and tech insights from our team.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search & Category filter */}
        <div className="mb-12 space-y-4">
          {/* Search */}
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              />
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                selectedCategory === 'All'
                  ? 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30'
                  : 'text-gray-500 border-white/[0.08] hover:text-white hover:border-white/20'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  selectedCategory === cat
                    ? 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30'
                    : 'text-gray-500 border-white/[0.08] hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg mb-4">No articles found</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group relative rounded-2xl overflow-hidden glass border border-white/[0.07] card-glow mb-8"
              >
                <Link href={`/blog/${featured.slug}`} className="block">
                  <div className={`h-64 sm:h-80 bg-gradient-to-br ${getCategoryGradient(featured.category)} relative overflow-hidden`}>
                    {featured.coverImage && (
                      <Image 
                        src={featured.coverImage} 
                        alt={featured.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                        fill
                        unoptimized={true}
                      />
                    )}
                    <div className="absolute inset-0 bg-grid opacity-30" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-cyber-black/90 to-transparent">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                        style={{ 
                          background: `${getCategoryColor(featured.category)}20`, 
                          color: getCategoryColor(featured.category), 
                          border: `1px solid ${getCategoryColor(featured.category)}30` 
                        }}
                      >
                        {featured.category || 'Uncategorized'}
                      </span>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {featured.excerpt || featured.content.slice(0, 150) + '...'}
                      </p>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-3 text-xs text-gray-400">
                      <span>{formatDate(featured.publishedAt)}</span>
                      <span>·</span>
                      <span>{calculateReadTime(featured.content)} read</span>
                      <span>·</span>
                      <span>{featured.views} views</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Posts grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group rounded-xl overflow-hidden glass border border-white/[0.07] card-glow"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className={`h-36 bg-gradient-to-br ${getCategoryGradient(post.category)} relative overflow-hidden`}>
                        {post.coverImage && (
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="absolute inset-0 w-full h-full object-cover opacity-40"
                            unoptimized={true}
                          />
                        )}
                        <div className="absolute inset-0 bg-grid opacity-20" />
                        <div className="absolute top-4 left-4">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              background: `${getCategoryColor(post.category)}20`, 
                              color: getCategoryColor(post.category), 
                              border: `1px solid ${getCategoryColor(post.category)}30` 
                            }}
                          >
                            {post.category || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                          <span>{formatDate(post.publishedAt)}</span>
                          <span>·</span>
                          <span>{calculateReadTime(post.content)} read</span>
                          <span>·</span>
                          <span>{post.views} views</span>
                        </div>
                        <h3 className="font-display font-semibold text-white text-sm leading-snug mb-2 group-hover:text-cyber-cyan transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                          {post.excerpt || post.content.slice(0, 100) + '...'}
                        </p>
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-medium"
                          style={{ color: getCategoryColor(post.category) }}
                        >
                          Read article <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
