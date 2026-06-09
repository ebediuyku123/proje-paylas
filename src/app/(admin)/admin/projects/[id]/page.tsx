'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import { getProjectById } from '@/lib/firebase/firestore';
import { useWhenAuthed } from '@/hooks/useWhenAuthed';
import type { Project } from '@/types';

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useWhenAuthed(async () => {
    try {
      const data = await getProjectById(params.id);
      if (!data) {
        setMissing(true);
      } else {
        setProject(data);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      setMissing(true);
    } finally {
      setLoading(false);
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  if (missing || !project) {
    notFound();
  }

  return <ProjectForm initialData={project} />;
}
