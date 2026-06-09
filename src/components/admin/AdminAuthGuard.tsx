'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdminUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // Extra buffer: wait at least 500ms before redirecting, in case Firebase
  // auth state takes a moment to hydrate after a hard navigation.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading || !ready) return;
    if (!user || !isAdminUser) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [user, loading, isAdminUser, router, pathname, ready]);

  // Show spinner while Firebase auth state is loading or within buffer window
  if (loading || !ready) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  // Not authed — redirect is in flight, render nothing
  if (!user || !isAdminUser) return null;

  return <>{children}</>;
}
