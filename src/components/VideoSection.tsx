// Source: youtube.com/@RCM3830 — check the channel periodically for newer videos to feature here.

import React, { useState, useEffect, useRef } from 'react';
import { Play, X, ExternalLink, Youtube, Sparkles } from 'lucide-react';
import { ThemeType } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  fallbackThumbnailUrl: string;
  description: string;
  isFeatured?: boolean;
}

const FEATURED_VIDEO: VideoItem = {
  id: 'featured-impact',
  title: 'IMPACT — Stories of the Rotary Club of Makati (Pilot Episode)',
  videoUrl: 'https://www.youtube.com/watch?v=4RVVt5bMwRQ',
  thumbnailUrl: 'https://i.ytimg.com/vi/4RVVt5bMwRQ/maxresdefault.jpg',
  fallbackThumbnailUrl: 'https://i.ytimg.com/vi/4RVVt5bMwRQ/hqdefault.jpg',
  description:
    'A digital video series that brings to life the stories behind the most meaningful projects of RC Makati — starting with this pilot episode.',
  isFeatured: true,
};

const SECONDARY_VIDEOS: VideoItem[] = [
  {
    id: 'ai-academy-grad',
    title: 'Rotary Club of Makati AI Academy Celebrates First Graduation',
    videoUrl: 'https://www.youtube.com/watch?v=VXwVbzl7doU',
    thumbnailUrl: 'https://i.ytimg.com/vi/VXwVbzl7doU/maxresdefault.jpg',
    fallbackThumbnailUrl: 'https://i.ytimg.com/vi/VXwVbzl7doU/hqdefault.jpg',
    description: '70 scholars certified as AI Practitioners — Feb 28, 2026',
  },
  {
    id: 'bgc-greenway',
    title: 'The BGC Greenway Project',
    videoUrl: 'https://youtu.be/Zq39I1kWVK4',
    thumbnailUrl: 'https://i.ytimg.com/vi/Zq39I1kWVK4/maxresdefault.jpg',
    fallbackThumbnailUrl: 'https://i.ytimg.com/vi/Zq39I1kWVK4/hqdefault.jpg',
    description: 'Turning a pathway into a shared community space',
  },
  {
    id: '60th-anniversary-sde',
    title: 'SDE: RC Makati 60th Charter Anniversary',
    videoUrl: 'https://www.youtube.com/watch?v=XNs3LUd2KOc',
    thumbnailUrl: 'https://i.ytimg.com/vi/XNs3LUd2KOc/maxresdefault.jpg',
    fallbackThumbnailUrl: 'https://i.ytimg.com/vi/XNs3LUd2KOc/hqdefault.jpg',
    description: 'Same-Day-Edit highlight — March 13, 2026, Marriott Grand Ballroom',
  },
];

interface VideoSectionProps {
  theme: ThemeType;
}

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

const ThumbnailImage: React.FC<{
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}> = ({ src, fallbackSrc, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
      className={className}
      loading="lazy"
    />
  );
};

export const VideoSection: React.FC<VideoSectionProps> = ({ theme }) => {
  const { t } = useI18n();
  const isDark = theme === 'dark';
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideo(null);
      }
    };
    if (activeVideo) {
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
  }, [activeVideo]);

  return (
    <section
      className="py-16 lg:py-20 bg-[#16233B] text-[#CBD5E1] transition-colors duration-300 relative"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/15 px-3.5 py-1 rounded-full border border-[#F7A81B]/40 shadow-sm">
            <Youtube className="w-4 h-4 text-[#F7A81B]" />
            <span>{t('Watch Our Story')}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC]">
            {t('See RC Makati in Action')}
          </h2>

          <p className="text-sm sm:text-base font-sans font-light text-[#CBD5E1] leading-relaxed max-w-2xl mx-auto">
            {t('Stories from the field — told through the people we serve and the members who serve them.')}
          </p>
        </div>

        {/* Featured Video Layout */}
        <div className="max-w-4xl mx-auto space-y-4">
          {/* FEATURED VIDEO */}
          <div className="space-y-4">
            <div
              onClick={() => setActiveVideo(FEATURED_VIDEO)}
              className="group relative aspect-video rounded-[18px] overflow-hidden border border-white/10 hover:border-[#F7A81B]/50 shadow-2xl cursor-pointer bg-black/40 transition-all duration-300 transform hover:-translate-y-1"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveVideo(FEATURED_VIDEO);
                }
              }}
              aria-label={`Play video: ${FEATURED_VIDEO.title}`}
            >
              <ThumbnailImage
                src={FEATURED_VIDEO.thumbnailUrl}
                fallbackSrc={FEATURED_VIDEO.fallbackThumbnailUrl}
                alt={FEATURED_VIDEO.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-black/30 to-black/10 group-hover:bg-black/40 transition-colors" />

              {/* Centered Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#17458F] border-2 border-white/20 text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#123773] group-hover:border-[#F7A81B] backdrop-blur-sm">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
                </div>
              </div>

              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center space-x-1.5 bg-[#F7A81B] text-[#011E41] font-montserrat font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  <Sparkles className="w-3 h-3" />
                  <span>Featured Series</span>
                </span>
              </div>
            </div>

            {/* Featured Video Title & Description */}
            <div className="space-y-2 pt-1 text-center">
              <h3
                className="font-serif text-xl sm:text-2xl font-bold leading-snug cursor-pointer hover:text-[#F7A81B] transition-colors text-[#F5F1E6]"
                onClick={() => setActiveVideo(FEATURED_VIDEO)}
              >
                {FEATURED_VIDEO.title}
              </h3>
              <p className="text-xs sm:text-sm font-sans font-light leading-relaxed opacity-85 text-[#F5F1E6]/90 max-w-2xl mx-auto">
                {FEATURED_VIDEO.description}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: YouTube Channel Link */}
        <div className="pt-4 text-center">
          <a
            href="https://www.youtube.com/@RCM3830"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 border-2 border-[#F7A81B] hover:bg-[#F7A81B] text-[#F7A81B] hover:text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Youtube className="w-4 h-4" />
            <span>See More on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* VIDEO LIGHTBOX / MODAL                                            */}
      {/* ------------------------------------------------------------------ */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
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
                  <span>Rotary Club of Makati Video</span>
                </span>
                <h3
                  id="video-modal-title"
                  className="font-serif text-xl sm:text-2xl font-extrabold leading-tight pt-1"
                >
                  {activeVideo.title}
                </h3>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video player"
                className="p-2.5 rounded-full hover:bg-white/10 text-[#F7A81B] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Playable YouTube Iframe (Mounts only when activeVideo is set) */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#F7A81B]/40 shadow-2xl bg-black">
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.videoUrl)}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Description */}
            <p className="text-xs sm:text-sm font-sans opacity-90 leading-relaxed font-light">
              {activeVideo.description}
            </p>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#F7A81B]/30 flex justify-between items-center text-xs">
              <span className="font-montserrat opacity-75">
                Official YouTube Channel: @RCM3830
              </span>
              <a
                href={activeVideo.videoUrl}
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
    </section>
  );
};
