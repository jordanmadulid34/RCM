import React, { useState } from 'react';
import {
  Users,
  Shield,
  Award,
  Sparkles,
  ArrowRight,
  Star,
  Network,
  LayoutGrid,
  Crown,
  Briefcase,
  ChevronRight,
  Info,
} from 'lucide-react';
import { TabType, ThemeType } from '../types';
import { useI18n } from '../i18n/I18nContext';
import {
  BOARD_OFFICERS,
  BOARD_DIRECTORS,
  BOARD_ADVISERS,
  BoardMember,
} from '../data/boardData';
import { RotaryWheelSVG } from '../components/RCMLogo';

interface BoardPageProps {
  setActiveTab: (tab: TabType) => void;
  theme: ThemeType;
}

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

interface MemberPhotoProps {
  member: BoardMember;
  sizeClass?: string;
  isDark: boolean;
}

const MemberPhoto: React.FC<MemberPhotoProps> = ({
  member,
  sizeClass = 'w-28 h-28',
  isDark,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initials = getMemberInitials(member.name);

  return (
    <div
      className={`relative ${sizeClass} rounded-full overflow-hidden border-2 transition-all duration-300 group-hover:scale-105 shadow-md mx-auto shrink-0 ${
        isDark
          ? 'border-[#F7A81B]/40 group-hover:border-[#F7A81B] bg-[#011E41]'
          : 'border-[#011E41]/20 group-hover:border-[#F7A81B] bg-[#F0EDE6]'
      }`}
    >
      {hasError ? (
        <div className="w-full h-full bg-[#011E41] border-2 border-[#F7A81B]/60 text-[#F7A81B] flex flex-col items-center justify-center font-serif text-lg font-extrabold shadow-inner">
          <span>{initials}</span>
          <span className="text-[8px] font-montserrat uppercase font-normal tracking-widest text-[#F7A81B]/80 mt-0.5">
            RCM
          </span>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-[#011E41]/30 animate-pulse flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-[#F7A81B] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <img
            src={member.photoUrl}
            alt={`${member.name} - ${member.title}`}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:brightness-105 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        </>
      )}
    </div>
  );
};

const HEADER_PHOTOS = [
  'https://static.wixstatic.com/media/b2fb7d_61e97627edf0455b95565b1c3774f1a1~mv2.jpg', // formal portrait, black attire with gold sash
  'https://static.wixstatic.com/media/b2fb7d_685e97f3d0334399a2e2e667fefc8cc5~mv2.jpg', // casual outdoor shot, Rotary Club of Makati polo shirt
  'https://static.wixstatic.com/media/b2fb7d_a5fbefa18cbc48c49181378297460c8c~mv2.jpg', // action shot, speaking at podium/event stage
  'https://static.wixstatic.com/media/b2fb7d_46e056f5b29342aebc669a21b3635779~mv2.jpg', // formal business portrait, dark suit
  'https://static.wixstatic.com/media/b2fb7d_dd7d2802f2d24dd5825ee2e8a7136cbf~mv2.jpg', // formal business portrait, dark suit with blue tie
];

const DOUBLE_HEADER_PHOTOS = [...HEADER_PHOTOS, ...HEADER_PHOTOS];

export const BoardPage: React.FC<BoardPageProps> = ({ setActiveTab, theme }) => {
  const { t } = useI18n();
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState<'chart' | 'grid'>('chart');

  // Officers breakdown from data
  const president = BOARD_OFFICERS.find((o) => o.title === 'President') || BOARD_OFFICERS[0];
  const execOfficers = BOARD_OFFICERS.filter((o) =>
    ['President-Elect', 'Secretary', 'Treasurer'].includes(o.title)
  );
  const adminOfficers = BOARD_OFFICERS.filter((o) =>
    ['Assistant Treasurer', 'Comptroller', 'Legal Counsel'].includes(o.title)
  );

  return (
    <div className="animate-fadeIn space-y-0">
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO BAND & VIEW TOGGLE WITH MOVING PHOTO STRIP               */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative py-16 lg:py-20 overflow-hidden border-b border-white/10 transition-colors duration-300 z-0">
        {/* Layer 1: Continuous Moving Photo Strip Background (z-0) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <div className="flex h-full w-[200%] animate-strip-scroll">
            {DOUBLE_HEADER_PHOTOS.map((url, idx) => (
              <div key={idx} className="h-full w-[10%] shrink-0 border-r border-black/30">
                <img
                  src={url}
                  alt={`Board Member Photo ${(idx % 5) + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top filter contrast-[1.05]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Layer 2: Dark Navy Overlay for Legibility (z-10) */}
        <div className="absolute inset-0 z-10 bg-[#0d1b2a]/75 backdrop-blur-[1px] pointer-events-none" />

        {/* Layer 3: Foreground Text Content & Controls (z-20) */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-20 w-full max-w-full overflow-hidden">
          {/* Eyebrow */}
          <div className="inline-flex items-center space-x-2 bg-[#F7A81B]/15 border border-[#F7A81B]/50 text-[#F7A81B] px-3.5 sm:px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm max-w-full">
            <RotaryWheelSVG className="h-4 w-auto shrink-0" />
            <span className="font-montserrat font-bold text-[10px] sm:text-xs uppercase tracking-widest truncate">
              Rotary Club of Makati • RY 2025–2026
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-serif text-2xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#F8FAFC] break-words [word-break:break-word] max-w-full"
          >
            {t('Board of Directors & Club Officers')}
          </h1>

          <p
            className="font-sans text-sm sm:text-lg font-light max-w-3xl mx-auto leading-relaxed text-[#CBD5E1] break-words [word-break:break-word] max-w-full"
          >
            "{t('Our leaders exemplify the highest standards of Rotary fellowship, ethical governance, and dedication to Service Above Self.')}"
          </p>

          {/* View Switcher Controls */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <div
              className="inline-flex p-1 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-inner"
            >
              <button
                type="button"
                onClick={() => setViewMode('chart')}
                className={`px-4 py-2 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
                  viewMode === 'chart'
                    ? 'bg-[#F7A81B] text-[#0F172A] shadow-md'
                    : 'text-[#CBD5E1] hover:text-[#F8FAFC]'
                }`}
              >
                <Network className="w-4 h-4" />
                <span>{t('Organizational Chart')}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#F7A81B] text-[#0F172A] shadow-md'
                    : 'text-[#CBD5E1] hover:text-[#F8FAFC]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{t('Member Roster Cards')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. ORGANIZATIONAL CHART TREE VIEW MODE                            */}
      {/* ------------------------------------------------------------------ */}
      {viewMode === 'chart' && (
        <section
          className={`py-16 transition-colors duration-300 overflow-x-auto ${
            isDark ? 'bg-[#0B131F] text-[#F8FAFC]' : 'bg-[#D7D2C8] text-[#243447]'
          }`}
        >
          <div className="min-w-[900px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Header info indicator */}
            <div className="text-center space-y-1">
              <span className={`text-xs font-montserrat font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-xs ${
                isDark ? 'text-[#F7A81B] bg-[#1E293B] border-[#F7A81B]/40' : 'text-[#243447] bg-[#F2EFE8] border-[#C9982B]/40'
              }`}>
                Official RCM Organizational Hierarchy (2025–2026)
              </span>
            </div>

            {/* TREE LEVEL 1: PRESIDENT */}
            <div className="flex flex-col items-center">
              <div
                className={`group relative p-6 rounded-3xl border-2 border-[#C9982B] transition-all duration-300 shadow-xl text-center w-80 max-w-full ${
                  isDark ? 'bg-[#1E293B] text-[#F8FAFC]' : 'bg-[#F2EFE8] text-[#243447]'
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9982B] text-[#243447] font-montserrat font-black text-[10px] uppercase tracking-widest px-3 py-0.5 rounded-full shadow flex items-center space-x-1">
                  <Crown className="w-3 h-3 text-[#243447]" />
                  <span>CLUB PRESIDENT</span>
                </div>

                <MemberPhoto member={president} sizeClass="w-32 h-32" isDark={isDark} />

                <div className="mt-3 space-y-1">
                  <h3 className={`font-serif text-xl font-extrabold ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>
                    {president.name}
                  </h3>
                  <div className={`text-xs font-montserrat font-bold uppercase tracking-wider ${isDark ? 'text-[#F7A81B]' : 'text-[#17458F]'}`}>
                    PRESIDENT
                  </div>
                </div>
              </div>

              {/* Connector Line down from President */}
              <div className="w-0.5 h-10 bg-[#C9982B]" />
              <div className="w-full max-w-2xl h-0.5 bg-[#C9982B]" />
            </div>

            {/* TREE LEVEL 2: EXECUTIVE OFFICERS */}
            <div className="flex flex-col items-center space-y-0">
              <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
                {execOfficers.map((officer) => (
                  <div key={officer.id} className="flex flex-col items-center">
                    <div className="w-0.5 h-6 bg-[#C9982B]" />
                    <div
                      className={`group p-4 rounded-2xl border transition-all duration-300 shadow-md text-center w-full ${
                        isDark ? 'bg-[#1E293B] border-slate-700/80 text-[#F8FAFC] hover:border-[#F7A81B]' : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447] hover:border-[#C9982B]'
                      }`}
                    >
                      <MemberPhoto member={officer} sizeClass="w-20 h-20" isDark={isDark} />
                      <div className="mt-2 space-y-0.5">
                        <h4 className={`font-montserrat font-bold text-xs sm:text-sm leading-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>
                          {officer.name}
                        </h4>
                        <span className={`text-[10px] font-montserrat font-semibold uppercase tracking-wider block ${isDark ? 'text-[#F7A81B]' : 'text-[#17458F]'}`}>
                          {officer.title}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Connector Line down from Executive Officers */}
              <div className="w-0.5 h-8 bg-[#C9982B] mt-2" />
              <div className="w-full max-w-2xl h-0.5 bg-[#C9982B]" />
            </div>

            {/* TREE LEVEL 3: KEY ADMINISTRATIVE OFFICERS */}
            <div className="flex flex-col items-center space-y-0">
              <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
                {adminOfficers.map((officer) => (
                  <div key={officer.id} className="flex flex-col items-center">
                    <div className="w-0.5 h-6 bg-[#C9982B]" />
                    <div
                      className={`group p-4 rounded-2xl border transition-all duration-300 shadow-sm text-center w-full ${
                        isDark ? 'bg-[#1E293B] border-slate-700/80 text-[#F8FAFC] hover:border-[#F7A81B]' : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447] hover:border-[#C9982B]'
                      }`}
                    >
                      <MemberPhoto member={officer} sizeClass="w-18 h-18" isDark={isDark} />
                      <div className="mt-2 space-y-0.5">
                        <h4 className={`font-montserrat font-semibold text-xs leading-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>
                          {officer.name}
                        </h4>
                        <span className={`text-[10px] font-montserrat font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-[#4A5565]'}`}>
                          {officer.title}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Connector Line down to Board of Directors */}
              <div className="w-0.5 h-10 bg-[#C9982B] mt-2" />
            </div>

            {/* TREE LEVEL 4: BOARD OF DIRECTORS */}
            <div className="flex flex-col items-center space-y-4">
              <div className={`font-montserrat font-black text-xs uppercase tracking-widest px-6 py-1.5 rounded-full shadow-md border ${
                isDark ? 'bg-[#1E293B] text-[#F7A81B] border-[#F7A81B]/50' : 'bg-[#243447] text-[#F2EFE8] border-[#C9982B]'
              }`}>
                BOARD OF DIRECTORS
              </div>

              <div className="w-full max-w-5xl h-0.5 bg-[#C9982B]/50" />

              <div className="grid grid-cols-5 gap-4 w-full max-w-5xl">
                {BOARD_DIRECTORS.slice(0, 5).map((director) => (
                  <div
                    key={director.id}
                    className={`group p-3 rounded-xl border transition-all text-center shadow-xs ${
                      isDark ? 'bg-[#1E293B] border-slate-700/80 text-[#F8FAFC] hover:border-[#F7A81B]' : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447] hover:border-[#C9982B]'
                    }`}
                  >
                    <MemberPhoto member={director} sizeClass="w-16 h-16" isDark={isDark} />
                    <div className="mt-1.5 space-y-0.5">
                      <h5 className={`font-montserrat font-semibold text-[11px] leading-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>
                        {director.name}
                      </h5>
                      <span className={`text-[9px] font-montserrat uppercase font-bold ${isDark ? 'text-slate-400' : 'text-[#4A5565]'}`}>
                        Director
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 w-full max-w-4xl pt-2">
                {BOARD_DIRECTORS.slice(5).map((director) => (
                  <div
                    key={director.id}
                    className={`group p-3 rounded-xl border transition-all text-center shadow-xs ${
                      isDark ? 'bg-[#1E293B] border-slate-700/80 text-[#F8FAFC] hover:border-[#F7A81B]' : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447] hover:border-[#C9982B]'
                    }`}
                  >
                    <MemberPhoto member={director} sizeClass="w-16 h-16" isDark={isDark} />
                    <div className="mt-1.5 space-y-0.5">
                      <h5 className={`font-montserrat font-semibold text-[11px] leading-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>
                        {director.name}
                      </h5>
                      <span className={`text-[9px] font-montserrat uppercase font-bold ${isDark ? 'text-slate-400' : 'text-[#4A5565]'}`}>
                        Director
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Connector Line down to Advisers */}
              <div className="w-0.5 h-10 bg-[#C9982B] mt-2" />
            </div>

            {/* TREE LEVEL 5: ADVISERS */}
            <div className="flex flex-col items-center space-y-4">
              <div className={`font-montserrat font-black text-xs uppercase tracking-widest px-6 py-1.5 rounded-full shadow-md border ${
                isDark ? 'bg-[#1E293B] text-[#F7A81B] border-[#F7A81B]/50' : 'bg-[#17458F] text-[#F2EFE8] border-[#C9982B]'
              }`}>
                ADVISERS & SENIOR COUNCIL
              </div>

              <div className="w-full max-w-5xl h-0.5 bg-[#C9982B]/30" />

              <div className="grid grid-cols-4 gap-4 w-full max-w-5xl">
                {BOARD_ADVISERS.slice(0, 4).map((adviser) => (
                  <div
                    key={adviser.id}
                    className={`group p-3 rounded-xl border transition-all text-center shadow-xs ${
                      isDark ? 'bg-[#1E293B] border-slate-700/80 text-[#F8FAFC] hover:border-[#F7A81B]' : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447] hover:border-[#C9982B]'
                    }`}
                  >
                    <MemberPhoto member={adviser} sizeClass="w-14 h-14" isDark={isDark} />
                    <div className="mt-1 space-y-0.5">
                      <h5 className={`font-montserrat font-semibold text-[10px] leading-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>
                        {adviser.name}
                      </h5>
                      <span className={`text-[8px] font-montserrat uppercase font-bold ${isDark ? 'text-slate-400' : 'text-[#4A5565]'}`}>
                        Adviser
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 w-full max-w-5xl pt-1">
                {BOARD_ADVISERS.slice(4).map((adviser) => (
                  <div
                    key={adviser.id}
                    className={`group p-3 rounded-xl border transition-all text-center shadow-xs ${
                      isDark ? 'bg-[#1E293B] border-slate-700/80 text-[#F8FAFC] hover:border-[#F7A81B]' : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447] hover:border-[#C9982B]'
                    }`}
                  >
                    <MemberPhoto member={adviser} sizeClass="w-14 h-14" isDark={isDark} />
                    <div className="mt-1 space-y-0.5">
                      <h5 className={`font-montserrat font-semibold text-[10px] leading-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>
                        {adviser.name}
                      </h5>
                      <span className={`text-[8px] font-montserrat uppercase font-bold ${isDark ? 'text-slate-400' : 'text-[#4A5565]'}`}>
                        Adviser
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Connector Line down to General Assembly */}
              <div className="w-0.5 h-8 bg-[#C9982B] mt-2" />
            </div>

            {/* TREE LEVEL 6: GENERAL ASSEMBLY */}
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-4">
                <div className={`px-5 py-2 rounded-xl border font-montserrat font-extrabold text-xs uppercase tracking-wider shadow-xs ${
                  isDark ? 'bg-[#1E293B] border-[#F7A81B]/50 text-[#F8FAFC]' : 'bg-[#F2EFE8] border-[#C9982B] text-[#243447]'
                }`}>
                  REGULAR MEMBERS
                </div>
                <span className="text-[#C9982B] font-bold">•</span>
                <div className={`px-5 py-2 rounded-xl border font-montserrat font-extrabold text-xs uppercase tracking-wider shadow-xs ${
                  isDark ? 'bg-[#1E293B] border-[#F7A81B]/50 text-[#F8FAFC]' : 'bg-[#F2EFE8] border-[#C9982B] text-[#243447]'
                }`}>
                  HONORARY MEMBERS
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. MEMBER ROSTER CARDS GRID VIEW MODE                             */}
      {/* ------------------------------------------------------------------ */}
      {viewMode === 'grid' && (
        <div className="space-y-0">
          {/* OFFICERS SECTION */}
          <section
            className={`py-16 border-b transition-colors duration-300 ${
              isDark ? 'bg-[#0F172A] border-slate-800 text-[#F8FAFC]' : 'bg-[#D7D2C8] border-[#243447]/10 text-[#243447]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <div className={`inline-flex items-center space-x-2 font-montserrat font-bold text-xs uppercase tracking-widest px-3.5 py-1 rounded-full border shadow-xs ${
                  isDark ? 'bg-[#1E293B] border-[#F7A81B]/40 text-[#F7A81B]' : 'bg-[#F2EFE8] border-[#C9982B]/30 text-[#17458F]'
                }`}>
                  <Star className="w-4 h-4 text-[#C9982B]" />
                  <span>Executive Officers</span>
                </div>
                <h2 className={`font-serif text-3xl font-extrabold ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>Executive Leadership & Officers</h2>
              </div>

              {/* Top 4 Executive Officers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {BOARD_OFFICERS.slice(0, 4).map((officer) => (
                  <div
                    key={officer.id}
                    className={`group p-6 rounded-3xl border transition-all duration-300 shadow-md hover:-translate-y-1.5 flex flex-col items-center text-center space-y-4 ${
                      isDark ? 'bg-[#1E293B] border-slate-700/80 text-[#F8FAFC] hover:border-[#F7A81B]' : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447] hover:bg-[#F7F4EE] hover:border-[#C9982B]'
                    }`}
                  >
                    <MemberPhoto member={officer} sizeClass="w-32 h-32" isDark={isDark} />
                    <div className="space-y-1.5 w-full">
                      <h3 className={`font-montserrat font-bold text-base ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>
                        {officer.name}
                      </h3>
                      <div className={`font-montserrat font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full inline-block border ${
                        isDark ? 'text-[#F7A81B] bg-slate-800 border-slate-700' : 'text-[#17458F] bg-[#DDD8CE] border-[#C9982B]/20'
                      }`}>
                        {officer.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom 3 Executive Officers (Mirrored & Centered) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto gap-6 pt-2">
                {BOARD_OFFICERS.slice(4).map((officer) => (
                  <div
                    key={officer.id}
                    className={`group p-6 rounded-3xl border transition-all duration-300 shadow-md hover:-translate-y-1.5 flex flex-col items-center text-center space-y-4 ${
                      isDark ? 'bg-[#1E293B] border-slate-700/80 text-[#F8FAFC] hover:border-[#F7A81B]' : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447] hover:bg-[#F7F4EE] hover:border-[#C9982B]'
                    }`}
                  >
                    <MemberPhoto member={officer} sizeClass="w-32 h-32" isDark={isDark} />
                    <div className="space-y-1.5 w-full">
                      <h3 className={`font-montserrat font-bold text-base ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>
                        {officer.name}
                      </h3>
                      <div className={`font-montserrat font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full inline-block border ${
                        isDark ? 'text-[#F7A81B] bg-slate-800 border-slate-700' : 'text-[#17458F] bg-[#DDD8CE] border-[#C9982B]/20'
                      }`}>
                        {officer.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* DIRECTORS SECTION */}
          <section
            className={`py-16 border-b transition-colors duration-300 ${
              isDark ? 'bg-[#0B131F] border-slate-800 text-[#F8FAFC]' : 'bg-[#DDD8CE] border-[#243447]/10 text-[#243447]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <div className={`inline-flex items-center space-x-2 font-montserrat font-bold text-xs uppercase tracking-widest px-3.5 py-1 rounded-full border shadow-xs ${
                  isDark ? 'bg-[#1E293B] border-[#F7A81B]/40 text-[#F7A81B]' : 'bg-[#F2EFE8] border-[#C9982B]/30 text-[#17458F]'
                }`}>
                  <Users className="w-4 h-4 text-[#C9982B]" />
                  <span>Board Directors</span>
                </div>
                <h2 className={`font-serif text-3xl font-extrabold ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>Board Directors</h2>
              </div>

              {/* Top 8 Board Directors (4 per row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {BOARD_DIRECTORS.slice(0, 8).map((director) => (
                  <div
                    key={director.id}
                    className={`group p-5 rounded-2xl border transition-all duration-300 shadow-xs hover:-translate-y-1 flex flex-col items-center text-center space-y-3 ${
                      isDark ? 'bg-[#1E293B] border-slate-700/80 text-[#F8FAFC] hover:border-[#F7A81B]' : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447] hover:bg-[#F7F4EE] hover:border-[#C9982B]'
                    }`}
                  >
                    <MemberPhoto member={director} sizeClass="w-28 h-28" isDark={isDark} />
                    <div className="space-y-1 w-full">
                      <h3 className={`font-montserrat font-semibold text-sm ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>
                        {director.name}
                      </h3>
                      <div className={`font-montserrat font-bold text-[11px] uppercase tracking-wider ${isDark ? 'text-[#F7A81B]' : 'text-[#4A5565]'}`}>
                        {director.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom 1 Board Director (Centered) */}
              <div className="flex justify-center pt-2">
                {BOARD_DIRECTORS.slice(8).map((director) => (
                  <div
                    key={director.id}
                    className={`group p-5 rounded-2xl border transition-all duration-300 shadow-xs hover:-translate-y-1 flex flex-col items-center text-center space-y-3 w-full max-w-xs ${
                      isDark ? 'bg-[#1E293B] border-slate-700/80 text-[#F8FAFC] hover:border-[#F7A81B]' : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447] hover:bg-[#F7F4EE] hover:border-[#C9982B]'
                    }`}
                  >
                    <MemberPhoto member={director} sizeClass="w-28 h-28" isDark={isDark} />
                    <div className="space-y-1 w-full">
                      <h3 className={`font-montserrat font-semibold text-sm ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>
                        {director.name}
                      </h3>
                      <div className={`font-montserrat font-bold text-[11px] uppercase tracking-wider ${isDark ? 'text-[#F7A81B]' : 'text-[#4A5565]'}`}>
                        {director.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ADVISERS SECTION */}
          <section
            className={`py-16 transition-colors duration-300 ${
              isDark ? 'bg-[#0F172A] text-[#F8FAFC]' : 'bg-[#D7D2C8] text-[#243447]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <div className={`inline-flex items-center space-x-2 font-montserrat font-bold text-xs uppercase tracking-widest px-3.5 py-1 rounded-full border shadow-xs ${
                  isDark ? 'bg-[#1E293B] border-[#F7A81B]/40 text-[#F7A81B]' : 'bg-[#F2EFE8] border-[#C9982B]/30 text-[#17458F]'
                }`}>
                  <Award className="w-4 h-4 text-[#C9982B]" />
                  <span>Senior Council</span>
                </div>
                <h2 className={`font-serif text-3xl font-extrabold ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>Board Advisers</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {BOARD_ADVISERS.map((adviser) => (
                  <div
                    key={adviser.id}
                    className={`group p-4 rounded-xl border transition-all duration-300 shadow-xs hover:-translate-y-1 flex flex-col items-center text-center space-y-2.5 ${
                      isDark ? 'bg-[#1E293B] border-slate-700/80 text-[#F8FAFC] hover:border-[#F7A81B]' : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447] hover:bg-[#F7F4EE] hover:border-[#C9982B]'
                    }`}
                  >
                    <MemberPhoto member={adviser} sizeClass="w-24 h-24" isDark={isDark} />
                    <div className="space-y-1 w-full">
                      <h3 className={`font-montserrat font-semibold text-xs ${isDark ? 'text-[#F8FAFC]' : 'text-[#243447]'}`}>
                        {adviser.name}
                      </h3>
                      <div className={`font-montserrat font-bold text-[10px] uppercase tracking-wider ${isDark ? 'text-[#F7A81B]' : 'text-[#4A5565]'}`}>
                        {adviser.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. CLOSING CTA BANNER                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? 'bg-[#0B131F]' : 'bg-[#D7D2C8]'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className={`relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl border ${
            isDark ? 'bg-gradient-to-r from-[#1E293B] to-[#0F172A] border-[#F7A81B]/40 text-[#F8FAFC]' : 'bg-[#C9982B] text-[#243447] border-[#B88922]'
          }`}>
            <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-montserrat font-bold uppercase tracking-wider ${
              isDark ? 'bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30' : 'bg-[#243447]/10 text-[#243447]'
            }`}>
              <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#F7A81B]' : 'text-[#243447]'}`} />
              <span>Leadership & Fellowship</span>
            </div>

            <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold ${isDark ? 'text-[#F7A81B]' : 'text-[#243447]'}`}>
              Interested in serving with our board?
            </h2>

            <p className={`font-sans text-base sm:text-lg max-w-2xl mx-auto font-medium ${isDark ? 'text-slate-300' : 'text-[#243447]/90'}`}>
              Join the Rotary Club of Makati to collaborate with prominent business and civic leaders in shaping impactful community projects.
            </p>

            <button
              type="button"
              onClick={() => {
                setActiveTab('Membership');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full shadow-lg inline-flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer ${
                isDark ? 'bg-[#F7A81B] hover:bg-[#e59b10] text-[#0F172A]' : 'bg-[#243447] hover:bg-[#1a2634] text-[#F2EFE8]'
              }`}
            >
              <span>Apply for Membership</span>
              <ArrowRight className={`w-4 h-4 ${isDark ? 'text-[#0F172A]' : 'text-[#C9982B]'}`} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
