'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, Download, Star, Calendar } from 'lucide-react';
import { GithubIcon } from '@/components/shared/BrandIcons';
import { cn, formatNumber, formatDate, truncate } from '@/lib/utils';
import TechBadge from '@/components/shared/TechBadge';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
  featured?: boolean;
}

export default function ProjectCard({ project, index = 0, featured = false }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/project/${project.slug}`} className="group block">
        <article
          className={cn(
            'relative bg-[#111111] border border-[#222222] rounded-xl overflow-hidden card-hover',
            featured && 'border-[#3B82F6]/30 shadow-[0_0_30px_rgba(59,130,246,0.08)]'
          )}
        >
          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-[#3B82F6] rounded-full text-white text-xs font-semibold shadow-lg">
              <Star className="w-3 h-3 fill-white" />
              Öne Çıkan
            </div>
          )}

          {/* Cover image */}
          <div className="relative h-48 bg-[#161616] overflow-hidden">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center grid-pattern">
                <div className="w-12 h-12 bg-[#3B82F6]/20 rounded-xl flex items-center justify-center">
                  <GithubIcon className="w-6 h-6 text-[#3B82F6]" />
                </div>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Category */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#3B82F6] font-medium uppercase tracking-wider">
                {project.category}
              </span>
              <div className="flex items-center gap-1 text-[#52525B] text-xs">
                <Calendar className="w-3 h-3" />
                {formatDate(project.releaseDate || project.createdAt)}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold text-base mb-2 group-hover:text-[#3B82F6] transition-colors duration-200 leading-tight">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4 line-clamp-2">
              {truncate(project.shortDescription, 120)}
            </p>

            {/* Tech badges */}
            {project.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.slice(0, 3).map((tech) => (
                  <TechBadge key={tech} name={tech} size="sm" />
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-0.5 text-xs text-[#52525B] bg-[#161616] border border-[#222222] rounded-full">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 pt-3 border-t border-[#1a1a1a]">
              <div className="flex items-center gap-1.5 text-[#52525B] text-xs">
                <Eye className="w-3.5 h-3.5" />
                <span>{formatNumber(project.viewCount ?? 0)} görüntüleme</span>
              </div>
              {project.zipFile && (
                <div className="flex items-center gap-1.5 text-[#52525B] text-xs">
                  <Download className="w-3.5 h-3.5" />
                  <span>{formatNumber(project.downloadCount ?? 0)} indirme</span>
                </div>
              )}
              {project.githubUrl && (
                <div className="ml-auto flex items-center gap-1 text-[#A1A1AA] group-hover:text-white transition-colors text-xs">
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </div>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
