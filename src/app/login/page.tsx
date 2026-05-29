'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await signIn('credentials', {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        redirect: false
      })
      
      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError('Invalid email or password. Please check your credentials and try again.')
        } else {
          setError('Authentication failed. Please try again.')
        }
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl">
          <h1 className="text-3xl font-bold mb-2 neon-text text-center">
            Admin Login
          </h1>
          <p className="text-white/60 text-center mb-8">
            Sign in to access dashboard
          </p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                autoFocus
                autoComplete="email"
                disabled={loading}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          
          <p className="text-center text-white/40 text-sm mt-6">
            Protected area - Admin access only
          </p>
          </div>
        </form>
      </div>
    </div>
    

  )

}
