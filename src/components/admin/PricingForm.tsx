'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { pricingSchema, type PricingFormData } from '@/lib/validations/pricing';
import {
  createPricingPlan,
  updatePricingPlan,
} from '@/lib/actions/pricing';
import type { PricingPlan } from '@prisma/client';

interface PricingFormProps {
  initialData?: Omit<PricingPlan, 'createdAt' | 'updatedAt'> & { 
    id: string;
    createdAt?: string;
    updatedAt?: string;
  };
  mode: 'create' | 'edit';
}

export function PricingForm({ initialData, mode }: PricingFormProps) {
  const router = useRouter();
  const [features, setFeatures] = useState<string[]>(
    initialData?.features || []
  );
  const [featureInput, setFeatureInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PricingFormData>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      price: initialData?.price || '',
      period: (initialData?.period as "project" | "month" | "year") || 'project',
      features: initialData?.features || [],
      recommended: initialData?.recommended ?? false,
      order: initialData?.order || 0,
      published: initialData?.published ?? true,
    },
  });

  // Optimize: batch watch calls
  const watchName = watch('name');

  // Auto-generate slug from name
  useEffect(() => {
    if (mode === 'create' && watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', slug);
    }
  }, [watchName, mode, setValue]);

  // Sync features with form
  useEffect(() => {
    setValue('features', features);
  }, [features, setValue]);

  const addFeature = () => {
    if (featureInput.trim() && features.length < 20) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PricingFormData) => {
    startTransition(async () => {
      // Handle default values for optional fields
      const submitData = {
        ...data,
        features,
        period: data.period || 'project',
        recommended: data.recommended ?? false,
        order: data.order ?? 0,
        published: data.published ?? true,
      };

      const result = mode === 'create'
        ? await createPricingPlan(submitData)
        : await updatePricingPlan(initialData?.id!, submitData);

      if (result?.success) {
        toast.success(
          mode === 'create' ? 'Pricing plan created!' : 'Pricing plan updated!'
        );
        router.push('/dashboard/pricing');
        router.refresh();
      } else {
        toast.error(result?.error || 'Something went wrong');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Plan Name <span className="text-red-400">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-4 py-2 bg-cyber-dark/50 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#00F5FF]/50"
          placeholder="e.g. Starter Plan"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Slug <span className="text-red-400">*</span>
        </label>
        <input
          {...register('slug')}
          type="text"
          className="w-full px-4 py-2 bg-cyber-dark/50 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#00F5FF]/50"
          placeholder="e.g. starter-plan"
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 bg-cyber-dark/50 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#00F5FF]/50 resize-none"
          placeholder="Brief description of the plan..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price & Period */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Price <span className="text-red-400">*</span>
          </label>
          <input
            {...register('price')}
            type="text"
            className="w-full px-4 py-2 bg-cyber-dark/50 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#00F5FF]/50"
            placeholder="e.g. 15,000 or Custom"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-400">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Period <span className="text-red-400">*</span>
          </label>
          <select
            {...register('period')}
            className="w-full px-4 py-2 bg-cyber-dark/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00F5FF]/50"
          >
            <option value="project">Per Project</option>
            <option value="month">Per Month</option>
            <option value="year">Per Year</option>
          </select>
          {errors.period && (
            <p className="mt-1 text-sm text-red-400">{errors.period.message}</p>
          )}
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Features <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addFeature();
              }
            }}
            className="flex-1 px-4 py-2 bg-cyber-dark/50 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#00F5FF]/50"
            placeholder="Add a feature..."
            disabled={features.length >= 20}
          />
          <button
            type="button"
            onClick={addFeature}
            disabled={!featureInput.trim() || features.length >= 20}
            className="px-4 py-2 bg-[#00F5FF]/20 hover:bg-[#00F5FF]/30 border border-[#00F5FF]/30 rounded-lg text-[#00F5FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-cyber-dark/50 border border-white/10 rounded-lg"
              >
                <span className="text-sm text-white/80">{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-white/50 hover:text-red-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {errors.features && (
          <p className="mt-1 text-sm text-red-400">{errors.features.message}</p>
        )}
        <p className="mt-1 text-xs text-white/50">
          {features.length}/20 features
        </p>
      </div>

      {/* Order */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Display Order
        </label>
        <input
          {...register('order', { valueAsNumber: true })}
          type="number"
          min="0"
          className="w-full px-4 py-2 bg-cyber-dark/50 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#00F5FF]/50"
          placeholder="0"
        />
        {errors.order && (
          <p className="mt-1 text-sm text-red-400">{errors.order.message}</p>
        )}
      </div>

      {/* Recommended & Published */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            {...register('recommended')}
            type="checkbox"
            id="recommended"
            className="w-5 h-5 rounded border-white/10 bg-cyber-dark/50 text-[#00F5FF] focus:ring-[#00F5FF]/30"
          />
          <label htmlFor="recommended" className="text-sm text-white/80">
            Mark as recommended plan
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            {...register('published')}
            type="checkbox"
            id="published"
            className="w-5 h-5 rounded border-white/10 bg-cyber-dark/50 text-[#00F5FF] focus:ring-[#00F5FF]/30"
          />
          <label htmlFor="published" className="text-sm text-white/80">
            Publish immediately
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 bg-cyber-dark/50 hover:bg-cyber-dark/70 border border-white/10 rounded-lg text-white transition-colors"
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6] hover:opacity-90 rounded-lg text-white font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="h-5 w-5 animate-spin" />}
          {mode === 'create' ? 'Create Plan' : 'Update Plan'}
        </button>
      </div>
    </form>
  );
}
