import { requireAdmin } from '@/lib/auth'
import { getProjectById } from '@/lib/actions/projects'
import ProjectForm from '@/components/admin/ProjectForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Project - Admin Dashboard',
  description: 'Edit portfolio project'
}

export default async function EditProjectPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  
  // Fetch project data
const { id } = await params; 
const result = await getProjectById(id)
  
  if (!result.success || !result.data) {
    notFound()
  }
  
  const project = result.data
  
  // Helper function to safely cast metrics
  const getMetrics = (metrics: any): Record<string, string> | undefined => {
    if (!metrics) return undefined
    if (typeof metrics === 'object' && !Array.isArray(metrics)) {
      // Convert all values to strings
      const result: Record<string, string> = {}
      for (const [key, value] of Object.entries(metrics)) {
        result[key] = String(value)
      }
      return result
    }
    return undefined
  }
  
  const transformedProject = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    category: project.category,
    tech: project.tech,
    challenge: project.challenge || undefined,
    solution: project.solution || undefined,
    results: project.results || undefined,
    thumbnail: project.thumbnail || undefined,
    images: project.images,
    videoUrl: project.videoUrl || undefined,
    demoUrl: project.demoUrl || undefined,
    githubUrl: project.githubUrl || undefined,
    gradient: project.gradient || undefined,
    accentColor: project.accentColor || undefined,
    metrics: getMetrics(project.metrics),
    featured: project.featured,
    published: project.published,
    order: project.order
  }
  
  return (
    <div className="min-h-screen bg-[#050816] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          
          <h1 className="text-3xl font-bold neon-text">Edit Project</h1>
          <p className="text-white/60 mt-1">
            Update {transformedProject.title}
          </p>
        </div>
        
        {/* Form */}
        <ProjectForm 
          mode="edit" 
          initialData={transformedProject}
        />
      </div>
    </div>
  )
}
