'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#3B82F6]/10 to-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center bg-[#111111]/80 backdrop-blur-xl border border-[#222222] rounded-3xl p-10 md:p-16 shadow-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-white mb-6"
        >
          Bir projen mi var?
          <br />
          <span className="gradient-text">Birlikte çalışalım.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#A1A1AA] text-lg mb-10 max-w-2xl mx-auto"
        >
          Yeni fikirler geliştirmeyi ve teknolojik zorlukları çözmeyi seviyorum. 
          Benimle iletişime geçmekten çekinme.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#3B82F6]/25 group"
          >
            <Mail className="w-5 h-5" />
            İletişime Geç
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#161616] hover:bg-[#1a1a1a] text-white font-semibold rounded-xl border border-[#333333] transition-all duration-200 group"
          >
            Projelerimi İncele
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
