import Link from 'next/link'
import { ArrowLeft, FileQuestion } from 'lucide-react'

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-cyber-black pt-20 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-cyber-cyan/20 blur-3xl rounded-full" />
            <div className="relative rounded-full p-6 glass border border-white/[0.07]">
              <FileQuestion className="w-16 h-16 text-cyber-cyan" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
          Project <span className="neon-text">Not Found</span>
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          The project you&apos;re looking for doesn&apos;t exist or has been removed. 
          Please check the URL or explore our other projects.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/portfolio" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/20 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
          
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-gray-400 border border-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-200 font-medium"
          >
            Go Home
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 opacity-30">
          <div className="text-9xl font-display font-bold text-white/[0.03] select-none">
            404
          </div>
        </div>
      </div>
    </div>
  )
}
