'use client';

import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
  label?: string;
}

export default function BackButton({
  className,
  label = 'Geri Dön',
}: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className={className}
    >
      <ArrowLeft className="w-5 h-5" />
      {label}
    </button>
  );
}
