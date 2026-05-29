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
  Star,
  StarOff,
  Loader2
} from 'lucide-react'
import { deleteProject, toggleProjectPublished, toggleProjectFeatured } from '@/lib/actions/projects'
import { toast } from 'sonner'
import Image from 'next/image'

// Type for Project from database
type Project = {
  id: string
  title: string
  slug: string
  description: string
  category: string
  tech: string[]
  challenge: string | null
  solution: string | null
  results: string | null
  thumbnail: string | null
  images: string[]
  videoUrl: string | null
  demoUrl: string | null
  githubUrl: string | null
  gradient: string | null
  accentColor: string | null
  metrics: any
  featured: boolean
  published: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

interface ProjectsTableProps {
  initialProjects: Project[]
}

export default function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isPending, startTransition] = useTransition()
  
  // Get unique categories
  const categories = Array.from(new Set(projects.map(p => p.category)))
  
  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'published' && project.published) ||
      (statusFilter === 'draft' && !project.published)
    
    return matchesSearch && matchesCategory && matchesStatus
  })
  
  // Handle delete
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    
    startTransition(async () => {
      const result = await deleteProject(id)
      if (result.success) {
        setProjects(prev => prev.filter(p => p.id !== id))
        toast.success('Project deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete project')
      }
    })
  }
  
  // Handle toggle published
  const handleTogglePublished = async (id: string) => {
    startTransition(async () => {
      const result = await toggleProjectPublished(id)
      if (result.success && result.data) {
        setProjects(prev => prev.map(p => p.id === id ? result.data! : p))
        toast.success(result.message)
      } else {
        toast.error(result.error || 'Failed to update')
      }
    })
  }
  
  // Handle toggle featured
  const handleToggleFeatured = async (id: string) => {
    startTransition(async () => {
      const result = await toggleProjectFeatured(id)
      if (result.success && result.data) {
        setProjects(prev => prev.map(p => p.id === id ? result.data! : p))
        toast.success(result.message)
      } else {
        toast.error(result.error || 'Failed to update')
      }
    })
  }
  
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold neon-text">Projects</h1>
          <p className="text-white/60 mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" />
          New Project
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
              placeholder="Search projects..."
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
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-dark p-4 rounded-xl">
          <p className="text-white/60 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold">{projects.length}</p>
        </div>
        <div className="glass-dark p-4 rounded-xl">
          <p className="text-white/60 text-sm mb-1">Published</p>
          <p className="text-2xl font-bold text-green-500">
            {projects.filter(p => p.published).length}
          </p>
        </div>
        <div className="glass-dark p-4 rounded-xl">
          <p className="text-white/60 text-sm mb-1">Draft</p>
          <p className="text-2xl font-bold text-yellow-500">
            {projects.filter(p => !p.published).length}
          </p>
        </div>
        <div className="glass-dark p-4 rounded-xl">
          <p className="text-white/60 text-sm mb-1">Featured</p>
          <p className="text-2xl font-bold text-cyan-500">
            {projects.filter(p => p.featured).length}
          </p>
        </div>
      </div>
      
      {/* Results Count */}
      <p className="text-sm text-white/60 mb-4">
        Showing {filteredProjects.length} of {projects.length} projects
      </p>
      
      {/* Projects Table */}
      <div className="glass rounded-xl overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-white/40 mb-2">No projects found</p>
            <p className="text-sm text-white/30">
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first project to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm font-medium text-white/60">Project</th>
                  <th className="text-left p-4 text-sm font-medium text-white/60">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-white/60">Tech Stack</th>
                  <th className="text-center p-4 text-sm font-medium text-white/60">Status</th>
                  <th className="text-center p-4 text-sm font-medium text-white/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr 
                    key={project.id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    {/* Project Info */}
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        {project.thumbnail && (
                          <Image 
                            width={100}
                            height={100}
                            // fill
                            src={project.thumbnail} 
                            alt={project.title}
                            className="w-12 h-12 rounded-lg object-cover"
                            unoptimized={true}
                            // sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 33vw"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold mb-1 line-clamp-1">
                            {project.title}
                          </h3>
                          <p className="text-sm text-white/60 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="p-4">
                      <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-sm">
                        {project.category}
                      </span>
                    </td>
                    
                    {/* Tech Stack */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.tech.slice(0, 3).map((tech: string) => (
                          <span 
                            key={tech}
                            className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 3 && (
                          <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60">
                            +{project.tech.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        {project.published ? (
                          <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-500">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-500">
                            Draft
                          </span>
                        )}
                        {project.featured && (
                          <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs text-cyan-500">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Toggle Published */}
                        <button
                          onClick={() => handleTogglePublished(project.id)}
                          disabled={isPending}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                          title={project.published ? 'Unpublish' : 'Publish'}
                        >
                          {project.published ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-white/40" />
                          )}
                        </button>
                        
                        {/* Toggle Featured */}
                        <button
                          onClick={() => handleToggleFeatured(project.id)}
                          disabled={isPending}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                          title={project.featured ? 'Unfeature' : 'Feature'}
                        >
                          {project.featured ? (
                            <Star className="w-4 h-4 text-cyan-500 fill-cyan-500" />
                          ) : (
                            <StarOff className="w-4 h-4 text-white/40" />
                          )}
                        </button>
                        
                        {/* Edit */}
                        <Link
                          href={`/dashboard/projects/${project.id}/edit`}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Link>
                        
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          disabled={isPending}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
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
            <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  )
}
