import React, { useState } from 'react';
import { Menu, X, ArrowRight, ChevronDown, Users, Info, Award, Handshake, Layers, Sparkles, LogIn, LogOut, Search, Shield } from 'lucide-react';
import { TabType, ThemeType } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { FOCUS_AREAS } from '../data/rcmData';
import { RCMLogo, RotaryWheelSVG } from './RCMLogo';
import { MemberProfile, ADMIN_DEMO_MEMBER, CURRENT_DEMO_MEMBER } from '../data/rcmMemberData';
import { CountrySelector } from './CountrySelector';
import { useI18n } from '../i18n/I18nContext';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onSelectFocusArea?: (focusId: string) => void;
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
  isSignedIn?: boolean;
  setIsSignedIn?: (val: boolean) => void;
  currentUser?: MemberProfile;
  onOpenLogin?: () => void;
  onOpenSearch?: () => void;
  onOpenRotaBot?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSelectFocusArea,
  theme,
  setTheme,
  isSignedIn = false,
  setIsSignedIn,
  currentUser = ADMIN_DEMO_MEMBER,
  onOpenLogin,
  onOpenSearch,
  onOpenRotaBot,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const { t } = useI18n();

  const mainTabs: TabType[] = ['Home', 'About Us', 'Projects', 'News', 'Membership', 'Contact Us'];

  const isDark = theme === 'dark';

  const handleTabClick = (tab: TabType, focusAreaId?: string) => {
    setActiveTab(tab);
    if (focusAreaId && onSelectFocusArea) {
      onSelectFocusArea(focusAreaId);
    }
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setProjectsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const getTabLabel = (tab: TabType): string => {
    switch (tab) {
      case 'Home': return t('nav.home');
      case 'About Us': return t('nav.about');
      case 'Projects': return t('nav.projects');
      case 'News': return t('nav.news');
      case 'Membership': return t('nav.membership');
      case 'Contact Us': return t('nav.contact');
      case 'Board of Directors': return t('nav.leadership');
      case 'Roster of Presidents': return t('nav.presidents');
      case 'Partnerships': return t('nav.sisterClubs');
      case 'Admin': return t('nav.adminDashboard');
      default: return tab;
    }
  };

  const isAboutActive =
    activeTab === 'About Us' ||
    activeTab === 'Board of Directors' ||
    activeTab === 'Roster of Presidents' ||
    activeTab === 'Partnerships';

  return (
    <header className="sticky top-0 z-50 transition-colors duration-300">
      {/* Main Navbar Section */}
      <div
        className={`transition-colors duration-300 backdrop-blur-md border-b shadow-sm ${
          isDark
            ? 'bg-[#01142E]/95 border-[#F7A81B]/20 text-[#F5F1E6]'
            : 'bg-[#D2CCC1] border-[#243447]/10 text-[#243447]'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Section */}
          <div
            className="flex items-center cursor-pointer py-1 shrink-0"
            onClick={() => handleTabClick('Home')}
            title="Rotary Club of Makati - The Mother Club"
          >
            <RCMLogo theme={theme} size="md" />
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 lg:space-x-2 xl:space-x-3 shrink-0">
            {mainTabs.map((tab) => {
              if (tab === 'About Us') {
                return (
                  <div
                    key="About Us"
                    className="relative shrink-0"
                    onMouseEnter={() => setAboutDropdownOpen(true)}
                    onMouseLeave={() => setAboutDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => handleTabClick('About Us')}
                      className={`px-3 py-1.5 lg:px-4 lg:py-2 text-[11px] lg:text-xs xl:text-sm font-montserrat font-bold uppercase tracking-wider transition-all duration-200 rounded-full cursor-pointer relative flex items-center space-x-1 whitespace-nowrap ${
                        isAboutActive
                          ? isDark
                            ? 'text-[#F7A81B] bg-[#011E41] shadow-xs border border-[#F7A81B]/40'
                            : 'text-[#243447] bg-[#F2EFE8] shadow-xs border border-[#C9982B]/30'
                          : isDark
                          ? 'text-[#F5F1E6]/90 hover:text-[#F7A81B] hover:bg-white/10'
                          : 'text-[#243447]/90 hover:text-[#243447] hover:bg-[#F2EFE8]/60'
                      }`}
                    >
                      <span>{t('nav.about')}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'} transition-transform duration-200 ${
                          aboutDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                      {isAboutActive && (
                        <span className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full ${isDark ? 'bg-[#F7A81B]' : 'bg-[#C9982B]'}`} />
                      )}
                    </button>

                    {/* About Us Submenu Dropdown */}
                    {aboutDropdownOpen && (
                      <div className="absolute top-full left-0 w-60 pt-2 z-50 animate-fadeIn">
                        <div
                          className={`rounded-2xl border shadow-xl p-2 space-y-1 ${
                            isDark
                              ? 'bg-[#011E41] border-[#F7A81B]/30 text-[#F5F1E6]'
                              : 'bg-[#F2EFE8] border-[#C9982B]/20 text-[#243447]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleTabClick('About Us')}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-montserrat font-semibold uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer ${
                              activeTab === 'About Us'
                                ? isDark ? 'bg-[#F7A81B] text-[#011E41]' : 'bg-[#C9982B] text-[#243447]'
                                : isDark ? 'hover:bg-white/10 text-[#F5F1E6]' : 'hover:bg-[#E7E2D8] text-[#243447]'
                            }`}
                          >
                            <Info className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'}`} />
                            <span>{t('nav.overview')}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTabClick('Board of Directors')}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-montserrat font-semibold uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer ${
                              activeTab === 'Board of Directors'
                                ? isDark ? 'bg-[#F7A81B] text-[#011E41]' : 'bg-[#C9982B] text-[#243447]'
                                : isDark ? 'hover:bg-white/10 text-[#F5F1E6]' : 'hover:bg-[#E7E2D8] text-[#243447]'
                            }`}
                          >
                            <Users className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'}`} />
                            <span>{t('nav.leadership')}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTabClick('Roster of Presidents')}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-montserrat font-semibold uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer ${
                              activeTab === 'Roster of Presidents'
                                ? isDark ? 'bg-[#F7A81B] text-[#011E41]' : 'bg-[#C9982B] text-[#243447]'
                                : isDark ? 'hover:bg-white/10 text-[#F5F1E6]' : 'hover:bg-[#E7E2D8] text-[#243447]'
                            }`}
                          >
                            <Award className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'}`} />
                            <span>{t('nav.presidents')}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTabClick('Partnerships')}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-montserrat font-semibold uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer ${
                              activeTab === 'Partnerships'
                                ? isDark ? 'bg-[#F7A81B] text-[#011E41]' : 'bg-[#C9982B] text-[#243447]'
                                : isDark ? 'hover:bg-white/10 text-[#F5F1E6]' : 'hover:bg-[#E7E2D8] text-[#243447]'
                            }`}
                          >
                            <Handshake className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'}`} />
                            <span>{t('nav.sisterClubs')}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (tab === 'Projects') {
                return (
                  <div
                    key="Projects"
                    className="relative shrink-0"
                    onMouseEnter={() => setProjectsDropdownOpen(true)}
                    onMouseLeave={() => setProjectsDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => handleTabClick('Projects', 'all')}
                      className={`px-3 py-1.5 lg:px-4 lg:py-2 text-[11px] lg:text-xs xl:text-sm font-montserrat font-bold uppercase tracking-wider transition-all duration-200 rounded-full cursor-pointer relative flex items-center space-x-1 whitespace-nowrap ${
                        activeTab === 'Projects'
                          ? isDark
                            ? 'text-[#F7A81B] bg-[#011E41] shadow-xs border border-[#F7A81B]/40'
                            : 'text-[#243447] bg-[#F2EFE8] shadow-xs border border-[#C9982B]/30'
                          : isDark
                          ? 'text-[#F5F1E6]/90 hover:text-[#F7A81B] hover:bg-white/10'
                          : 'text-[#243447]/90 hover:text-[#243447] hover:bg-[#F2EFE8]/60'
                      }`}
                    >
                      <span>{t('nav.projects')}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'} transition-transform duration-200 ${
                          projectsDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                      {activeTab === 'Projects' && (
                        <span className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full ${isDark ? 'bg-[#F7A81B]' : 'bg-[#C9982B]'}`} />
                      )}
                    </button>

                    {/* Projects Submenu Dropdown */}
                    {projectsDropdownOpen && (
                      <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-fadeIn">
                        <div
                          className={`rounded-2xl border shadow-xl p-2 space-y-1 ${
                            isDark
                              ? 'bg-[#011E41] border-[#F7A81B]/30 text-[#F5F1E6]'
                              : 'bg-[#F2EFE8] border-[#C9982B]/20 text-[#243447]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleTabClick('Projects', 'all')}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-montserrat font-semibold uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer ${
                              activeTab === 'Projects'
                                ? isDark ? 'bg-[#F7A81B] text-[#011E41]' : 'bg-[#C9982B] text-[#243447]'
                                : isDark ? 'hover:bg-white/10 text-[#F5F1E6]' : 'hover:bg-[#E7E2D8] text-[#243447]'
                            }`}
                          >
                            <Layers className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'}`} />
                            <span>{t('nav.allProjects')}</span>
                          </button>

                          <div className={`pt-1 pb-1 border-t ${isDark ? 'border-white/10' : 'border-[#243447]/10'}`}>
                            <span className={`px-3 text-[10px] font-montserrat font-bold uppercase tracking-widest block mb-1 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'}`}>
                              {t('nav.focusAreas')}
                            </span>
                            {FOCUS_AREAS.map((area) => (
                              <button
                                key={area.id}
                                type="button"
                                onClick={() => handleTabClick('Projects', area.id)}
                                className={`w-full text-left px-3 py-1.5 rounded-xl text-[11px] font-montserrat font-medium transition-colors cursor-pointer flex items-center space-x-2 ${
                                  isDark ? 'hover:bg-white/10 text-[#F5F1E6]' : 'hover:bg-[#E7E2D8] text-[#243447]'
                                }`}
                              >
                                <img src={area.iconUrl} alt="" className="w-3.5 h-3.5 object-contain shrink-0" referrerPolicy="no-referrer" />
                                <span className="line-clamp-1">{area.title}</span>
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleTabClick('Projects', 'milestones')}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-montserrat font-semibold uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer border-t pt-2 ${
                              isDark
                                ? 'border-white/10 hover:bg-white/10 text-[#F5F1E6]'
                                : 'border-[#243447]/10 hover:bg-[#E7E2D8] text-[#243447]'
                            }`}
                          >
                            <Sparkles className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'}`} />
                            <span>{t('nav.milestones')}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-3 py-1.5 lg:px-4 lg:py-2 text-[11px] lg:text-xs xl:text-sm font-montserrat font-bold uppercase tracking-wider transition-all duration-200 rounded-full cursor-pointer relative whitespace-nowrap shrink-0 ${
                    isActive
                      ? isDark
                        ? 'text-[#F7A81B] bg-[#011E41] shadow-xs border border-[#F7A81B]/40'
                        : 'text-[#243447] bg-[#F2EFE8] shadow-xs border border-[#C9982B]/30'
                      : isDark
                      ? 'text-[#F5F1E6]/90 hover:text-[#F7A81B] hover:bg-white/10'
                      : 'text-[#243447]/90 hover:text-[#243447] hover:bg-[#F2EFE8]/60'
                  }`}
                >
                  {getTabLabel(tab)}
                  {isActive && (
                    <span className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full ${isDark ? 'bg-[#F7A81B]' : 'bg-[#C9982B]'}`} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Right Controls */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              className={`p-2 rounded-md transition-colors duration-200 cursor-pointer ${
                isDark ? 'text-[#F5F1E6] hover:bg-white/10' : 'text-[#243447] hover:bg-[#F2EFE8]'
              }`}
            >
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 transition-transform duration-200 rotate-90 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'}`} />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Layer 2: Sub-Header Utility Layer (Search, Theme Mode, Sign In, Apply) */}
      <div
        className={`block transition-colors duration-300 border-t border-b py-2 px-4 sm:px-6 lg:px-8 text-xs shadow-xs ${
          isDark
            ? 'bg-[#071326] border-[#F7A81B]/20 text-[#F5F1E6]'
            : 'bg-[#DDD8CE] border-[#243447]/10 text-[#243447]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          {/* Left: Expanded Sitewide Search */}
          <div className="flex items-center space-x-3 flex-1 max-w-md">
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className={`w-full px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-between border shadow-xs ${
                  isDark
                    ? 'border-[#F7A81B]/30 bg-[#01142E] text-[#F5F1E6] hover:border-[#F7A81B]'
                    : 'border-[#243447]/10 bg-[#F2EFE8] text-[#243447] hover:border-[#C9982B]'
                }`}
                title="Search site (Press '/' anywhere)"
                aria-label="Open Sitewide Search"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Search className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'}`} />
                  <span className={`text-xs font-montserrat font-medium truncate ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`}>
                    {t('common.search')}
                  </span>
                </div>
                <kbd className={`px-1.5 py-0.5 text-[10px] font-mono rounded border font-bold shrink-0 ml-2 ${
                  isDark ? 'bg-[#0A192F] border-[#F7A81B]/20 text-[#F7A81B]' : 'bg-[#DDD8CE] border-[#243447]/10 text-[#6B7280]'
                }`}>
                  /
                </kbd>
              </button>
            )}
          </div>

          {/* Right: Country Selector, Theme Mode Toggle, Sign In, & Apply Button */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Country Selector */}
            <div className={`border-r pr-3 ${isDark ? 'border-white/10' : 'border-[#243447]/10'}`}>
              <CountrySelector isDark={isDark} />
            </div>

            {/* Theme Mode Toggle */}
            <div className={`flex items-center space-x-2 border-r pr-3 ${isDark ? 'border-white/10' : 'border-[#243447]/10'}`}>
              <span className={`text-[11px] font-montserrat font-bold ${isDark ? 'text-[#F7A81B]' : 'text-[#4A5565]'}`}>
                {t('common.mode')}:
              </span>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>

            {/* Sign In / Member Profile */}
            {isSignedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleTabClick('Membership')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer shadow-xs ${
                    isDark
                      ? 'border-[#F7A81B]/40 bg-[#011E41] text-[#F5F1E6] hover:border-[#F7A81B]'
                      : 'border-[#243447]/20 bg-[#F2EFE8] text-[#243447] hover:border-[#C9982B]'
                  }`}
                  title="Go to Member Dashboard"
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-serif font-bold text-[9px] ${
                    isDark ? 'bg-[#F7A81B] text-[#01142E]' : 'bg-[#243447] text-[#C9982B] border border-[#C9982B]'
                  }`}>
                    {(currentUser || CURRENT_DEMO_MEMBER).initials}
                  </div>
                  <span className="text-xs font-montserrat font-bold">
                    {(currentUser || CURRENT_DEMO_MEMBER).name.split(' ')[0]}
                  </span>
                </button>

                {setIsSignedIn && (
                  <button
                    type="button"
                    onClick={() => setIsSignedIn(false)}
                    className="p-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                    title={t('common.signOut')}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleTabClick('MemberPortal')}
                  className={`font-montserrat font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 border shadow-xs ${
                    activeTab === 'MemberPortal'
                      ? 'bg-[#F7A81B] text-[#01142E] border-[#F7A81B]'
                      : isDark
                      ? 'border-[#F7A81B]/40 bg-[#011E41] text-[#F5F1E6] hover:bg-[#0A2540]'
                      : 'border-[#243447]/20 bg-[#F2EFE8] text-[#243447] hover:bg-[#E7E2D8]'
                  }`}
                  title="Member Portal Sign In"
                >
                  <LogIn className={`w-3.5 h-3.5 ${activeTab === 'MemberPortal' ? 'text-[#01142E]' : isDark ? 'text-[#F7A81B]' : 'text-[#243447]'}`} />
                  <span>Member Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('Admin')}
                  className={`font-montserrat font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 border shadow-xs ${
                    activeTab === 'Admin'
                      ? 'bg-[#17458F] text-white border-blue-400'
                      : isDark
                      ? 'border-white/20 bg-[#0A2540] text-slate-300 hover:text-white hover:bg-white/10'
                      : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Admin Portal Sign In"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span>Admin Sign In</span>
                </button>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => handleTabClick('Membership')}
                  className={`font-montserrat font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full transition-all duration-200 shadow-sm flex items-center space-x-1.5 cursor-pointer transform hover:-translate-y-0.5 ${
                    isDark
                      ? 'bg-[#F7A81B] hover:bg-[#D98E0E] text-[#01142E]'
                      : 'bg-[#17458F] hover:bg-[#1D5CB8] text-[#FFFFFF]'
                  }`}
                >
                  <span>{t('common.apply')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b transition-all duration-300 px-4 pt-3 pb-6 space-y-2 bg-[#E7E2D8] border-[#243447]/10 text-[#243447]">
          {/* Mobile Search Button at top */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full mb-3 p-3 rounded-xl border border-[#C9982B]/40 bg-[#F2EFE8] text-[#243447] font-montserrat font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#C9982B]" />
              <span>Search Projects, People & Pages</span>
            </button>
          )}
          {mainTabs.map((tab) => {
            if (tab === 'About Us') {
              return (
                <div key="About Us" className="space-y-1">
                  <div className="px-4 py-2 text-xs font-montserrat font-extrabold uppercase tracking-widest text-[#C9982B]">
                    About Us
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabClick('About Us')}
                    className={`w-full text-left pl-8 pr-4 py-2 text-xs font-montserrat font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-between ${
                      activeTab === 'About Us'
                        ? 'bg-[#C9982B] text-[#243447]'
                        : 'text-[#243447] hover:bg-[#F2EFE8]'
                    }`}
                  >
                    <span>Overview & History</span>
                    {activeTab === 'About Us' && <span className="text-[10px] font-semibold">● Active</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabClick('Board of Directors')}
                    className={`w-full text-left pl-8 pr-4 py-2 text-xs font-montserrat font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-between ${
                      activeTab === 'Board of Directors'
                        ? 'bg-[#C9982B] text-[#243447]'
                        : 'text-[#243447] hover:bg-[#F2EFE8]'
                    }`}
                  >
                    <span>Board of Directors</span>
                    {activeTab === 'Board of Directors' && <span className="text-[10px] font-semibold">● Active</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabClick('Roster of Presidents')}
                    className={`w-full text-left pl-8 pr-4 py-2 text-xs font-montserrat font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-between ${
                      activeTab === 'Roster of Presidents'
                        ? 'bg-[#C9982B] text-[#243447]'
                        : 'text-[#243447] hover:bg-[#F2EFE8]'
                    }`}
                  >
                    <span>Roster of Presidents</span>
                    {activeTab === 'Roster of Presidents' && <span className="text-[10px] font-semibold">● Active</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabClick('Partnerships')}
                    className={`w-full text-left pl-8 pr-4 py-2 text-xs font-montserrat font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-between ${
                      activeTab === 'Partnerships'
                        ? 'bg-[#C9982B] text-[#243447]'
                        : 'text-[#243447] hover:bg-[#F2EFE8]'
                    }`}
                  >
                    <span>Partnerships</span>
                    {activeTab === 'Partnerships' && <span className="text-[10px] font-semibold">● Active</span>}
                  </button>
                </div>
              );
            }

            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`w-full text-left px-4 py-3 text-sm font-montserrat font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'bg-[#C9982B] text-[#243447]'
                    : 'text-[#243447] hover:bg-[#F2EFE8]'
                }`}
              >
                <span>{getTabLabel(tab)}</span>
                {isActive && <span className="text-xs font-semibold">● Active</span>}
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#243447]/10 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleTabClick('MemberPortal');
                }}
                className="bg-[#011E41] hover:bg-[#01142E] text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl border border-[#F7A81B]/40 flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[#F7A81B]" />
                <span>Member Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleTabClick('Admin');
                }}
                className="bg-[#0A2540] hover:bg-[#011E41] text-slate-200 font-montserrat font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl border border-white/20 flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Admin Sign In</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleTabClick('Membership');
              }}
              className="w-full bg-[#17458F] hover:bg-[#1D5CB8] text-[#FFFFFF] font-montserrat font-bold text-xs uppercase tracking-wider py-3 rounded-md transition-colors shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{t('common.applyNow')}</span>
              <ArrowRight className="w-4 h-4 text-[#FFFFFF]" />
            </button>

            <CountrySelector isDark={false} isMobile={true} />
          </div>
        </div>
      )}
      </div>
    </header>
  );
};
