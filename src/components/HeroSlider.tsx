import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpLeft, Volume2 } from 'lucide-react';
import { BannerSlide } from '../types';

interface HeroSliderProps {
  banners: BannerSlide[];
  onNavigate: (target: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ banners, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const safeBanners = banners.length > 0 ? banners : [];
  const activeSlide = safeBanners[currentIndex] || safeBanners[0];

  useEffect(() => {
    if (safeBanners.length <= 1 || isDragging) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeBanners.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [safeBanners.length, isDragging]);

  useEffect(() => {
    if (currentIndex >= safeBanners.length && safeBanners.length > 0) {
      setCurrentIndex(0);
    }
  }, [safeBanners.length, currentIndex]);

  const handlePrev = () => {
    if (safeBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + safeBanners.length) % safeBanners.length);
  };

  const handleNext = () => {
    if (safeBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % safeBanners.length);
  };

  const handlePointerDown = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 65;
    // In RTL or standard swipe: dragging left/right triggers slide change
    if (dragOffset > threshold) {
      handleNext();
    } else if (dragOffset < -threshold) {
      handlePrev();
    }
    setDragOffset(0);
  };

  if (!activeSlide) {
    return null;
  }

  const imageFailed = failedImages[activeSlide.id];

  return (
    <section
      aria-label="العروض الترويجية الرئيسية"
      className="relative w-full overflow-hidden border-b border-slate-800/80 bg-[#070913] select-none"
    >
      <div
        ref={containerRef}
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
        className={`relative min-h-[540px] lg:min-h-[640px] w-full flex items-end transition-transform duration-200 ease-out ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Background Media with Zero-Broken-Image Fallback */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0B0F1F]">
          {!imageFailed && activeSlide.imageUrl ? (
            <img
              key={activeSlide.imageUrl}
              src={activeSlide.imageUrl}
              alt={activeSlide.titleAr}
              referrerPolicy="no-referrer"
              draggable={false}
              onError={() =>
                setFailedImages((prev) => ({ ...prev, [activeSlide.id]: true }))
              }
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-700 ease-out opacity-65"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#070913] flex items-center justify-center">
              <Volume2 className="w-28 h-28 text-blue-500/20" />
            </div>
          )}
          {/* Measured Scrim for guaranteed WCAG AA contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-[#070913]/75 to-[#070913]/30" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#070913]/90 via-[#070913]/50 to-transparent" />
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 pb-14 pt-28 lg:pb-20">
          <div className="max-w-3xl space-y-5">
            {/* Unboxed Metadata Kicker (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium tracking-wide text-amber-400/90">
              <span className="font-display">{activeSlide.kickerEn}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">المدير العام: عيون Prince</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-blue-400 font-mono-num">{activeSlide.statsHighlight}</span>
            </div>

            {/* Display Headline */}
            <h1
              className="text-3xl sm:text-5xl lg:text-[3.35rem] font-bold text-white leading-[1.2] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {activeSlide.titleAr}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {activeSlide.subtitleAr}
            </p>

            {/* Primary Action + Slide Controls Row */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(activeSlide.ctaTarget);
                  }}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>{activeSlide.ctaTextAr}</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </button>

                <a
                  href="#activities"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-5 py-3.5 rounded-xl border border-slate-700/80 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 font-medium text-sm transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  استعراض الهيكل القيادي
                </a>
              </div>

              {/* Interactive Slider Controls & Swipe Hint */}
              <div
                className="flex items-center gap-4"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1.5">
                  {safeBanners.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`الانتقال إلى الشريحة ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                        idx === currentIndex
                          ? 'w-8 bg-amber-400'
                          : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="الشريحة السابقة"
                    className="w-10 h-10 rounded-lg border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="الشريحة التالية"
                    className="w-10 h-10 rounded-lg border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 pt-1">
              اسحب الشاشة يميناً أو يساراً للتنقل بين عروض Vibers V العالمية · الشريحة{' '}
              <span className="font-mono-num text-slate-200">{currentIndex + 1}</span> من{' '}
              <span className="font-mono-num text-slate-200">{safeBanners.length}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
