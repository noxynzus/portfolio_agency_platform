import { requireAdmin } from '@/lib/auth'
import { 
  getProjects, 
  createProject, 
  toggleProjectPublished,
  toggleProjectFeatured,
  getProjectCategories 
} from '@/lib/actions/projects'
import { revalidatePath } from 'next/cache'

export default async function TestProjectsPage() {
  await requireAdmin()
  
  // Fetch all projects
  const result = await getProjects()
  const projects = result.success ? result.data : []
  
  // Fetch categories
  const catResult = await getProjectCategories()
  const categories = catResult.success ? catResult.data : []
  
  // Server action for testing create
  async function testCreate() {
    'use server'
    const testData = {
      title: 'Test Project ' + Date.now(),
      slug: 'test-project-' + Date.now(),
      description: 'This is a test project created for testing purposes',
      category: 'Test',
      tech: ['Next.js', 'TypeScript'],
      gradient: 'from-cyan-500/20 via-blue-600/10 to-transparent',
      accentColor: '#00F5FF',
      featured: false,
      published: false,
      order: 999
    }
    
    const result = await createProject(testData)
    revalidatePath('/dashboard/test-projects')
    return result
  }
  
  return (
    <div></div>
    // <div className="min-h-screen bg-[#050816] p-8">
    //   <div className="max-w-7xl mx-auto">
    //     <div className="glass p-8 rounded-2xl">
    //       <h1 className="text-3xl font-bold neon-text mb-6">
    //         Test Projects Actions
    //       </h1>
          
    //       {/* Stats */}
    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    //         <div className="glass-dark p-4 rounded-xl">
    //           <p className="text-white/60 text-sm">Total Projects</p>
    //           <p className="text-2xl font-bold">{projects.length}</p>
    //         </div>
    //         <div className="glass-dark p-4 rounded-xl">
    //           <p className="text-white/60 text-sm">Published</p>
    //           <p className="text-2xl font-bold">
    //             {projects.filter(p => p.published).length}
    //           </p>
    //         </div>
    //         <div className="glass-dark p-4 rounded-xl">
    //           <p className="text-white/60 text-sm">Featured</p>
    //           <p className="text-2xl font-bold">
    //             {projects.filter(p => p.featured).length}
    //           </p>
    //         </div>
    //       </div>
          
    //       {/* Categories */}
    //       <div className="mb-8">
    //         <h2 className="text-xl font-semibold mb-3">Categories</h2>
    //         <div className="flex flex-wrap gap-2">
    //           {categories.map((cat: string) => (
    //             <span 
    //               key={cat}
    //               className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-sm"
    //             >
    //               {cat}
    //             </span>
    //           ))}
    //         </div>
    //       </div>
          
    //       {/* Test Create Button */}
    //       <div className="mb-8">
    //         <form action={testCreate}>
    //           <button
    //             type="submit"
    //             className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition"
    //           >
    //             Test Create Project
    //           </button>
    //         </form>
    //       </div>
          
    //       {/* Projects List */}
    //       <div className="space-y-4">
    //         <h2 className="text-xl font-semibold mb-3">All Projects</h2>
            
    //         {projects.length === 0 ? (
    //           <p className="text-white/40">No projects found</p>
    //         ) : (
    //           projects.map((project) => (
    //             <div 
    //               key={project.id}
    //               className="glass-dark p-4 rounded-xl"
    //             >
    //               <div className="flex items-start justify-between">
    //                 <div className="flex-1">
    //                   <h3 className="font-semibold text-lg mb-1">
    //                     {project.title}
    //                   </h3>
    //                   <p className="text-sm text-white/60 mb-2">
    //                     {project.slug}
    //                   </p>
    //                   <div className="flex flex-wrap gap-2 mb-2">
    //                     <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs">
    //                       {project.category}
    //                     </span>
    //                     {project.published && (
    //                       <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-500">
    //                         Published
    //                       </span>
    //                     )}
    //                     {project.featured && (
    //                       <span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-500">
    //                         Featured
    //                       </span>
    //                     )}
    //                   </div>
    //                   <div className="flex flex-wrap gap-1">
    //                     {project.tech.map((t: string) => (
    //                       <span 
    //                         key={t}
    //                         className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60"
    //                       >
    //                         {t}
    //                       </span>
    //                     ))}
    //                   </div>
    //                 </div>
                    
    //                 <div className="flex gap-2">
    //                   <form action={async () => {
    //                     'use server'
    //                     await toggleProjectPublished(project.id)
    //                     revalidatePath('/dashboard/test-projects')
    //                   }}>
    //                     <button
    //                       type="submit"
    //                       className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm transition"
    //                     >
    //                       {project.published ? 'Unpublish' : 'Publish'}
    //                     </button>
    //                   </form>
                      
    //                   <form action={async () => {
    //                     'use server'
    //                     await toggleProjectFeatured(project.id)
    //                     revalidatePath('/dashboard/test-projects')
    //                   }}>
    //                     <button
    //                       type="submit"
    //                       className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm transition"
    //                     >
    //                       {project.featured ? 'Unfeature' : 'Feature'}
    //                     </button>
    //                   </form>
    //                 </div>
    //               </div>
    //             </div>
    //           ))
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}
