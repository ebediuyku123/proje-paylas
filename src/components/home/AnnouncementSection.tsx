'use client';

import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

interface AnnouncementSectionProps {
  text: string;
}

export default function AnnouncementSection({ text }: AnnouncementSectionProps) {
  if (!text) return null;

  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-[#111111] border border-[#222222] rounded-2xl p-10 md:p-16 text-center overflow-hidden w-full"
      >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-purple-500/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#3B82F6]/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full text-[#3B82F6] text-sm font-medium mb-6">
              <Megaphone className="w-4 h-4" />
              Duyuru
            </div>

            <p className="text-white text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
              {text}
            </p>
          </div>
        </motion.div>
    </div>
  );
}
