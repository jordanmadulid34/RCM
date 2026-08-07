import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Award, Mail } from 'lucide-react';
import { TabType, ThemeType } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface HeroProps {
  setActiveTab: (tab: TabType) => void;
  theme: ThemeType;
}

const HERO_BACKGROUND_IMAGES = [
  'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
  'https://static.wixstatic.com/media/b2fb7d_d89839a1bdf44d9cb48eedb8473a91d0~mv2.jpg',
  'https://static.wixstatic.com/media/941b16_b8f80fe80e2243b7ae964af0f2049fc4~mv2.jpeg',
  'https://static.wixstatic.com/media/941b16_fee94a5547814ae6b8ff9aa69c809b81~mv2.jpeg',
  'https://static.wixstatic.com/media/b2fb7d_78bfae307ec441e3ac955e6ff04475f6f000.jpg',
];

export const Hero: React.FC<HeroProps> = ({ setActiveTab, theme }) => {
  const isDark = theme === 'dark';
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const { t, isMachineTranslated } = useI18n();

  // Preload images & set up 3-second auto-rotation interval
  useEffect(() => {
    // Preload background images
    HERO_BACKGROUND_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Respect reduced motion settings
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const interval = setInterval(() => {
      if (!document.hidden) {
        setCurrentBgIndex((prev) => (prev + 1) % HERO_BACKGROUND_IMAGES.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden min-h-[480px] sm:min-h-[520px] flex items-center w-full max-w-full">
      {/* AUTO-ROTATING BACKGROUND IMAGES WITH SMOOTH CROSSFADE */}
      <div className="absolute inset-0 z-0">
        {HERO_BACKGROUND_IMAGES.map((imgUrl, idx) => (
          <div
            key={imgUrl}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
              idx === currentBgIndex ? 'opacity-100 scale-105 transition-transform duration-[4000ms]' : 'opacity-0 scale-100'
            }`}
            style={{ backgroundImage: `url('${imgUrl}')` }}
          />
        ))}

        {/* DARK NAVY TINT OVERLAY FOR OPTIMAL PHOTO VISIBILITY & TEXT LEGIBILITY */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDark
              ? 'bg-gradient-to-r from-[#01142E]/90 via-[#011E41]/75 to-[#01142E]/55'
              : 'bg-gradient-to-r from-[#0D1B2A]/85 via-[#0D1B2A]/65 to-[#0D1B2A]/45'
          }`}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 w-full max-w-full overflow-hidden">
        {/* Top Header Block: Headline, Subhead & Action CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-center lg:text-left">
          <div className="lg:col-span-8 space-y-4 sm:space-y-5 max-w-full overflow-hidden">
            {/* Heritage Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md border bg-[#01142E]/70 border-[#F7A81B]/40 text-[#F7A81B] max-w-full">
              <Award className="w-4 h-4 text-[#F7A81B] shrink-0" />
              <span className="font-montserrat font-extrabold text-[10px] sm:text-xs uppercase tracking-widest text-[#F7A81B] truncate">
                {t('hero.badge')}
              </span>
            </div>

            {/* Main Headline H1 */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md text-[#FAF8F3] break-words [word-break:break-word] max-w-full">
              {t('hero.heading')}
            </h1>

            {/* Subheadline */}
            <p className="font-sans text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0 text-[#E2E8F0] drop-shadow-xs break-words [word-break:break-word] max-w-full">
              {t('hero.subheading')}
            </p>

            {/* Functional CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-3.5 pt-2 w-full max-w-full">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Membership');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto max-w-full font-montserrat font-bold text-xs uppercase tracking-wider px-5 sm:px-7 py-3.5 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer transform hover:-translate-y-0.5 bg-[#F7A81B] hover:bg-[#D98E0E] text-[#01142E]"
              >
                <span>{t('hero.ctaJoin')}</span>
                <ArrowRight className="w-4 h-4 text-[#01142E] shrink-0" />
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Projects');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto max-w-full border border-[#F7A81B]/50 bg-[#011E41]/85 hover:bg-[#011E41] text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-wider px-5 sm:px-7 py-3.5 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer backdrop-blur-md"
              >
                <span>{t('hero.ctaExplore')}</span>
                <Sparkles className="w-4 h-4 text-[#F7A81B] shrink-0" />
              </button>

              {/* Contact CTA */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Contact Us');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto max-w-full border border-white/25 bg-white/10 hover:bg-white/20 text-[#FAF8F3] font-montserrat font-bold text-xs uppercase tracking-wider px-5 sm:px-6 py-3.5 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer backdrop-blur-md"
              >
                <Mail className="w-4 h-4 text-[#F7A81B] shrink-0" />
                <span>{t('common.contactUs')}</span>
              </button>
            </div>
          </div>

          {/* Quick Stats / Institutional Stamp */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className={`p-6 rounded-[18px] border transition-colors duration-300 shadow-xl space-y-4 backdrop-blur-md ${
              isDark
                ? 'bg-[#011E41]/90 border-[#F7A81B]/40 text-[#F5F1E6]'
                : 'bg-[#FAF8F3] border-[#C9982B]/30 text-[#243447]'
            }`}>
              <div className={`flex items-center space-x-3 border-b pb-4 ${isDark ? 'border-white/10' : 'border-[#243447]/10'}`}>
                <div className={`p-3 rounded-2xl border ${
                  isDark
                    ? 'bg-[#F7A81B]/15 text-[#F7A81B] border-[#F7A81B]/30'
                    : 'bg-[#17458F]/10 text-[#17458F] border-[#17458F]/20'
                }`}>
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className={`font-serif text-2xl font-extrabold ${isDark ? 'text-[#F7A81B]' : 'text-[#243447]'}`}>
                    {t('common.yearsLegacy')}
                  </div>
                  <div className={`text-[10px] uppercase font-montserrat font-bold tracking-wider ${isDark ? 'text-[#CBD5E1]' : 'text-[#17458F]'}`}>
                    {t('common.institutionalLegacy')}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className={`flex justify-between items-center pb-2 border-b ${isDark ? 'border-white/10' : 'border-[#243447]/10'}`}>
                  <span className={`font-montserrat uppercase text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`}>{t('First Chartered')}</span>
                  <span className={`font-bold ${isDark ? 'text-[#F5F1E6]' : 'text-[#243447]'}`}>{t('Makati City')}</span>
                </div>
                <div className={`flex justify-between items-center pb-2 border-b ${isDark ? 'border-white/10' : 'border-[#243447]/10'}`}>
                  <span className={`font-montserrat uppercase text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`}>{t('Motto')}</span>
                  <span className={`font-bold italic ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'}`}>{t('Service Above Self')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`font-montserrat uppercase text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`}>Focus Areas</span>
                  <span className={`font-bold ${isDark ? 'text-[#F7A81B]' : 'text-[#17458F]'}`}>7 Causes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


