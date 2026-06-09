'use client';

import { useState } from 'react';
import { BarChart2, Eye, Download, TrendingUp } from 'lucide-react';
import { getAnalyticsEvents, getDashboardStats } from '@/lib/firebase/firestore';
import { useWhenAuthed } from '@/hooks/useWhenAuthed';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { AnalyticsEvent, DashboardStats } from '@/types';

export default function AnalyticsPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useWhenAuthed(async () => {
    try {
      const [eventsData, statsData] = await Promise.all([
        getAnalyticsEvents(50),
        getDashboardStats({ includeDrafts: true }),
      ]);
      setEvents(eventsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load analytics', error);
      toast.error('Analitik verileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  });

  if (loading) {
    return <div className="p-12 text-center text-[#A1A1AA]">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Analitik</h1>
          <p className="text-[#A1A1AA] text-sm">Ziyaretçi etkileşimlerini ve indirmeleri takip edin.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Eye className="w-5 h-5"/></div>
            <h3 className="text-[#A1A1AA] font-medium">Toplam Görüntülenme</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.totalViews || 0}</p>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><Download className="w-5 h-5"/></div>
            <h3 className="text-[#A1A1AA] font-medium">Toplam İndirme</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.totalDownloads || 0}</p>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><TrendingUp className="w-5 h-5"/></div>
            <h3 className="text-[#A1A1AA] font-medium">Etkileşim Oranı</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {stats?.totalViews ? Math.round(((stats.totalDownloads || 0) / stats.totalViews) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Recent Events Log */}
      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#222222]">
          <h2 className="text-lg font-semibold text-white">Son Etkileşimler</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#A1A1AA]">
            <thead className="bg-[#161616] border-b border-[#222222] text-[#52525B]">
              <tr>
                <th className="px-6 py-3 font-medium">Tür</th>
                <th className="px-6 py-3 font-medium">Proje</th>
                <th className="px-6 py-3 font-medium text-right">Zaman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {events.length > 0 ? (
                events.map(event => (
                  <tr key={event.id} className="hover:bg-[#161616]">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        event.type === 'view' ? 'bg-blue-500/10 text-blue-500' :
                        event.type === 'download' ? 'bg-green-500/10 text-green-500' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {event.type === 'view' ? <Eye className="w-3 h-3"/> :
                         event.type === 'download' ? <Download className="w-3 h-3"/> :
                         <BarChart2 className="w-3 h-3"/>}
                        {event.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{event.projectTitle}</td>
                    <td className="px-6 py-4 text-right text-xs">{formatDate(event.timestamp)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[#52525B]">Henüz etkileşim verisi yok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
