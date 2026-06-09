'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FolderGit2, Plus, Search, MoreVertical, Edit2, Trash2, Eye, ExternalLink, Star } from 'lucide-react';
import { getProjects, deleteProject, updateProject } from '@/lib/firebase/firestore';
import { useWhenAuthed } from '@/hooks/useWhenAuthed';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { Project } from '@/types';

export default function AdminProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useWhenAuthed(() => {
    void loadProjects();
  });

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Projeler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`"${title}" projesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      try {
        await deleteProject(id);
        toast.success('Proje silindi.');
        setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
        toast.error('Proje silinirken hata oluştu.');
      }
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await updateProject(id, { published: !currentStatus });
      toast.success(currentStatus ? 'Proje yayından kaldırıldı.' : 'Proje yayınlandı.');
      setProjects(projects.map(p => p.id === id ? { ...p, published: !currentStatus } : p));
    } catch (error) {
      toast.error('Durum güncellenirken hata oluştu.');
    }
  };

  const toggleFeature = async (id: string, currentFeature: boolean) => {
    try {
      await updateProject(id, { featured: !currentFeature });
      toast.success(currentFeature ? 'Öne çıkanlardan kaldırıldı.' : 'Öne çıkanlara eklendi.');
      setProjects(projects.map(p => p.id === id ? { ...p, featured: !currentFeature } : p));
    } catch (error) {
      toast.error('Durum güncellenirken hata oluştu.');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Projeler</h1>
          <p className="text-[#A1A1AA] text-sm">Portföyünüzdeki tüm projeleri yönetin.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Proje
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#111111] p-4 rounded-xl border border-[#222222]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Proje ara..."
            className="w-full bg-[#161616] border border-[#333333] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
        </div>
      </div>

      {/* Table/List */}
      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#A1A1AA]">Yükleniyor...</div>
        ) : filteredProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#A1A1AA]">
              <thead className="bg-[#161616] border-b border-[#222222] text-[#52525B] uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Proje Adı</th>
                  <th className="px-6 py-4 font-medium">Kategori</th>
                  <th className="px-6 py-4 font-medium">Durum</th>
                  <th className="px-6 py-4 font-medium">Öne Çıkan</th>
                  <th className="px-6 py-4 font-medium">Tarih</th>
                  <th className="px-6 py-4 font-medium text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {filteredProjects.map((project) => (
                  <motion.tr key={project.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-[#161616] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#1a1a1a] flex items-center justify-center overflow-hidden flex-shrink-0 border border-[#333333]">
                          {project.coverImage ? (
                            <img src={project.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FolderGit2 className="w-5 h-5 text-[#52525B]" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{project.title}</p>
                          <p className="text-xs text-[#52525B]">v{project.version}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-[#222222] text-[#A1A1AA] rounded text-xs">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(project.id, project.published)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors ${
                          project.published ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                        }`}
                      >
                        {project.published ? 'Yayında' : 'Taslak'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFeature(project.id, project.featured)}
                        className={`p-1.5 rounded transition-colors ${
                          project.featured ? 'text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20' : 'text-[#52525B] hover:text-white hover:bg-[#222222]'
                        }`}
                        title={project.featured ? "Öne çıkandan kaldır" : "Öne çıkar"}
                      >
                        <Star className={`w-4 h-4 ${project.featured ? 'fill-yellow-500' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/project/${project.slug}`}
                          target="_blank"
                          className="p-1.5 text-[#52525B] hover:text-white transition-colors rounded hover:bg-[#222222]"
                          title="Görüntüle"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-1.5 text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-colors rounded"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 transition-colors rounded"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-[#222222] m-6 rounded-xl">
            <FolderGit2 className="w-12 h-12 text-[#52525B] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Proje Bulunamadı</h3>
            <p className="text-[#A1A1AA] mb-4">Arama kriterlerine uygun proje yok veya henüz hiç proje eklenmedi.</p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              İlk Projeni Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
