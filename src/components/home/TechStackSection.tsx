'use client';

import { motion } from 'framer-motion';

const TECH_STACK = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#FFFFFF' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Python', color: '#3776AB' },
  { name: 'Firebase', color: '#FFCA28' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'Go', color: '#00ADD8' },
  { name: 'Tailwind CSS', color: '#06B6D4' },
  { name: 'GraphQL', color: '#E10098' },
  { name: 'Redis', color: '#DC382D' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'Rust', color: '#CE422B' },
  { name: 'Vue.js', color: '#4FC08D' },
  { name: 'MongoDB', color: '#47A248' },
];

const doubled = [...TECH_STACK, ...TECH_STACK];

export default function TechStackSection() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#3B82F6] text-sm font-medium mb-2"
        >
          Teknoloji Yığını
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-white"
        >
          Kullandığım Teknolojiler
        </motion.h2>
      </div>

      {/* Marquee row 1 - left to right */}
      <div className="relative flex overflow-hidden mb-4">
        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {doubled.map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#222222] rounded-lg flex-shrink-0"
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tech.color }} />
              <span className="text-[#A1A1AA] text-sm font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee row 2 - right to left */}
      <div className="relative flex overflow-hidden">
        <div className="flex gap-4 animate-marquee whitespace-nowrap" style={{ animationDirection: 'reverse' }}>
          {[...doubled].reverse().map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#222222] rounded-lg flex-shrink-0"
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tech.color }} />
              <span className="text-[#A1A1AA] text-sm font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none" />
    </section>
  );
}
