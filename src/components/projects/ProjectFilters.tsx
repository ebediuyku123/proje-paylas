'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, SORT_OPTIONS, TECHNOLOGIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ProjectFilters, SortOption } from '@/types';

interface ProjectFiltersProps {
  filters: ProjectFilters;
  onChange: (filters: ProjectFilters) => void;
  totalCount: number;
}

export default function ProjectFiltersComponent({ filters, onChange, totalCount }: ProjectFiltersProps) {
  const [showTechFilter, setShowTechFilter] = useState(false);

  const handleSearch = (value: string) => onChange({ ...filters, search: value });
  const handleCategory = (cat: string) => onChange({ ...filters, category: cat === filters.category ? '' : cat });
  const handleTech = (tech: string) => onChange({ ...filters, technology: tech === filters.technology ? '' : tech });
  const handleSort = (sort: SortOption) => onChange({ ...filters, sort });

  const hasActiveFilters = filters.search || filters.category || filters.technology;

  const clearAll = () => onChange({ search: '', category: '', technology: '', sort: 'newest' });

  return (
    <div className="space-y-4">
      {/* Search & sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
          <input
            id="project-search"
            type="text"
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Proje ara..."
            className="w-full bg-[#111111] border border-[#222222] text-white placeholder-[#52525B] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          id="project-sort"
          value={filters.sort}
          onChange={(e) => handleSort(e.target.value as SortOption)}
          className="bg-[#111111] border border-[#222222] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#3B82F6] transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#111111]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Tech filter toggle */}
        <button
          onClick={() => setShowTechFilter(!showTechFilter)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all',
            showTechFilter || filters.technology
              ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40 text-[#3B82F6]'
              : 'bg-[#111111] border-[#222222] text-[#A1A1AA] hover:text-white hover:border-[#333333]'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Teknoloji
          {filters.technology && (
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          )}
        </button>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategory('')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
            !filters.category
              ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
              : 'bg-transparent border-[#222222] text-[#A1A1AA] hover:border-[#333333] hover:text-white'
          )}
        >
          Tümü
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
              filters.category === cat.id
                ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
                : 'bg-transparent border-[#222222] text-[#A1A1AA] hover:border-[#333333] hover:text-white'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Technology filter panel */}
      {showTechFilter && (
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-4">
          <p className="text-[#A1A1AA] text-xs font-medium mb-3 uppercase tracking-wider">Teknolojiye Göre Filtrele</p>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {TECHNOLOGIES.map((tech) => (
              <button
                key={tech}
                onClick={() => handleTech(tech)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs border transition-all duration-200',
                  filters.technology === tech
                    ? 'bg-[#3B82F6]/20 border-[#3B82F6]/50 text-[#3B82F6]'
                    : 'bg-transparent border-[#222222] text-[#A1A1AA] hover:border-[#333333] hover:text-white'
                )}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results + clear */}
      <div className="flex items-center justify-between">
        <p className="text-[#52525B] text-sm">
          <span className="text-white font-medium">{totalCount}</span> proje bulundu
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Filtreleri temizle
          </button>
        )}
      </div>
    </div>
  );
}
