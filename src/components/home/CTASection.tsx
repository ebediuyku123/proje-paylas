'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

export default function CTASection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full flex items-center justify-center py-6 lg:py-0"
    >
      <div className="w-full border-l-2 border-[#222222] pl-6 py-4">
        <p className="text-white text-sm font-semibold mb-1">Bir projen mi var?</p>
        <p className="text-[#52525B] text-sm mb-5">
          Yeni fikirler geliştirmeyi seviyorum — benimle iletişime geç.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            İletişime Geç
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-transparent hover:bg-[#161616] text-[#A1A1AA] hover:text-white text-sm font-medium rounded-lg border border-[#222222] hover:border-[#333333] transition-colors group"
          >
            Projeler
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
