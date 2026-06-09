'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import ProjectCard from '@/components/projects/ProjectCard';
import type { Project } from '@/types';

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-[#3B82F6] text-sm font-medium mb-2"
            >
              <Star className="w-4 h-4 fill-[#3B82F6]" />
              Öne Çıkan Projeler
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-white"
            >
              Seçilmiş Çalışmalar
            </motion.h2>
          </div>
          <Link
            href="/projects"
            className="hidden sm:flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors group"
          >
            Tümünü gör
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} featured />
          ))}
        </div>

        {/* Mobile: see all */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors"
          >
            Tüm projeleri gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
