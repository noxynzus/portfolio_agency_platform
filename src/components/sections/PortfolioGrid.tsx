'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Filter } from 'lucide-react'
import type { Project } from '@prisma/client'

interface PortfolioGridProps {
  projects: Project[]
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  // Extract unique categories from projects
  const categories = useMemo(() => {
    const cats = projects.map(p => p.category).filter(Boolean)
    const uniqueCats = Array.from(new Set(cats))
    return ['All', ...uniqueCats.sort()]
  }, [projects])

  const [activeCategory, setActiveCategory] = useState('All')

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') {
      return projects
    }
    return projects.filter(p => p.category === activeCategory)
  }, [projects, activeCategory])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      {/* Filter Bar */}
      <motion.div
        initial={false}
        animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-3 mb-12 flex-wrap"
      >
        <Filter className="w-4 h-4 text-gray-500" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30'
                : 'text-gray-500 border border-white/[0.08] hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={false}
              animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl overflow-hidden glass border border-white/[0.07] card-glow"
            >
              {/* Image/Thumbnail */}
              <div
                className={`relative h-48 overflow-hidden ${
                  project.gradient || 'bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-transparent'
                }`}
              >
                <div className="absolute inset-0 bg-grid opacity-30" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${project.accentColor || '#00F5FF'}20`,
                      border: `1px solid ${project.accentColor || '#00F5FF'}30`,
                      color: project.accentColor || '#00F5FF',
                    }}
                  >
                    {project.category}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-cyber-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg"
                    style={{
                      background: `${project.accentColor || '#00F5FF'}15`,
                      border: `1px solid ${project.accentColor || '#00F5FF'}40`,
                      color: project.accentColor || '#00F5FF',
                    }}
                  >
                    View Case Study <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="font-display font-semibold text-base text-white mb-2 group-hover:text-cyber-cyan transition-colors line-clamp-1">
                  {project.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech.slice(0, 3).map((t) => (
                    <span key={t} className="tech-tag">
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="tech-tag">+{project.tech.length - 3}</span>
                  )}
                </div>

                {/* Metrics (if available) */}
                {project.metrics && Array.isArray(project.metrics) && project.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/[0.06]">
                    {project.metrics.slice(0, 3).map((metric: any, idx: number) => (
                      <div key={idx} className="text-center">
                        <div
                          className="font-display font-bold text-sm"
                          style={{ color: project.accentColor || '#00F5FF' }}
                        >
                          {metric.value}
                        </div>
                        <div className="text-gray-600 text-[0.6rem] mt-0.5">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No projects found in this category.</p>
          </div>
        )}
      </div>
    </>
  )
}
