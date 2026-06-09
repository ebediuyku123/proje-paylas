'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Globe, Smartphone, Monitor, Server, Terminal, Package, Gamepad2, Layers } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

const iconMap: Record<string, React.ElementType> = {
  Globe, Smartphone, Monitor, Server, Terminal, Package, Gamepad2, Layers,
};

interface CategorySectionProps {
  counts?: Record<string, number>;
}

export default function CategorySection({ counts = {} }: CategorySectionProps) {
  return (
    <section className="py-20 px-4 bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#3B82F6] text-sm font-medium mb-2"
          >
            Kategoriler
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-white"
          >
            Proje Kategorileri
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = iconMap[cat.icon];
            const count = counts[cat.id] ?? 0;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/projects?category=${cat.id}`}
                  className="group block p-5 bg-[#111111] border border-[#222222] rounded-xl hover:border-[#333333] hover:bg-[#161616] transition-all duration-200 card-hover"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-200"
                    style={{ background: `${cat.color}15` }}
                  >
                    {Icon && <Icon className="w-5 h-5" style={{ color: cat.color }} />}
                  </div>
                  <p className="text-white font-medium text-sm mb-1">{cat.name}</p>
                  <p className="text-[#52525B] text-xs">
                    {count > 0 ? `${count} proje` : 'Proje yok'}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
