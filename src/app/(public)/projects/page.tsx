'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjects } from '@/lib/firebase/firestore';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFiltersComponent from '@/components/projects/ProjectFilters';
import { SkeletonProjectGrid } from '@/components/shared/SkeletonCard';
import { FolderGit2 } from 'lucide-react';
import type { Project, ProjectFilters } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    category: '',
    technology: '',
    sort: 'newest',
  });

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects({ published: true });
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    // Technology
    if (filters.technology) {
      result = result.filter((p) => p.technologies?.includes(filters.technology));
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'most-viewed':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'most-downloaded':
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [projects, filters]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Projeler</h1>
          <p className="text-[#A1A1AA] text-lg max-w-2xl">
            Tüm çalışmalarımı, açık kaynak projelerimi ve denemelerimi burada bulabilirsiniz.
            Filtreleri kullanarak ilgilendiğiniz teknolojilere göre arama yapabilirsiniz.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ProjectFiltersComponent
            filters={filters}
            onChange={setFilters}
            totalCount={filteredProjects.length}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <SkeletonProjectGrid count={6} />
        ) : filteredProjects.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#222222] rounded-2xl bg-[#111111]/50"
          >
            <div className="w-16 h-16 bg-[#161616] rounded-full flex items-center justify-center mb-4">
              <FolderGit2 className="w-8 h-8 text-[#52525B]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Proje Bulunamadı</h3>
            <p className="text-[#A1A1AA]">
              Seçtiğiniz filtrelere uygun proje bulunmuyor. Farklı filtreler denemeyi veya
              arama teriminizi değiştirmeyi deneyin.
            </p>
            <button
              onClick={() => setFilters({ search: '', category: '', technology: '', sort: 'newest' })}
              className="mt-6 px-6 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors"
            >
              Filtreleri Temizle
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
