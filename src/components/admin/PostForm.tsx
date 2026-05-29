'use client'

import { useState, useTransition, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postSchema, type PostFormData } from '@/lib/validations/post'
import { createPost, updatePost } from '@/lib/actions/posts'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import { Loader2, Plus, X, Sparkles, FileText, Image as ImageIcon, Tag, Globe } from 'lucide-react'
import ImageUpload from '@/components/common/ImageUpload'

// Dynamic import for MarkdownEditor to reduce bundle size (~200KB)
const MarkdownEditor = dynamic(
  () => import('@/components/admin/MarkdownEditor'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
      </div>
    )
  }
)

interface PostFormProps {
  initialData?: Partial<PostFormData> & { id?: string }
  mode: 'create' | 'edit'
}

export default function PostForm({ initialData, mode }: PostFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [tagInput, setTagInput] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      coverImage: initialData?.coverImage || '',
      category: initialData?.category || '',
      tags: initialData?.tags || [],
      author: initialData?.author || 'Admin', // Default to 'Admin' if not provided
      metaTitle: initialData?.metaTitle || '',
      metaDescription: initialData?.metaDescription || '',
      published: initialData?.published || false
    }
  })
  
  // Optimize watch() - watch multiple fields at once to reduce re-renders
  const { tags, title, content, coverImage, excerpt, metaTitle, metaDescription, published } = watch()
  
  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    if (mode === 'create') {
      const slug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setValue('slug', slug)
    }
    
    // Auto-generate metaTitle if empty
    if (!metaTitle) {
      setValue('metaTitle', newTitle.slice(0, 60))
    }
  }
  
  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()])
      setTagInput('')
    }
  }
  
  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(t => t !== tagToRemove))
  }
  
  // Handle cover image change
  const handleCoverImageChange = (files: File[]) => {
    setCoverFile(files[0] || null)
  }
  
  // Submit handler
  const onSubmit = async (data: PostFormData) => {
    setIsUploading(true)
    
    try {
      // 1. Upload cover image if new file selected
      let coverImageUrl = data.coverImage
      if (coverFile) {
        const formData = new FormData()
        formData.append('file', coverFile)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Failed to upload cover image')
        }
        
        const result = await response.json()
        coverImageUrl = result.url
      }
      
      setIsUploading(false)
      
      // 2. Submit to server action
      startTransition(async () => {
        const submitData = {
          ...data,
          author: data.author || 'Admin',
          coverImage: coverImageUrl
        }
        
        const result = mode === 'create' 
          ? await createPost(submitData)
          : await updatePost(initialData?.id!, submitData)
        
        if (result.success) {
          toast.success(`Post ${mode === 'create' ? 'created' : 'updated'} successfully`)
          router.push('/dashboard/blog')
          router.refresh()
        } else {
          toast.error(result.error || 'Something went wrong')
          if (result.details) {
            console.error('Validation errors:', result.details)
          }
        }
      })
    } catch (error) {
      setIsUploading(false)
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    }
  }
  
  // Calculate read time (rough estimate: 200 words per minute)
  // Use useMemo to avoid recalculating on every render
  const readTime = useMemo(() => {
    const wordCount = content.trim().split(/\s+/).length
    return Math.ceil(wordCount / 200)
  }, [content])
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold neon-text">
            {mode === 'create' ? 'Create New Post' : 'Edit Post'}
          </h1>
          <p className="text-white/60 mt-1">
            {mode === 'create' ? 'Write and publish your blog post' : 'Update your blog post'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending || isUploading}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || isUploading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition disabled:opacity-50"
          >
            {(isPending || isUploading) ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isUploading ? 'Uploading...' : 'Saving...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {mode === 'create' ? 'Create Post' : 'Update Post'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-500" />
          Basic Information
        </h2>
        
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              onChange={(e) => {
                register('title').onChange(e)
                handleTitleChange(e)
              }}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              placeholder="e.g., Building Scalable Multi-Tenant SaaS with Next.js"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          
          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('slug')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              placeholder="building-scalable-multi-tenant-saas"
              readOnly={mode === 'edit'}
            />
            <p className="mt-1 text-xs text-white/40">
              {mode === 'create' ? 'Auto-generated from title' : 'Cannot change slug after creation'}
            </p>
            {errors.slug && (
              <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category
            </label>
            <input
              type="text"
              {...register('category')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              placeholder="e.g., Web Development, System Design, AI"
              list="category-suggestions"
            />
            <datalist id="category-suggestions">
              <option value="Web Development" />
              <option value="System Design" />
              <option value="AI" />
              <option value="Performance" />
              <option value="UI/UX" />
              <option value="Case Study" />
            </datalist>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
          
          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Excerpt
            </label>
            <textarea
              {...register('excerpt')}
              rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition resize-none"
              placeholder="Brief summary of the post (will be shown in post list)..."
            />
            <p className="mt-1 text-xs text-white/40">
              {excerpt?.length || 0} / 500 characters
            </p>
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-500">{errors.excerpt.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-500" />
          Content
        </h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Post Content (Markdown) <span className="text-red-500">*</span>
          </label>
          <MarkdownEditor
            value={content}
            onChange={(value) => setValue('content', value)}
            placeholder="Write your post content in Markdown format...

## Heading 2
### Heading 3

**Bold text** and *italic text*

- List item 1
- List item 2

```javascript
const example = 'code block'
```"
            height={500}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-white/40">
            <span>{content.length.toLocaleString()} characters</span>
            <span>~{readTime} min read</span>
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>
      </div>

      {/* Media */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-pink-500" />
          Cover Image
        </h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Cover Image
          </label>
          <ImageUpload
            existingUrls={coverImage ? [coverImage] : []}
            onFilesChange={handleCoverImageChange}
            maxFiles={1}
            label="Cover Image"
          />
          <p className="mt-2 text-xs text-white/40">
            Recommended size: 1200x630px (16:9 ratio)
          </p>
          {errors.coverImage && (
            <p className="mt-1 text-sm text-red-500">{errors.coverImage.message}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-orange-500" />
          Tags
        </h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag()
                }
              }}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              placeholder="Add a tag (press Enter)"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg"
                >
                  <span className="text-sm">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-white/40 hover:text-red-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {tags.length === 0 && (
            <p className="text-sm text-white/40">No tags added yet</p>
          )}
        </div>
      </div>

      {/* SEO */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-green-500" />
          SEO Settings
        </h2>
        
        <div className="space-y-4">
          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Meta Title
            </label>
            <input
              type="text"
              {...register('metaTitle')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              placeholder="SEO title (defaults to post title)"
            />
            <p className="mt-1 text-xs text-white/40">
              {metaTitle?.length || 0} / 60 characters (optimal for search results)
            </p>
            {errors.metaTitle && (
              <p className="mt-1 text-sm text-red-500">{errors.metaTitle.message}</p>
            )}
          </div>
          
          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Meta Description
            </label>
            <textarea
              {...register('metaDescription')}
              rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition resize-none"
              placeholder="SEO description (defaults to excerpt)"
            />
            <p className="mt-1 text-xs text-white/40">
              {metaDescription?.length || 0} / 160 characters (optimal for search results)
            </p>
            {errors.metaDescription && (
              <p className="mt-1 text-sm text-red-500">{errors.metaDescription.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Publishing Settings</h2>
        
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            {...register('published')}
            className="w-5 h-5 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
          />
          <label htmlFor="published" className="text-sm font-medium">
            Publish this post
          </label>
        </div>
        <p className="mt-2 text-xs text-white/40">
          {published 
            ? '✓ This post will be visible on your blog' 
            : '○ This post will be saved as a draft'}
        </p>
      </div>
    </form>
  )
}
