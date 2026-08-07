import React from 'react';
import { ArrowRight, History, Compass, Users } from 'lucide-react';
import { TabType, ThemeType } from '../types';
import { RCM_IMAGES, RCM_INFO } from '../data/rcmData';
import { ImageWithFallback } from './ImageWithFallback';
import { useI18n } from '../i18n/I18nContext';

interface HeritageSectionProps {
  setActiveTab: (tab: TabType) => void;
  theme: ThemeType;
}

export const HeritageSection: React.FC<HeritageSectionProps> = ({
  setActiveTab,
  theme,
}) => {
  const { t } = useI18n();

  return (
    <section className="py-20 transition-colors duration-300 bg-[#0F172A] text-[#CBD5E1] relative">
      {/* Subtle top section divider gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Column 1: Ceremony / Group Photo */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-[18px] overflow-hidden shadow-2xl border border-white/10 group">
              <ImageWithFallback
                src={RCM_IMAGES.groupCeremony}
                alt="Rotary Club of Makati Chartering & Ceremony"
                className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Subtle dark overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-black/30 to-transparent" />
              
              {/* Badge overlay on image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0F172A]/85 backdrop-blur-md border border-white/10 text-[#F8FAFC] shadow-lg">
                <p className="font-serif text-lg font-bold text-[#F7A81B]">
                  {t('common.charterCeremony')}
                </p>
                <p className="text-xs font-sans text-[#CBD5E1] mt-1">
                  {t('common.charterLocation')}
                </p>
              </div>
            </div>

            {/* Decorative Gold Frame Offset */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#F7A81B]/20 rounded-[18px] -z-0 hidden sm:block" />
          </div>

          {/* Column 2: History & Heritage Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30">
              <History className="w-4 h-4 text-[#F7A81B]" />
              <span>{t('common.institutionalHeritage')}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold leading-tight text-[#F8FAFC]">
              {t('common.motherClubTitle')}
            </h2>

            <p className="text-base sm:text-lg leading-relaxed font-normal text-[#CBD5E1]">
              {t('about.heritageBody')}
            </p>

            {/* Key Facts Highlights */}
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="p-5 rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-[16px] shadow-lg transition-all hover:border-[#F7A81B]/30">
                <div className="flex items-center space-x-2 mb-1.5">
                  <Compass className="w-4 h-4 text-[#F7A81B]" />
                  <span className="font-bold text-xs uppercase tracking-wider text-[#94A3B8]">
                    {t('common.guidingMotto')}
                  </span>
                </div>
                <p className="font-serif italic font-bold text-base text-[#F7A81B]">
                  "{RCM_INFO.motto}"
                </p>
              </div>

              <div className="p-5 rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-[16px] shadow-lg transition-all hover:border-[#F7A81B]/30">
                <div className="flex items-center space-x-2 mb-1.5">
                  <Users className="w-4 h-4 text-[#F7A81B]" />
                  <span className="font-bold text-xs uppercase tracking-wider text-[#94A3B8]">
                    {t('common.rotaryDistrict')}
                  </span>
                </div>
                <p className="font-serif font-bold text-base text-[#F8FAFC]">
                  District 3830
                </p>
              </div>
            </div>

            {/* Learn More CTA -> About Us Tab */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('About Us');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#17458F] hover:bg-[#123773] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all duration-200 inline-flex items-center space-x-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>{t('common.learnMoreHeritage')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
