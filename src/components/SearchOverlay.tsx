// Search index is built from existing app data (board members, presidents, projects, page list) — update the index source arrays if new content is added later (e.g. more president bios, more projects).

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  User,
  Award,
  Layers,
  Info,
  Calendar,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Users,
  Handshake,
  Mail,
  BookOpen,
} from 'lucide-react';
import { TabType, ThemeType } from '../types';
import { BOARD_OFFICERS, BOARD_DIRECTORS, BOARD_ADVISERS, BoardMember } from '../data/boardData';
import { RCM_PRESIDENTS, PastPresident } from '../data/presidentsData';
import { REAL_RCM_PROJECTS, ProjectPost } from '../data/projectsData';
import { ALL_PILLAR_PROJECTS_MAP, PillarCatalogProject } from '../data/pillarProjectsData';
import { FOCUS_AREAS } from '../data/rcmData';
import { ImageWithFallback } from './ImageWithFallback';
import { useI18n } from '../i18n/I18nContext';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: TabType) => void;
  onSelectFocusArea?: (focusId: string) => void;
  theme: ThemeType;
}

export interface PageSearchItem {
  type: 'page';
  id: string;
  title: string;
  subtitle: string;
  tab: TabType;
  focusAreaId?: string;
  synonyms: string[];
}

export interface PersonSearchItem {
  type: 'person';
  id: string;
  personType: 'board' | 'president';
  name: string;
  titleOrYear: string;
  activeRole?: string;
  photoUrl?: string;
  originalBoardMember?: BoardMember;
  originalPresident?: PastPresident;
}

export interface ProjectSearchItem {
  type: 'project';
  id: string;
  title: string;
  pillarName: string;
  pillarId?: string;
  excerpt: string;
  imageUrl?: string;
  date?: string;
  originalPost?: ProjectPost;
  originalCatalogItem?: PillarCatalogProject;
}

export type SearchResultItem = PageSearchItem | PersonSearchItem | ProjectSearchItem;

const SUGGESTED_SEARCHES = [
  'Board of Directors',
  'Save Our Reefs',
  'Membership Fees',
  'Contact',
  'Polio Plus',
  'Eddie Yap',
];

const PAGES_INDEX: PageSearchItem[] = [
  {
    type: 'page',
    id: 'page-home',
    title: 'Home Page',
    subtitle: 'Main overview, club stats, and latest news',
    tab: 'Home',
    synonyms: ['home', 'main', 'welcome', 'rotary club of makati', 'mother club'],
  },
  {
    type: 'page',
    id: 'page-about',
    title: 'About Us — Overview & History',
    subtitle: '60 years of service, charter story, and core values',
    tab: 'About Us',
    synonyms: ['about', 'history', 'charter', 'mother club', 'rotary', 'values', 'mission'],
  },
  {
    type: 'page',
    id: 'page-board',
    title: 'Board of Directors & Officers',
    subtitle: 'RY 2024-2025 club leadership team',
    tab: 'Board of Directors',
    synonyms: ['board', 'directors', 'officers', 'leadership', 'galvez', 'calleja', 'soliven'],
  },
  {
    type: 'page',
    id: 'page-presidents',
    title: 'Roster of Past Presidents',
    subtitle: 'Honoring 59 distinguished leaders since 1966',
    tab: 'Roster of Presidents',
    synonyms: ['presidents', 'past presidents', 'roster', 'history', 'legacy', 'yap', '1966'],
  },
  {
    type: 'page',
    id: 'page-partnerships',
    title: 'Partnerships',
    subtitle: 'Global and local collaborators',
    tab: 'Partnerships',
    synonyms: ['partners', 'sponsors', 'sister clubs', 'collaborators', 'international', 'alliances'],
  },
  {
    type: 'page',
    id: 'page-projects',
    title: 'Projects & Focus Areas',
    subtitle: 'All 7 Rotary focus area initiatives & feed',
    tab: 'Projects',
    focusAreaId: 'all',
    synonyms: ['projects', 'service', 'grants', 'causes', 'initiatives', 'feed'],
  },
  {
    type: 'page',
    id: 'page-news',
    title: 'News & Kaunlaran Newsletter Archive',
    subtitle: 'Announcements, club updates, and Kaunlaran issues',
    tab: 'News',
    synonyms: ['news', 'newsletter', 'kaunlaran', 'sower', 'quill', 'announcements', 'updates', 'presidents message'],
  },
  {
    type: 'page',
    id: 'page-dp',
    title: 'Disease Prevention & Treatment',
    subtitle: 'Pillar catalog: Polio, Stop TB, PGH Missions',
    tab: 'Projects',
    focusAreaId: 'disease-prevention',
    synonyms: ['disease', 'polio', 'tb', 'medical', 'health', 'pgh', 'surgical', 'cancer'],
  },
  {
    type: 'page',
    id: 'page-ws',
    title: 'Water & Sanitation',
    subtitle: 'Pillar catalog: Clean water projects',
    tab: 'Projects',
    focusAreaId: 'water-sanitation',
    synonyms: ['water', 'sanitation', 'wash', 'clean water', 'wells', 'hygiene'],
  },
  {
    type: 'page',
    id: 'page-mc',
    title: 'Maternal & Child Health',
    subtitle: 'Pillar catalog: Healthcare for mothers & children',
    tab: 'Projects',
    focusAreaId: 'maternal-child-care',
    synonyms: ['maternal', 'mother', 'child', 'children', 'baby', 'health', 'nutrition'],
  },
  {
    type: 'page',
    id: 'page-be',
    title: 'Basic Education & Literacy',
    subtitle: 'Pillar catalog: HATCH+, schools, literacy',
    tab: 'Projects',
    focusAreaId: 'basic-education',
    synonyms: ['education', 'literacy', 'school', 'books', 'hatch', 'scholarships', 'reading'],
  },
  {
    type: 'page',
    id: 'page-ec',
    title: 'Economic & Community Development',
    subtitle: 'Pillar catalog: Livelihood & microfinance',
    tab: 'Projects',
    focusAreaId: 'economic-development',
    synonyms: ['economic', 'community', 'microfinance', 'jobs', 'business', 'livelihood'],
  },
  {
    type: 'page',
    id: 'page-pb',
    title: 'Peacebuilding & Conflict Prevention',
    subtitle: 'Pillar catalog: Sanlakbay rehab & youth peace',
    tab: 'Projects',
    focusAreaId: 'peacebuilding',
    synonyms: ['peace', 'conflict', 'drug rehab', 'sanlakbay', 'youth', 'harmony'],
  },
  {
    type: 'page',
    id: 'page-env',
    title: 'Environment',
    subtitle: 'Pillar catalog: Save Our Reefs & BGC Greenway',
    tab: 'Projects',
    focusAreaId: 'environment',
    synonyms: ['environment', 'reef', 'green', 'trees', 'bgc', 'coral', 'reefs', 'nature'],
  },
  {
    type: 'page',
    id: 'page-membership',
    title: 'Membership & Application',
    subtitle: 'Join RCM, member dues, requirements, portal',
    tab: 'Membership',
    synonyms: ['membership', 'join', 'apply', 'dues', 'fees', 'member portal', 'login', 'pay'],
  },
  {
    type: 'page',
    id: 'page-contact',
    title: 'Contact Us & Location',
    subtitle: 'Secretariat, Google Maps directions, inquiry form',
    tab: 'Contact Us',
    synonyms: ['contact', 'donate', 'call', 'address', 'email', 'location', 'map', 'headquarters', 'secretariat'],
  },
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onSelectFocusArea,
  theme,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPersonModal, setSelectedPersonModal] = useState<PersonSearchItem | null>(null);
  const [selectedProjectModal, setSelectedProjectModal] = useState<ProjectSearchItem | null>(null);

  const isDark = theme === 'dark';
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when overlay opens & keyboard listeners
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setSelectedPersonModal(null);
      setSelectedProjectModal(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Combine data sources into search index
  const allPeople: PersonSearchItem[] = useMemo(() => {
    const boardList: PersonSearchItem[] = [
      ...BOARD_OFFICERS,
      ...BOARD_DIRECTORS,
      ...BOARD_ADVISERS,
    ].map((m) => ({
      type: 'person',
      id: `board-${m.id}`,
      personType: 'board',
      name: m.name,
      titleOrYear: `Board of Directors • ${m.title}`,
      photoUrl: m.photoUrl,
      originalBoardMember: m,
    }));

    const presList: PersonSearchItem[] = RCM_PRESIDENTS.map((p) => ({
      type: 'person',
      id: `pres-${p.id}`,
      personType: 'president',
      name: p.name,
      titleOrYear: `President • RY ${p.year}`,
      activeRole: p.activeRole,
      photoUrl: p.photoUrl,
      originalPresident: p,
    }));

    return [...boardList, ...presList];
  }, []);

  const allProjects: ProjectSearchItem[] = useMemo(() => {
    const feedList: ProjectSearchItem[] = REAL_RCM_PROJECTS.map((p) => ({
      type: 'project',
      id: `feed-${p.id}`,
      title: p.title,
      pillarName: p.pillar || 'Club Project',
      pillarId: p.pillarId,
      excerpt: p.excerpt,
      imageUrl: p.imageUrl,
      date: p.date,
      originalPost: p,
    }));

    const catalogList: ProjectSearchItem[] = Object.values(ALL_PILLAR_PROJECTS_MAP)
      .flat()
      .map((cp) => ({
        type: 'project',
        id: `cat-${cp.id}`,
        title: cp.title,
        pillarName: cp.pillarName,
        pillarId: cp.pillarId,
        excerpt: cp.excerpt || '',
        imageUrl: cp.imageUrl,
        originalCatalogItem: cp,
      }));

    // Deduplicate by title if needed
    const map = new Map<string, ProjectSearchItem>();
    [...feedList, ...catalogList].forEach((item) => {
      if (!map.has(item.title.toLowerCase())) {
        map.set(item.title.toLowerCase(), item);
      }
    });

    return Array.from(map.values());
  }, []);

  // Filtered results
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { pages: [], people: [], projects: [], totalCount: 0 };

    const matchedPages = PAGES_INDEX.filter((page) => {
      const matchTitle = page.title.toLowerCase().includes(q);
      const matchSub = page.subtitle.toLowerCase().includes(q);
      const matchSyn = page.synonyms.some((s) => s.toLowerCase().includes(q));
      return matchTitle || matchSub || matchSyn;
    });

    const matchedPeople = allPeople.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchTitle = p.titleOrYear.toLowerCase().includes(q);
      const matchRole = p.activeRole?.toLowerCase().includes(q) || false;
      return matchName || matchTitle || matchRole;
    });

    const matchedProjects = allProjects.filter((proj) => {
      const matchTitle = proj.title.toLowerCase().includes(q);
      const matchPillar = proj.pillarName.toLowerCase().includes(q);
      const matchExcerpt = proj.excerpt.toLowerCase().includes(q);
      return matchTitle || matchPillar || matchExcerpt;
    });

    const totalCount = matchedPages.length + matchedPeople.length + matchedProjects.length;

    return {
      pages: matchedPages,
      people: matchedPeople,
      projects: matchedProjects,
      totalCount,
    };
  }, [query, allPeople, allProjects]);

  const flatResultsList: SearchResultItem[] = useMemo(() => {
    return [
      ...filteredResults.pages,
      ...filteredResults.people,
      ...filteredResults.projects,
    ];
  }, [filteredResults]);

  // Handle keyboard navigation (ArrowUp, ArrowDown, Enter, Esc)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPersonModal || selectedProjectModal) {
          setSelectedPersonModal(null);
          setSelectedProjectModal(null);
        } else {
          onClose();
        }
        return;
      }

      if (flatResultsList.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatResultsList.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatResultsList.length) % flatResultsList.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = flatResultsList[selectedIndex];
        if (selected) {
          handleSelectResult(selected);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatResultsList, selectedIndex, selectedPersonModal, selectedProjectModal]);

  const handleSelectResult = (item: SearchResultItem) => {
    if (item.type === 'page') {
      setActiveTab(item.tab);
      if (item.focusAreaId && onSelectFocusArea) {
        onSelectFocusArea(item.focusAreaId);
      }
      onClose();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.type === 'person') {
      setSelectedPersonModal(item);
    } else if (item.type === 'project') {
      setSelectedProjectModal(item);
    }
  };

  const highlightMatch = (text: string, searchStr: string) => {
    if (!searchStr.trim()) return text;
    const parts = text.split(new RegExp(`(${searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchStr.toLowerCase() ? (
            <mark
              key={i}
              className="bg-[#F7A81B]/35 text-[#F7A81B] font-extrabold rounded px-0.5 inline-block"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-start items-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sitewide Search Overlay"
    >
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite">
        {query.trim()
          ? `${filteredResults.totalCount} search results found for ${query}`
          : 'Search overlay active. Type a search term.'}
      </div>

      <div
        className={`w-full max-w-3xl rounded-3xl border-2 border-[#F7A81B] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] transition-all ${
          isDark ? 'bg-[#011E41] text-[#F5F1E6]' : 'bg-[#FAF8F3] text-[#011E41]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar Header */}
        <div className="p-4 sm:p-6 border-b border-[#F7A81B]/30 flex items-center space-x-3 bg-[#011E41] text-[#F5F1E6]">
          <Search className="w-6 h-6 text-[#F7A81B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t('common.search')}
            className="w-full bg-transparent text-lg sm:text-xl font-sans font-medium text-[#F5F1E6] placeholder-[#F5F1E6]/50 focus:outline-none focus:ring-0 border-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#F5F1E6]/70 hover:text-[#F7A81B] transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F7A81B]/10 hover:bg-[#F7A81B] text-[#F7A81B] hover:text-[#011E41] transition-all cursor-pointer border border-[#F7A81B]/30 shrink-0"
            aria-label="Close search overlay"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div
          ref={resultsContainerRef}
          className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar"
        >
          {/* Empty Query State (Suggested Searches) */}
          {!query.trim() && (
            <div className="py-6 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-montserrat font-bold uppercase tracking-wider text-[#F7A81B]">
                <Sparkles className="w-4 h-4 text-[#F7A81B]" />
                <span>Suggested & Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SEARCHES.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setQuery(chip);
                      inputRef.current?.focus();
                    }}
                    className={`px-4 py-2 rounded-full border text-xs font-montserrat font-bold transition-all duration-200 cursor-pointer flex items-center space-x-1.5 hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-[#121212] border-[#F7A81B]/30 text-[#F5F1E6] hover:border-[#F7A81B] hover:bg-[#F7A81B]/20'
                        : 'bg-[#F0EDE6] border-[#011E41]/20 text-[#011E41] hover:border-[#F7A81B] hover:bg-[#F7A81B]/20'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 text-[#F7A81B]" />
                    <span>{chip}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs font-sans text-[#F5F1E6]/60 pt-2">
                Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/20 font-mono text-[10px]">Esc</kbd> anytime to close this search overlay.
              </p>
            </div>
          )}

          {/* No Results State */}
          {query.trim() && filteredResults.totalCount === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F7A81B]/15 border border-[#F7A81B]/40 flex items-center justify-center text-[#F7A81B] mx-auto">
                <Search className="w-8 h-8 text-[#F7A81B]" />
              </div>
              <h3 className="font-serif text-xl font-bold">
                No matches found for "{query}"
              </h3>
              <p className="font-sans text-sm opacity-80 max-w-md mx-auto">
                Try searching for a different keyword, board member name, project title, or Rotary focus area.
              </p>
              <div className="pt-4">
                <div className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#F7A81B] mb-2">
                  Try one of these instead:
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTED_SEARCHES.slice(0, 4).map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setQuery(chip);
                        inputRef.current?.focus();
                      }}
                      className="px-3.5 py-1.5 rounded-full border border-[#F7A81B]/40 text-xs font-montserrat font-semibold text-[#F7A81B] hover:bg-[#F7A81B]/20 cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Group 1: Pages & Sections */}
          {filteredResults.pages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-montserrat font-bold uppercase tracking-widest text-[#F7A81B] pb-1 border-b border-[#F7A81B]/20">
                <Layers className="w-4 h-4 text-[#F7A81B]" />
                <span>Pages & Sections ({filteredResults.pages.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredResults.pages.map((item) => {
                  const globalIdx = flatResultsList.indexOf(item);
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectResult(item)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#F7A81B] text-[#011E41] border-[#F7A81B] shadow-md font-bold'
                          : isDark
                          ? 'bg-[#121212]/70 border-[#F7A81B]/20 hover:border-[#F7A81B] text-[#F5F1E6]'
                          : 'bg-white border-[#011E41]/10 hover:border-[#F7A81B] text-[#011E41]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#011E41] text-[#F7A81B]'
                              : 'bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30'
                          }`}
                        >
                          <Info className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-sm sm:text-base">
                            {highlightMatch(item.title, query)}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-[#011E41]/80' : 'opacity-70'}`}>
                            {highlightMatch(item.subtitle, query)}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#011E41]' : 'text-[#F7A81B]'}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Group 2: People (Board & Presidents) */}
          {filteredResults.people.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-montserrat font-bold uppercase tracking-widest text-[#F7A81B] pb-1 border-b border-[#F7A81B]/20">
                <Users className="w-4 h-4 text-[#F7A81B]" />
                <span>Board Members & Past Presidents ({filteredResults.people.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredResults.people.map((item) => {
                  const globalIdx = flatResultsList.indexOf(item);
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectResult(item)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#F7A81B] text-[#011E41] border-[#F7A81B] shadow-md font-bold'
                          : isDark
                          ? 'bg-[#121212]/70 border-[#F7A81B]/20 hover:border-[#F7A81B] text-[#F5F1E6]'
                          : 'bg-white border-[#011E41]/10 hover:border-[#F7A81B] text-[#011E41]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {item.photoUrl ? (
                          <img
                            src={item.photoUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-[#F7A81B]/50 shrink-0"
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-xs shrink-0 ${
                              isSelected
                                ? 'bg-[#011E41] text-[#F7A81B]'
                                : 'bg-[#F7A81B]/20 text-[#F7A81B] border border-[#F7A81B]/40'
                            }`}
                          >
                            <User className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-serif font-bold text-sm sm:text-base truncate">
                            {highlightMatch(item.name, query)}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-[#011E41]/85' : 'opacity-70'} truncate`}>
                            {highlightMatch(item.titleOrYear, query)}
                            {item.activeRole && ` • ${item.activeRole}`}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#011E41]' : 'text-[#F7A81B]'}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Group 3: Projects */}
          {filteredResults.projects.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-montserrat font-bold uppercase tracking-widest text-[#F7A81B] pb-1 border-b border-[#F7A81B]/20">
                <Award className="w-4 h-4 text-[#F7A81B]" />
                <span>Projects & Service Initiatives ({filteredResults.projects.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredResults.projects.map((item) => {
                  const globalIdx = flatResultsList.indexOf(item);
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectResult(item)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#F7A81B] text-[#011E41] border-[#F7A81B] shadow-md font-bold'
                          : isDark
                          ? 'bg-[#121212]/70 border-[#F7A81B]/20 hover:border-[#F7A81B] text-[#F5F1E6]'
                          : 'bg-white border-[#011E41]/10 hover:border-[#F7A81B] text-[#011E41]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-[#F7A81B]/40 shrink-0 bg-black/20"
                          />
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-[#011E41] text-[#F7A81B]'
                                : 'bg-[#F7A81B]/20 text-[#F7A81B] border border-[#F7A81B]/40'
                            }`}
                          >
                            <Award className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-serif font-bold text-sm sm:text-base truncate">
                            {highlightMatch(item.title, query)}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-[#011E41]/85' : 'text-[#F7A81B] font-semibold'} truncate`}>
                            {highlightMatch(item.pillarName, query)}
                            {item.date ? ` • ${item.date}` : ''}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#011E41]' : 'text-[#F7A81B]'}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#F7A81B]/20 bg-[#011E41] text-[#F5F1E6] flex items-center justify-between text-xs font-montserrat">
          <span className="text-[#F7A81B] font-semibold">
            Rotary Club of Makati Sitewide Search
          </span>
          <span className="opacity-70 hidden sm:inline">
            Use <kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/20">↑</kbd>{' '}
            <kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/20">↓</kbd> to navigate,{' '}
            <kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/20">Enter</kbd> to select
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* IN-APP PERSON DETAIL MODAL (Inside Search)                        */}
      {/* ------------------------------------------------------------------ */}
      {selectedPersonModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedPersonModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#011E41] text-[#F5F1E6] rounded-3xl border-2 border-[#F7A81B] shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F7A81B]/30 pb-4">
              <div className="flex items-center space-x-2 text-xs font-montserrat font-bold text-[#F7A81B] uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#F7A81B]" />
                <span>
                  {selectedPersonModal.personType === 'president'
                    ? 'Past President Profile'
                    : 'Board Member Profile'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPersonModal(null)}
                className="p-2 rounded-full bg-[#F7A81B]/10 hover:bg-[#F7A81B] text-[#F7A81B] hover:text-[#011E41] transition-colors border border-[#F7A81B]/30 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {selectedPersonModal.photoUrl ? (
                <img
                  src={selectedPersonModal.photoUrl}
                  alt={selectedPersonModal.name}
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-[#F7A81B] shadow-xl shrink-0"
                />
              ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#F7A81B]/20 border-2 border-[#F7A81B] flex items-center justify-center font-serif text-3xl font-extrabold text-[#F7A81B] shrink-0">
                  <User className="w-12 h-12 text-[#F7A81B]" />
                </div>
              )}

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="inline-block bg-[#F7A81B] text-[#011E41] font-montserrat font-extrabold text-xs uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                  {selectedPersonModal.titleOrYear}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F5F1E6]">
                  {selectedPersonModal.name}
                </h3>
                {selectedPersonModal.activeRole && (
                  <div className="text-xs font-montserrat font-bold text-[#F7A81B] bg-[#F7A81B]/20 px-3 py-1 rounded-full border border-[#F7A81B]/40 inline-block">
                    {selectedPersonModal.activeRole}
                  </div>
                )}
                <p className="text-xs font-sans text-[#F5F1E6]/70 pt-1">
                  Rotary Club of Makati • District 3830
                </p>
              </div>
            </div>

            {/* If President has bio */}
            {selectedPersonModal.originalPresident?.bio && (
              <div className="p-4 rounded-2xl bg-[#121212]/80 border border-[#F7A81B]/30 space-y-3 text-sm font-serif leading-relaxed text-[#F5F1E6]/90 max-h-60 overflow-y-auto custom-scrollbar">
                {selectedPersonModal.originalPresident.bio.intro.map((pText, i) => (
                  <p key={i}>{pText}</p>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-[#F7A81B]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (selectedPersonModal.personType === 'president') {
                    setActiveTab('Roster of Presidents');
                  } else {
                    setActiveTab('Board of Directors');
                  }
                  setSelectedPersonModal(null);
                  onClose();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>
                  Go to {selectedPersonModal.personType === 'president' ? 'Roster of Presidents' : 'Board Page'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedPersonModal(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#F7A81B]/40 text-[#F7A81B] hover:bg-[#F7A81B]/10 font-montserrat font-bold text-xs uppercase transition-colors cursor-pointer"
              >
                Back to Search Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* IN-APP PROJECT DETAIL MODAL (Inside Search)                       */}
      {/* ------------------------------------------------------------------ */}
      {selectedProjectModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedProjectModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#011E41] text-[#F5F1E6] rounded-3xl border-2 border-[#F7A81B] shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F7A81B]/30 pb-4">
              <div className="flex items-center space-x-2 text-xs font-montserrat font-bold text-[#F7A81B] uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#F7A81B]" />
                <span>{selectedProjectModal.pillarName}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProjectModal(null)}
                className="p-2 rounded-full bg-[#F7A81B]/10 hover:bg-[#F7A81B] text-[#F7A81B] hover:text-[#011E41] transition-colors border border-[#F7A81B]/30 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F5F1E6]">
              {selectedProjectModal.title}
            </h3>

            {selectedProjectModal.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-[#F7A81B]/40 shadow-lg max-h-72 bg-black/20">
                <ImageWithFallback
                  src={selectedProjectModal.imageUrl}
                  alt={selectedProjectModal.title}
                  className="w-full h-full object-cover max-h-72"
                />
              </div>
            )}

            <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed text-[#F5F1E6]/90">
              <p>{selectedProjectModal.excerpt}</p>
            </div>

            <div className="pt-4 border-t border-[#F7A81B]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Projects');
                  if (selectedProjectModal.pillarId && onSelectFocusArea) {
                    onSelectFocusArea(selectedProjectModal.pillarId);
                  }
                  setSelectedProjectModal(null);
                  onClose();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>View Full Projects Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedProjectModal(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#F7A81B]/40 text-[#F7A81B] hover:bg-[#F7A81B]/10 font-montserrat font-bold text-xs uppercase transition-colors cursor-pointer"
              >
                Back to Search Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
