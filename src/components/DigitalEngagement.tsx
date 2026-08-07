import React from 'react';
import { ArrowRight, Mail, Users, Share2 } from 'lucide-react';
import { TabType } from '../types';
import { RCM_INFO } from '../data/rcmData';
import { useI18n } from '../i18n/I18nContext';

interface DigitalEngagementProps {
  setActiveTab: (tab: TabType) => void;
}

export const DigitalEngagement: React.FC<DigitalEngagementProps> = ({
  setActiveTab,
}) => {
  const { t } = useI18n();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#E7E2D8] transition-colors duration-300 relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#243447]/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Deep Warm Glass Banner Container */}
        <div className="relative overflow-hidden rounded-[18px] bg-[#F2EFE8] text-[#4A5565] p-8 sm:p-12 lg:p-16 shadow-lg border border-[#C9982B]/20 backdrop-blur-md">
          {/* Subtle Decorative Rotary Pattern Overlay */}
          <div className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full border border-[#243447]/5 pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full border border-[#243447]/5 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Copy Column */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center space-x-2 bg-[#17458F]/10 text-[#17458F] border border-[#17458F]/20 px-3.5 py-1 rounded-full text-xs font-montserrat font-bold uppercase tracking-wider shadow-xs">
                <Users className="w-3.5 h-3.5 text-[#17458F]" />
                <span>{t('Join People Of Action')}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#243447] leading-tight uppercase">
                {t('BE A ROTARIAN')}
              </h2>

              <p className="font-sans text-base sm:text-lg text-[#4A5565] max-w-2xl font-normal leading-relaxed">
                {t('Whether you are a business leader looking to give back, a young professional seeking mentorship, or an organization eager to partner on local initiatives — there is a place for you in the Mother Club of Makati.')}
              </p>

              {/* Social Channels Row */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-montserrat font-semibold text-[#6B7280]">
                <span className="flex items-center space-x-1 text-[#243447]">
                  <Share2 className="w-3.5 h-3.5 text-[#C9982B]" />
                  <span>{t('Connect With Us:')}</span>
                </span>
                <a
                  href={RCM_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#17458F] transition-colors underline text-[#17458F]"
                >
                  Facebook
                </a>
                <span>•</span>
                <a
                  href={RCM_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#17458F] transition-colors underline text-[#17458F]"
                >
                  YouTube
                </a>
                <span>•</span>
                <a
                  href={RCM_INFO.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#17458F] transition-colors underline text-[#17458F]"
                >
                  TikTok
                </a>
              </div>
            </div>

            {/* CTAs Column */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center">
              {/* Button 1: Apply for Membership */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Membership');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full bg-[#17458F] hover:bg-[#1D5CB8] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{t('Apply for Membership')}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              {/* Button 2: Contact Us */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Contact Us');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full bg-[#EEE9E0] hover:bg-[#E7E2D8] text-[#243447] border border-[#243447]/20 font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer backdrop-blur-xs"
              >
                <Mail className="w-4 h-4 text-[#17458F]" />
                <span>{t('Contact Us')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
