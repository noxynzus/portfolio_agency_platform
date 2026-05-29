import AdminHeader from '@/components/layout/AdminHeader';
import { ServiceForm } from '@/components/admin/ServiceForm';

export const metadata = {
  title: 'New Service - Admin Dashboard',
};

export default function NewServicePage() {
  return (
    <>
      <AdminHeader
        title="Create Service"
        description="Add a new service offering"
        showBack
      />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-xl p-8">
            <ServiceForm mode="create" />
          </div>
        </div>
      </div>
    </>
  );
}
