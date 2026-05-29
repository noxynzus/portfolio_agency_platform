import AdminHeader from '@/components/layout/AdminHeader';
import { PricingForm } from '@/components/admin/PricingForm';

export const metadata = {
  title: 'New Pricing Plan - Admin Dashboard',
};

export default function NewPricingPage() {
  return (
    <>
      <AdminHeader
        title="Create Pricing Plan"
        description="Add a new pricing option"
        showBack
      />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-xl p-8">
            <PricingForm mode="create" />
          </div>
        </div>
      </div>
    </>
  );
}
