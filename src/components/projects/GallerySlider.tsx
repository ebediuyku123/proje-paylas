'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface GallerySliderProps {
  images: string[];
  title: string;
}

export default function GallerySlider({ images, title }: GallerySliderProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const prev = useCallback(() => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const next = useCallback(() => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightbox(true);
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="space-y-3">
        {/* Main slide */}
        <div className="relative aspect-video bg-[#111111] rounded-xl overflow-hidden border border-[#222222] group">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={images[current]}
                alt={`${title} ekran görüntüsü ${current + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom button */}
          <button
            onClick={() => openLightbox(current)}
            className="absolute top-3 right-3 p-2 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            aria-label="Büyüt"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                aria-label="Önceki"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                aria-label="Sonraki"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/40'}`}
                    aria-label={`${i + 1}. görüntü`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === current ? 'border-[#3B82F6]' : 'border-[#222222] hover:border-[#333333]'
                }`}
              >
                <Image src={img} alt={`Küçük resim ${i + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
              onClick={() => setLightbox(false)}
              aria-label="Kapat"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex]}
                alt={`${title} büyük görüntü`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1)); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1)); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
