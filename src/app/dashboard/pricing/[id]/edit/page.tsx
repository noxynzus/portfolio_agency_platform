import { notFound } from 'next/navigation';
import AdminHeader from '@/components/layout/AdminHeader';
import { getPricingPlanById } from '@/lib/actions/pricing';
import { PricingForm } from '@/components/admin/PricingForm';

export const metadata = {
  title: 'Edit Pricing Plan - Admin Dashboard',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPricingPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getPricingPlanById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  // Serialize dates for client component
  const serializedData = {
    ...result.data,
    createdAt: result.data.createdAt.toISOString(),
    updatedAt: result.data.updatedAt.toISOString(),
  };

  return (
    <>
      <AdminHeader
        title="Edit Pricing Plan"
        description={result.data.name}
        showBack
      />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-xl p-8">
            <PricingForm initialData={serializedData} mode="edit" />
          </div>
        </div>
      </div>
    </>
  );
}
