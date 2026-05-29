'use client';

import { useState } from 'react';
import { Testimonial } from '@prisma/client';
import { Plus, Search } from 'lucide-react';
import TestimonialsTable from '@/components/admin/TestimonialsTable';
import TestimonialForm from '@/components/admin/TestimonialForm';

type SerializedTestimonial = Omit<Testimonial, 'createdAt' | 'updatedAt'> & {
  name: string;
    id: string;
    role: string;
    company: string;
    content: string;
    avatar: string | null;
    rating: number;
    order: number;
    published: boolean;
  createdAt: string;
  updatedAt: string;
};

interface TestimonialsClientProps {
  initialTestimonials: SerializedTestimonial[];
}

export default function TestimonialsClient({
  initialTestimonials,
}: TestimonialsClientProps) {
  const [testimonials, setTestimonials] = useState<SerializedTestimonial[]>(initialTestimonials);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<SerializedTestimonial | undefined>();

  const filteredTestimonials = testimonials.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (testimonial: SerializedTestimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTestimonial(undefined);
  };

  const handleSuccess = async () => {
    // Refresh testimonials
    const { getTestimonials } = await import('@/lib/actions/testimonials');
    const result = await getTestimonials();
    if (result.success && result.data) {
      const serialized = result.data.map(t => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      }));
      setTestimonials(serialized);
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search testimonials..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:opacity-90 transition flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-4 rounded-xl border border-white/10">
          <p className="text-sm text-white/60 mb-1">Total</p>
          <p className="text-2xl font-bold">{testimonials.length}</p>
        </div>
        <div className="glass p-4 rounded-xl border border-white/10">
          <p className="text-sm text-white/60 mb-1">Published</p>
          <p className="text-2xl font-bold text-green-500">
            {testimonials.filter((t) => t.published).length}
          </p>
        </div>
        <div className="glass p-4 rounded-xl border border-white/10">
          <p className="text-sm text-white/60 mb-1">Average Rating</p>
          <p className="text-2xl font-bold text-yellow-500">
            {testimonials.length > 0
              ? (
                  testimonials.reduce((sum, t) => sum + t.rating, 0) /
                  testimonials.length
                ).toFixed(1)
              : '0.0'}
            ⭐
          </p>
        </div>
      </div>

      {/* Table */}
      <TestimonialsTable
        initialTestimonials={filteredTestimonials}
        onEdit={handleEdit}
      />

      {/* Form Modal */}
      {showForm && (
        <TestimonialForm
          testimonial={editingTestimonial}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
