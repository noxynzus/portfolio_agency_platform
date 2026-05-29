import Link from 'next/link'
import Image from 'next/image'
import { getBlogCategoryColor, getBlogCategoryGradient } from '@/lib/blog-utils'
import type { Post } from '@/types'

interface RelatedPostCardProps {
  post: Post
}

export default function RelatedPostCard({ post }: RelatedPostCardProps) {
  const categoryColor = getBlogCategoryColor(post.category)
  const categoryGradient = getBlogCategoryGradient(post.category)
  
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group glass rounded-xl overflow-hidden border border-white/[0.07] card-glow"
    >
      <div className={`h-32 bg-gradient-to-br ${categoryGradient} relative overflow-hidden`}>
        {post.coverImage && (
          <Image 
            src={post.coverImage} 
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            className="object-cover opacity-40"
            unoptimized={true}
          />
        )}
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ 
              background: `${categoryColor}20`, 
              color: categoryColor, 
              border: `1px solid ${categoryColor}30` 
            }}
          >
            {post.category || 'Uncategorized'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-white text-sm leading-snug mb-2 group-hover:text-cyan-400 transition line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2">
          {post.excerpt || post.content.slice(0, 100)}
        </p>
      </div>
    </Link>
  )
}
