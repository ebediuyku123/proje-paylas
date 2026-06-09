'use client';

import { useEffect, useRef } from 'react';
import { recordAnalyticsEvent } from '@/lib/firebase/firestore';

export default function ClientAnalytics({ 
  type, 
  projectId, 
  projectTitle 
}: { 
  type: 'view' | 'download', 
  projectId?: string, 
  projectTitle?: string 
}) {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;

    recordAnalyticsEvent({
      type,
      projectId: projectId || 'home',
      projectTitle: projectTitle || 'Ana Sayfa'
    }).catch(console.error);
  }, [type, projectId, projectTitle]);
  
  return null;
}
