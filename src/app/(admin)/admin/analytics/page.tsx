'use client';

import { useState } from 'react';
import { BarChart2, Eye, Download, TrendingUp, Users, Globe } from 'lucide-react';
import { getAnalyticsEvents, getDashboardStats, getVisitorStats, getRecentVisitors } from '@/lib/firebase/firestore';
import { useWhenAuthed } from '@/hooks/useWhenAuthed';
import { formatDate, formatRelativeDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { AnalyticsEvent, DashboardStats, VisitorRecord, VisitorStats } from '@/types';

export default function AnalyticsPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useWhenAuthed(async () => {
    try {
      const [eventsData, statsData, vStats, vRecords] = await Promise.all([
        getAnalyticsEvents(50),
        getDashboardStats({ includeDrafts: true }),
        getVisitorStats(),
        getRecentVisitors(50),
      ]);
      setEvents(eventsData);
      setStats(statsData);
      setVisitorStats(vStats);
      setVisitors(vRecords);
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Analitik</h1>
        <p className="text-[#A1A1AA] text-sm">Ziyaretçi etkileşimlerini ve indirmeleri takip edin.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg"><Eye className="w-4 h-4"/></div>
            <h3 className="text-[#A1A1AA] text-sm font-medium">Görüntülenme</h3>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.totalViews || 0}</p>
          <p className="text-xs text-[#52525B] mt-1">Gerçek sayı</p>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-500/10 text-green-500 rounded-lg"><Download className="w-4 h-4"/></div>
            <h3 className="text-[#A1A1AA] text-sm font-medium">İndirme</h3>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.totalDownloads || 0}</p>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-purple-500/10 text-purple-500 rounded-lg"><Users className="w-4 h-4"/></div>
            <h3 className="text-[#A1A1AA] text-sm font-medium">Tekil Ziyaretçi</h3>
          </div>
          <p className="text-2xl font-bold text-white">{visitorStats?.uniqueVisitors || 0}</p>
          <p className="text-xs text-[#52525B] mt-1">IP hash bazlı</p>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-orange-500/10 text-orange-500 rounded-lg"><Globe className="w-4 h-4"/></div>
            <h3 className="text-[#A1A1AA] text-sm font-medium">Toplam Ziyaret</h3>
          </div>
          <p className="text-2xl font-bold text-white">{visitorStats?.totalVisits || 0}</p>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#222222] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Ziyaretçiler</h2>
            <p className="text-xs text-[#52525B] mt-0.5">IP adresleri SHA-256 ile hash'lenerek saklanır — ham IP tutulmaz (GDPR uyumlu)</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#A1A1AA]">
            <thead className="bg-[#161616] border-b border-[#222222] text-[#52525B]">
              <tr>
                <th className="px-5 py-3 font-medium">IP Hash</th>
                <th className="px-5 py-3 font-medium">İlk Ziyaret</th>
                <th className="px-5 py-3 font-medium">Son Ziyaret</th>
                <th className="px-5 py-3 font-medium text-right">Ziyaret Sayısı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {visitors.length > 0 ? visitors.map((v, i) => (
                <tr key={i} className="hover:bg-[#161616]">
                  <td className="px-5 py-3 font-mono text-xs text-[#52525B]">{v.ipHash}</td>
                  <td className="px-5 py-3 text-xs">{formatDate(v.firstVisit)}</td>
                  <td className="px-5 py-3 text-xs">{formatRelativeDate(v.lastVisit)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="px-2 py-0.5 bg-[#3B82F6]/10 text-[#3B82F6] rounded-full text-xs font-medium">
                      {v.visitCount}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-[#52525B]">Henüz ziyaretçi verisi yok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Events Log */}
      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#222222]">
          <h2 className="text-lg font-semibold text-white">Son Etkileşimler</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#A1A1AA]">
            <thead className="bg-[#161616] border-b border-[#222222] text-[#52525B]">
              <tr>
                <th className="px-5 py-3 font-medium">Tür</th>
                <th className="px-5 py-3 font-medium">Proje</th>
                <th className="px-5 py-3 font-medium text-right">Zaman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {events.length > 0 ? events.map(event => (
                <tr key={event.id} className="hover:bg-[#161616]">
                  <td className="px-5 py-4">
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
                  <td className="px-5 py-4 text-white font-medium">{event.projectTitle}</td>
                  <td className="px-5 py-4 text-right text-xs">{formatDate(event.timestamp)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-[#52525B]">Henüz etkileşim verisi yok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
