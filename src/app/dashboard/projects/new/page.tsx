import { requireAdmin } from '@/lib/auth'
import ProjectForm from '@/components/admin/ProjectForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'New Project - Admin Dashboard',
  description: 'Create a new portfolio project'
}

export default async function NewProjectPage() {
  await requireAdmin()
  
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
          
          <h1 className="text-3xl font-bold neon-text">Create New Project</h1>
          <p className="text-white/60 mt-1">
            Add a new project to your portfolio
          </p>
        </div>
        
        {/* Form */}
        <ProjectForm mode="create" />
      </div>
    </div>
  )
}
