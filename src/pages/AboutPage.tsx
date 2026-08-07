/* Light Mode overhaul — established section background rhythm (paper/white/gold-tint/navy alternating), visible borders on all cards, 3-tier button hierarchy. Applies sitewide. */

import React from 'react';
import {
  Award,
  Users,
  Globe,
  Building,
  Clock,
  HeartHandshake,
  Handshake,
  Sparkles,
  ShieldCheck,
  DollarSign,
  MapPin,
  ArrowRight,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  Target,
  Compass,
} from 'lucide-react';
import { TabType, ThemeType } from '../types';
import { RCM_IMAGES, RCM_INFO } from '../data/rcmData';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { HeritageVideoMoment } from '../components/HeritageVideoMoment';
import { useI18n } from '../i18n/I18nContext';

interface AboutPageProps {
  setActiveTab: (tab: TabType) => void;
  theme: ThemeType;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab, theme }) => {
  const { t } = useI18n();
  const isDark = theme === 'dark';

  return (
    <div className="animate-fadeIn space-y-0">
      {/* ------------------------------------------------------------------ */}
      {/* 1. ABOUT US HERO SECTION                                          */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center justify-center overflow-hidden text-[#F5F1E6]">
        {/* Background image layer (z-0) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/about-section/bg.jpg"
            alt="About Us section background"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://static.wixstatic.com/media/b2fb7d_7120845956ba471a8faed4ec2c05839c~mv2.jpg';
            }}
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.95) contrast(1.15) saturate(1.15)' }}
          />
        </div>

        {/* Dark navy overlay layer */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(1, 20, 46, 0.70) 0%, rgba(1, 20, 46, 0.88) 100%)',
          }}
        />

        {/* Hero Copy (z-10) */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center space-y-6 w-full max-w-full overflow-hidden">
          <div className="inline-flex items-center space-x-2 bg-[#F7A81B]/20 border border-[#F7A81B]/60 text-[#F7A81B] px-3.5 sm:px-4 py-1.5 rounded-full backdrop-blur-md max-w-full">
            <Sparkles className="w-4 h-4 text-[#F7A81B] shrink-0" />
            <span className="font-montserrat font-bold text-[10px] sm:text-xs uppercase tracking-widest text-[#F7A81B] truncate">
              {t('About Us')}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-extrabold text-[#F5F1E6] leading-tight drop-shadow-md max-w-4xl mx-auto break-words [word-break:break-word]">
            {t('Uniting and Taking Action to')} <br className="hidden sm:inline" />
            <span className="text-[#F7A81B] italic font-serif">{t('Create Lasting Change')}</span>
          </h1>

          <p className="font-montserrat text-xs sm:text-base text-[#F7A81B] uppercase tracking-wider font-semibold max-w-2xl mx-auto break-words [word-break:break-word]">
            {t('Across the globe, in our communities, and in ourselves.')}
          </p>

          <div className="pt-2 max-w-3xl mx-auto">
            <p className="font-sans text-sm sm:text-lg text-[#F5F1E6]/90 font-light leading-relaxed break-words [word-break:break-word]">
              The Rotary Club of Makati is the <strong className="font-semibold text-[#F7A81B]">"mother club"</strong> of all Rotary Clubs in Makati. It was the first club chartered in the City of Makati on <strong className="font-semibold text-[#F7A81B]">12 March 1966</strong>. The formal chartering ceremony by Rotary International was held at the Manila Polo Club in Forbes Park, and at that time, the Club had 46 members, two of whom are still on the club's roster.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. COMPACT VIDEO MOMENT — 60 YEARS, CAPTURED                      */}
      {/* ------------------------------------------------------------------ */}
      <HeritageVideoMoment theme={theme} />

      {/* ------------------------------------------------------------------ */}
      {/* 4. MISSION, VISION & CORE VALUES SECTION                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        className={`py-20 transition-colors duration-300 border-b ${
          isDark
            ? 'bg-[#011E41] border-[#F7A81B]/20 text-white'
            : 'bg-[#FAF8F3] border-[#011E41]/15 text-[#011E41]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 text-[#D97706] dark:text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/15 px-3.5 py-1.5 rounded-full border border-[#F7A81B]/40 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#D97706] dark:text-[#F7A81B]" />
              <span>What We Stand For</span>
            </div>

            <h2
              className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold ${
                isDark ? 'text-white' : 'text-[#011E41]'
              }`}
            >
              Vision, Mission & Guiding Principles
            </h2>

            <p className="text-sm sm:text-base font-sans text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              As a chartered club of Rotary International, RC Makati upholds these guiding statements in everything it does.
            </p>
          </div>

          {/* Vision + Mission Grid (2 Distinct Premium Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Vision Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0A2540] border-2 border-[#F7A81B]/40 shadow-xl text-white flex flex-col justify-between space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#F7A81B]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center space-x-2 bg-[#F7A81B]/20 border border-[#F7A81B]/50 px-3.5 py-1.5 rounded-full text-xs font-montserrat font-bold uppercase tracking-wider text-[#F7A81B]">
                  <Compass className="w-4 h-4 text-[#F7A81B]" />
                  <span>Our Vision</span>
                </div>

                <blockquote className="font-serif text-xl sm:text-2xl font-extrabold leading-relaxed italic text-white drop-shadow-sm pt-2">
                  “Together, we see a world where people unite and take action to create lasting change — across the globe, in our communities, and in ourselves.”
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[#F7A81B]/30 relative z-10">
                <p className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#F7A81B]">
                  — Rotary International Vision Statement
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0A2540] border-2 border-[#F7A81B]/40 shadow-xl text-white flex flex-col justify-between space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#F7A81B]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center space-x-2 bg-[#F7A81B]/20 border border-[#F7A81B]/50 px-3.5 py-1.5 rounded-full text-xs font-montserrat font-bold uppercase tracking-wider text-[#F7A81B]">
                  <Target className="w-4 h-4 text-[#F7A81B]" />
                  <span>Our Mission</span>
                </div>

                <p className="font-serif text-lg sm:text-xl font-medium leading-relaxed text-slate-100 pt-2">
                  We provide service to others, promote integrity, and advance world understanding, goodwill, and peace through our fellowship of business, professional, and community leaders.
                </p>
              </div>

              <div className="pt-4 border-t border-[#F7A81B]/30 relative z-10">
                <p className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#F7A81B]">
                  — Rotary Strategic Plan Mission
                </p>
              </div>
            </div>
          </div>

          {/* Core Values (4 Clean Photo-Top Cards Grid) */}
          <div className="space-y-8 pt-4">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#011E41] dark:text-[#F7A81B]">
                Rotary Core Values
              </h3>
              <p className="text-xs sm:text-sm font-montserrat font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                The Four Pillars of Rotary Fellowship & Service
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pillar 1: Fellowship */}
              <div
                className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 shadow-lg flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#0A2540] border-[#F7A81B]/30 hover:border-[#F7A81B] text-white'
                    : 'bg-white border-[#011E41]/15 hover:border-[#011E41]/40 text-[#011E41]'
                }`}
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <ImageWithFallback
                      src="https://static.wixstatic.com/media/941b16_b8f80fe80e2243b7ae964af0f2049fc4~mv2.jpeg"
                      alt="RC Makati fellowship and teamwork"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-[#F7A81B] text-[#011E41]">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-white drop-shadow-md">
                        Fellowship
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className="font-serif font-bold text-lg text-[#011E41] dark:text-white">
                      Lifelong Bonds
                    </h4>
                    <p className="text-xs sm:text-sm font-sans leading-relaxed text-slate-600 dark:text-slate-300">
                      We build lifelong relationships and foster deep international camaraderie across professions and cultures.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Integrity */}
              <div
                className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 shadow-lg flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#0A2540] border-[#F7A81B]/30 hover:border-[#F7A81B] text-white'
                    : 'bg-white border-[#011E41]/15 hover:border-[#011E41]/40 text-[#011E41]'
                }`}
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <ImageWithFallback
                      src="https://static.wixstatic.com/media/941b16_fee94a5547814ae6b8ff9aa69c809b81~mv2.jpeg"
                      alt="RC Makati officers and directors"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-[#F7A81B] text-[#011E41]">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-white drop-shadow-md">
                        Integrity
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className="font-serif font-bold text-lg text-[#011E41] dark:text-white">
                      High Ethics
                    </h4>
                    <p className="text-xs sm:text-sm font-sans leading-relaxed text-slate-600 dark:text-slate-300">
                      We honor our commitments, promote ethics, and lead with accountability in everything we do.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Diversity */}
              <div
                className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 shadow-lg flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#0A2540] border-[#F7A81B]/30 hover:border-[#F7A81B] text-white'
                    : 'bg-white border-[#011E41]/15 hover:border-[#011E41]/40 text-[#011E41]'
                }`}
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <ImageWithFallback
                      src="https://i.ytimg.com/vi/VXwVbzl7doU/maxresdefault.jpg"
                      alt="RC Makati AI Academy graduating class"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-[#F7A81B] text-[#011E41]">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-white drop-shadow-md">
                        Diversity
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className="font-serif font-bold text-lg text-[#011E41] dark:text-white">
                      Inclusive Network
                    </h4>
                    <p className="text-xs sm:text-sm font-sans leading-relaxed text-slate-600 dark:text-slate-300">
                      We unite diverse perspectives, cultures, and vocations to solve local and global challenges.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 4: Service & Leadership */}
              <div
                className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 shadow-lg flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#0A2540] border-[#F7A81B]/30 hover:border-[#F7A81B] text-white'
                    : 'bg-white border-[#011E41]/15 hover:border-[#011E41]/40 text-[#011E41]'
                }`}
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <ImageWithFallback
                      src="https://static.wixstatic.com/media/b2fb7d_a9b11276feb747a9a98acbff46597292~mv2.jpg"
                      alt="RC Makati dental mission at Sisters of Mary"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-[#F7A81B] text-[#011E41]">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-white drop-shadow-md">
                        Service & Leadership
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className="font-serif font-bold text-lg text-[#011E41] dark:text-white">
                      Action Above Self
                    </h4>
                    <p className="text-xs sm:text-sm font-sans leading-relaxed text-slate-600 dark:text-slate-300">
                      We deploy our leadership skills and professional expertise to transform lives and communities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Four-Way Test (Clean, High-Contrast Banner) */}
          <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-[#011E41] border-2 border-[#F7A81B]/40 shadow-2xl text-white space-y-10 relative overflow-hidden">
            {/* Ambient Background Radial Glow */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F7A81B]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto space-y-3 relative z-10">
              <div className="inline-flex items-center space-x-2 bg-[#F7A81B] text-[#011E41] px-4 py-1.5 rounded-full text-xs font-montserrat font-extrabold uppercase tracking-widest shadow-md">
                <span>Rotary Ethical Standards</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F7A81B] tracking-tight">
                The Four-Way Test
              </h3>

              <p className="font-serif italic text-base sm:text-lg text-slate-200 font-medium">
                Of the things we think, say, or do —
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[
                { num: '1', title: 'Truth', text: 'Is it the TRUTH?', image: '/four-way-test/test-1.jpg' },
                { num: '2', title: 'Fairness', text: 'Is it FAIR to all concerned?', image: '/four-way-test/test-2.jpg' },
                { num: '3', title: 'Goodwill', text: 'Will it build GOODWILL and BETTER FRIENDSHIPS?', image: '/four-way-test/test-3.jpg' },
                { num: '4', title: 'Beneficial', text: 'Will it be BENEFICIAL to all concerned?', image: '/four-way-test/test-4.jpg' },
              ].map((q) => (
                <div
                  key={q.num}
                  className="relative overflow-hidden p-6 rounded-2xl bg-[#0A2540] border border-[#F7A81B]/30 space-y-4 flex flex-col justify-between shadow-xl hover:border-[#F7A81B] transition-colors group"
                >
                  {/* Background image layer (z-0) */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={q.image}
                      alt={`Test ${q.num}: ${q.title}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      style={{ filter: 'brightness(0.95) contrast(1.15) saturate(1.15)' }}
                    />
                  </div>

                  {/* Dark navy overlay layer (z-1) */}
                  <div
                    className="absolute inset-0 z-1 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(1, 20, 46, 0.60) 0%, rgba(1, 20, 46, 0.85) 100%)',
                    }}
                  />

                  {/* Content layer (z-10) */}
                  <div className="relative z-10 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#F7A81B] text-[#011E41] font-serif font-extrabold text-lg flex items-center justify-center shadow-md shrink-0">
                      {q.num}
                    </div>
                    <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#F7A81B]">
                      Test {q.num}
                    </span>
                  </div>
                  <p className="relative z-10 font-serif text-lg sm:text-xl font-bold text-white leading-snug drop-shadow-sm">
                    {q.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. MEETINGS CALLOUT BLOCK                                         */}
      {/* ------------------------------------------------------------------ */}
      <section
        className={`py-8 transition-colors duration-300 border-b ${
          isDark
            ? 'bg-[#121212] border-[#F7A81B]/10 text-[#F5F1E6]'
            : 'bg-[#E7E2D8] border-[#243447]/10 text-[#243447]'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`p-6 sm:p-8 rounded-2xl border-l-4 border-[#C9982B] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isDark
                ? 'bg-[#011E41]/90 border border-[#F7A81B]/30'
                : 'bg-[#F2EFE8] border border-[#243447]/10'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-[#17458F]/10 text-[#17458F] shrink-0 mt-1 sm:mt-0">
                <Clock className="w-6 h-6 text-[#17458F]" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 text-[#C9982B] font-montserrat font-bold text-xs uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Meetings</span>
                </div>
                <p className={`font-serif text-lg sm:text-xl font-bold ${isDark ? 'text-[#F5F1E6]' : 'text-[#243447]'}`}>
                  The Club meets every Tuesday at noontime at the Conservatory of The Manila Peninsula.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('Contact Us');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#17458F] hover:bg-[#1D5CB8] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-md transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Inquire to Attend
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. COMPOSITION SECTION                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden py-20 text-[#F5F1E6]">
        {/* Background image layer (z-0) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/vanguard-section/bg.jpg"
            alt="A Distinguished Vanguard section background"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg';
            }}
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.95) contrast(1.15) saturate(1.15)' }}
          />
        </div>

        {/* Dark navy overlay layer */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(1, 20, 46, 0.75) 0%, rgba(1, 20, 46, 0.90) 100%)',
          }}
        />

        {/* Content layer (z-10) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Column 1: Service / Community Photo (Contained Boxed Card) */}
            <div className="lg:col-span-6 relative">
              <div className="p-3 sm:p-4 rounded-3xl bg-[#011E41]/90 border border-[#F7A81B]/40 shadow-2xl backdrop-blur-md">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-[#F7A81B]/30 group">
                  <ImageWithFallback
                    src={RCM_IMAGES.serviceCommunity}
                    alt="Rotary Club of Makati Service & Community Engagement"
                    className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011E41]/80 via-transparent to-transparent opacity-70" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-[#011E41]/95 backdrop-blur-md border border-[#F7A81B]/30 text-xs text-[#F5F1E6]">
                    <strong className="text-[#F7A81B]">Community Action:</strong> Business leaders and professionals serving together in Makati.
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Composition Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/20 px-3 py-1 rounded-full border border-[#F7A81B]/40">
                <Users className="w-4 h-4 text-[#F7A81B]" />
                <span>Composition</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold leading-tight text-white drop-shadow-sm">
                A Distinguished Vanguard of Corporate & Civic Leaders
              </h2>

              <p className="text-base sm:text-lg leading-relaxed font-light text-slate-200 opacity-95">
                The club is composed of businessmen and professionals representing a wide range of fields. About half of the club are chief executive officers, chief operating officers, or chief finance officers of the country's largest corporations; a fourth are heads or senior officers of financial institutions...
              </p>

              <p className="text-sm sm:text-base leading-relaxed text-slate-300 opacity-90">
                ...while the rest are principal officers of multilateral institutions, seasoned businessmen, and leading practitioners in the fields of law, medicine, banking, accountancy, engineering, architecture, consultancy, and information technology, among others.
              </p>

              {/* Vocation Tag Chips */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-montserrat font-semibold">
                {['CEOs & CFOs', 'Banking & Finance', 'Law & Medicine', 'Architecture & Engineering', 'Diplomatic Corps', 'IT & Tech'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full border bg-[#011E41]/90 border-[#F7A81B]/40 text-[#F7A81B] shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. TRF CONTRIBUTIONS (STAT BLOCK)                                 */}
      {/* ------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------ */}
      {/* 4. TRF BENEFACTOR SECTION                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden py-20 text-[#F5F1E6]">
        {/* Background image layer (z-0) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/benefactor-section/bg.jpg"
            alt="District 3830's Top Benefactor section background"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://static.wixstatic.com/media/b2fb7d_daebb40a8d074468890b4fc57e3ff879~mv2.jpg';
            }}
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.95) contrast(1.15) saturate(1.15)' }}
          />
        </div>

        {/* Dark navy overlay layer */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(1, 20, 46, 0.75) 0%, rgba(1, 20, 46, 0.90) 100%)',
          }}
        />

        {/* Content layer (z-10) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/20 px-3 py-1 rounded-full border border-[#F7A81B]/40 shadow-sm">
              <DollarSign className="w-4 h-4 text-[#F7A81B]" />
              <span>The Rotary Foundation (TRF) Contributions</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-sm">
              District 3830's Top Benefactor
            </h2>

            <p className="text-base sm:text-lg font-light text-slate-200 opacity-95 leading-relaxed max-w-2xl mx-auto">
              The club has consistently been the district's biggest contributor to The Rotary Foundation of Rotary International. <span className="text-xs text-[#F7A81B] font-montserrat uppercase block mt-1 font-semibold">(Data as of 12 March 2024)</span>
            </p>
          </div>

          {/* 4 Stat Cards in a Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1 */}
            <div className="p-7 rounded-2xl bg-[#011E41]/90 border border-[#F7A81B]/30 backdrop-blur-md shadow-xl hover:border-[#F7A81B] hover:-translate-y-1 transition-all flex flex-col justify-between text-center space-y-3">
              <div className="p-3 bg-[#F7A81B]/15 w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-[#F7A81B]">
                <Award className="w-6 h-6 text-[#F7A81B]" />
              </div>
              <div className="space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-[#F7A81B]">
                  US$2,602,053
                </div>
                <div className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#F7A81B]/90">
                  Aggregate TRF Contribution
                </div>
              </div>
              <p className="text-xs font-sans text-slate-200 opacity-90 pt-2 border-t border-[#F7A81B]/20">
                Cumulative philanthropic giving to global Rotary initiatives.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="p-7 rounded-2xl bg-[#011E41]/90 border border-[#F7A81B]/30 backdrop-blur-md shadow-xl hover:border-[#F7A81B] hover:-translate-y-1 transition-all flex flex-col justify-between text-center space-y-3">
              <div className="p-3 bg-[#F7A81B]/15 w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-[#F7A81B]">
                <Star className="w-6 h-6 text-[#F7A81B]" />
              </div>
              <div className="space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-[#F7A81B]">
                  $19,712
                </div>
                <div className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#F7A81B]/90">
                  Per Capita Contribution
                </div>
              </div>
              <p className="text-xs font-sans text-slate-200 opacity-90 pt-2 border-t border-[#F7A81B]/20">
                Highest per capita giving record across District 3830.
              </p>
            </div>

            {/* Stat 3 */}
            <div className="p-7 rounded-2xl bg-[#011E41]/90 border border-[#F7A81B]/30 backdrop-blur-md shadow-xl hover:border-[#F7A81B] hover:-translate-y-1 transition-all flex flex-col justify-between text-center space-y-3">
              <div className="p-3 bg-[#F7A81B]/15 w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-[#F7A81B]">
                <ShieldCheck className="w-6 h-6 text-[#F7A81B]" />
              </div>
              <div className="space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-[#F7A81B]">
                  4
                </div>
                <div className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#F7A81B]/90">
                  Arch Klumph Society Members
                </div>
              </div>
              <p className="text-xs font-sans text-slate-200 opacity-90 pt-2 border-t border-[#F7A81B]/20">
                Contributions exceeding $250,000 each <span className="block text-[11px] font-semibold text-[#F7A81B]">(2 active, 2 deceased †)</span>
              </p>
            </div>

            {/* Stat 4 */}
            <div className="p-7 rounded-2xl bg-[#011E41]/90 border border-[#F7A81B]/30 backdrop-blur-md shadow-xl hover:border-[#F7A81B] hover:-translate-y-1 transition-all flex flex-col justify-between text-center space-y-3">
              <div className="p-3 bg-[#F7A81B]/15 w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-[#F7A81B]">
                <Users className="w-6 h-6 text-[#F7A81B]" />
              </div>
              <div className="space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-[#F7A81B]">
                  29
                </div>
                <div className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#F7A81B]/90">
                  Major Donors
                </div>
              </div>
              <p className="text-xs font-sans text-slate-200 opacity-90 pt-2 border-t border-[#F7A81B]/20">
                Members who have individually contributed $10,000 or more to TRF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. MEMBERSHIP SECTION & NOTABLE MEMBERS                            */}
      {/* ------------------------------------------------------------------ */}
      <section
        className={`py-20 transition-colors duration-300 ${
          isDark ? 'bg-[#011E41] text-[#F5F1E6]' : 'bg-[#FAF8F3] text-[#011E41]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/15 px-3.5 py-1.5 rounded-full border border-[#F7A81B]/40 shadow-sm">
              <Users className="w-4 h-4 text-[#F7A81B]" />
              <span>Membership Roster</span>
            </div>

            <h2
              className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold ${
                isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'
              }`}
            >
              A Diverse & High-Caliber Fellowship
            </h2>
            <p className="text-base sm:text-lg font-light leading-relaxed text-slate-600 dark:text-slate-300">
              One of the largest and most prestigious Rotary clubs in District 3830, uniting top leaders and professionals across eleven nationalities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Block: Composition & Classifications */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="relative overflow-hidden p-8 rounded-3xl border border-[#F7A81B]/30 shadow-2xl h-full flex flex-col justify-between space-y-6 text-white">
                {/* Layer 0: Background Image (z-0) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    backgroundImage: 'url(/roster-stats-section/bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                {/* Layer 1: Dark Navy Gradient Overlay for High Contrast Readability (z-1) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-1 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(1, 20, 46, 0.75) 0%, rgba(1, 20, 46, 0.90) 100%)',
                  }}
                />

                {/* Layer 10: Foreground Content (z-10) */}
                <div className="relative z-10 flex flex-col justify-between space-y-6 h-full">
                  {/* Stat Counters */}
                  <div className="grid grid-cols-3 gap-4 pb-6 border-b border-[#F7A81B]/25 text-center">
                    <div className="p-3 rounded-2xl bg-[#011E41]/80 border border-[#F7A81B]/30 shadow-md">
                      <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#F7A81B] block">132</span>
                      <span className="text-[11px] font-montserrat uppercase font-bold tracking-wider mt-1 text-slate-100 block">Regular</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#011E41]/80 border border-[#F7A81B]/30 shadow-md">
                      <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#F7A81B] block">10</span>
                      <span className="text-[11px] font-montserrat uppercase font-bold tracking-wider mt-1 text-slate-100 block">Honorary</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#011E41]/80 border border-[#F7A81B]/30 shadow-md">
                      <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#F7A81B] block">11</span>
                      <span className="text-[11px] font-montserrat uppercase font-bold tracking-wider mt-1 text-slate-100 block">Nations</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm sm:text-base leading-relaxed text-slate-100 font-normal">
                      As of 23 January 2024, the membership of RC Makati stood at 132 regular members and 10 honoraries, making it one of the largest clubs in District 3830. Its international character is reflected in the diversity of cultures represented by the <strong className="font-bold text-[#F7A81B]">eleven nationalities</strong> in its roster.
                    </p>

                    <div className="pt-2">
                      <span className="block text-xs font-montserrat font-bold uppercase tracking-wider text-[#F7A81B] mb-2.5">
                        Diverse Professional Classifications
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Law', 'Medicine', 'Banking', 'Accountancy', 'Engineering',
                          'Architecture', 'Automotive', 'Consultancy', 'Hospitality',
                          'Information Technology', 'Diplomatic Corps'
                        ].map((cls, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 rounded-full font-medium border border-[#F7A81B]/30 bg-[#011E41]/85 text-slate-100 shadow-sm"
                          >
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Block: Notable Members & District Governors */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="relative overflow-hidden p-8 rounded-3xl border border-[#F7A81B]/30 shadow-2xl h-full flex flex-col justify-between space-y-6 text-white">
                {/* Layer 0: Background Image (z-0) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    backgroundImage: 'url(/leaders-section/bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                {/* Layer 1: Dark Navy Gradient Overlay for High Contrast Readability (z-1) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-1 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(1, 20, 46, 0.75) 0%, rgba(1, 20, 46, 0.90) 100%)',
                  }}
                />

                {/* Layer 10: Foreground Content (z-10) */}
                <div className="relative z-10 flex flex-col justify-between space-y-6 h-full">
                  <div className="flex items-center space-x-3.5 border-b border-[#F7A81B]/25 pb-4">
                    <div className="p-3 rounded-2xl bg-[#F7A81B]/20 text-[#F7A81B] border border-[#F7A81B]/30 shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-white">
                        Notable Leaders & Roster Legacy
                      </h3>
                      <p className="text-xs font-montserrat font-bold uppercase text-[#F7A81B] tracking-wider">
                        Past RI Directors & District Governors
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-sans leading-relaxed text-slate-100">
                    RC Makati is proud of the distinction of its members, including a past Rotary International director, <strong className="font-bold text-[#F7A81B]">Rafael Hechanova †</strong>, and seven district governors:
                  </p>

                  {/* Governors List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { name: 'Rafael Hechanova', role: 'Past RI Director & DG', deceased: true },
                      { name: 'Bert Montinola', role: 'Past District Governor', deceased: true },
                      { name: 'Tony Quila', role: 'Past District Governor', deceased: false },
                      { name: 'Sid Garcia', role: 'Past District Governor', deceased: false },
                      { name: 'Robert Kuan', role: 'Past District Governor', deceased: true },
                      { name: 'Pepito Bengzon', role: 'Past District Governor', deceased: false },
                      { name: 'Reggie Nolido', role: 'District Governor Nominee (DGN)', deceased: false },
                    ].map((gov, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-[#F7A81B]/25 bg-[#011E41]/90 text-white flex items-start space-x-2.5 transition-colors shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#F7A81B] shrink-0 mt-0.5" />
                        <div className="text-xs space-y-0.5">
                          <span className="font-bold block text-white">
                            {gov.name} {gov.deceased && <span className="text-[#F7A81B] font-semibold" title="In Memoriam">†</span>}
                          </span>
                          <span className="text-slate-300 text-[11px] font-medium block">{gov.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] font-sans text-slate-300 italic text-right pt-2 border-t border-[#F7A81B]/20">
                    † In Memoriam — honoring our deceased leaders who served with distinction.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated Section Quick-Nav Action Banner */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab('Board of Directors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group cursor-pointer flex items-center justify-between ${
                isDark
                  ? 'bg-[#0A2540] border-[#F7A81B]/40 hover:border-[#F7A81B] text-white'
                  : 'bg-white border-[#011E41]/20 hover:border-[#F7A81B] text-[#011E41]'
              }`}
            >
              <div className="space-y-1">
                <div className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#D97706] dark:text-[#F7A81B] flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Board of Directors</span>
                </div>
                <div className="font-serif text-sm font-bold text-slate-900 dark:text-white">
                  Meet Current Officers
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D97706] dark:text-[#F7A81B] group-hover:translate-x-1.5 transition-transform shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('Roster of Presidents');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group cursor-pointer flex items-center justify-between ${
                isDark
                  ? 'bg-[#0A2540] border-[#F7A81B]/40 hover:border-[#F7A81B] text-white'
                  : 'bg-white border-[#011E41]/20 hover:border-[#F7A81B] text-[#011E41]'
              }`}
            >
              <div className="space-y-1">
                <div className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#D97706] dark:text-[#F7A81B] flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Roster of Presidents</span>
                </div>
                <div className="font-serif text-sm font-bold text-slate-900 dark:text-white">
                  Historical 60-Yr Timeline
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D97706] dark:text-[#F7A81B] group-hover:translate-x-1.5 transition-transform shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('Partnerships');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group cursor-pointer flex items-center justify-between ${
                isDark
                  ? 'bg-[#0A2540] border-[#F7A81B]/40 hover:border-[#F7A81B] text-white'
                  : 'bg-white border-[#011E41]/20 hover:border-[#F7A81B] text-[#011E41]'
              }`}
            >
              <div className="space-y-1">
                <div className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#D97706] dark:text-[#F7A81B] flex items-center space-x-2">
                  <Handshake className="w-4 h-4" />
                  <span>Partnerships</span>
                </div>
                <div className="font-serif text-sm font-bold text-slate-900 dark:text-white">
                  Impact Alliances
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D97706] dark:text-[#F7A81B] group-hover:translate-x-1.5 transition-transform shrink-0 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. MATCHED CLUBS                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section
        className={`relative py-20 sm:py-24 transition-colors duration-300 border-t border-b overflow-hidden ${
          isDark
            ? 'border-[#F7A81B]/20 text-[#F5F1E6]'
            : 'border-[#011E41]/20 text-[#F5F1E6]'
        }`}
      >
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/brotherhood_agreement.jpg"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://static.wixstatic.com/media/83b216_7a92dd9abba14620a42d323fe4cb88c6~mv2.jpg';
            }}
            alt="National & Global Rotary Alliances Signing"
            className="w-full h-full object-cover object-center filter brightness-90 transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#011E41]/90 via-[#011E41]/85 to-[#011E41]/95 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-white">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/15 px-4 py-1.5 rounded-full border border-[#F7A81B]/40 backdrop-blur-md shadow-lg">
              <Globe className="w-4 h-4 text-[#F7A81B]" />
              <span>Matched Clubs</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">
              National & Global Rotary Alliances
            </h2>

            <p className="text-base font-light text-slate-200 leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
              The club has initiated and maintains "matched clubs" relations with other Rotary clubs, kept fresh with periodic exchanges of visits and mutual support for each other's projects.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1: Brother Clubs */}
            <div
              className={`p-8 rounded-3xl border text-center space-y-4 shadow-2xl flex flex-col items-center justify-between transition-transform hover:-translate-y-1 backdrop-blur-md ${
                isDark
                  ? 'bg-[#011E41]/85 border-[#F7A81B]/40 text-[#F5F1E6]'
                  : 'bg-[#011E41]/80 border-[#F7A81B]/50 text-white'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-[#F7A81B]/20 text-[#F7A81B] flex items-center justify-center border border-[#F7A81B]/50 shadow-inner">
                <Building className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="font-serif text-4xl font-extrabold text-[#F7A81B] drop-shadow-sm">
                  21 Brother Clubs
                </div>
                <p className="font-montserrat font-bold text-xs uppercase tracking-wider text-amber-200/90">
                  Across Various Parts of the Philippines
                </p>
              </div>
              <p className="text-xs font-sans text-slate-200 max-w-xs leading-relaxed">
                Partnering on domestic disaster relief, medical caravans, and youth scholarship expansions.
              </p>
            </div>

            {/* Card 2: Sister Clubs */}
            <div
              className={`p-8 rounded-3xl border text-center space-y-4 shadow-2xl flex flex-col items-center justify-between transition-transform hover:-translate-y-1 backdrop-blur-md ${
                isDark
                  ? 'bg-[#011E41]/85 border-[#F7A81B]/40 text-[#F5F1E6]'
                  : 'bg-[#011E41]/80 border-[#F7A81B]/50 text-white'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-[#F7A81B]/20 text-[#F7A81B] flex items-center justify-center border border-[#F7A81B]/50 shadow-inner">
                <Globe className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="font-serif text-4xl font-extrabold text-[#F7A81B] drop-shadow-sm">
                  10 Sister Clubs
                </div>
                <p className="font-montserrat font-bold text-xs uppercase tracking-wider text-amber-200/90">
                  Across Various Parts of the World
                </p>
              </div>
              <p className="text-xs font-sans text-slate-200 max-w-xs leading-relaxed">
                Fostering international peacebuilding, global grant matching, and cultural exchanges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. HONORS & RECOGNITIONS                                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        className={`relative py-20 transition-colors duration-300 border-b overflow-hidden ${
          isDark ? 'border-[#F7A81B]/20' : 'border-[#011E41]/20'
        }`}
      >
        {/* Background Image with Dark Navy Gradient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://live.staticflickr.com/65535/54518297996_cf2c36d780_b.jpg"
            alt="Rotary Club of Makati Honors and Recognitions"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-90 transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#011E41]/90 via-[#011E41]/85 to-[#011E41]/95 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-white">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/15 px-4 py-1.5 rounded-full border border-[#F7A81B]/40 backdrop-blur-md shadow-lg">
              <Award className="w-4 h-4 text-[#F7A81B]" />
              <span>Honors & Recognitions</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-md">
              Excellence & Distinction
            </h2>

            <p className="text-base font-light text-slate-200 leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
              Decades of unwavering commitment to Rotary ideals recognized locally, nationally, and internationally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Honor 1 */}
            <div
              className={`p-7 rounded-2xl border space-y-3 shadow-xl backdrop-blur-md flex items-start space-x-4 ${
                isDark
                  ? 'bg-[#011E41]/85 border-[#F7A81B]/40 text-[#F5F1E6]'
                  : 'bg-[#011E41]/80 border-[#F7A81B]/50 text-white'
              }`}
            >
              <div className="p-3 bg-[#F7A81B]/20 text-[#F7A81B] rounded-xl shrink-0 mt-1 border border-[#F7A81B]/30">
                <Star className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#F7A81B]">
                  6-Time Most Outstanding Club
                </h3>
                <p className="text-sm font-sans leading-relaxed opacity-95">
                  Recipient of District 3830's <strong>Overall Most Outstanding Club</strong> and <strong>Overall Most Outstanding Club President</strong> awards across six charter years.
                </p>
              </div>
            </div>

            {/* Honor 2 */}
            <div
              className={`p-7 rounded-2xl border space-y-3 shadow-xl backdrop-blur-md flex items-start space-x-4 ${
                isDark
                  ? 'bg-[#011E41]/85 border-[#F7A81B]/40 text-[#F5F1E6]'
                  : 'bg-[#011E41]/80 border-[#F7A81B]/50 text-white'
              }`}
            >
              <div className="p-3 bg-[#F7A81B]/20 text-[#F7A81B] rounded-xl shrink-0 mt-1 border border-[#F7A81B]/30">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#F7A81B]">
                  6 Service Above Self Awards
                </h3>
                <p className="text-sm font-sans leading-relaxed opacity-95">
                  6 club members are recipients of the <strong>Service Above Self Award</strong>, the highest honor Rotary International bestows on individual Rotarians.
                </p>
              </div>
            </div>

            {/* Honor 3 */}
            <div
              className={`p-7 rounded-2xl border space-y-3 shadow-xl backdrop-blur-md flex items-start space-x-4 ${
                isDark
                  ? 'bg-[#011E41]/85 border-[#F7A81B]/40 text-[#F5F1E6]'
                  : 'bg-[#011E41]/80 border-[#F7A81B]/50 text-white'
              }`}
            >
              <div className="p-3 bg-[#F7A81B]/20 text-[#F7A81B] rounded-xl shrink-0 mt-1 border border-[#F7A81B]/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#F7A81B]">
                  2 RI Significant Achievement Awards
                </h3>
                <p className="text-sm font-sans leading-relaxed opacity-95">
                  Awarded for establishing the <strong>Makati Rotary Club Foundation, Inc.</strong>, and for <strong>Project Angels</strong>, an environmental advocacy program for youth.
                </p>
              </div>
            </div>

            {/* Honor 4 */}
            <div
              className={`p-7 rounded-2xl border space-y-3 shadow-xl backdrop-blur-md flex items-start space-x-4 ${
                isDark
                  ? 'bg-[#011E41]/85 border-[#F7A81B]/40 text-[#F5F1E6]'
                  : 'bg-[#011E41]/80 border-[#F7A81B]/50 text-white'
              }`}
            >
              <div className="p-3 bg-[#F7A81B]/20 text-[#F7A81B] rounded-xl shrink-0 mt-1 border border-[#F7A81B]/30">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#F7A81B]">
                  Top Service Project Award (Rotary Homes)
                </h3>
                <p className="text-sm font-sans leading-relaxed opacity-95">
                  Recognized by RC Manila as among the <strong>Top Ten Service Projects in the Philippines</strong> during its centennial celebration on June 1, 2019 — with Rotary Homes conferred the <strong>Top Service Project Award</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 8. DAUGHTER CLUBS                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        className={`py-16 sm:py-20 transition-colors duration-300 border-t border-b ${
          isDark
            ? 'bg-[#011E41]/50 border-[#F7A81B]/20'
            : 'bg-[#FAF8F3] border-[#011E41]/20'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="p-8 sm:p-10 rounded-3xl border shadow-2xl bg-[#011E41] border-[#F7A81B]/40 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          >
            {/* Background subtle glow */}
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#F7A81B]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-3 text-center md:text-left relative z-10 max-w-2xl">
              <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/20 px-3.5 py-1.5 rounded-full border border-[#F7A81B]/40">
                <Layers className="w-4 h-4 text-[#F7A81B]" />
                <span>Daughter Clubs</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                Expanding District Leadership
              </h3>
              <p className="text-base font-sans text-slate-200 leading-relaxed font-normal">
                Rotary Club of Makati has organized and chartered <strong className="text-[#F7A81B] font-bold">12 "daughter" clubs</strong> across Metro Manila and surrounding districts, multiplying Rotary's reach, expanding community leadership, and fostering local service impact.
              </p>
            </div>

            <div className="shrink-0 text-center bg-[#F7A81B]/20 border-2 border-[#F7A81B]/60 px-9 py-7 rounded-2xl shadow-xl backdrop-blur-md relative z-10 w-full md:w-auto">
              <span className="font-serif text-5xl sm:text-6xl font-extrabold text-[#F7A81B] block drop-shadow-md">12</span>
              <span className="text-xs font-montserrat uppercase font-bold tracking-wider text-amber-200 mt-1 block">Daughter Clubs Sponsored</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 9. MAKATI ROTARY CLUB FOUNDATION, INC. (MRCFI)                    */}
      {/* ------------------------------------------------------------------ */}
      <section
        className={`py-20 transition-colors duration-300 ${
          isDark ? 'bg-[#011E41] text-[#F5F1E6]' : 'bg-[#FAF8F3] text-[#2A2A2A]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`p-8 sm:p-12 rounded-3xl border shadow-2xl relative overflow-hidden ${
              isDark
                ? 'bg-[#121212] border-[#F7A81B]/40'
                : 'bg-[#F0EDE6] border-[#011E41]/20'
            }`}
          >
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center space-x-2 bg-[#F7A81B] text-[#011E41] px-3.5 py-1 rounded-full text-xs font-montserrat font-bold uppercase tracking-wider shadow-sm">
                  <Building className="w-3.5 h-3.5" />
                  <span>Funding Partner</span>
                </div>

                <h2
                  className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold ${
                    isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'
                  }`}
                >
                  Makati Rotary Club Foundation, Inc. (MRCFI)
                </h2>

                <p className="text-base sm:text-lg leading-relaxed font-light opacity-95">
                  RC Makati has the distinction of having a well-endowed funding partner, the <strong className="font-semibold text-[#F7A81B]">Makati Rotary Club Foundation, Inc. (MRCFI)</strong>, that allows it to carry out long-term projects that benefit large numbers of people.
                </p>

                <p className="text-sm sm:text-base leading-relaxed opacity-85">
                  In its early years, the Foundation derived funds from rental income from its 3-storey arcade at the Makati Commercial Center, creating a permanent financial cornerstone for sustainable philanthropy.
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="p-6 rounded-2xl bg-[#011E41] border border-[#F7A81B]/40 text-[#F5F1E6] text-center space-y-3 shadow-xl w-full">
                  <Building className="w-12 h-12 text-[#F7A81B] mx-auto" />
                  <div className="font-serif text-xl font-bold text-[#F7A81B]">MRCFI Building</div>
                  <p className="text-xs font-sans opacity-80">
                    8001 Camia St., Guadalupe Viejo, Makati City
                  </p>
                  <span className="inline-block text-[11px] font-montserrat uppercase tracking-wider text-[#F7A81B] font-bold border-t border-[#F7A81B]/20 pt-2 w-full">
                    Permanent Foundation Seat
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 10. CLOSING CTA BANNER                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F3] dark:bg-[#121212] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-[#F7A81B] text-[#011E41] p-8 sm:p-12 text-center space-y-6 shadow-2xl border-2 border-[#D98E0E]">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#011E41]">
              Ready to Join Us?
            </h2>
            <p className="font-sans text-base sm:text-lg max-w-2xl mx-auto font-medium text-[#011E41]/90">
              Become a member of the Mother Club of Makati and lead high-impact service projects in our community.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('Membership');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#011E41] hover:bg-[#011E41]/90 text-[#F5F1E6] font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-xl inline-flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Apply for Membership</span>
              <ArrowRight className="w-4 h-4 text-[#F7A81B]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
