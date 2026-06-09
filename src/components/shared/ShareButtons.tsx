'use client';

import { Link2, Check } from 'lucide-react';
import { TwitterIcon, FacebookIcon } from '@/components/shared/BrandIcons';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: 'Twitter',
      icon: TwitterIcon,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30',
    },
    {
      label: 'Facebook',
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-[#1877F2] hover:border-[#1877F2]/30',
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Bağlantı kopyalandı!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Kopyalama başarısız');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[#A1A1AA] text-sm mr-1">Paylaş:</span>
      {shareLinks.map(({ label, icon: Icon, href, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label}'da paylaş`}
          className={`w-9 h-9 rounded-lg bg-[#111111] border border-[#222222] flex items-center justify-center text-[#A1A1AA] transition-all duration-200 ${color}`}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label="Bağlantıyı kopyala"
        className="w-9 h-9 rounded-lg bg-[#111111] border border-[#222222] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#333333] transition-all duration-200"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
