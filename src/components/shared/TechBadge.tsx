import { cn } from '@/lib/utils';

interface TechBadgeProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'solid';
  className?: string;
}

const techColors: Record<string, string> = {
  'React': 'text-[#61DAFB] bg-[#61DAFB]/10 border-[#61DAFB]/20',
  'Next.js': 'text-white bg-white/10 border-white/20',
  'Vue.js': 'text-[#4FC08D] bg-[#4FC08D]/10 border-[#4FC08D]/20',
  'Angular': 'text-[#DD0031] bg-[#DD0031]/10 border-[#DD0031]/20',
  'TypeScript': 'text-[#3178C6] bg-[#3178C6]/10 border-[#3178C6]/20',
  'JavaScript': 'text-[#F7DF1E] bg-[#F7DF1E]/10 border-[#F7DF1E]/20',
  'Python': 'text-[#3776AB] bg-[#3776AB]/10 border-[#3776AB]/20',
  'Go': 'text-[#00ADD8] bg-[#00ADD8]/10 border-[#00ADD8]/20',
  'Rust': 'text-[#CE422B] bg-[#CE422B]/10 border-[#CE422B]/20',
  'Node.js': 'text-[#339933] bg-[#339933]/10 border-[#339933]/20',
  'Firebase': 'text-[#FFCA28] bg-[#FFCA28]/10 border-[#FFCA28]/20',
  'Docker': 'text-[#2496ED] bg-[#2496ED]/10 border-[#2496ED]/20',
  'Tailwind CSS': 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/20',
  'PostgreSQL': 'text-[#336791] bg-[#336791]/10 border-[#336791]/20',
  'MongoDB': 'text-[#47A248] bg-[#47A248]/10 border-[#47A248]/20',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function TechBadge({ name, size = 'md', className }: TechBadgeProps) {
  const colorClass = techColors[name] ?? 'text-[#A1A1AA] bg-white/5 border-white/10';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-all duration-200',
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      {name}
    </span>
  );
}
