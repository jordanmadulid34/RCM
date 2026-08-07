import React, { useState, useMemo, useEffect } from 'react';
import {
  Award,
  Search,
  X,
  Crown,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  History,
  Users,
  UserCheck,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Tv,
  Play,
} from 'lucide-react';
import { TabType, ThemeType } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { RCM_PRESIDENTS, PastPresident } from '../data/presidentsData';
import { RCM_IMAGES } from '../data/rcmData';

interface PresidentsPageProps {
  setActiveTab: (tab: TabType) => void;
  theme: ThemeType;
}

const DECADE_ORDER: Array<'1966–1979' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s'> = [
  '2020s',
  '2010s',
  '2000s',
  '1990s',
  '1980s',
  '1966–1979',
];

function getMemberInitials(fullName: string): string {
  const cleanName = fullName
    .replace(/^(PE|PP|IPP|PDG|PN|DS\/PP|DS|Gov\.)\s+/i, '')
    .trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'RC';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

interface PresidentAvatarProps {
  president: PastPresident;
  sizeClass?: string;
  isDark: boolean;
}

const PresidentAvatar: React.FC<PresidentAvatarProps> = ({
  president,
  sizeClass = 'w-16 h-16 sm:w-20 sm:h-20',
  isDark,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initials = getMemberInitials(president.name);
  const officialSealUrl = 'https://static.wixstatic.com/media/941b16_6f6644683ff84002be72f4eda47c4794~mv2.png';

  if (!president.photoUrl || hasError) {
    return (
      <div
        className={`relative ${sizeClass} rounded-2xl overflow-hidden border-2 shrink-0 flex flex-col items-center justify-center transition-all duration-300 shadow-md ${
          president.isCurrent
            ? 'border-[#F7A81B] bg-gradient-to-br from-[#011E41] via-[#011E41]/95 to-[#121212] text-[#F7A81B]'
            : isDark
            ? 'border-[#F7A81B]/40 bg-[#011E41] text-[#F7A81B]'
            : 'border-[#F7A81B]/60 bg-[#011E41] text-[#F7A81B] shadow-sm'
        }`}
        title={`${president.name} - Official Rotary Club of Makati Record`}
      >
        <img
          src={officialSealUrl}
          alt="Rotary Club of Makati Official Seal"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-1.5 filter drop-shadow-md opacity-90 transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#011E41] via-transparent to-transparent flex flex-col items-center justify-end pb-1">
          <span className="font-serif font-extrabold text-[10px] sm:text-xs text-[#F5F1E6] leading-none drop-shadow">
            {initials}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${sizeClass} rounded-2xl overflow-hidden border-2 shrink-0 transition-all duration-300 shadow-md group-hover:scale-105 ${
        president.isCurrent
          ? 'border-[#F7A81B] ring-2 ring-[#F7A81B]/50'
          : president.isActive
          ? 'border-[#F7A81B]'
          : isDark
          ? 'border-[#F7A81B]/40'
          : 'border-[#F7A81B]/60 bg-[#011E41]'
      }`}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-[#011E41]/30 animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-[#F7A81B] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={president.photoUrl}
        alt={`${president.name} - RCM President ${president.year}`}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover object-top transition-all duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};

const PRESIDENTS_HEADER_PHOTOS: string[] = RCM_PRESIDENTS
  .map((p) => p.photoUrl)
  .filter((url): url is string => Boolean(url && url.startsWith('http')))
  .slice(0, 5);

const DOUBLE_PRESIDENTS_HEADER_PHOTOS = [
  ...PRESIDENTS_HEADER_PHOTOS,
  ...PRESIDENTS_HEADER_PHOTOS,
];

export const PresidentsPage: React.FC<PresidentsPageProps> = ({ setActiveTab, theme }) => {
  const { t } = useI18n();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active'>('all');
  const [selectedPresident, setSelectedPresident] = useState<PastPresident | null>(null);

  // Current President (2025-2026)
  const currentPresident = useMemo(() => {
    return RCM_PRESIDENTS.find((p) => p.isCurrent) || RCM_PRESIDENTS[RCM_PRESIDENTS.length - 1];
  }, []);

  // Filter ONLY truly active past presidents for the top showcase
  const activePresidents = useMemo(() => {
    return RCM_PRESIDENTS.filter((p) => p.isActive || p.isCurrent);
  }, []);

  // Filter presidents based on search query AND active filter toggle
  const filteredPresidents = useMemo(() => {
    let list = RCM_PRESIDENTS;

    if (activeFilter === 'active') {
      list = list.filter((p) => p.isActive || p.isCurrent);
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;

    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.year.toLowerCase().includes(query) ||
        p.decadeGroup.toLowerCase().includes(query) ||
        (p.activeRole && p.activeRole.toLowerCase().includes(query))
    );
  }, [searchQuery, activeFilter]);

  // Group filtered results by decade
  const groupedPresidents = useMemo(() => {
    const map = new Map<string, PastPresident[]>();

    DECADE_ORDER.forEach((decade) => {
      const items = filteredPresidents.filter((p) => p.decadeGroup === decade);
      if (items.length > 0) {
        map.set(decade, items);
      }
    });

    return map;
  }, [filteredPresidents]);

  return (
    <div className="animate-fadeIn space-y-0">
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO BAND WITH IMAGE BANNER                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative py-20 lg:py-24 overflow-hidden border-b transition-colors duration-300 w-full z-0">
        {/* Layer 1: Continuous Moving Photo Strip Background (z-0) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <div className="flex h-full w-[200%] animate-strip-scroll">
            {DOUBLE_PRESIDENTS_HEADER_PHOTOS.map((url, idx) => (
              <div key={idx} className="h-full w-[10%] shrink-0 border-r border-black/30">
                <img
                  src={url}
                  alt={`Past President Photo ${(idx % 5) + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top filter contrast-[1.05]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Layer 2: Dark Navy Overlay for Legibility (z-10) */}
        <div className="absolute inset-0 z-10 bg-[#0d1b2a]/75 backdrop-blur-[1px] pointer-events-none" />

        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 w-full max-w-full overflow-hidden">
          {/* Eyebrow */}
          <div className="inline-flex items-center space-x-2 bg-[#F7A81B]/20 border border-[#F7A81B]/60 text-[#F7A81B] px-3.5 sm:px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg max-w-full">
            <History className="w-4 h-4 text-[#F7A81B] shrink-0" />
            <span className="font-montserrat font-bold text-[10px] sm:text-xs uppercase tracking-widest truncate">
              {t('ROSTER OF PRESIDENTS')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#F5F1E6] break-words [word-break:break-word] max-w-full">
            {t('60 Years of Leadership')}
          </h1>

          {/* Subhead */}
          <p className="font-sans text-sm sm:text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed text-[#F5F1E6]/90 break-words [word-break:break-word] max-w-full">
            {t('Honoring the distinguished Rotarians who have led the Rotary Club of Makati since its charter on March 12, 1966. Click any president to read their term narrative.')}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-montserrat uppercase tracking-wider text-[#F7A81B] font-bold">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 shrink-0 text-[#F7A81B]" />
              <span>58 Years of Presidential Leadership</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('active');
                document.getElementById('presidents-timeline')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center space-x-2 bg-[#F7A81B]/15 hover:bg-[#F7A81B]/30 px-3 py-1 rounded-full text-[#F5F1E6] border border-[#F7A81B]/40 transition-all cursor-pointer hover:scale-105"
              title="Filter list to Active Past Presidents"
            >
              <UserCheck className="w-4 h-4 text-[#F7A81B]" />
              <span>{activePresidents.length} Active Past Presidents</span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. CURRENT PRESIDENT SHOWCASE & INAUGURAL STATEMENT (LEFT VIDEO/QUOTE) */}
      {/* ------------------------------------------------------------------ */}
      <section className={`py-12 sm:py-16 border-b transition-colors duration-300 ${
        isDark ? 'bg-[#011E41]/90 border-[#F7A81B]/30 text-[#F5F1E6]' : 'bg-[#FAF8F3] border-[#011E41]/15 text-[#011E41]'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-[#F7A81B]/30">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-[#F7A81B] text-[#011E41] shadow-md">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#17458F] dark:text-[#F7A81B] block">
                  Club Leadership • RY 2025–2026
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold">
                  Current President Spotlight
                </h2>
              </div>
            </div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#17458F] text-white dark:bg-[#F7A81B] dark:text-[#011E41] text-xs font-montserrat font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Serving RY 2025–2026</span>
            </div>
          </div>

          {/* 2-Column Grid: Left = Video & Inaugural Quote, Right = Current President Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* LEFT COLUMN: Video / Inaugural Statement ("sinabi / video sa kaliwa") */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6 bg-white dark:bg-[#121212] p-6 sm:p-8 rounded-3xl border-2 border-[#011E41]/15 dark:border-[#F7A81B]/30 shadow-xl border-t-4 border-t-[#17458F]">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-xs font-montserrat font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-[#17458F]/10 text-[#17458F] dark:bg-[#F7A81B]/20 dark:text-[#F7A81B]">
                  <Tv className="w-4 h-4" />
                  <span>Inaugural Message & Keynote Video</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-extrabold leading-snug text-[#011E41] dark:text-[#F5F1E6]">
                  "Unite for Impact, Lead with Compassion"
                </h3>

                {/* President's Statement / Quote */}
                <blockquote className="relative p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#011E41]/70 border-l-4 border-[#17458F] dark:border-[#F7A81B] font-serif italic text-sm sm:text-base text-[#2C333E] dark:text-[#F5F1E6]/90 leading-relaxed shadow-sm">
                  "As we steer the Rotary Club of Makati into Rotary Year 2025–2026, our duty is clear: translate our shared fellowship into tangible, life-changing action across every community we touch. From expanding our AI Academy to strengthening maternal health and disaster resilience, we build on 60 years of unwavering service."
                  <span className="block not-italic font-montserrat font-bold text-xs uppercase tracking-wider text-[#17458F] dark:text-[#F7A81B] mt-3">
                    — Pres. Eduardo "Eddie" H. Galvez (RY 2025–2026)
                  </span>
                </blockquote>
              </div>

              {/* Video Player Embed */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#17458F]/30 dark:border-[#F7A81B]/40 shadow-lg group bg-black">
                <div className="aspect-video w-full relative">
                  <iframe
                    src="https://www.youtube.com/embed/XNs3LUd2KOc"
                    title="Rotary Club of Makati Inaugural Address & 60th Charter Milestone"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Current President Profile Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#011E41] via-[#012a5c] to-[#011329] text-[#F5F1E6] border-2 border-[#F7A81B]/60 shadow-2xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-[#F7A81B]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-montserrat font-extrabold uppercase tracking-widest bg-[#F7A81B] text-[#011E41] shadow-md">
                    <Crown className="w-3.5 h-3.5 text-[#011E41]" />
                    <span>Current President</span>
                  </span>
                  <span className="font-montserrat font-extrabold text-xs text-[#F7A81B] tracking-wider uppercase">
                    RY 2025–2026
                  </span>
                </div>

                {/* Photo & Name */}
                <div className="flex items-center space-x-4 sm:space-x-5">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#F7A81B] shadow-xl shrink-0 group">
                    <img
                      src={currentPresident.photoUrl}
                      alt={currentPresident.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#011E41] via-transparent to-transparent opacity-40" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-[#F5F1E6] leading-snug">
                      {currentPresident.name}
                    </h3>
                    <p className="font-montserrat font-bold text-xs text-[#F7A81B] uppercase tracking-wider">
                      President • Rotary Club of Makati
                    </p>
                    <p className="font-sans text-xs text-[#F5F1E6]/80 pt-1">
                      Guiding RC Makati through its 60th Diamond Jubilee year.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#F7A81B]/20">
                  <div className="flex items-center justify-between text-xs font-montserrat font-semibold text-[#F5F1E6]/90">
                    <span className="text-[#F7A81B]">Rotary Theme:</span>
                    <span>The Magic of Rotary</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-montserrat font-semibold text-[#F5F1E6]/90">
                    <span className="text-[#F7A81B]">Flagship Project:</span>
                    <span>RC Makati AI Academy</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-montserrat font-semibold text-[#F5F1E6]/90">
                    <span className="text-[#F7A81B]">Rotary Milestone:</span>
                    <span>60th Diamond Jubilee</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPresident(currentPresident)}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#F7A81B] hover:bg-[#e09612] text-[#011E41] font-montserrat font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#011E41]" />
                  <span>View Pres. Eddie's Profile & Term Highlights</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. SEARCH & FULL TIMELINE SECTION WITH TOGGLE                      */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="presidents-timeline"
        className={`py-16 sm:py-20 transition-colors duration-300 ${
          isDark ? 'bg-[#121212] text-[#F5F1E6]' : 'bg-[#FAF8F3] text-[#2A2A2A]'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Search & Filter Controls */}
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Filter Toggle Buttons */}
            <div className="flex items-center justify-center p-1.5 rounded-2xl bg-[#011E41]/10 dark:bg-[#011E41]/60 border border-[#F7A81B]/30 max-w-md mx-auto backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#F7A81B] text-[#011E41] shadow-md'
                    : 'text-opacity-70 hover:text-[#F7A81B]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>All Presidents ({RCM_PRESIDENTS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('active')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                  activeFilter === 'active'
                    ? 'bg-[#F7A81B] text-[#011E41] shadow-md'
                    : 'text-opacity-70 hover:text-[#F7A81B]'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Active Only ({activePresidents.length})</span>
              </button>
            </div>

            {/* Search Bar Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F7A81B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by president name, year (e.g. 1987), or title..."
                className={`w-full pl-12 pr-10 py-3.5 rounded-2xl text-sm font-sans transition-all border outline-none shadow-md ${
                  isDark
                    ? 'bg-[#011E41] border-[#F7A81B]/40 text-[#F5F1E6] placeholder-[#F5F1E6]/50 focus:border-[#F7A81B]'
                    : 'bg-[#F0EDE6] border-[#011E41]/20 text-[#011E41] placeholder-[#011E41]/50 focus:border-[#F7A81B]'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F7A81B] hover:text-[#D98E0E] p-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-montserrat px-2">
              <span className="opacity-80">
                Showing{' '}
                <strong className="text-[#F7A81B] font-bold">
                  {filteredPresidents.length}
                </strong>{' '}
                {activeFilter === 'active' ? 'Active Presidents' : 'Past Presidents'}
              </span>
              {(searchQuery || activeFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="text-[#F7A81B] hover:underline font-semibold cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>

          {/* Timeline Container */}
          {groupedPresidents.size === 0 ? (
            <div className="text-center py-16 space-y-4 bg-[#011E41]/20 rounded-3xl border border-[#F7A81B]/20 max-w-xl mx-auto p-8">
              <Search className="w-12 h-12 text-[#F7A81B] mx-auto opacity-60" />
              <h3 className="font-serif text-xl font-bold">No Presidents Found</h3>
              <p className="text-sm opacity-80">
                No matching entry found for "{searchQuery}". Try clearing search or switching filter to "All Presidents".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="bg-[#F7A81B] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-md hover:bg-[#D98E0E] transition-colors cursor-pointer"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="relative space-y-16">
              {/* Vertical Timeline Axis Line */}
              <div className="absolute left-4 sm:left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#F7A81B] via-[#F7A81B]/40 to-[#F7A81B]/10 -translate-x-1/2 hidden sm:block" />
              <div className="absolute left-4 top-10 bottom-10 w-0.5 bg-[#F7A81B]/30 sm:hidden" />

              {/* Loop through Decade Groups */}
              {Array.from(groupedPresidents.entries()).map(([decade, presidents]) => (
                <div key={decade} className="relative space-y-8">
                  {/* Decade Section Header Badge */}
                  <div className="sticky top-20 z-20 flex justify-start sm:justify-center">
                    <div
                      className={`inline-flex items-center space-x-2 px-5 py-2 rounded-full border shadow-xl backdrop-blur-md ${
                        isDark
                          ? 'bg-[#011E41] border-[#F7A81B]/60 text-[#F7A81B]'
                          : 'bg-[#FAF8F3] border-[#011E41]/30 text-[#011E41]'
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-[#F7A81B]" />
                      <span className="font-montserrat font-extrabold text-xs uppercase tracking-widest text-[#F7A81B]">
                        {decade === '1966–1979' ? '1966–1979 (Founding Era)' : `${decade} Decade`}
                      </span>
                      <span className="text-[10px] font-sans font-normal opacity-80 px-2 py-0.5 rounded-full bg-[#F7A81B]/15">
                        {presidents.length} {presidents.length === 1 ? 'Leader' : 'Leaders'}
                      </span>
                    </div>
                  </div>

                  {/* Individual Timeline Nodes */}
                  <div className="space-y-6">
                    {presidents.map((p, idx) => {
                      const isEven = idx % 2 === 0;

                      return (
                        <div
                          key={p.id}
                          className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                            isEven ? 'sm:flex-row-reverse' : ''
                          }`}
                        >
                          {/* Timeline Node Center Badge */}
                          <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-[#011E41] border-2 border-[#F7A81B] flex items-center justify-center text-[#F7A81B] shadow-md shrink-0">
                            {p.isCurrent ? (
                              <Crown className="w-4 h-4 text-[#F7A81B] animate-pulse" />
                            ) : p.isActive ? (
                              <UserCheck className="w-4 h-4 text-[#F7A81B]" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#F7A81B]/60" />
                            )}
                          </div>

                          {/* Content Card */}
                          <div
                            className={`pl-12 sm:pl-0 sm:w-1/2 w-full ${
                              isEven ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedPresident(p)}
                              className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 shadow-md hover:shadow-2xl hover:border-[#17458F] hover:-translate-y-0.5 group relative flex items-center space-x-4 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#F7A81B] ${
                                isEven ? 'sm:flex-row-reverse sm:space-x-reverse sm:text-right' : ''
                              } ${
                                p.isCurrent
                                  ? isDark
                                    ? 'bg-[#011E41] border-[#F7A81B] ring-2 ring-[#F7A81B]/40'
                                    : 'bg-white border-[#F7A81B] border-t-4 border-t-[#17458F] ring-2 ring-[#F7A81B]/30'
                                  : p.isActive
                                  ? isDark
                                    ? 'bg-[#011E41]/90 border-[#F7A81B]/50'
                                    : 'bg-white border-[#011E41]/20 border-t-4 border-t-[#17458F]'
                                  : isDark
                                  ? 'bg-[#011E41]/50 border-[#F7A81B]/20 hover:bg-[#011E41]'
                                  : 'bg-white border-[#011E41]/12 hover:border-[#17458F]'
                              }`}
                            >
                              {/* Avatar Image Frame */}
                              <PresidentAvatar
                                president={p}
                                sizeClass="w-16 h-16 sm:w-20 sm:h-20"
                                isDark={isDark}
                              />

                              {/* Text Info */}
                              <div className="space-y-1.5 flex-1 min-w-0">
                                {/* Current or Active Role Tag */}
                                {p.isCurrent ? (
                                  <div
                                    className={`inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-[10px] font-montserrat font-bold uppercase tracking-wider bg-[#F7A81B] text-[#011E41] shadow-sm mb-1 ${
                                      isEven ? 'sm:ml-auto' : ''
                                    }`}
                                  >
                                    <Crown className="w-3 h-3" />
                                    <span>Current President</span>
                                  </div>
                                ) : p.isActive ? (
                                  <div
                                    className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-montserrat font-bold uppercase tracking-wider mb-1 ${
                                      isDark
                                        ? 'bg-[#F7A81B]/20 border border-[#F7A81B]/50 text-[#F7A81B]'
                                        : 'bg-[#011E41] border border-[#F7A81B]/40 text-[#F7A81B] shadow-xs'
                                    } ${isEven ? 'sm:ml-auto' : ''}`}
                                  >
                                    <UserCheck className="w-3 h-3 text-[#F7A81B]" />
                                    <span>{p.activeRole || 'Active Past President'}</span>
                                  </div>
                                ) : null}

                                {/* Rotary Year */}
                                <div className="font-montserrat font-extrabold text-xs sm:text-sm text-[#17458F] dark:text-[#F7A81B] uppercase tracking-wider">
                                  {p.year}
                                </div>

                                {/* President Name */}
                                <h3
                                  className={`font-serif text-base sm:text-lg font-extrabold leading-snug group-hover:text-[#F7A81B] transition-colors ${
                                    isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'
                                  }`}
                                >
                                  {p.name}
                                </h3>

                                <div className={`text-[11px] font-sans opacity-70 flex items-center space-x-1 pt-0.5 ${
                                  isEven ? 'sm:justify-end' : ''
                                }`}>
                                  <BookOpen className="w-3.5 h-3.5 text-[#F7A81B] shrink-0" />
                                  <span className="font-semibold group-hover:text-[#F7A81B] transition-colors">Click to Read Bio Narrative →</span>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. DETAILED PRESIDENT BIO MODAL                                   */}
      {/* ------------------------------------------------------------------ */}
      {selectedPresident && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-[#011E41] text-[#F5F1E6] rounded-3xl border-2 border-[#F7A81B] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* 1. Breadcrumb Top Bar */}
            <div className="px-6 py-3 bg-[#001733] border-b border-[#F7A81B]/20 flex items-center justify-between shrink-0">
              <nav className="flex items-center space-x-2 text-[11px] font-montserrat uppercase tracking-wider text-[#F5F1E6]/70">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPresident(null);
                    setActiveTab('Home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#F7A81B] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => setSelectedPresident(null)}
                  className="text-[#F7A81B] font-bold hover:underline cursor-pointer"
                >
                  Roster of Presidents
                </button>
              </nav>

              <button
                type="button"
                onClick={() => setSelectedPresident(null)}
                className="p-1.5 rounded-full bg-[#F7A81B]/10 hover:bg-[#F7A81B] text-[#F7A81B] hover:text-[#011E41] transition-colors cursor-pointer border border-[#F7A81B]/30"
                aria-label="Close Bio View"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Hero Header Band (Full Width, Deep Navy, Centered Content) */}
            <div className="bg-[#011833] border-b border-[#F7A81B]/30 py-8 px-6 text-center space-y-2 shrink-0 shadow-inner">
              <div className="inline-flex items-center space-x-2 bg-[#F7A81B]/15 px-3 py-0.5 rounded-full text-[10px] font-montserrat font-bold text-[#F7A81B] uppercase tracking-widest border border-[#F7A81B]/30">
                <span>Rotary Club of Makati • Past President</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F1E6] tracking-tight leading-tight">
                {selectedPresident.name}
              </h1>

              <div className="text-sm sm:text-base font-montserrat font-semibold text-[#F7A81B] tracking-widest uppercase">
                Term Year: {selectedPresident.year}
              </div>

              {selectedPresident.activeRole && (
                <div className="pt-1">
                  <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-montserrat font-bold bg-[#F7A81B]/20 text-[#F7A81B] border border-[#F7A81B]/40">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{selectedPresident.activeRole}</span>
                  </span>
                </div>
              )}
            </div>

            {/* 3. Two-Column Body Section (Scrollable) */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Circular Photo Frame */}
                <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center space-y-4">
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-[#F7A81B] shadow-2xl ring-4 ring-[#F7A81B]/20 bg-black/40 shrink-0">
                    {selectedPresident.photoUrl ? (
                      <img
                        src={selectedPresident.photoUrl}
                        alt={`${selectedPresident.name} - RCM President ${selectedPresident.year}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#001733] flex flex-col items-center justify-center p-4 text-center">
                        <Award className="w-12 h-12 text-[#F7A81B] mb-2" />
                        <span className="font-serif text-sm font-bold text-[#F5F1E6]">
                          {selectedPresident.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-center text-xs font-sans text-[#F5F1E6]/70 max-w-xs">
                    Official Presidential Archive <br />
                    Rotary Club of Makati (District 3830)
                  </div>
                </div>

                {/* Right Column: Bio Narrative, Term Highlights, or In-App Placeholder */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                  {selectedPresident.termHighlights ? (
                    <div className="space-y-6">
                      <div className="p-6 sm:p-8 rounded-3xl bg-[#001733]/90 border-2 border-[#F7A81B]/40 shadow-2xl space-y-6">
                        <div className="flex items-center space-x-3 border-b border-[#F7A81B]/30 pb-4">
                          <div className="p-2.5 rounded-xl bg-[#F7A81B] text-[#011E41] shadow-md">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="font-montserrat font-extrabold text-[10px] uppercase tracking-widest text-[#F7A81B] block">
                              2025–2026 at a Glance
                            </span>
                            <h3 className="font-serif text-2xl font-extrabold text-[#F5F1E6]">
                              Term Highlights
                            </h3>
                          </div>
                        </div>

                        <ul className="space-y-3.5">
                          {selectedPresident.termHighlights.map((highlight, idx) => (
                            <li
                              key={`th-${idx}`}
                              className="flex items-start space-x-3 text-sm sm:text-base font-sans text-[#F5F1E6]/95 leading-relaxed bg-[#011E41]/70 p-4 rounded-xl border border-[#F7A81B]/20 shadow-sm"
                            >
                              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F7A81B] mt-2 shrink-0" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-4 border-t border-[#F7A81B]/20 text-center">
                          <p className="font-sans text-xs italic text-[#F5F1E6]/70">
                            Full personal biography coming soon, as with our other Past Presidents
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : selectedPresident.bio ? (
                    <div className="space-y-6">
                      {/* Intro Paragraphs */}
                      <div className="space-y-4">
                        {selectedPresident.bio.intro.map((pText, i) => (
                          <p
                            key={`intro-${i}`}
                            className="font-serif text-base sm:text-lg font-light leading-relaxed text-[#F5F1E6]/95"
                          >
                            {pText}
                          </p>
                        ))}
                      </div>

                      {/* Sections if available */}
                      {selectedPresident.bio.sections &&
                        selectedPresident.bio.sections.map((sec, sIdx) => (
                          <div key={`section-${sIdx}`} className="space-y-4 pt-4 border-t border-[#F7A81B]/20">
                            <h3 className="font-montserrat font-bold text-base sm:text-lg text-[#F7A81B] uppercase tracking-wider flex items-center space-x-2">
                              <Sparkles className="w-5 h-5 text-[#F7A81B] shrink-0" />
                              <span>{sec.title}</span>
                            </h3>

                            <div className="space-y-3">
                              {sec.content.map((cText, cIdx) => (
                                <p
                                  key={`content-${sIdx}-${cIdx}`}
                                  className="font-sans text-sm sm:text-base font-light leading-relaxed text-[#F5F1E6]/90"
                                >
                                  {cText}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}

                      {/* Closing Quote if available */}
                      {selectedPresident.bio.closing && (
                        <div className="p-5 rounded-2xl bg-[#F7A81B]/15 border border-[#F7A81B]/40 font-serif text-base italic text-[#F7A81B] leading-relaxed shadow-lg">
                          "{selectedPresident.bio.closing.join(' ')}"
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Honest In-App Placeholder for Presidents without extracted bio */
                    <div className="p-8 rounded-3xl bg-[#001733]/80 border border-[#F7A81B]/30 text-center space-y-4 my-auto">
                      <div className="w-16 h-16 rounded-full bg-[#F7A81B]/15 border border-[#F7A81B]/40 flex items-center justify-center text-[#F7A81B] mx-auto">
                        <BookOpen className="w-8 h-8 text-[#F7A81B]" />
                      </div>

                      <h3 className="font-serif text-2xl font-extrabold text-[#F5F1E6]">
                        Full Biography Coming Soon
                      </h3>

                      <p className="font-sans text-sm text-[#F5F1E6]/85 max-w-lg mx-auto leading-relaxed">
                        Full biography coming soon — this president's story is currently being archived in our digital record.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Footer Back Button */}
            <div className="px-6 py-4 bg-[#001733] border-t border-[#F7A81B]/20 flex items-center justify-between shrink-0">
              <span className="text-xs font-montserrat text-[#F7A81B]/80 font-semibold">
                District 3830 • Mother Club of Makati
              </span>

              <button
                type="button"
                onClick={() => setSelectedPresident(null)}
                className="bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center space-x-1"
              >
                <span>← Back to Roster</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. CLOSING CTA BANNER                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F3] dark:bg-[#121212] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-[#F7A81B] text-[#011E41] p-8 sm:p-12 text-center space-y-6 shadow-2xl border-2 border-[#D98E0E]">
            <div className="inline-flex items-center space-x-2 bg-[#011E41]/10 px-3.5 py-1 rounded-full text-xs font-montserrat font-bold uppercase tracking-wider text-[#011E41]">
              <Sparkles className="w-4 h-4 text-[#011E41]" />
              <span>Rotary Fellowship</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#011E41]">
              Want to be part of this legacy?
            </h2>

            <p className="font-sans text-base sm:text-lg max-w-2xl mx-auto font-medium text-[#011E41]/90">
              Join the Rotary Club of Makati to write the next chapter of community service and leadership excellence.
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
