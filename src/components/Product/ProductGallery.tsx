import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export function ProductGallery() {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const docRef = doc(db, 'products', 'body-glue');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.images && data.images.length > 0) {
          // Sort to ensure primary is first, then rest
          const sorted = [...data.images].sort((a: ProductImage, b: ProductImage) => {
            if (a.isPrimary) return -1;
            if (b.isPrimary) return 1;
            return 0;
          });
          setImages(sorted);
          return;
        }
      }
      // Fallback
      setImages([{ id: 'default', url: '/assets/product-front.jpg', isPrimary: true }]);
    } catch (err) {
      console.error('Failed to load images', err);
      setImages([{ id: 'default', url: '/assets/product-front.jpg', isPrimary: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const childWidth = container.scrollWidth / images.length;
      container.scrollTo({
        left: childWidth * index,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollPosition = container.scrollLeft;
      const childWidth = container.scrollWidth / images.length;
      const newIndex = Math.round(scrollPosition / childWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full aspect-[4/5] md:aspect-auto md:h-full bg-brand-pink-light rounded-sm animate-pulse flex items-center justify-center text-brand-pink">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row-reverse gap-4 md:gap-6">
      {/* Main Image View */}
      <div className="relative flex-1 bg-brand-pink-light rounded-sm overflow-hidden aspect-[4/5] md:aspect-auto">
        {/* Mobile Swipe Container / Desktop Main Image */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar md:overflow-hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img, idx) => (
            <div key={img.id} className="w-full h-full shrink-0 snap-center relative flex items-center justify-center p-4">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={idx === currentIndex ? img.url : 'hidden'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={img.url} 
                  alt={`Product view ${idx + 1}`} 
                  className={`w-full h-full object-contain mix-blend-multiply md:absolute md:inset-0 ${idx !== currentIndex ? 'md:hidden block' : 'block'}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Desktop mostly) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-white/80 hover:bg-brand-white text-brand-black flex items-center justify-center rounded-sm transition-colors shadow-sm hidden md:flex"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-white/80 hover:bg-brand-white text-brand-black flex items-center justify-center rounded-sm transition-colors shadow-sm hidden md:flex"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:w-24 shrink-0 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => handleThumbnailClick(idx)}
              className={`relative w-20 h-24 md:w-full md:h-28 shrink-0 bg-brand-pink-light rounded-sm overflow-hidden transition-all duration-300 ${currentIndex === idx ? 'ring-2 ring-brand-black ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
            >
              <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply p-1" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
