import { Settings, Wrench, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Site Under Maintenance',
  description: 'We are currently performing scheduled maintenance',
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="bg-grid fixed inset-0 opacity-10" />
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-600/5" />
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Icon Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-cyan-500/20 rounded-full animate-pulse" />
            <div className="glass p-8 rounded-3xl border border-cyan-500/30 relative">
              <Settings className="w-20 h-20 text-cyan-500 animate-spin-slow" />
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-5xl font-bold mb-4">
          <span className="neon-text">Under Maintenance</span>
        </h1>
        
        {/* Description */}
        <p className="text-xl text-white/60 mb-8">
          We&apos;re currently performing scheduled maintenance to improve your experience.
          We&apos;ll be back online shortly.
        </p>
        
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="glass p-6 rounded-xl border border-white/10">
            <div className="flex items-center justify-center mb-3">
              <Wrench className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-2">System Upgrade</h3>
            <p className="text-sm text-white/60">
              Enhancing performance and adding new features
            </p>
          </div>
          
          <div className="glass p-6 rounded-xl border border-white/10">
            <div className="flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-cyan-500" />
            </div>
            <h3 className="font-semibold mb-2">Estimated Time</h3>
            <p className="text-sm text-white/60">
              We&apos;ll be back in a few hours
            </p>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="glass p-6 rounded-xl border border-white/10">
          <p className="text-sm text-white/60">
            If you need immediate assistance, please contact us at{' '}
            <Link 
              href="mailto:hello@techforge.dev" 
              className="text-cyan-500 hover:text-cyan-400 underline"
            >
              hello@techforge.dev
            </Link>
          </p>
        </div>
        
        {/* Admin Login Link */}
        <div className="mt-8">
          <Link
            href="/login"
            className="text-sm text-white/40 hover:text-cyan-500 transition"
          >
            Admin Access →
          </Link>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="fixed bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
    </div>
  );
}
