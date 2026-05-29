'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormData } from '@/lib/validations/project'
import { createProject, updateProject } from '@/lib/actions/projects'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Plus, X, Sparkles } from 'lucide-react'
import ImageUpload from '@/components/common/ImageUpload'

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData> & { id?: string }
  mode: 'create' | 'edit'
}

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [techInput, setTechInput] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      tech: initialData?.tech || [],
      challenge: initialData?.challenge || '',
      solution: initialData?.solution || '',
      results: initialData?.results || '',
      thumbnail: initialData?.thumbnail || '',
      images: initialData?.images || [],
      videoUrl: initialData?.videoUrl || '',
      demoUrl: initialData?.demoUrl || '',
      githubUrl: initialData?.githubUrl || '',
      gradient: initialData?.gradient || 'from-cyan-500/20 via-blue-600/10 to-transparent',
      accentColor: initialData?.accentColor || '#00F5FF',
      metrics: initialData?.metrics || {},
      featured: initialData?.featured || false,
      published: initialData?.published || false,
      order: initialData?.order || 0
    }
  })
  
  const tech = watch('tech')
  const title = watch('title')
  
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
  }
  
  // Add tech tag
  const addTech = () => {
    if (techInput.trim() && !tech.includes(techInput.trim())) {
      setValue('tech', [...tech, techInput.trim()])
      setTechInput('')
    }
  }
  
  // Remove tech tag
  const removeTech = (techToRemove: string) => {
    setValue('tech', tech.filter(t => t !== techToRemove))
  }
  
  // Handle thumbnail change
  const handleThumbnailChange = (files: File[]) => {
    setThumbnailFile(files[0] || null)
  }
  
  // Handle images change
  const handleImagesChange = (files: File[]) => {
    setImageFiles(files)
  }
  
  // Submit handler
  const onSubmit = async (data: ProjectFormData) => {
    setIsUploading(true)
    
    try {
      // 1. Upload thumbnail if new file selected
      let thumbnailUrl = data.thumbnail
      if (thumbnailFile) {
        const formData = new FormData()
        formData.append('file', thumbnailFile)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Failed to upload thumbnail')
        }
        
        const result = await response.json()
        thumbnailUrl = result.url
      }
      
      // 2. Upload images if new files selected
      const uploadedImageUrls: string[] = []
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData()
          formData.append('file', file)
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })
          
          if (!response.ok) {
            throw new Error('Failed to upload image')
          }
          
          const result = await response.json()
          uploadedImageUrls.push(result.url)
        }
      }
      
      // 3. Prepare final data
      const finalData = {
        ...data,
        thumbnail: thumbnailUrl,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : data.images
      }
      
      setIsUploading(false)
      
      // 4. Submit to server action
      startTransition(async () => {
        const result = mode === 'create' 
          ? await createProject(finalData)
          : await updateProject(initialData?.id!, finalData)
        
        if (result.success) {
          toast.success(result.message || `Project ${mode === 'create' ? 'created' : 'updated'} successfully`)
          router.push('/dashboard/projects')
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
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-500" />
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
              placeholder="e.g., NexusERP — Enterprise Resource Planning"
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
              placeholder="nexus-erp"
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
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('category')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              placeholder="e.g., Enterprise System, SaaS Platform"
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition resize-none"
              placeholder="Brief description of the project..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Technology Stack */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Technology Stack</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Technologies <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
                placeholder="e.g., Next.js, TypeScript"
              />
              <button
                type="button"
                onClick={addTech}
                className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {tech.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tech.map((t) => (
                  <span 
                    key={t}
                    className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center gap-2"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTech(t)}
                      className="hover:text-red-500 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {errors.tech && (
              <p className="mt-1 text-sm text-red-500">{errors.tech.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Project Details */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Project Details</h2>
        
        <div className="space-y-4">
          {/* Challenge */}
          <div>
            <label className="block text-sm font-medium mb-2">Challenge</label>
            <textarea
              {...register('challenge')}
              rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition resize-none"
              placeholder="What problem did this project solve?"
            />
          </div>
          
          {/* Solution */}
          <div>
            <label className="block text-sm font-medium mb-2">Solution</label>
            <textarea
              {...register('solution')}
              rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition resize-none"
              placeholder="How did you solve it?"
            />
          </div>
          
          {/* Results */}
          <div>
            <label className="block text-sm font-medium mb-2">Results</label>
            <textarea
              {...register('results')}
              rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition resize-none"
              placeholder="What were the outcomes?"
            />
          </div>
        </div>
      </div>
      
      {/* Media */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Media & Links</h2>
        
        <div className="space-y-6">
          {/* Thumbnail */}
          <ImageUpload
            label="Thumbnail Image"
            multiple={false}
            existingUrls={initialData?.thumbnail ? [initialData.thumbnail] : []}
            onFilesChange={handleThumbnailChange}
          />
          {errors.thumbnail && (
            <p className="text-sm text-red-500">{errors.thumbnail.message}</p>
          )}
          
          {/* Images */}
          <ImageUpload
            label="Additional Images (Gallery)"
            multiple={true}
            maxFiles={10}
            existingUrls={initialData?.images || []}
            onFilesChange={handleImagesChange}
          />
          
          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium mb-2">Video URL</label>
            <input
              type="text"
              {...register('videoUrl')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              placeholder="https://youtube.com/..."
            />
            {errors.videoUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.videoUrl.message}</p>
            )}
          </div>
          
          {/* Demo URL */}
          <div>
            <label className="block text-sm font-medium mb-2">Demo URL</label>
            <input
              type="text"
              {...register('demoUrl')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              placeholder="https://demo.example.com"
            />
            {errors.demoUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.demoUrl.message}</p>
            )}
          </div>
          
          {/* GitHub URL */}
          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input
              type="text"
              {...register('githubUrl')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              placeholder="https://github.com/..."
            />
            {errors.githubUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.githubUrl.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Styling */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Styling</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Gradient Class</label>
            <input
              type="text"
              {...register('gradient')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              placeholder="from-cyan-500/20 via-blue-600/10 to-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <input
              type="text"
              {...register('accentColor')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              placeholder="#00F5FF"
            />
          </div>
        </div>
      </div>
      
      {/* Settings */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                {...register('order', { valueAsNumber: true })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
              />
            </div>
            
            <div className="flex items-center gap-3 pt-7">
              <input
                type="checkbox"
                id="featured"
                {...register('featured')}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured Project
              </label>
            </div>
            
            <div className="flex items-center gap-3 pt-7">
              <input
                type="checkbox"
                id="published"
                {...register('published')}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Published
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending || isUploading}
          className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition disabled:opacity-50"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={isPending || isUploading}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
        >
          {(isPending || isUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
          {isUploading ? 'Uploading...' : isPending ? 'Saving...' : mode === 'create' ? 'Create Project' : 'Update Project'}
        </button>
      </div>
    </form>
  )
}
