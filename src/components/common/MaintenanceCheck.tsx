'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function MaintenanceCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    async function checkMaintenance() {
      // Skip check for admin users
      if (session?.user?.role === 'ADMIN') {
        setIsChecking(false);
        return;
      }
      
      // Skip check if already on maintenance page
      if (pathname === '/maintenance') {
        setIsChecking(false);
        return;
      }
      
      // Skip check for auth pages
      if (pathname === '/login' || pathname?.startsWith('/api/')) {
        setIsChecking(false);
        return;
      }
      
      try {
        const response = await fetch('/api/maintenance-status', {
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.maintenanceMode === true) {
            // Redirect to maintenance page
            router.push('/maintenance');
            return;
          }
        }
      } catch (error) {
        console.error('Failed to check maintenance status:', error);
      } finally {
        setIsChecking(false);
      }
    }
    
    // Only check after session is loaded
    if (status !== 'loading') {
      checkMaintenance();
    }
  }, [session, status, pathname, router]);
  
  // Don't render anything, this is just a checker
  return null;
}
