'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Eye, Tag as TagIcon, Share2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
// @ts-ignore
import 'highlight.js/styles/atom-one-dark.css'
import Image from 'next/image'
import type { Post } from '@/types'
import { calculateReadTime, formatPublishDate, getBlogCategoryColor, getBlogCategoryGradient } from '@/lib/blog-utils'
import RelatedPostCard from '@/components/blog/RelatedPostCard'

interface BlogDetailClientProps {
  post: Post
  relatedPosts: Post[]
}

// Markdown custom components (constant to prevent re-creation)
const MARKDOWN_COMPONENTS: Components = {
  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-cyan-400 mt-8 mb-4 pb-2 border-b border-cyan-400/20" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-cyan-400 mt-8 mb-4 pb-2 border-b border-cyan-400/10" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-purple-400 mt-6 mb-3" {...props} />,
  h4: ({ node, ...props }) => <h4 className="text-lg font-semibold text-white/90 mt-6 mb-3" {...props} />,
  p: ({ node, ...props }) => <p className="text-white/80 leading-relaxed mb-4" {...props} />,
  a: ({ node, ...props }) => <a className="text-cyan-400 hover:text-cyan-300 border-b border-cyan-400/30 hover:border-cyan-300 transition" {...props} />,
  code: ({ node, className, children, ...props }) => {
    const isInline = !className
    return isInline ? (
      <code className="bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  pre: ({ node, ...props }) => <pre className="bg-black/30 border border-white/10 rounded-lg p-4 overflow-x-auto my-6" {...props} />,
  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-cyan-400 pl-4 my-6 italic text-white/70 bg-cyan-400/5 py-3 rounded-r" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 text-white/80" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-white/80" {...props} />,
  li: ({ node, ...props }) => <li className="ml-4" {...props} />,
  img: ({ node, ...props }) => <img className="rounded-lg my-6 w-full" {...props} />,
  table: ({ node, ...props }) => <div className="overflow-x-auto my-6"><table className="w-full border-collapse" {...props} /></div>,
  th: ({ node, ...props }) => <th className="bg-cyan-400/10 text-cyan-400 px-4 py-2 text-left font-semibold border-b-2 border-cyan-400/30" {...props} />,
  td: ({ node, ...props }) => <td className="px-4 py-2 border-b border-white/5" {...props} />,
  hr: ({ node, ...props }) => <hr className="border-white/10 my-8" {...props} />
}

export default function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  // Memoized values for performance
  const readTime = useMemo(() => calculateReadTime(post.content), [post.content])
  const publishDate = useMemo(() => formatPublishDate(post.publishedAt), [post.publishedAt])
  const accentColor = useMemo(() => getBlogCategoryColor(post.category), [post.category])
  const gradientClass = useMemo(() => getBlogCategoryGradient(post.category), [post.category])
  
  return (
    <div className="min-h-screen bg-cyber-black pt-20">
      {/* Hero Section */}
      <div className={`relative py-20 bg-gradient-to-br ${gradientClass} border-b border-white/[0.06] overflow-hidden`}>
        {post.coverImage && (
          <Image 
            src={post.coverImage} 
            alt={`Cover image for ${post.title}`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
            unoptimized={true}
          />
        )}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/50 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-cyan-400 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          {/* Category badge */}
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ 
              background: `${accentColor}20`, 
              color: accentColor, 
              border: `1px solid ${accentColor}30` 
            }}
          >
            {post.category || 'Uncategorized'}
          </span>
          
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
          >
            {post.title}
          </motion.h1>
          
          {/* Meta info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-4 text-sm text-white/60"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {publishDate}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {readTime} min read
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {post.views.toLocaleString()} views
            </div>
            <div className="flex items-center gap-2">
              By {post.author}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose-custom">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={MARKDOWN_COMPONENTS}
          >
            {post.content}
          </ReactMarkdown>
        </article>
        
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3 flex-wrap">
              <TagIcon className="w-5 h-5 text-white/40" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/60 hover:text-cyan-400 hover:border-cyan-400/30 transition"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Share */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-sm">Share this article</p>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt || '',
                    url: window.location.href
                  }).catch(console.error)
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied to clipboard!')
                }
              }}
              aria-label="Share this article"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-white/10 bg-cyber-dark/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
