import { db } from '@/lib/db';
import Link from 'next/link';
import {
  Folder,
  FileText,
  Mail,
  TrendingUp,
  Eye,
  CheckCircle,
} from 'lucide-react';

export default async function DashboardPage() {
  
  // Fetch real stats from database
  const [
    projectsCount,
    publishedProjectsCount,
    servicesCount,
    postsCount,
    publishedPostsCount,
    leadsCount,
    newLeadsCount,
    testimonialsCount
  ] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { published: true } }),
    db.service.count({ where: { published: true } }),
    db.post.count(),
    db.post.count({ where: { published: true } }),
    db.lead.count(),
    db.lead.count({ where: { status: 'NEW' } }),
    db.testimonial.count({ where: { published: true } })
  ]);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold neon-text mb-2">Dashboard</h1>
          <p className="text-white/60">
            Welcome back! Here&apos;s your overview.
          </p>
        </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Projects */}
              <div className="glass p-6 rounded-xl border border-cyan-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg">
                    <Folder className="w-6 h-6 text-cyan-500" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <h3 className="text-white/60 text-sm mb-1">Projects</h3>
                <p className="text-3xl font-bold mb-2">{projectsCount}</p>
                <p className="text-xs text-white/40">
                  {publishedProjectsCount} published
                </p>
              </div>
              
              {/* Services */}
              <div className="glass p-6 rounded-xl border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-500" />
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <h3 className="text-white/60 text-sm mb-1">Services</h3>
                <p className="text-3xl font-bold mb-2">{servicesCount}</p>
                <p className="text-xs text-white/40">Active services</p>
              </div>
              
              {/* Blog Posts */}
              <div className="glass p-6 rounded-xl border border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                  <Eye className="w-4 h-4 text-cyan-500" />
                </div>
                <h3 className="text-white/60 text-sm mb-1">Blog Posts</h3>
                <p className="text-3xl font-bold mb-2">{postsCount}</p>
                <p className="text-xs text-white/40">
                  {publishedPostsCount} published
                </p>
              </div>
              
              {/* Leads */}
              <div className="glass p-6 rounded-xl border border-pink-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-pink-500/10 rounded-lg">
                    <Mail className="w-6 h-6 text-pink-500" />
                  </div>
                  {newLeadsCount > 0 && (
                    <span className="px-2 py-1 bg-red-500 text-xs rounded-full">
                      New
                    </span>
                  )}
                </div>
                <h3 className="text-white/60 text-sm mb-1">Leads</h3>
                <p className="text-3xl font-bold mb-2">{leadsCount}</p>
                <p className="text-xs text-white/40">
                  {newLeadsCount} new inquiries
                </p>
              </div>
            </div>
            
            {/* Welcome Message */}
            <div className="glass p-8 rounded-2xl border border-cyan-500/20 mb-8">
              <h2 className="text-2xl font-bold mb-3">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  🎉 System Ready!
                </span>
              </h2>
              <p className="text-white/80 mb-4">
                Your database has been seeded with initial data:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-cyan-500">{projectsCount}</p>
                  <p className="text-sm text-white/60">Projects</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-purple-500">{servicesCount}</p>
                  <p className="text-sm text-white/60">Services</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-blue-500">4</p>
                  <p className="text-sm text-white/60">Pricing Plans</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-pink-500">{testimonialsCount}</p>
                  <p className="text-sm text-white/60">Testimonials</p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/dashboard/projects"
                  className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 transition group"
                >
                  <Folder className="w-8 h-8 text-cyan-500 mb-2 group-hover:scale-110 transition" />
                  <h4 className="font-semibold mb-1">Manage Projects</h4>
                  <p className="text-sm text-white/60">
                    Add, edit, or remove portfolio projects
                  </p>
                </Link>
                
                <Link
                  href="/dashboard/blog"
                  className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition group"
                >
                  <FileText className="w-8 h-8 text-purple-500 mb-2 group-hover:scale-110 transition" />
                  <h4 className="font-semibold mb-1">Write Blog Post</h4>
                  <p className="text-sm text-white/60">
                    Create and publish new content
                  </p>
                </Link>
                
                <Link
                  href="/dashboard/leads"
                  className="p-4 bg-gradient-to-br from-pink-500/10 to-red-600/10 border border-pink-500/20 rounded-lg hover:border-pink-500/40 transition group"
                >
                  <Mail className="w-8 h-8 text-pink-500 mb-2 group-hover:scale-110 transition" />
                  <h4 className="font-semibold mb-1">View Leads</h4>
                  <p className="text-sm text-white/60">
                    Review and respond to inquiries
                  </p>
                </Link>
              </div>
            </div>
          </div>
      </div>
  );
}
