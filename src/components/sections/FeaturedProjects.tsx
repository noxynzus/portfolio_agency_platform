
import FeaturedProjectsClient from './FeaturedProjectsClient'
import { getProjects } from '@/lib/actions/projects'
import type { Project } from '@/types'

export default async function FeaturedProjects() {
  const result = await getProjects({ featured: true })
  const rawProjects = (result.success && result.data) ? result.data : []
  
  // Transform database projects to match Project interface with defaults
  const featuredProjects: Project[] = rawProjects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    tech: p.tech,
    gradient: p.gradient || 'from-cyan-500/20 to-purple-500/20',
    accentColor: p.accentColor || '#06b6d4',
    slug: p.slug,
    featured: p.featured,
    liveUrl: p.demoUrl || undefined,
    githubUrl: p.githubUrl || undefined,
  }))

  return <FeaturedProjectsClient projects={featuredProjects} />
}
