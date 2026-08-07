/* Light Mode card redesign — replaced low-contrast badge/text colors with AA-verified tokens (gold-text on gold-tint, ink for titles, text-muted for dates, royal-blue/azure-text for CTAs). Applies to all card components sitewide. */

// Source: rotaryclubmakati.org/blog — update these 3 with the club's newest project posts periodically.

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Calendar, X } from 'lucide-react';
import { TabType, ThemeType } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { useI18n } from '../i18n/I18nContext';

// All project/content details render in-app — do not add external links to rotaryclubmakati.org for content viewing, only for genuinely external actions (social links, map directions).

interface ProjectsPreviewProps {
  setActiveTab: (tab: TabType) => void;
  theme: ThemeType;
}

interface HomepageProjectItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  excerpt: string;
}

const RECENT_PROJECTS: HomepageProjectItem[] = [
  {
    id: 'home-proj-1',
    title: "RC Makati's Hatch+ Cohort 2 Completes Final Pitch",
    date: 'June 3, 2026',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_9946319f5a2845d18303c2396cb5011a~mv2.jpg',
    excerpt:
      'RC Makati formally concluded the HATCH+ Cohort 2 Incubation Program through its Final Pitch — 13 sessions of mentoring and business development for socially relevant startups.',
  },
  {
    id: 'home-proj-2',
    title: 'Club Conducts Dental Mission at Sisters of Mary',
    date: 'May 26, 2026',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_a9b11276feb747a9a98acbff46597292~mv2.jpg',
    excerpt:
      'RC Makati continued its long-standing partnership with the Sisters of Mary in Silang, Cavite, supporting the holistic development of its students through this dental mission.',
  },
  {
    id: 'home-proj-3',
    title: 'RC Makati Expands Save Our Reefs Project to La Union',
    date: 'May 20, 2026',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_7120845956ba471a8faed4ec2c05839c~mv2.jpg',
    excerpt:
      'First initiated in 2021 with 200 reef buds, the Save Our Reefs project has grown to more than 400 reef buds and has now expanded to a second site in Padre Burgos, Quezon.',
  },
];

export const ProjectsPreview: React.FC<ProjectsPreviewProps> = ({
  setActiveTab,
}) => {
  const { t } = useI18n();
  const [selectedProject, setSelectedProject] = useState<HomepageProjectItem | null>(null);

  return (
    <section className="relative overflow-hidden py-20 text-[#CBD5E1]">
      {/* Background image layer (z-0) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/projects-section/bg.jpg"
          alt="A Glimpse of Our Projects section background"
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.95) contrast(1.15) saturate(1.15)' }}
        />
      </div>

      {/* Dark navy overlay layer (z-1) */}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(1, 20, 46, 0.75) 0%, rgba(1, 20, 46, 0.90) 100%)',
        }}
      />

      {/* Content layer (z-10) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/20 px-3.5 py-1 rounded-full border border-[#F7A81B]/40 shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#F7A81B]" />
            <span>{t('Recent Work')}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] drop-shadow-sm">
            {t('A Glimpse of Our Projects')}
          </h2>

          <p className="text-base sm:text-lg font-light text-[#CBD5E1] opacity-95 leading-relaxed">
            {t('A quick look at what RC Makati has been doing lately.')}
          </p>
        </div>

        {/* 3-Column Static Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {RECENT_PROJECTS.map((project) => (
            <div
              key={project.id}
              tabIndex={0}
              role="button"
              onClick={() => setSelectedProject(project)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedProject(project);
                }
              }}
              className="group rounded-[18px] overflow-hidden border border-[#F7A81B]/30 bg-[#0F172A]/90 backdrop-blur-md transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:border-[#F7A81B] hover:-translate-y-1.5 cursor-pointer"
            >
              <div>
                {/* Real photo (aspect ratio 4:3) */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                  <ImageWithFallback
                    src={project.imageUrl}
                    alt={t(project.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  {/* Date */}
                  <div className="inline-flex items-center space-x-1.5 text-xs font-sans font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md text-[#F7A81B] bg-[#F7A81B]/15 border border-[#F7A81B]/20">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{project.date}</span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug text-[#F8FAFC] group-hover:text-[#F7A81B] transition-colors">
                    {t(project.title)}
                  </h3>

                  {/* Excerpt (2 lines max) */}
                  <p className="text-xs sm:text-sm font-sans leading-relaxed text-[#CBD5E1] line-clamp-2">
                    {t(project.excerpt)}
                  </p>
                </div>
              </div>

              {/* Read Full Story -> In-App Modal Trigger */}
              <div className="p-6 pt-0">
                <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all bg-[#17458F] text-white group-hover:bg-[#123773] shadow-md">
                  <span>{t('common.readFullStory')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* See All Projects Navigation Button */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('Projects');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-[#17458F] hover:bg-[#123773] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200 inline-flex items-center space-x-2 cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>{t('See All Projects')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* In-App Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-w-2xl w-full rounded-[18px] border border-white/10 bg-[#0F172A] text-[#CBD5E1] p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 pr-6">
                <div className="flex items-center space-x-2 text-xs font-montserrat font-bold text-[#F7A81B] uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-[#F7A81B]" />
                  <span>{selectedProject.date}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold leading-tight text-[#F8FAFC]">
                  {selectedProject.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
                className="p-2.5 rounded-full hover:bg-white/10 text-[#F7A81B] transition-colors cursor-pointer shrink-0 border border-[#F7A81B]/30"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Photo */}
            <div className="relative max-h-80 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/40">
              <ImageWithFallback
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-full object-cover max-h-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
            </div>

            {/* Excerpt Content */}
            <div className="space-y-4 font-sans text-base leading-relaxed opacity-95">
              <p>{selectedProject.excerpt}</p>
            </div>

            {/* Close Action */}
            <div className="pt-6 border-t border-[#F7A81B]/30 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="w-full sm:w-auto bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

