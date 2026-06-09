'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function useWhenAuthed(effect: () => void | Promise<void>) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;
    void effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);
}
