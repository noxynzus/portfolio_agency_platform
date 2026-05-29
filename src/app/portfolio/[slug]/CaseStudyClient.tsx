'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Play, ZoomIn } from 'lucide-react'
import type { Project } from '@prisma/client'
import { useState, useEffect } from 'react'

interface Props {
  project: Project
}

export default function CaseStudyClient({ project }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  
  // Parse metrics if it's JSON
  const metrics = project.metrics ? 
    (Array.isArray(project.metrics) ? project.metrics : []) : 
    []

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-cyber-black pt-20">
      {/* Back */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mb-4">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-cyber-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
      </div>

      {/* Hero banner with thumbnail */}
      <div className={`relative h-96 sm:h-[28rem] bg-gradient-to-br ${project.gradient || 'from-cyan-500/20 via-blue-600/10 to-transparent'} overflow-hidden`}>
        {/* Thumbnail Background */}
        {project.thumbnail && (
          <>
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover opacity-30"
              priority
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/70 to-cyber-black/30" />
          </>
        )}
        
        {/* Fallback gradient pattern */}
        {!project.thumbnail && (
          <>
            <div className="absolute inset-0 bg-grid opacity-25" />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, ${project.accentColor || '#00F5FF'}20, transparent 70%)`,
              }}
            />
          </>
        )}
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-10">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 w-fit"
            style={{
              background: `${project.accentColor || '#00F5FF'}20`,
              border: `1px solid ${project.accentColor || '#00F5FF'}30`,
              color: project.accentColor || '#00F5FF',
            }}
          >
            {project.category}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            {project.title}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">{project.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            <motion.section
              initial={false}
              animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-2xl font-bold text-white mb-4">
                Project Overview
              </h2>
              <p className="text-gray-400 leading-relaxed text-base">
                {project.description}
              </p>
            </motion.section>

            {/* Video Section */}
            {project.videoUrl && (
              <motion.section
                initial={false}
                animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <h2 className="font-display text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Play className="w-6 h-6 text-cyber-cyan" />
                  Project Demo
                </h2>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden glass border border-white/[0.07]">
                  <iframe
                    src={project.videoUrl}
                    title={`${project.title} Demo`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </motion.section>
            )}

            {/* Image Gallery */}
            {project.images && project.images.length > 0 && (
              <motion.section
                initial={false}
                animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                <h2 className="font-display text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <ZoomIn className="w-6 h-6 text-cyber-cyan" />
                  Project Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={false}
                      animate={isMounted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative aspect-video rounded-xl overflow-hidden glass border border-white/[0.07] group cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image}
                        alt={`${project.title} - Screenshot ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized={true}
                      />
                      <div className="absolute inset-0 bg-cyber-black/0 group-hover:bg-cyber-black/40 transition-colors duration-300 flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {project.challenge && (
              <motion.section
                initial={false}
                animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="font-display text-2xl font-bold text-white mb-4">
                  Challenge
                </h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {project.challenge}
                </p>
              </motion.section>
            )}

            {project.solution && (
              <motion.section
                initial={false}
                animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <h2 className="font-display text-2xl font-bold text-white mb-4">
                  Solution
                </h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {project.solution}
                </p>
              </motion.section>
            )}

            {project.results && (
              <motion.section
                initial={false}
                animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="font-display text-2xl font-bold text-white mb-4">
                  Results
                </h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {project.results}
                </p>
              </motion.section>
            )}

            {/* Tech stack */}
            <motion.section
              initial={false}
              animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-display text-2xl font-bold text-white mb-4">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="tech-tag">{t}</span>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {metrics && metrics.length > 0 && (
              <motion.div
                initial={false}
                animate={isMounted ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-xl p-6 glass border border-white/[0.07]"
              >
                <h3 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wider">
                  Results
                </h3>
                <div className="space-y-4">
                  {metrics.map((metric: any, idx: number) => (
                    <div key={idx}>
                      <div
                        className="font-display font-bold text-2xl"
                        style={{ color: project.accentColor || '#00F5FF' }}
                      >
                        {metric.value}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={false}
              animate={isMounted ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl p-6 glass border border-white/[0.07] space-y-4"
            >
              <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
                Project Info
              </h3>
              <div>
                <div className="text-gray-600 text-xs mb-0.5">Category</div>
                <div className="text-gray-300 text-sm">{project.category}</div>
              </div>
              
              {/* External Links */}
              {project.demoUrl && (
                <div>
                  <div className="text-gray-600 text-xs mb-0.5">Live Demo</div>
                  <a 
                    href={project.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyber-cyan text-sm hover:underline flex items-center gap-1"
                  >
                    View Site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              
              {project.githubUrl && (
                <div>
                  <div className="text-gray-600 text-xs mb-0.5">GitHub</div>
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 text-sm hover:text-cyber-cyan hover:underline flex items-center gap-1"
                  >
                    Source Code <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </motion.div>

            <Link href="/contact" className="btn-cyber w-full text-sm">
              Start Similar Project <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-cyber-cyan transition-colors p-2 rounded-lg glass"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedImage}
              alt="Project preview"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
