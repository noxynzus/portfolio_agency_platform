'use client';

import { SessionProvider } from 'next-auth/react';
import MaintenanceCheck from '@/components/common/MaintenanceCheck';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MaintenanceCheck />
      {children}
    </SessionProvider>
  );
}
