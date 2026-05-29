import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Post Not Found',
  description: 'The requested blog post could not be found.'
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cyber-black pt-20 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass p-12 rounded-2xl">
          <h1 className="text-6xl font-bold neon-text mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">Post Not Found</h2>
          <p className="text-white/60 mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
