'use client';

import { motion } from 'framer-motion';
import { FolderGit2, Download, Eye, TerminalSquare } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface StatsSectionProps {
  stats: {
    totalProjects: number;
    totalDownloads: number;
    totalViews: number;
  };
  linesOfCode?: string;
}

export default function StatsSection({ stats, linesOfCode }: StatsSectionProps) {
  const statItems = [
    {
      label: 'Toplam Proje',
      value: stats.totalProjects,
      icon: FolderGit2,
      color: '#3B82F6',
    },
    {
      label: 'Toplam İndirme',
      value: stats.totalDownloads,
      icon: Download,
      color: '#10B981',
    },
    {
      label: 'Görüntülenme',
      value: stats.totalViews,
      icon: Eye,
      color: '#8B5CF6',
    },
    ...(linesOfCode
      ? [{
          label: 'Satır Kod',
          value: linesOfCode,
          icon: TerminalSquare,
          color: '#F59E0B',
        }]
      : []),
  ];

  return (
    <section className="py-20 px-4 border-y border-[#222222] bg-[#0A0A0A] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-[#3B82F6]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`grid grid-cols-2 gap-8 md:gap-12 ${statItems.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          {statItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${item.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {typeof item.value === 'number' ? formatNumber(item.value) : item.value}
                </h3>
                <p className="text-[#A1A1AA] text-sm font-medium">{item.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
