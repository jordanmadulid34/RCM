import React, { useState, useEffect } from 'react';
import { TabType, ThemeType } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { BoardPage } from './pages/BoardPage';
import { PresidentsPage } from './pages/PresidentsPage';
import { PartnershipsPage } from './pages/PartnershipsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { NewsPage } from './pages/NewsPage';
import { MembershipPage } from './pages/MembershipPage';
import { ContactPage } from './pages/ContactPage';
import { AnnouncementsFeedPage } from './pages/AnnouncementsFeedPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { MemberLoginPage } from './pages/MemberLoginPage';
import { SearchOverlay } from './components/SearchOverlay';
import { RotaBotModal } from './components/RotaBotModal';
import { RotaryWheelSVG } from './components/RCMLogo';
import { Sparkles, ShieldAlert, Lock, ShieldCheck } from 'lucide-react';

import { ADMIN_DEMO_MEMBER, MemberProfile } from './data/rcmMemberData';
import { I18nProvider } from './i18n/I18nContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('Home');
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [selectedFocusAreaId, setSelectedFocusAreaId] = useState<string>('all');
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<MemberProfile>(ADMIN_DEMO_MEMBER);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isRotaBotOpen, setIsRotaBotOpen] = useState<boolean>(false);

  const [announcementMarquee, setAnnouncementMarquee] = useState<string>(
    'Weekly Luncheon: Tuesdays 12:00 PM @ The Conservatory, The Manila Peninsula | Guest Speaker: Sec. Ralph Recto'
  );

  const isDark = theme === 'dark';

  // Apply dark class to document body root for global styling
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Keyboard shortcut '/' to trigger sitewide search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col font-sans transition-colors duration-300 ${
        isDark ? 'bg-[#0F172A] text-[#CBD5E1]' : 'bg-[#FAF8F3] text-[#243447]'
      }`}
    >
      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectFocusArea={(focusId) => setSelectedFocusAreaId(focusId)}
        theme={theme}
        setTheme={setTheme}
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
        currentUser={currentUser}
        onOpenLogin={() => setActiveTab('Admin')}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenRotaBot={() => setIsRotaBotOpen(true)}
      />

      {/* Main Active Page View */}
      <main className="flex-grow w-full max-w-full overflow-x-hidden">
        {activeTab === 'Home' && (
          <HomePage
            setActiveTab={setActiveTab}
            onSelectFocusArea={(focusId) => setSelectedFocusAreaId(focusId)}
            theme={theme}
          />
        )}

        {activeTab === 'About Us' && (
          <AboutPage setActiveTab={setActiveTab} theme={theme} />
        )}

        {activeTab === 'Board of Directors' && (
          <BoardPage setActiveTab={setActiveTab} theme={theme} />
        )}

        {activeTab === 'Roster of Presidents' && (
          <PresidentsPage setActiveTab={setActiveTab} theme={theme} />
        )}

        {activeTab === 'Partnerships' && (
          <PartnershipsPage
            setActiveTab={setActiveTab}
            onSelectFocusArea={(focusId) => setSelectedFocusAreaId(focusId)}
            theme={theme}
          />
        )}

        {activeTab === 'Projects' && (
          <ProjectsPage
            setActiveTab={setActiveTab}
            selectedFocusAreaId={selectedFocusAreaId}
            theme={theme}
          />
        )}

        {activeTab === 'News' && (
          <NewsPage
            setActiveTab={setActiveTab}
            theme={theme}
          />
        )}

        {activeTab === 'Membership' && (
          <MembershipPage
            theme={theme}
            isSignedIn={isSignedIn}
            setIsSignedIn={setIsSignedIn}
            currentUser={currentUser}
            onOpenLogin={() => setActiveTab('MemberPortal')}
            onOpenMemberLogin={() => setActiveTab('MemberPortal')}
            onOpenAdminLogin={() => setActiveTab('Admin')}
          />
        )}

        {activeTab === 'Announcements' && (
          <MembershipPage
            theme={theme}
            isSignedIn={isSignedIn}
            setIsSignedIn={setIsSignedIn}
            currentUser={currentUser}
            onOpenLogin={() => setActiveTab('MemberPortal')}
            onOpenMemberLogin={() => setActiveTab('MemberPortal')}
            onOpenAdminLogin={() => setActiveTab('Admin')}
          />
        )}

        {activeTab === 'Admin' && (
          <AdminLoginPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'MemberPortal' && (
          <MemberLoginPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'Contact Us' && (
          <ContactPage theme={theme} />
        )}
      </main>

      {/* Footer */}
      <Footer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
      />

      {/* Sitewide Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setActiveTab={setActiveTab}
        onSelectFocusArea={(focusId) => setSelectedFocusAreaId(focusId)}
        theme={theme}
      />

      {/* RotaBot AI Assistant Modal */}
      <RotaBotModal
        isOpen={isRotaBotOpen}
        onClose={() => setIsRotaBotOpen(false)}
        isDark={isDark}
        setActiveTab={setActiveTab}
      />

      {/* Floating Bottom-Right RotaBot AI Trigger Widget */}
      <button
        type="button"
        onClick={() => setIsRotaBotOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#F7A81B] to-[#D98E0E] text-[#0F172A] hover:text-[#0F172A] font-montserrat font-extrabold p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-white/40 transform hover:scale-105 transition-all cursor-pointer group"
        title="Open RotaBot AI Assistant"
      >
        <div className="h-7 px-1.5 rounded-full bg-[#0F172A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <RotaryWheelSVG className="h-5 w-auto" />
        </div>
        <span className="hidden sm:inline text-xs uppercase tracking-wider font-extrabold">
          RotaBot AI ✨
        </span>
      </button>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
