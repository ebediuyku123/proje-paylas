import Link from 'next/link';
import { Home } from 'lucide-react';
import BackButton from '@/components/shared/BackButton';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#3B82F6] to-[#0A0A0A] leading-none mb-4 select-none">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4">Sayfa Bulunamadı</h2>
        <p className="text-[#A1A1AA] text-lg max-w-md mx-auto mb-10">
          Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Ana Sayfaya Dön
          </Link>
          <BackButton className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#161616] border border-[#222222] text-white font-medium rounded-xl transition-colors" />
        </div>
      </div>
    </div>
  );
}
