'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FolderGit2, Download, Eye, Plus, Star, FileText } from 'lucide-react';
import { getDashboardStats, getProjects } from '@/lib/firebase/firestore';
import { useWhenAuthed } from '@/hooks/useWhenAuthed';
import { formatNumber, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { Project, DashboardStats as StatsType } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useWhenAuthed(async () => {
    try {
      const [statsData, projectsData] = await Promise.all([
        getDashboardStats({ includeDrafts: true }),
        getProjects({ limitCount: 5 }),
      ]);
      setStats(statsData);
      setRecentProjects(projectsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Dashboard verileri yüklenemedi.');
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

  const statCards = [
    { label: 'Toplam Proje', value: stats?.totalProjects || 0, icon: FolderGit2, color: 'text-blue-500' },
    { label: 'Yayında', value: stats?.publishedProjects || 0, icon: FileText, color: 'text-green-500' },
    { label: 'Taslak', value: stats?.draftProjects || 0, icon: FileText, color: 'text-yellow-500' },
    { label: 'Öne Çıkan', value: stats?.featuredProjects || 0, icon: Star, color: 'text-purple-500' },
    { label: 'Toplam Görüntülenme', value: formatNumber(stats?.totalViews || 0), icon: Eye, color: 'text-blue-400' },
    { label: 'Toplam İndirme', value: formatNumber(stats?.totalDownloads || 0), icon: Download, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-[#A1A1AA] text-sm">Portföy platformunuzun genel durumu.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Proje Ekle
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#111111] border border-[#222222] rounded-xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#161616] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[#A1A1AA] text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#222222] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Son Eklenen Projeler</h2>
          <Link href="/admin/projects" className="text-sm text-[#3B82F6] hover:text-[#2563EB] transition-colors">
            Tümünü Gör
          </Link>
        </div>
        <div className="divide-y divide-[#222222]">
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => (
              <div key={project.id} className="p-6 flex items-center justify-between hover:bg-[#161616] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg border border-[#333333] flex items-center justify-center">
                    {project.coverImage ? (
                      <img src={project.coverImage} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <FolderGit2 className="w-6 h-6 text-[#52525B]" />
                    )}
                  </div>
                  <div>
                    <Link href={`/admin/projects/${project.id}`} className="font-medium text-white hover:text-[#3B82F6] transition-colors">
                      {project.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${project.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {project.published ? 'Yayında' : 'Taslak'}
                      </span>
                      <span className="text-[#52525B] text-xs">{formatDate(project.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#A1A1AA] hidden sm:flex">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {formatNumber(project.viewCount)}</span>
                  <span className="flex items-center gap-1"><Download className="w-4 h-4" /> {formatNumber(project.downloadCount)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#A1A1AA]">
              Henüz proje eklenmemiş.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
