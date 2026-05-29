'use client'

import Link from 'next/link'
import { ShieldX, ArrowLeft, Home } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4">
      <div className="bg-grid absolute inset-0 opacity-20" />
      
      <div className="relative max-w-md w-full">
        <div className="glass p-8 rounded-2xl text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-red-500" />
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold mb-3">
            <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Access Denied
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-white/60 mb-8">
            You don&apos;t have permission to access this area. This section is restricted to administrators only.
          </p>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition font-medium"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
          
          {/* Help Text */}
          <p className="mt-6 text-sm text-white/40">
            Need access? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
