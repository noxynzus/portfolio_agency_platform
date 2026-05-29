import { Suspense } from 'react';
import { getTestimonials } from '@/lib/actions/testimonials';
import TestimonialsClient from './TestimonialsClient';
import AdminHeader from '@/components/layout/AdminHeader';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Testimonials | Admin',
};

async function TestimonialsContent() {
  const result = await getTestimonials();

  if (!result.success) {
    return (
      <div className="glass p-8 rounded-xl border border-red-500/20 text-center">
        <p className="text-red-500">Failed to load testimonials</p>
      </div>
    );
  }

  const serializedTestimonials = (result.data || []).map(t => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return <TestimonialsClient initialTestimonials={serializedTestimonials} />;
}

export default function TestimonialsPage() {
  return (
    <div className="p-8">
      <AdminHeader title="Testimonials" showBack={false} />

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        }
      >
        <TestimonialsContent />
      </Suspense>
    </div>
  );
}
