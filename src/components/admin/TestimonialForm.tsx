'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { testimonialSchema, type TestimonialInput } from '@/lib/validations/testimonial';
import { createTestimonial, updateTestimonial } from '@/lib/actions/testimonials';
import { Testimonial } from '@prisma/client';
import { toast } from 'sonner';
import { X, Save, Loader2, Star, User, Briefcase, Building2, MessageSquare, Image as ImageIcon } from 'lucide-react';

interface TestimonialFormProps {
  testimonial?: Omit<Testimonial, 'createdAt' | 'updatedAt'> & {
    createdAt?: string;
    updatedAt?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function TestimonialForm({
  testimonial,
  onClose,
  onSuccess,
}: TestimonialFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!testimonial;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: testimonial?.name || '',
      role: testimonial?.role || '',
      company: testimonial?.company || '',
      content: testimonial?.content || '',
      avatar: testimonial?.avatar || '',
      rating: testimonial?.rating ?? 5,
      order: testimonial?.order ?? 0,
      published: testimonial?.published ?? true,
    },
  });

  const rating = watch('rating');

  const onSubmit = async (data: TestimonialInput) => {
    setIsSaving(true);

    const submitData = {
      ...data,
      rating: data.rating ?? 5,
      order: data.order ?? 0,
      published: data.published ?? true,
    };

    const result = isEditing
      ? await updateTestimonial(testimonial!.id, submitData)
      : await createTestimonial(submitData);

    setIsSaving(false);

    if (result.success) {
      toast.success(
        isEditing ? 'Testimonial updated!' : 'Testimonial created!'
      );
      onSuccess();
      onClose();
    } else {
      toast.error(result.error || 'Failed to save testimonial');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass w-full max-w-2xl rounded-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 glass border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold neon-text">
            {isEditing ? 'Edit Testimonial' : 'New Testimonial'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Client Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Client Information</h3>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  {...register('name')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  {...register('role')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="CEO"
                />
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Company <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  {...register('company')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="Acme Inc"
                />
              </div>
              {errors.company && (
                <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>
              )}
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium mb-2">Avatar URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="url"
                  {...register('avatar')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              {errors.avatar && (
                <p className="mt-1 text-sm text-red-500">{errors.avatar.message}</p>
              )}
              <p className="mt-1 text-xs text-white/40">
                Optional. Leave empty to show initials.
              </p>
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Testimonial</h3>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                <textarea
                  {...register('content')}
                  rows={5}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none resize-none"
                  placeholder="Share your experience working with us..."
                />
              </div>
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue('rating', star)}
                    className="transition hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (rating ?? 5)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-white/20'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-white/60">{rating ?? 5}/5</span>
              </div>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                {...register('order', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                placeholder="0"
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-500">{errors.order.message}</p>
              )}
              <p className="mt-1 text-xs text-white/40">
                Lower numbers appear first. You can also drag & drop to reorder.
              </p>
            </div>

            {/* Published */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h4 className="font-medium mb-1">Published</h4>
                <p className="text-sm text-white/60">
                  Make this testimonial visible on the website
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('published')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
