import { requireAdmin } from '@/lib/auth';
import AdminLayout from '@/components/layout/AdminLayout';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Admin Dashboard - UI/UX Pro Max',
  description: 'Admin panel for managing content and settings',
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
