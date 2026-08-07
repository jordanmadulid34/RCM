// 9-image crossfade banner using local ROTARY GATEWAY assets (1.jpeg–9.jpeg) — replace with higher-resolution versions where available for crisper display on large screens.
// Note: Some source images have original resolutions as small as 344x258 up to 1440x1068. If any image's resolution is too low to look sharp at full banner width on large screens, note it in a code comment so it can be swapped for a higher-res version later — do not upscale or distort it to compensate.

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface BannerSlide {
  id: number;
  filename: string;
  src: string;
  fallbackSrc: string;
  alt: string;
  resolutionNote?: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 1,
    filename: '1.jpeg',
    src: 'https://static.wixstatic.com/media/b2fb7d_9946319f5a2845d18303c2396cb5011a~mv2.jpg',
    fallbackSrc: '/membership-banner/1.jpeg',
    alt: 'RC Makati community service event — community entrepreneurship and livelihood development',
    resolutionNote: 'Original resolution ~1440x1068 (high resolution, sharp on large screens)',
  },
  {
    id: 2,
    filename: '2.jpeg',
    src: 'https://static.wixstatic.com/media/b2fb7d_a9b11276feb747a9a98acbff46597292~mv2.jpg',
    fallbackSrc: '/membership-banner/2.jpeg',
    alt: 'RC Makati community service event — dental and medical outreach mission',
    resolutionNote: 'Original resolution ~980x735 (standard desktop clarity)',
  },
  {
    id: 3,
    filename: '3.jpeg',
    src: 'https://static.wixstatic.com/media/b2fb7d_7120845956ba471a8faed4ec2c05839c~mv2.jpg',
    fallbackSrc: '/membership-banner/3.jpeg',
    alt: 'RC Makati community service event — marine reef preservation and coastal protection',
    // Note: Resolution is low (~344x258). May appear soft on ultra-wide screens; replace with higher-res version later without upscaling distortion.
    resolutionNote: 'Low resolution (~344x258) — note for future high-res asset replacement',
  },
  {
    id: 4,
    filename: '4.jpeg',
    src: 'https://static.wixstatic.com/media/b2fb7d_b1fbf77300f9440ca4f20030468fcc2c~mv2.jpg',
    fallbackSrc: '/membership-banner/4.jpeg',
    alt: 'RC Makati community service event — youth career guidance and educational mentorship',
    resolutionNote: 'Original resolution ~960x720 (clear on standard viewports)',
  },
  {
    id: 5,
    filename: '5.jpeg',
    src: 'https://static.wixstatic.com/media/b2fb7d_ca7371be21054818ab83365c2c4cdbcd~mv2.jpg',
    fallbackSrc: '/membership-banner/5.jpeg',
    alt: 'RC Makati community service event — rural community outreach and humanitarian aid',
    // Note: Resolution is low (~474x355). Replace with higher-resolution asset when available.
    resolutionNote: 'Low resolution (~474x355) — note for future high-res asset replacement',
  },
  {
    id: 6,
    filename: '6.jpeg',
    src: 'https://static.wixstatic.com/media/941b16_c7f3a903128341189db574743bf22539~mv2.jpg',
    fallbackSrc: '/membership-banner/6.jpeg',
    alt: 'RC Makati community service event — maternal and child healthcare initiative',
    resolutionNote: 'Original resolution ~1280x720 (HD clarity)',
  },
  {
    id: 7,
    filename: '7.jpeg',
    src: 'https://static.wixstatic.com/media/941b16_1b106fe9c46d451f9f0c679ca331457d~mv2.jpeg',
    fallbackSrc: '/membership-banner/7.jpeg',
    alt: 'RC Makati community service event — clean water access and sanitation project',
    resolutionNote: 'Original resolution ~1440x1068 (sharp on large displays)',
  },
  {
    id: 8,
    filename: '8.jpeg',
    src: 'https://static.wixstatic.com/media/941b16_b5dbc984533b429297f98f66bc19d746~mv2.jpeg',
    fallbackSrc: '/membership-banner/8.jpeg',
    alt: 'RC Makati community service event — basic education and literacy development',
    resolutionNote: 'Original resolution ~980x735 (standard clarity)',
  },
  {
    id: 9,
    filename: '9.jpeg',
    src: 'https://static.wixstatic.com/media/941b16_10efc9654d1a499da8c4554a5febda96~mv2.jpeg',
    fallbackSrc: '/membership-banner/9.jpeg',
    alt: 'RC Makati community service event — club fellowship and service milestone celebration',
    resolutionNote: 'Original resolution ~1280x720 (clear presentation)',
  },
];

interface ProjectsHeaderBannerProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
}

export const ProjectsHeaderBanner: React.FC<ProjectsHeaderBannerProps> = ({
  title = "Our Projects & Service Initiatives",
  subtitle = "Explore all 28 landmark service projects of the Rotary Club of Makati, spanning Rotary International's Seven Areas of Focus.",
  badgeText = "Complete RCM Service Record",
}) => {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Duplicate the image set once so the marquee loop connects seamlessly without jump or gap
  const stripSlides = [...BANNER_SLIDES, ...BANNER_SLIDES];

  return (
    <section
      aria-label="RC Makati Projects Featured Chronicle Banner"
      className="w-full relative overflow-hidden bg-[#243447] select-none min-h-[380px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px] flex flex-col justify-center items-center py-16 px-4"
    >
      {/* Connected Moving Photo Strip Background at base (z-0) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div
          className="flex flex-row h-full w-max animate-strip-scroll"
          style={{ animation: 'stripScroll 40s linear infinite' }}
        >
          {stripSlides.map((slide, idx) => {
            const isError = imgErrors[slide.id];
            const imgSrc = isError ? slide.fallbackSrc : slide.src;

            return (
              <div
                key={`${slide.id}-${idx}`}
                className="h-full w-[280px] sm:w-[340px] md:w-[400px] lg:w-[440px] xl:w-[480px] shrink-0"
              >
                <img
                  src={imgSrc}
                  alt={slide.alt}
                  onError={() => handleImageError(slide.id)}
                  className="w-full h-full object-cover object-top"
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Dark Navy Overlay above the photo strip (z-10) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ backgroundColor: 'rgba(13, 27, 42, 0.73)' }}
      />

      {/* Hero Header Text Integrated ON TOP of the Background Photo Strip (z-20) */}
      <div className="relative z-20 text-center max-w-4xl mx-auto space-y-4 my-auto px-4 w-full max-w-full overflow-hidden">
        <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-[#243447]/80 backdrop-blur-md px-3.5 sm:px-4 py-1.5 rounded-full border border-white/20 shadow-lg max-w-full">
          <Sparkles className="w-4 h-4 text-[#F7A81B] shrink-0" />
          <span className="truncate">{badgeText}</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md break-words [word-break:break-word] max-w-full">
          {title}
        </h1>

        <p className="text-sm sm:text-lg font-sans max-w-2xl mx-auto leading-relaxed text-slate-100 drop-shadow-sm break-words [word-break:break-word] max-w-full">
          {subtitle}
        </p>
      </div>
    </section>
  );
};
