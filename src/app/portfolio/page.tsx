import Link from 'next/link'
import type { Metadata } from 'next'
import { getProjects } from '@/lib/actions/projects'
import PortfolioGrid from '@/components/sections/PortfolioGrid'

// SEO Metadata
export const metadata: Metadata = {
  title: 'Portfolio & Case Studies | TechForge',
  description: 'Explore our portfolio of successful projects. Real projects, real results. See how we help businesses build better digital products.',
  openGraph: {
    title: 'Portfolio & Case Studies | TechForge',
    description: 'Explore our portfolio of successful projects across web development, mobile apps, and AI solutions.',
    type: 'website',
  }
}

export default async function PortfolioPage() {
  // Fetch published projects from database
  const result = await getProjects({ published: true })
  const projects = (result.success && result.data) ? result.data : []

  return (
    <div className="min-h-screen bg-cyber-black pt-20">
      {/* Hero Section */}
      <div className="relative py-20 bg-cyber-dark border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-eyebrow mb-4 inline-flex">
            Our Work
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-5">
            Portfolio &{' '}
            <span className="neon-text">Case Studies</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real projects. Real results. Explore how we help businesses across industries build better digital products.
          </p>
        </div>
      </div>

      {/* Portfolio Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PortfolioGrid projects={projects} />

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">Ready to become our next success story?</p>
          <Link href="/contact" className="btn-cyber text-base">
            Start a Project
          </Link>
        </div>
      </div>
    </div>
  )
}
