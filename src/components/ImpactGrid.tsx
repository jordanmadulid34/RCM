/* Light Mode card redesign — replaced low-contrast badge/text colors with AA-verified tokens (gold-text on gold-tint, ink for titles, text-muted for dates, royal-blue/azure-text for CTAs). Applies to all card components sitewide. */

// Source: each focus area's own page on rotaryclubmakati.org/projects/ — these are the club's 7 official areas of focus, matching Rotary International's global focus areas.

import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { TabType, ThemeType, FocusArea } from '../types';
import { FOCUS_AREAS } from '../data/rcmData';
import { ImageWithFallback } from './ImageWithFallback';
import { useI18n } from '../i18n/I18nContext';

interface ImpactGridProps {
  setActiveTab: (tab: TabType) => void;
  onSelectFocusArea?: (focusAreaId: string) => void;
  theme: ThemeType;
}

interface FocusAreaCardProps {
  area: FocusArea;
  onClick: (id: string) => void;
}

const FocusAreaCard: React.FC<FocusAreaCardProps> = ({ area, onClick }) => {
  const { t } = useI18n();

  return (
    <div
      onClick={() => onClick(area.id)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(area.id);
        }
      }}
      className="group h-full rounded-[18px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-[16px] transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:border-[#F7A81B]/40 hover:-translate-y-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F7A81B]"
    >
      <div>
        {/* Real Photo with fixed aspect ratio ~4:3 */}
        <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
          <ImageWithFallback
            src={area.imageUrl || area.iconUrl}
            alt={area.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle dark overlay to improve text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />

          {/* Pillar icon overlaid small in top-right corner */}
          <div className="absolute top-3 right-3 w-10 h-10 rounded-xl p-1.5 bg-[#0F172A]/85 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-md">
            <ImageWithFallback
              src={area.iconUrl}
              alt=""
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-3">
          <h3 className="font-serif font-bold text-lg sm:text-xl leading-snug text-[#F8FAFC] group-hover:text-[#F7A81B] transition-colors">
            {t(area.title)}
          </h3>

          <p className="text-xs sm:text-sm font-sans leading-relaxed font-normal text-[#CBD5E1]">
            {t(area.shortDesc)}
          </p>
        </div>
      </div>

      {/* Enhanced Action Button */}
      <div className="p-6 pt-0">
        <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all bg-[#17458F] text-white group-hover:bg-[#123773] shadow-md">
          <span>{t('common.knowMore')}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  );
};

export const ImpactGrid: React.FC<ImpactGridProps> = ({
  setActiveTab,
  onSelectFocusArea,
}) => {
  const { t } = useI18n();

  const handleCardClick = (focusAreaId: string) => {
    if (onSelectFocusArea) {
      onSelectFocusArea(focusAreaId);
    }
    setActiveTab('Projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 transition-colors duration-300 bg-[#16233B] text-[#CBD5E1] relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 font-montserrat font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-[#F7A81B]/30 bg-[#F7A81B]/15 text-[#F7A81B] shadow-sm">
            <Globe className="w-4 h-4 text-[#F7A81B]" />
            <span>{t('common.ourFocusAreas')}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC]">
            {t('common.whereServiceMeetsAction')}
          </h2>

          <p className="text-base sm:text-lg font-sans text-[#CBD5E1] leading-relaxed max-w-2xl mx-auto">
            {t('common.focusAreasSubtitle')}
          </p>
        </div>

        {/* Mobile & Tablet Responsive Grid (1 col mobile, 2 cols tablet) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">
          {FOCUS_AREAS.map((area) => (
            <FocusAreaCard
              key={area.id}
              area={area}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {/* Desktop Responsive Grid (4 columns row 1, 3 columns centered row 2) */}
        <div className="hidden lg:block space-y-6 lg:space-y-8">
          {/* Row 1: 4 cards */}
          <div className="grid grid-cols-4 gap-6 lg:gap-8">
            {FOCUS_AREAS.slice(0, 4).map((area) => (
              <FocusAreaCard
                key={area.id}
                area={area}
                onClick={handleCardClick}
              />
            ))}
          </div>

          {/* Row 2: 3 cards centered */}
          <div className="flex justify-center gap-6 lg:gap-8">
            {FOCUS_AREAS.slice(4).map((area) => (
              <div key={area.id} className="w-[calc(25%-1.5rem)]">
                <FocusAreaCard
                  area={area}
                  onClick={handleCardClick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
