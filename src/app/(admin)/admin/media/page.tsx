'use client';

import { useState } from 'react';
import { Image as ImageIcon, FileArchive, Trash2, Search, Filter } from 'lucide-react';

export default function MediaManager() {
  // Mock media for now, in a real app you'd list from Firebase Storage using listAll
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Medya Yöneticisi</h1>
          <p className="text-[#A1A1AA] text-sm">Yüklenen tüm görsel ve dosyaları yönetin.</p>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 text-center">
        <ImageIcon className="w-12 h-12 text-[#52525B] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Geliştirme Aşamasında</h3>
        <p className="text-[#A1A1AA] max-w-md mx-auto">
          Medya yöneticisi arayüzü yakında eklenecek. Şu an için Firebase Storage konsolu üzerinden medya dosyalarınızı yönetebilirsiniz.
        </p>
      </div>
    </div>
  );
}
