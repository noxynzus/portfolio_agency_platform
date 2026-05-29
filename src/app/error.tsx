'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw, Bug } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error caught:', error);
    }
    
    // TODO: Log to error tracking service (e.g., Sentry)
    // logErrorToService(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4">
          {/* Background Grid */}
          <div className="bg-grid absolute inset-0 opacity-20" />
          
          {/* Ambient Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
            }}
          />

          <div className="relative max-w-lg w-full">
            <div className="glass p-8 rounded-2xl text-center border border-white/10">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold mb-3">
                <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  Oops! Something went wrong
                </span>
              </h1>

              {/* Description */}
              <p className="text-gray-400 mb-6">
                We encountered an unexpected error. Don&apos;t worry, our team has been
                notified and we&apos;re working on it.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-left">
                  <p className="text-xs text-red-400 font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-gray-500 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={reset}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 font-semibold hover:bg-white/10 transition flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </div>

              {/* Report Bug Link */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <a
                  href="mailto:support@atthawat.studio?subject=Error Report"
                  className="text-sm text-gray-500 hover:text-cyan-400 transition inline-flex items-center gap-2"
                >
                  <Bug className="w-4 h-4" />
                  Report this issue
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
