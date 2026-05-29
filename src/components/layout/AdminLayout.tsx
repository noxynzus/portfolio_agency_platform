'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Folder,
  FileText,
  Mail,
  DollarSign,
  MessageSquare,
  Settings,
  LogOut,
  Server,
  Newspaper,
} from 'lucide-react';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
  };
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: Folder,
  },
  {
    name: 'Services',
    href: '/dashboard/services',
    icon: Server,
  },
  {
    name: 'Pricing',
    href: '/dashboard/pricing',
    icon: DollarSign,
  },
  {
    name: 'Blog Posts',
    href: '/dashboard/blog',
    icon: Newspaper,
  },
  {
    name: 'Leads',
    href: '/dashboard/leads',
    icon: Mail,
    badge: 'NEW',
  },
  {
    name: 'Testimonials',
    href: '/dashboard/testimonials',
    icon: MessageSquare,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-cyber-black">
      <div className="bg-grid fixed inset-0 opacity-10" />

      <div className="relative flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen glass border-r border-white/10 sticky top-0 flex flex-col">
          <div className="p-6 border-b border-white/10">
            <Link href="/dashboard" className="block">
              <h2 className="text-xl font-bold neon-text">{`Atthawat 'Aui`}</h2>
              <p className="text-sm text-white/40">Admin Panel</p>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                    active
                      ? 'bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan'
                      : 'hover:bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="mb-4 px-4">
              <p className="text-xs text-white/40 mb-1">Logged in as</p>
              <p className="text-sm text-white/80 font-medium truncate">
                {user.name || user.email}
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
