"use client";

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative rounded-2xl overflow-hidden glass border border-white/[0.07] card-glow"
    >
      {/* Image / gradient placeholder */}
      <div
        className={`relative h-52 bg-gradient-to-br ${project.gradient} overflow-hidden`}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Corner accent */}
        <div
          className="absolute top-4 right-4 w-24 h-24 rounded-full opacity-40"
          style={{
            background: `radial-gradient(circle, ${project.accentColor}40, transparent 70%)`,
          }}
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: `${project.accentColor}20`,
              border: `1px solid ${project.accentColor}30`,
              color: project.accentColor,
            }}
          >
            {project.category}
          </span>
        </div>

        {/* Hover overlay with links */}
        <div className="absolute inset-0 bg-cyber-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            href={`/portfolio/${project.slug}`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg"
            style={{
              background: `${project.accentColor}15`,
              border: `1px solid ${project.accentColor}40`,
              color: project.accentColor,
            }}
          >
            Case Study
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display font-semibold text-base text-white mb-2 group-hover:text-cyber-cyan transition-colors duration-200 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 4).map((t) => (
            <span key={t} className="tech-tag">
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="tech-tag">+{project.tech.length - 4}</span>
          )}
        </div>

        {/* Metrics */}
        {project.metrics && (
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/[0.06]">
            {project.metrics.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div
                  className="font-display font-bold text-sm"
                  style={{ color: project.accentColor }}
                >
                  {value}
                </div>
                <div className="text-gray-600 text-[0.6rem] mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
