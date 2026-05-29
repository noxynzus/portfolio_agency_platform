'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { siteSettingsSchema, type SiteSettingsInput } from '@/lib/validations/settings';
import { getSiteSettings, updateSiteSettings } from '@/lib/actions/settings';
import { toast } from 'sonner';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Globe,
  FileText,
  Image,
  Power,
  Save,
  Loader2,
} from 'lucide-react';
import AdminHeader from '@/components/layout/AdminHeader';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
  });

  // Watch maintenanceMode value in real-time
  const maintenanceMode = watch('maintenanceMode');

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const result = await getSiteSettings();

      if (result.success && result.data) {
        reset({
          email: result.data.email,
          phone: result.data.phone || '',
          address: result.data.address || '',
          facebook: result.data.facebook || '',
          twitter: result.data.twitter || '',
          linkedin: result.data.linkedin || '',
          github: result.data.github || '',
          instagram: result.data.instagram || '',
          siteName: result.data.siteName,
          siteDescription: result.data.siteDescription,
          siteUrl: result.data.siteUrl,
          ogImage: result.data.ogImage || '',
          maintenanceMode: result.data.maintenanceMode,
        });
      } else {
        toast.error('Failed to load settings');
      }

      setIsLoading(false);
    }

    loadSettings();
  }, [reset]);

  // Handle form submission
  const onSubmit = async (data: SiteSettingsInput) => {
    setIsSaving(true);

    const result = await updateSiteSettings(data);

    if (result.success) {
      toast.success('Settings saved successfully!');
      reset(data); // Reset form dirty state
    } else {
      toast.error(result.error || 'Failed to save settings');
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <AdminHeader title="Settings" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AdminHeader title="Site Settings" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8">
        {/* Contact Information */}
        <div className="glass p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-500" />
            Contact Information
          </h2>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="hello@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="+66 12 345 6789"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                <textarea
                  {...register('address')}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none resize-none"
                  placeholder="123 Main St, Bangkok, Thailand"
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="glass p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-500" />
            Social Media Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium mb-2">Facebook</label>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="url"
                  {...register('facebook')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              {errors.facebook && (
                <p className="mt-1 text-sm text-red-500">{errors.facebook.message}</p>
              )}
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-sm font-medium mb-2">Twitter</label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="url"
                  {...register('twitter')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              {errors.twitter && (
                <p className="mt-1 text-sm text-red-500">{errors.twitter.message}</p>
              )}
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="url"
                  {...register('linkedin')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              {errors.linkedin && (
                <p className="mt-1 text-sm text-red-500">{errors.linkedin.message}</p>
              )}
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="url"
                  {...register('github')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="https://github.com/yourorg"
                />
              </div>
              {errors.github && (
                <p className="mt-1 text-sm text-red-500">{errors.github.message}</p>
              )}
            </div>

            {/* Instagram */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="url"
                  {...register('instagram')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
              {errors.instagram && (
                <p className="mt-1 text-sm text-red-500">{errors.instagram.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="glass p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            SEO Settings
          </h2>

          <div className="space-y-4">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Site Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('siteName')}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                placeholder="TechForge"
              />
              {errors.siteName && (
                <p className="mt-1 text-sm text-red-500">{errors.siteName.message}</p>
              )}
            </div>

            {/* Site Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Site Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('siteDescription')}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none resize-none"
                placeholder="Modern Digital Engineering Studio"
              />
              {errors.siteDescription && (
                <p className="mt-1 text-sm text-red-500">{errors.siteDescription.message}</p>
              )}
            </div>

            {/* Site URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Site URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="url"
                  {...register('siteUrl')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="https://techforge.dev"
                />
              </div>
              {errors.siteUrl && (
                <p className="mt-1 text-sm text-red-500">{errors.siteUrl.message}</p>
              )}
            </div>

            {/* OG Image */}
            <div>
              <label className="block text-sm font-medium mb-2">
                OG Image URL (Social Preview)
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"  />
                <input
                  type="url"
                  {...register('ogImage')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                  placeholder="https://example.com/og-image.png"
                />
              </div>
              {errors.ogImage && (
                <p className="mt-1 text-sm text-red-500">{errors.ogImage.message}</p>
              )}
              <p className="mt-1 text-xs text-white/40">
                Recommended: 1200x630px (for social media previews)
              </p>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="glass p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Power className="w-5 h-5 text-red-500" />
            System Settings
          </h2>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h3 className="font-medium mb-1">Maintenance Mode</h3>
              <p className="text-sm text-white/60">
                Temporarily disable public access to the website
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('maintenanceMode')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          {maintenanceMode && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">
                ⚠️ Maintenance mode is currently <strong>ACTIVE</strong>. Public visitors
                will see a maintenance page.
              </p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4 sticky bottom-8">
          <button
            type="submit"
            disabled={isSaving || !isDirty}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
