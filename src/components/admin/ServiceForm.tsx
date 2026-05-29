'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { serviceSchema, type ServiceFormData } from '@/lib/validations/service';
import { createService, updateService } from '@/lib/actions/services';
import { IconSelector } from './IconSelector';
import type { Service } from '@prisma/client';

interface ServiceFormProps {
  initialData?: Omit<Service, 'createdAt' | 'updatedAt'> & { 
    id: string;
    createdAt?: string;
    updatedAt?: string;
  };
  mode: 'create' | 'edit';
}

export function ServiceForm({ initialData, mode }: ServiceFormProps) {
  const router = useRouter();
  const [features, setFeatures] = useState<string[]>(
    initialData?.features || []
  );
  const [featureInput, setFeatureInput] = useState('');
  const [ispending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      iconName: initialData?.iconName || '',
      variant: (initialData?.variant as 'cyan' | 'purple' | 'teal') || 'cyan',
      features: initialData?.features || [],
      order: initialData?.order ?? 0,
      published: initialData?.published ?? true,
    },
  });

  const { title: watchTitle, iconName: watchIconName, variant: watchVariant } = watch();

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === 'create' && watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', slug);
    }
  }, [watchTitle, mode, setValue]);

  // Sync features with form
  useEffect(() => {
    setValue('features', features);
  }, [features, setValue]);

  const addFeature = () => {
    if (featureInput.trim() && features.length < 10) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ServiceFormData) => {
    startTransition(async () => {
      const submitData = {
        ...data,
        features,
        order: data.order ?? 0,
        published: data.published ?? true,
      };
      const result = mode === 'create'
        ? await createService(submitData)
        : await updateService(initialData!.id, submitData);
      if (result?.success) {
        toast.success(
          mode === 'create' ? 'Service created!' : 'Service updated!'
        );
        router.push('/dashboard/services');
        router.refresh();
      } else {
        toast.error(result?.error || 'Something went wrong');
      }
    });

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          {...register('title')}
          type="text"
          className="w-full px-4 py-2 bg-cyber-dark/50 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#00F5FF]/50"
          placeholder="e.g. Web Application Development"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
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
          placeholder="e.g. web-application"
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-2 bg-cyber-dark/50 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#00F5FF]/50 resize-none"
          placeholder="Brief description of the service..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Icon Selector */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Icon <span className="text-red-400">*</span>
        </label>
        <IconSelector
          value={watchIconName}
          onChange={(icon) => setValue('iconName', icon)}
          placeholder="Select an icon"
        />
        {errors.iconName && (
          <p className="mt-1 text-sm text-red-400">{errors.iconName.message}</p>
        )}
      </div>

      {/* Variant */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Color Variant <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-3">
          {['cyan', 'purple', 'teal'].map((variant) => (
            <label
              key={variant}
              className={`flex-1 cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${
                watchVariant === variant
                  ? variant === 'cyan'
                    ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                    : variant === 'purple'
                    ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                    : 'border-[#06B6D4] bg-[#06B6D4]/10'
                  : 'border-white/10 bg-cyber-dark/30 hover:bg-cyber-dark/50'
              }`}
            >
              <input
                {...register('variant')}
                type="radio"
                value={variant}
                className="sr-only"
              />
              <div
                className={`h-8 w-8 rounded-full mx-auto mb-2 ${
                  variant === 'cyan'
                    ? 'bg-[#00F5FF]'
                    : variant === 'purple'
                    ? 'bg-[#8B5CF6]'
                    : 'bg-[#06B6D4]'
                }`}
              />
              <span className="text-sm capitalize text-white/70">
                {variant}
              </span>
            </label>
          ))}
        </div>
        {errors.variant && (
          <p className="mt-1 text-sm text-red-400">{errors.variant.message}</p>
        )}
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
            disabled={features.length >= 10}
          />
          <button
            type="button"
            onClick={addFeature}
            disabled={!featureInput.trim() || features.length >= 10}
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
          {features.length}/10 features
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

      {/* Published */}
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

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 bg-cyber-dark/50 hover:bg-cyber-dark/70 border border-white/10 rounded-lg text-white transition-colors"
          disabled={ispending}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={ispending}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6] hover:opacity-90 rounded-lg text-white font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {ispending && <Loader2 className="h-5 w-5 animate-spin" />}
          {mode === 'create' ? 'Create Service' : 'Update Service'}
        </button>
      </div>
    </form>
  );
}
