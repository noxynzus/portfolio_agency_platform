'use client'

import Link from 'next/link'
import { ShieldX, Home } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isUnauthorized = error.message.includes('Unauthorized')
  
  if (isUnauthorized) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4">
        <div className="bg-grid absolute inset-0 opacity-20" />
        
        <div className="relative max-w-md w-full">
          <div className="glass p-8 rounded-2xl text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ShieldX className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Authentication Required
              </span>
            </h1>
            
            <p className="text-white/60 mb-8">
              Please log in to access the admin dashboard.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition font-medium"
              >
                Go to Login
              </Link>
              
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Generic error
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4">
      <div className="bg-grid absolute inset-0 opacity-20" />
      
      <div className="relative max-w-md w-full">
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h2>
          <p className="text-white/60 mb-6">{error.message}</p>
          
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition"
            >
              Try again
            </button>
            <Link
              href="/dashboard"
              className="flex-1 px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-center"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
