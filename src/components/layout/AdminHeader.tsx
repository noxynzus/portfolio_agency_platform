'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
  showBack?: boolean;
}

export default function AdminHeader({
  title,
  description,
  showBack = false,
}: AdminHeaderProps) {
  const router = useRouter();

  return (
    <div className="p-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 hover:text-cyber-cyan transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
        <h1 className="text-3xl font-bold neon-text mb-2">{title}</h1>
        {description && (
          <p className="text-white/60 text-sm">{description}</p>
        )}
      </div>
    </div>
  );
}
