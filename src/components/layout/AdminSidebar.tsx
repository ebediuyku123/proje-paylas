'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Code2, Menu, X, Home } from 'lucide-react';
import { ADMIN_NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/firebase/auth';
import { toast } from 'sonner';
import { useState } from 'react';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard: require('lucide-react').LayoutDashboard,
  FolderOpen: require('lucide-react').FolderOpen,
  Image: require('lucide-react').Image,
  Settings: require('lucide-react').Settings,
  BarChart2: require('lucide-react').BarChart2,
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      toast.success('Çıkış yapıldı.');
      router.push('/');
    } catch (error) {
      toast.error('Çıkış yapılamadı.');
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111111] border-r border-[#222222] text-white w-64">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group mb-8">
          <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">ProjePaylaş</span>
        </Link>

        <nav className="space-y-1">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon = iconMap[link.icon];
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-[#A1A1AA] hover:bg-[#161616] hover:text-white'
                )}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#A1A1AA] hover:bg-[#161616] hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          Siteye Dön
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#111111] border-b border-[#222222]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">Admin</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-[#A1A1AA] hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-64 transform transition-transform duration-200">
            <SidebarContent />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-[-40px] p-2 text-white bg-[#111111] rounded-r-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-50">
        <SidebarContent />
      </div>
    </>
  );
}
