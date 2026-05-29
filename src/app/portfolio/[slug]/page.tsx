import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjects } from '@/lib/actions/projects'
import CaseStudyClient from './CaseStudyClient'
import type { Metadata } from 'next'

// ============================================
// Generate Static Params for Build Time
// ============================================
export async function generateStaticParams() {
  const result = await getProjects({ published: true })
  const projects = result.success && result.data ? result.data : []
  
  return projects.map((project) => ({
    slug: project.slug
  }))
}

// ============================================
// Generate Dynamic Metadata for SEO
// ============================================
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const result = await getProjectBySlug(slug)
  
  if (!result.success || !result.data) {
    return {
      title: 'Project Not Found',
    }
  }
  
  const project = result.data
  
  return {
    title: `${project.title} | Portfolio | TechForge`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      images: project.thumbnail ? [project.thumbnail] : [],
    },
  }
}

// ============================================
// Project Detail Page
// ============================================
export default async function ProjectPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const result = await getProjectBySlug(slug)
  
  // Handle not found or unpublished
  if (!result.success || !result.data) {
    notFound()
  }
  
  const project = result.data
  
  // Don't show unpublished projects to public
  if (!project.published) {
    notFound()
  }
  
  return <CaseStudyClient project={project} />
}
