'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface AnnouncementSectionProps {
  text: string;
}

const DEFAULT_TEXT = 'Yenilikler yakında burada.';

export default function AnnouncementSection({ text }: AnnouncementSectionProps) {
  const content = text?.trim() || DEFAULT_TEXT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full flex items-center justify-center py-6 lg:py-0"
    >
      <div className="w-full border-l-2 border-[#3B82F6] pl-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span className="text-[#3B82F6] text-xs font-semibold uppercase tracking-widest">
            Yenilikler
          </span>
        </div>
        <p className="text-[#A1A1AA] text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
