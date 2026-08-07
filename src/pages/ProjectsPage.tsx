/* Light Mode card redesign — replaced low-contrast badge/text colors with AA-verified tokens (gold-text on gold-tint, ink for titles, text-muted for dates, royal-blue/azure-text for CTAs). Applies to all card components sitewide. */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Calendar,
  X,
  Play,
  ArrowRight,
  Filter,
  Layers,
  Award,
  CheckCircle2,
  Heart,
  BookOpen,
  Camera,
} from 'lucide-react';
import { TabType, ThemeType } from '../types';
import { REAL_RCM_PROJECTS, ProjectPost } from '../data/projectsData';
import {
  PillarCatalogProject,
  ALL_28_PROJECTS,
  ALL_PILLAR_PROJECTS_MAP,
} from '../data/pillarProjectsData';
import { FOCUS_AREAS } from '../data/rcmData';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProjectsHeaderBanner } from '../components/ProjectsHeaderBanner';

interface ProjectsPageProps {
  setActiveTab: (tab: TabType) => void;
  selectedFocusAreaId?: string;
  theme: ThemeType;
}

interface FilterOption {
  id: string;
  label: string;
  count: number;
  icon?: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All Projects', count: 28 },
  {
    id: 'disease-prevention',
    label: 'Disease Prevention & Treatment',
    count: 8,
    icon: 'https://static.wixstatic.com/media/b2fb7d_e81071c025cb4fbf91014e6c9f4d7da3~mv2.png',
  },
  {
    id: 'water-sanitation',
    label: 'Water & Sanitation',
    count: 2,
    icon: 'https://static.wixstatic.com/media/b2fb7d_f63f527d873e462da16aa7000cf9a20e~mv2.png',
  },
  {
    id: 'maternal-child-care',
    label: 'Maternal & Child Health',
    count: 1,
    icon: 'https://static.wixstatic.com/media/b2fb7d_2cfd0609a55545979fa9c175b8e09d78~mv2.png',
  },
  {
    id: 'basic-education',
    label: 'Basic Education & Literacy',
    count: 8,
    icon: 'https://static.wixstatic.com/media/b2fb7d_b5caeae413e44c899eb10eaf81c126cd~mv2.png',
  },
  {
    id: 'economic-development',
    label: 'Economic & Community Development',
    count: 6,
    icon: 'https://static.wixstatic.com/media/b2fb7d_8d6ad2b87ee140b4b84cc0ed1a881bfa~mv2.png',
  },
  {
    id: 'environment',
    label: 'Environment',
    count: 2,
    icon: 'https://static.wixstatic.com/media/b2fb7d_00b636edeca842bea68220ee62277041~mv2.png',
  },
  {
    id: 'peacebuilding',
    label: 'Peacebuilding & Conflict Prevention',
    count: 1,
    icon: 'https://static.wixstatic.com/media/b2fb7d_5e8a995911ef43afaa20c4575ad2a020~mv2.png',
  },
];

function getYouTubeEmbedUrl(url?: string): string {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('v=')) {
    videoId = url.split('v=')[1]?.split('&')[0] || '';
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  setActiveTab,
  selectedFocusAreaId = 'all',
  theme,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(selectedFocusAreaId);
  const [selectedFeedProject, setSelectedFeedProject] = useState<ProjectPost | null>(null);
  const [selectedCatalogProject, setSelectedCatalogProject] = useState<PillarCatalogProject | null>(null);

  const isDark = theme === 'dark';
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (selectedFocusAreaId) {
      setActiveFilter(selectedFocusAreaId);
    }
  }, [selectedFocusAreaId]);

  useEffect(() => {
    if (selectedFeedProject || selectedCatalogProject) {
      closeButtonRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedFeedProject(null);
          setSelectedCatalogProject(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedFeedProject, selectedCatalogProject]);

  // Catalog filtered list based on selected pillar chip
  const displayCatalogProjects =
    activeFilter === 'all'
      ? ALL_28_PROJECTS
      : ALL_28_PROJECTS.filter((p) => p.pillarId === activeFilter);

  return (
    <div className="w-full animate-fadeIn">
      {/* ------------------------------------------------------------------ */}
      {/* 0. FULL-WIDTH CROSSFADE IMAGE SLIDER BANNER WITH INTEGRATED HERO   */}
      {/* ------------------------------------------------------------------ */}
      <ProjectsHeaderBanner />

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CONTAINER FOR THE PROJECTS PAGE CONTENT                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* ------------------------------------------------------------------ */}
        {/* 1. RECENTLY UPDATED FEED (TOP PREVIEW SUBSET - 8 ITEMS)            */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#243447]/10 pb-3">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-[#C9982B]" />
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#243447]">
              Recently Updated Highlights
            </h2>
          </div>
          <span className="text-xs font-montserrat font-semibold text-[#17458F] bg-[#17458F]/10 px-3 py-1 rounded-full border border-[#17458F]/20 self-start sm:self-auto">
            8 Latest Updates
          </span>
        </div>

        {/* 8-Item Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {REAL_RCM_PROJECTS.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedFeedProject(project)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedFeedProject(project);
                }
              }}
              className={`group rounded-[18px] overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 cursor-pointer focus:outline-none focus:ring-2 ${
                isDark
                  ? 'border border-white/10 bg-white/5 backdrop-blur-[16px] text-white hover:border-[#F7A81B]/40 shadow-lg hover:shadow-2xl focus:ring-[#F7A81B]'
                  : 'border border-[#243447]/10 bg-[#F2EFE8] backdrop-blur-md text-[#243447] hover:border-[#17458F]/40 shadow-xs hover:shadow-md focus:ring-[#17458F]'
              }`}
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                  {project.imageUrl ? (
                    <ImageWithFallback
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-[#16233B] via-[#0F172A] to-[#0A0F1D] flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <div className="w-14 h-14 rounded-full bg-[#F7A81B]/15 border border-[#F7A81B]/40 flex items-center justify-center text-[#F7A81B] shadow-inner">
                        <Camera className="w-6 h-6 text-[#F7A81B]" />
                      </div>
                      <span className="font-montserrat font-bold text-xs text-[#F7A81B] uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[#F7A81B]/10 border border-[#F7A81B]/20">
                        {project.placeholderLabel || 'Official Photo Pending'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#243447]/80 via-transparent to-transparent" />

                  <div className="absolute top-2.5 left-2.5 text-[11px] font-bold uppercase tracking-[0.05em] px-2.5 py-1 rounded-md shadow-md bg-[#243447]/90 backdrop-blur-md border border-white/10 text-[#C9982B]">
                    {project.pillar}
                  </div>

                  {project.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#17458F] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div
                    className={`inline-flex items-center space-x-1.5 text-xs font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isDark
                        ? 'text-[#F7A81B] bg-[#F7A81B]/15 border-[#F7A81B]/20'
                        : 'text-[#17458F] bg-[#17458F]/10 border-[#17458F]/20'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{project.date}</span>
                  </div>

                  <h3
                    className={`font-serif text-base sm:text-lg font-bold leading-snug line-clamp-2 transition-colors ${
                      isDark
                        ? 'text-[#F8FAFC] group-hover:text-[#F7A81B]'
                        : 'text-[#243447] group-hover:text-[#17458F]'
                    }`}
                  >
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 pt-0">
                <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all bg-[#17458F] text-white group-hover:bg-[#1D5CB8] shadow-xs">
                  <span>Read Story</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-white" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. FULL CATALOG SECTION (ALL 28 PROJECTS) WITH PILLAR FILTERS      */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-8 pt-6 border-t border-[#F7A81B]/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F7A81B]/30 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Layers className="w-6 h-6 text-[#F7A81B]" />
              <h2
                className={`font-serif text-2xl sm:text-3xl font-extrabold ${
                  isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'
                }`}
              >
                All Projects Catalog
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-sans opacity-80">
              Showing {displayCatalogProjects.length} of 28 total projects across all Seven Areas of Focus.
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 bg-[#F7A81B]/15 text-[#F7A81B] px-4 py-1.5 rounded-full border border-[#F7A81B]/40 text-xs font-montserrat font-bold uppercase tracking-widest self-start md:self-auto">
            <span>28 Total Projects</span>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {FILTER_OPTIONS.map((opt) => {
            const isActive = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveFilter(opt.id)}
                className={`px-4 py-2 rounded-xl font-montserrat font-bold text-xs transition-all duration-200 flex items-center space-x-2 cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-[#17458F] text-white shadow-md scale-105 border border-[#17458F]'
                    : 'bg-[#F2EFE8] text-[#4A5565] hover:text-[#243447] hover:bg-[#EEE9E0] border border-[#243447]/10'
                }`}
              >
                {opt.icon && (
                  <img src={opt.icon} alt="" className="w-4 h-4 object-contain shrink-0 filter drop-shadow-xs" referrerPolicy="no-referrer" />
                )}
                <span>{opt.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#17458F]/10 text-[#17458F]'
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Catalog Grid (28 Projects Display) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayCatalogProjects.map((project) => {
            const hasImage = Boolean(project.imageUrl);
            const isVideo = project.type === 'video';

            return (
              <div
                key={project.id}
                onClick={() => setSelectedCatalogProject(project)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCatalogProject(project);
                  }
                }}
                className={`group rounded-[18px] overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 cursor-pointer focus:outline-none focus:ring-2 ${
                  isDark
                    ? 'border border-white/10 bg-white/5 backdrop-blur-[16px] text-white hover:border-[#F7A81B]/40 shadow-lg hover:shadow-2xl focus:ring-[#F7A81B]'
                    : 'border border-[#243447]/10 bg-[#F2EFE8] backdrop-blur-md text-[#243447] hover:border-[#17458F]/40 shadow-xs hover:shadow-md focus:ring-[#17458F]'
                }`}
              >
                <div>
                  {/* Card Media Header */}
                  {hasImage ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                      <ImageWithFallback
                        src={project.imageUrl!}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#243447]/80 via-transparent to-transparent" />

                      {/* Pillar Badge */}
                      <div className="absolute top-2.5 left-2.5 text-[11px] font-bold uppercase tracking-[0.05em] px-3 py-1 rounded-md shadow-md bg-[#243447]/90 backdrop-blur-md text-[#C9982B] border border-white/10">
                        {project.pillarName}
                      </div>

                      {/* Video Play Icon if type video */}
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#17458F] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Fallback Card Header for Supplemental Feeding Program */
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#EEE9E0] via-[#F2EFE8] to-[#E7E2D8] flex flex-col items-center justify-center p-6 text-center border-b border-[#243447]/10">
                      <div className="w-14 h-14 rounded-full bg-[#17458F]/10 border border-[#17458F]/30 flex items-center justify-center text-[#17458F] mb-2 group-hover:scale-110 transition-transform">
                        <Heart className="w-7 h-7 fill-[#17458F]/20 text-[#17458F]" />
                      </div>
                      <span className="font-montserrat font-bold text-[10px] uppercase tracking-widest text-[#17458F]">
                        {project.pillarName}
                      </span>
                      <span className="text-[10px] font-sans text-[#4A5565] mt-1">
                        Rotary Community Initiative
                      </span>
                    </div>
                  )}

                  {/* Card Content Body */}
                  <div className="p-5 space-y-2.5">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-[0.05em] px-2.5 py-0.5 rounded-md inline-block border ${
                        isDark
                          ? 'bg-[#F7A81B]/15 text-[#F7A81B] border-[#F7A81B]/20'
                          : 'bg-[#17458F]/10 text-[#17458F] border-[#17458F]/20'
                      }`}
                    >
                      {project.pillarName}
                    </span>

                    <h3
                      className={`font-serif font-bold text-base sm:text-lg leading-snug line-clamp-2 transition-colors ${
                        isDark
                          ? 'text-[#F8FAFC] group-hover:text-[#F7A81B]'
                          : 'text-[#243447] group-hover:text-[#17458F]'
                      }`}
                    >
                      {project.title}
                    </h3>

                    <p
                      className={`text-xs font-sans leading-relaxed line-clamp-3 ${
                        isDark ? 'text-[#CBD5E1]' : 'text-[#4A5565]'
                      }`}
                    >
                      {project.excerpt || 'Full project details available in modal.'}
                    </p>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-5 pt-0">
                  <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all bg-[#17458F] text-white group-hover:bg-[#1D5CB8] shadow-xs">
                    <span>Know More</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 ease-in-out group-hover:translate-x-1 text-white" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 1: RECENTLY UPDATED FEED ITEM IN-APP MODAL                   */}
      {/* ------------------------------------------------------------------ */}
      {selectedFeedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedFeedProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-w-3xl w-full rounded-[18px] border border-white/10 bg-[#0F172A] text-[#CBD5E1] p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 pr-6">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-montserrat font-bold text-[#F7A81B] uppercase tracking-wider bg-[#F7A81B]/15 px-3 py-1 rounded-full border border-[#F7A81B]/30">
                    {selectedFeedProject.pillar}
                  </span>
                  <span className="text-xs font-montserrat opacity-80 flex items-center space-x-1 text-[#CBD5E1]">
                    <Calendar className="w-3.5 h-3.5 text-[#F7A81B]" />
                    <span>{selectedFeedProject.date}</span>
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold mt-2 leading-tight text-[#F8FAFC]">
                  {selectedFeedProject.title}
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedFeedProject(null)}
                aria-label="Close project modal"
                className="p-2.5 rounded-full hover:bg-white/10 text-[#F7A81B] transition-colors cursor-pointer shrink-0 border border-[#F7A81B]/30"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedFeedProject.type === 'video' && selectedFeedProject.videoUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(selectedFeedProject.videoUrl)}
                  title={selectedFeedProject.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : selectedFeedProject.imageUrl ? (
              <div className="relative max-h-96 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/40">
                <ImageWithFallback
                  src={selectedFeedProject.imageUrl}
                  alt={selectedFeedProject.title}
                  className="w-full h-full object-cover max-h-96"
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-lg bg-gradient-to-br from-[#16233B] via-[#0F172A] to-[#0A0F1D] p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F7A81B]/15 border border-[#F7A81B]/40 flex items-center justify-center text-[#F7A81B] shadow-inner">
                  <Camera className="w-8 h-8 text-[#F7A81B]" />
                </div>
                <span className="font-montserrat font-bold text-sm text-[#F7A81B] uppercase tracking-wider px-4 py-2 rounded-xl bg-[#F7A81B]/10 border border-[#F7A81B]/20">
                  {selectedFeedProject.placeholderLabel || 'Official Photo Pending Verification'}
                </span>
              </div>
            )}

            <div className="space-y-4 font-sans text-base sm:text-lg leading-relaxed text-[#CBD5E1]">
              <p className="whitespace-pre-line">{selectedFeedProject.excerpt}</p>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedFeedProject(null)}
                className="w-full sm:w-auto bg-[#17458F] hover:bg-[#123773] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 2: FULL CATALOG PROJECT IN-APP MODAL                          */}
      {/* ------------------------------------------------------------------ */}
      {selectedCatalogProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedCatalogProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-w-2xl w-full rounded-[18px] border border-white/10 bg-[#0F172A] text-[#CBD5E1] p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 pr-6">
                <span className="text-xs font-montserrat font-bold text-[#F7A81B] uppercase tracking-wider bg-[#F7A81B]/15 px-3 py-1 rounded-full border border-[#F7A81B]/30 inline-block">
                  {selectedCatalogProject.pillarName}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold leading-tight text-[#F8FAFC]">
                  {selectedCatalogProject.title}
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedCatalogProject(null)}
                aria-label="Close project modal"
                className="p-2.5 rounded-full hover:bg-white/10 text-[#F7A81B] transition-colors cursor-pointer shrink-0 border border-[#F7A81B]/30"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedCatalogProject.type === 'video' && selectedCatalogProject.videoUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(selectedCatalogProject.videoUrl)}
                  title={selectedCatalogProject.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : selectedCatalogProject.imageUrl ? (
              <div className="relative max-h-80 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/40">
                <ImageWithFallback
                  src={selectedCatalogProject.imageUrl}
                  alt={selectedCatalogProject.title}
                  className="w-full h-full object-cover max-h-80"
                />
              </div>
            ) : (
              <div className="relative p-8 rounded-xl bg-gradient-to-br from-[#16233B] via-[#0F172A] to-[#0A0F1D] border border-white/10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#F7A81B]/20 border border-[#F7A81B]/50 flex items-center justify-center text-[#F7A81B] mx-auto">
                  <Heart className="w-8 h-8 fill-[#F7A81B]/30" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#F8FAFC]">
                  {selectedCatalogProject.title}
                </h4>
                <p className="text-xs font-montserrat uppercase tracking-wider text-[#CBD5E1]">
                  Rotary Community Healthcare Initiative
                </p>
              </div>
            )}

            <div className="space-y-4 font-sans text-base leading-relaxed text-[#CBD5E1]">
              {selectedCatalogProject.excerpt && selectedCatalogProject.excerpt.trim() ? (
                <p className="whitespace-pre-line">{selectedCatalogProject.excerpt}</p>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-montserrat font-medium text-[#F7A81B]">
                  Full project details coming soon
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCatalogProject(null)}
                className="w-full sm:w-auto bg-[#17458F] hover:bg-[#123773] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Close Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. CLOSING CTA                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden py-12 px-6 sm:px-10 rounded-[18px] border border-[#F7A81B]/30 shadow-xl text-center space-y-6 text-[#F8FAFC]">
        {/* Background image layer (z-0) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/partnership-section/bg.jpg"
            alt="Partnership & Collaboration background"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://static.wixstatic.com/media/941b16_fee94a5547814ae6b8ff9aa69c809b81~mv2.jpeg';
            }}
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.95) contrast(1.15) saturate(1.15)' }}
          />
        </div>

        {/* Dark navy overlay layer (z-1) */}
        <div
          className="absolute inset-0 z-1 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(1, 20, 46, 0.75) 0%, rgba(1, 20, 46, 0.88) 100%)',
          }}
        />

        {/* Foreground Content layer (z-10) */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 border border-[#F7A81B]/40 px-3.5 py-1 rounded-full text-xs font-montserrat font-bold uppercase tracking-wider bg-[#F7A81B]/20 text-[#F7A81B]">
            <CheckCircle2 className="w-4 h-4 text-[#F7A81B]" />
            <span>Partnership & Collaboration</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white drop-shadow-sm">
            Interested in supporting this work?
          </h2>

          <p className="font-sans text-sm sm:text-base max-w-2xl mx-auto font-medium text-slate-200 leading-relaxed">
            Partner with the Rotary Club of Makati to amplify community impact across Metro Manila and surrounding provinces.
          </p>

          <button
            type="button"
            onClick={() => {
              setActiveTab('Contact Us');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg inline-flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer bg-[#F7A81B] hover:bg-[#e59b10] text-[#011E41]"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4 text-[#011E41]" />
          </button>
        </div>
      </section>
      </div>
    </div>
  );
};
