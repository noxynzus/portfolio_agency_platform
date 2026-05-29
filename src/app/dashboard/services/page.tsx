import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getServices } from '@/lib/actions/services';
import { ServicesTable } from '@/components/admin/ServicesTable';

export const metadata = {
  title: 'Services - Admin Dashboard',
};

export default async function ServicesPage() {
  const result = await getServices();

  if (!result.success) {
    return (
      <div className="p-8">
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-red-400">{result.error}</p>
        </div>
      </div>
    );
  }

  const services = result.data || [];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Services</h1>
            <p className="text-white/60 mt-1">
              Manage your service offerings
            </p>
          </div>
          <Link
            href="/dashboard/services/new"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6] hover:opacity-90 rounded-lg text-white font-medium transition-opacity"
          >
            <Plus className="h-5 w-5" />
            New Service
          </Link>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6">
          <p className="text-white/60 text-sm">Total Services</p>
          <p className="text-3xl font-bold text-white mt-2">
            {services.length}
          </p>
        </div>
        <div className="glass rounded-xl p-6">
          <p className="text-white/60 text-sm">Published</p>
          <p className="text-3xl font-bold text-green-400 mt-2">
            {services.filter((s) => s.published).length}
          </p>
        </div>
        <div className="glass rounded-xl p-6">
          <p className="text-white/60 text-sm">Drafts</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">
            {services.filter((s) => !s.published).length}
          </p>
        </div>
      </div>

        {/* Table */}
        <ServicesTable services={services} />
      </div>
    </div>
  );
}
