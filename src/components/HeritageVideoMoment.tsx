// Source: youtube.com/@RCM3830 — SDE 60th Charter Anniversary video, published April 6, 2026.

import React, { useState, useEffect, useRef } from 'react';
import { Play, X, ExternalLink, Youtube, Sparkles } from 'lucide-react';
import { ThemeType } from '../types';

interface HeritageVideoMomentProps {
  theme: ThemeType;
}

const VIDEO_DATA = {
  title: '60 Years, Captured',
  subtitle: 'SDE: RC Makati 60th Charter Anniversary',
  videoUrl: 'https://www.youtube.com/watch?v=XNs3LUd2KOc',
  thumbnailUrl: 'https://i.ytimg.com/vi/XNs3LUd2KOc/maxresdefault.jpg',
  fallbackThumbnailUrl: 'https://i.ytimg.com/vi/XNs3LUd2KOc/hqdefault.jpg',
  description:
    "A Same-Day-Edit highlight of the Rotary Club of Makati's 60th Charter Anniversary, held March 13, 2026 at the Marriott Grand Ballroom — six decades of the Mother Club of Makati, in six minutes.",
};

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('v=')) {
    videoId = url.split('v=')[1]?.split('&')[0] || '';
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
}

export const HeritageVideoMoment: React.FC<HeritageVideoMomentProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(VIDEO_DATA.thumbnailUrl);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* COMPACT VIDEO MOMENT BAND */}
      <section className="relative py-14 sm:py-16 overflow-hidden flex items-center justify-center border-y border-[#F7A81B]/30 shadow-2xl transition-colors duration-300">
        {/* Background Image with Lightened Tint Overlay */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img
            src={imgSrc}
            alt="RC Makati 60th Charter Anniversary Highlight"
            referrerPolicy="no-referrer"
            onError={() => {
              if (imgSrc !== VIDEO_DATA.fallbackThumbnailUrl) {
                setImgSrc(VIDEO_DATA.fallbackThumbnailUrl);
              }
            }}
            className="w-full h-full object-cover object-center filter brightness-105 contrast-105 saturate-105"
            loading="lazy"
          />
          {/* Subtle Overlay allowing the background image/video frame to shine through clearly */}
          <div
            className={`absolute inset-0 transition-colors duration-300 ${
              isDark
                ? 'bg-gradient-to-r from-[#011E41]/60 via-[#011E41]/35 to-[#011E41]/60 backdrop-brightness-90'
                : 'bg-gradient-to-r from-[#011E41]/50 via-[#011E41]/25 to-[#011E41]/50'
            }`}
          />
        </div>

        {/* Clickable Content Banner */}
        <div
          onClick={() => setIsOpen(true)}
          className="group relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 cursor-pointer select-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
          aria-label="Watch video: 60 Years, Captured"
        >
          {/* Gold Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#011E41]/80 border border-[#F7A81B]/70 text-[#F7A81B] px-3.5 py-1 rounded-full backdrop-blur-md shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-[#F7A81B]" />
            <span className="font-montserrat font-bold text-[11px] sm:text-xs uppercase tracking-widest text-[#F7A81B]">
              60th Charter Anniversary
            </span>
          </div>

          {/* Centered Play Button Overlay */}
          <div className="flex justify-center my-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#011E41]/85 border-2 border-[#F7A81B] text-[#F7A81B] flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#F7A81B] group-hover:text-[#011E41] backdrop-blur-md motion-reduce:transition-none">
              <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
            </div>
          </div>

          {/* Headline */}
          <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-[#F7A81B] transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {VIDEO_DATA.title}
          </h3>

          {/* Subtitle / Description */}
          <p className="font-sans text-xs sm:text-sm font-medium text-white max-w-2xl mx-auto leading-relaxed line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {VIDEO_DATA.description}
          </p>
        </div>
      </section>

      {/* VIDEO LIGHTBOX MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="heritage-video-modal-title"
        >
          <div
            className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-5 overflow-hidden ${
              isDark ? 'bg-[#011E41] border-[#F7A81B]/50 text-[#F5F1E6]' : 'bg-[#FAF8F3] border-[#F7A81B] text-[#011E41]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-montserrat font-bold text-[#F7A81B] uppercase tracking-widest bg-[#F7A81B]/20 px-3 py-1 rounded-full border border-[#F7A81B]/40 inline-flex items-center space-x-1">
                  <Youtube className="w-3 h-3 text-[#F7A81B]" />
                  <span>60th Charter Anniversary Video</span>
                </span>
                <h3
                  id="heritage-video-modal-title"
                  className="font-serif text-xl sm:text-2xl font-extrabold leading-tight pt-1"
                >
                  {VIDEO_DATA.subtitle}
                </h3>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close video player"
                className="p-2.5 rounded-full hover:bg-white/10 text-[#F7A81B] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Embedded Playable YouTube Iframe */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#F7A81B]/40 shadow-2xl bg-black">
              <iframe
                src={getYouTubeEmbedUrl(VIDEO_DATA.videoUrl)}
                title={VIDEO_DATA.subtitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Description */}
            <p className="text-xs sm:text-sm font-sans opacity-90 leading-relaxed font-light">
              {VIDEO_DATA.description}
            </p>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#F7A81B]/30 flex justify-between items-center text-xs">
              <span className="font-montserrat opacity-75">
                Rotary Club of Makati • YouTube @RCM3830
              </span>
              <a
                href={VIDEO_DATA.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F7A81B] font-montserrat font-bold uppercase tracking-wider hover:underline inline-flex items-center space-x-1"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
