import { requireAdmin } from '@/lib/auth'
import { getProjects } from '@/lib/actions/projects'
import ProjectsTable from '@/components/admin/ProjectsTable'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Projects - Admin Dashboard',
  description: 'Manage your portfolio projects'
}

export default async function ProjectsPage() {
  // Require admin authentication
  await requireAdmin()
  
  // Fetch all projects
  const result = await getProjects()
  
  if (!result.success) {
    // Handle error - could redirect or show error page
    return (
      <div className="min-h-screen bg-[#050816] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-8 rounded-2xl text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-white/60">{result.error}</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#050816] p-8">
      <div className="max-w-7xl mx-auto">
        <ProjectsTable initialProjects={result.data || []} />
      </div>
    </div>
  )
}
