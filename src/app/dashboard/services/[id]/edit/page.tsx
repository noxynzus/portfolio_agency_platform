import { notFound } from 'next/navigation';
import AdminHeader from '@/components/layout/AdminHeader';
import { getServiceById } from '@/lib/actions/services';
import { ServiceForm } from '@/components/admin/ServiceForm';

export const metadata = {
  title: 'Edit Service - Admin Dashboard',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  const result = await getServiceById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const service = result.data;
  
  const serializedData = {
    ...service,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  };

  return (
    <>
      <AdminHeader
        title="Edit Service"
        description={serializedData.title}
        showBack
      />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-xl p-8">
            <ServiceForm initialData={serializedData} mode="edit" />
          </div>
        </div>
      </div>
    </>
  );
}
