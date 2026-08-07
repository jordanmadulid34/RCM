import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MemberDirectorySection } from '../components/MemberDirectorySection';
import {
  UserCheck,
  Shield,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  Calendar,
  Clock,
  MapPin,
  LogIn,
  LogOut,
  Bell,
  Search,
  Check,
  X,
  HelpCircle,
  TrendingUp,
  Award,
  QrCode,
  LayoutDashboard,
  FileText,
  Briefcase,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  Building,
  User,
  Globe,
  HeartHandshake,
  Compass,
  Star,
  ExternalLink,
  MessageSquare,
  ArrowDown,
  Info,
  Play,
  Video,
  Youtube
} from 'lucide-react';
import { ThemeType } from '../types';
import {
  CURRENT_DEMO_MEMBER,
  ADMIN_DEMO_MEMBER,
  MemberProfile,
  DEMO_ANNOUNCEMENTS,
  INITIAL_DEMO_EVENTS,
  DEMO_ATTENDANCE,
  DEMO_DIRECTORY_MEMBERS,
  ClubEvent,
  Announcement,
  SubmittedApplication
} from '../data/rcmMemberData';
import { DigitalMemberCard } from '../components/DigitalMemberCard';
import { AdminAnnouncementsPage } from '../components/AdminAnnouncementsPage';
import { RCM_INFO, FOCUS_AREAS } from '../data/rcmData';
import { ApplicationNotificationModal } from '../components/ApplicationNotificationModal';
import { MembershipApplicationForm } from '../components/MembershipApplicationForm';
import { AdminInterviewModal } from '../components/AdminInterviewModal';
import { ApplicantStatusTracker } from '../components/ApplicantStatusTracker';
import {
  getSavedApplications,
  saveApplication,
  updateApplicationStatus,
  updateApplicationDetails,
  ADMIN_NOTIFICATION_EMAIL
} from '../services/notificationService';
import { calculateInterviewWeek } from '../utils/dateUtils';

import banner1 from '../assets/membership-banner/1.jpeg';
import banner2 from '../assets/membership-banner/2.jpeg';
import banner3 from '../assets/membership-banner/3.jpeg';
import banner4 from '../assets/membership-banner/4.jpeg';
import banner5 from '../assets/membership-banner/5.jpeg';
import banner6 from '../assets/membership-banner/6.jpeg';
import banner7 from '../assets/membership-banner/7.jpeg';
import banner8 from '../assets/membership-banner/8.jpeg';
import banner9 from '../assets/membership-banner/9.jpeg';

import rotaryConnectImg from '../assets/images/rotary_connect.jpg';
import rotaryPeaceImg from '../assets/images/rotary_peace.jpg';
import rotaryTransformImg from '../assets/images/rotary_transform.jpg';
import brotherhoodAgreementImg from '../assets/images/brotherhood_agreement.jpg';
import rotarySaveLivesImg from '../assets/images/rotary_savelives.jpg';

const MEMBERSHIP_HERO_SLIDES = [
  {
    id: 1,
    theme: 'Connect',
    src: banner1,
    fallbackSrc: rotaryConnectImg,
    alt: 'Rotary People of Action — Together, We Connect (Bel-Air)',
  },
  {
    id: 2,
    theme: 'Connect',
    src: banner2,
    fallbackSrc: rotaryConnectImg,
    alt: 'Rotary People of Action — Together, We Connect (Southwest)',
  },
  {
    id: 3,
    theme: 'Promote Peace',
    src: banner3,
    fallbackSrc: rotaryPeaceImg,
    alt: 'Rotary People of Action — Together, We Promote Peace',
  },
  {
    id: 4,
    theme: 'Transform',
    src: banner4,
    fallbackSrc: rotaryTransformImg,
    alt: 'Rotary People of Action — Together, We Transform',
  },
  {
    id: 5,
    theme: 'Fight Hunger',
    src: banner5,
    fallbackSrc: brotherhoodAgreementImg,
    alt: 'Rotary People of Action — Together, We Fight Hunger',
  },
  {
    id: 6,
    theme: 'Connect',
    src: banner6,
    fallbackSrc: rotaryConnectImg,
    alt: 'Rotary People of Action — Together, We Connect',
  },
  {
    id: 7,
    theme: 'Connect',
    src: banner7,
    fallbackSrc: rotaryConnectImg,
    alt: 'Rotary People of Action — Together, We Connect in Community',
  },
  {
    id: 8,
    theme: 'Save Lives',
    src: banner8,
    fallbackSrc: rotarySaveLivesImg,
    alt: 'Rotary People of Action — Together, We Save Lives (Chronic Kidney Disease)',
  },
  {
    id: 9,
    theme: 'Save Lives',
    src: banner9,
    fallbackSrc: rotarySaveLivesImg,
    alt: 'Rotary People of Action — Together, We Save Lives (Blood Donation)',
  },
];

interface MembershipPageProps {
  theme: ThemeType;
  isSignedIn: boolean;
  setIsSignedIn: (val: boolean) => void;
  onOpenLogin: () => void;
  onOpenMemberLogin?: () => void;
  onOpenAdminLogin?: () => void;
  currentUser?: MemberProfile;
}

type DashboardSubTab = 'overview' | 'applications' | 'events' | 'announcements' | 'attendance' | 'card' | 'directory';

export const MembershipPage: React.FC<MembershipPageProps> = ({
  theme,
  isSignedIn,
  setIsSignedIn,
  onOpenLogin,
  onOpenMemberLogin,
  onOpenAdminLogin,
  currentUser = ADMIN_DEMO_MEMBER,
}) => {
  const isDark = theme === 'dark';

  // Hero background slideshow state (2s interval, continuous infinite loop)
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroImageErrors, setHeroImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % MEMBERSHIP_HERO_SLIDES.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Preload next image in sequence to prevent flicker/pop-in
  useEffect(() => {
    const nextIndex = (heroSlideIndex + 1) % MEMBERSHIP_HERO_SLIDES.length;
    const nextSlide = MEMBERSHIP_HERO_SLIDES[nextIndex];
    if (nextSlide) {
      const img = new Image();
      img.src = heroImageErrors[nextSlide.id] ? nextSlide.fallbackSrc : nextSlide.src;
    }
  }, [heroSlideIndex, heroImageErrors]);

  const handleHeroImageError = (id: number) => {
    setHeroImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Section Scroll Refs
  const applicationSectionRef = useRef<HTMLDivElement>(null);
  const scheduleVisitSectionRef = useRef<HTMLDivElement>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Public Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    classification: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Visit Form State
  const [visitFormData, setVisitFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredDate: '',
    guestsCount: '1',
    message: '',
  });
  const [visitSubmitted, setVisitSubmitted] = useState(false);
  const [isVisitSubmitting, setIsVisitSubmitting] = useState(false);
  const [visitSubmitError, setVisitSubmitError] = useState<string | null>(null);

  // Interactive Eligibility Checker State
  const [checkerStep, setCheckerStep] = useState<number>(1);
  const [checkerData, setCheckerData] = useState({
    industry: 'Technology',
    yearsExp: '6–10',
    availability: 'Yes definitely',
    selectedFocusAreas: ['Disease Prevention & Treatment', 'Water, Sanitation & Hygiene'] as string[],
  });
  const [checkerCompleted, setCheckerCompleted] = useState(false);

  // Dashboard & Applications Log States
  const [activeSubTab, setActiveSubTab] = useState<DashboardSubTab>('overview');
  const [eventsList, setEventsList] = useState<ClubEvent[]>(INITIAL_DEMO_EVENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEMO_ANNOUNCEMENTS);
  const [directorySearch, setDirectorySearch] = useState('');

  // Submitted Applications State & Notification Modal
  const [applicationsList, setApplicationsList] = useState<SubmittedApplication[]>(() => getSavedApplications());
  const [selectedAppModal, setSelectedAppModal] = useState<SubmittedApplication | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [lastSubmittedApp, setLastSubmittedApp] = useState<SubmittedApplication | null>(null);
  const [appSearch, setAppSearch] = useState('');

  // Admin Interview Scheduling Modal State
  const [selectedInterviewApp, setSelectedInterviewApp] = useState<SubmittedApplication | null>(null);
  const [isAdminInterviewModalOpen, setIsAdminInterviewModalOpen] = useState(false);

  const handleUpdateApplicationDetails = (id: string, updates: Partial<SubmittedApplication>) => {
    const updated = updateApplicationDetails(id, updates);
    setApplicationsList(updated);
    if (selectedInterviewApp && selectedInterviewApp.id === id) {
      const refreshed = updated.find((a) => a.id === id) || null;
      setSelectedInterviewApp(refreshed);
    }
  };

  // Membership Video Modal State
  const [isMembershipVideoOpen, setIsMembershipVideoOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMembershipVideoOpen(false);
      }
    };
    if (isMembershipVideoOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMembershipVideoOpen]);

  // Handle Application Form Submit with Email Dispatch Simulation
  const handlePublicFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) return;

    // Save Application & dispatch simulated emails
    const newApp = saveApplication({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      classification: formData.classification,
      message: formData.message,
      source: 'Online Application Form',
    });

    setApplicationsList(getSavedApplications());
    setLastSubmittedApp(newApp);
    setSelectedAppModal(newApp);
    setIsNotificationModalOpen(true);
    setFormSubmitted(true);
  };

  // Change Application Status
  const handleStatusChange = (id: string, newStatus: SubmittedApplication['status']) => {
    const updated = updateApplicationStatus(id, newStatus);
    setApplicationsList(updated);
  };

  // Export Applications to CSV
  const handleExportCsv = () => {
    const headers = ['Ref ID', 'Full Name', 'Email', 'Phone', 'Company', 'Classification', 'Message', 'Submitted At', 'Status', 'Admin Recipient'];
    const rows = applicationsList.map((app) => [
      app.id,
      `"${app.fullName.replace(/"/g, '""')}"`,
      `"${app.email}"`,
      `"${app.phone}"`,
      `"${(app.company || '').replace(/"/g, '""')}"`,
      `"${(app.classification || '').replace(/"/g, '""')}"`,
      `"${(app.message || '').replace(/"/g, '""')}"`,
      app.submittedAt,
      app.status,
      app.adminRecipient,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RCM_Membership_Applications_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Schedule Visit Submit with Supabase insert
  const handleScheduleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVisitSubmitError(null);

    if (!visitFormData.firstName.trim() || !visitFormData.lastName.trim() || !visitFormData.email.trim() || !visitFormData.phone.trim()) {
      setVisitSubmitError('Please fill in all required fields.');
      return;
    }

    setIsVisitSubmitting(true);

    try {
      const { error } = await supabase
        .from('visit_requests')
        .insert([
          {
            first_name: visitFormData.firstName.trim(),
            last_name: visitFormData.lastName.trim(),
            email: visitFormData.email.trim(),
            phone: visitFormData.phone.trim(),
            preferred_date: visitFormData.preferredDate || null,
            number_of_guests: visitFormData.guestsCount,
            notes: visitFormData.message.trim(),
          },
        ]);

      if (error) {
        console.error('Supabase visit request submission error:', error);
        const errorCodeStr = error.code ? ` (Code: ${error.code})` : '';
        setVisitSubmitError(`Database submission error${errorCodeStr}: ${error.message}`);
        setIsVisitSubmitting(false);
        return;
      }

      setVisitSubmitted(true);
    } catch (err: any) {
      console.error('Unexpected error during visit request submission:', err);
      setVisitSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsVisitSubmitting(false);
    }
  };

  // Handle Event RSVP Toggle
  const handleRsvpChange = (eventId: string, newRsvp: 'Yes' | 'No' | 'Maybe') => {
    setEventsList((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          const wasYes = evt.userRsvp === 'Yes';
          const isYes = newRsvp === 'Yes';
          let diff = 0;
          if (!wasYes && isYes) diff = 1;
          if (wasYes && !isYes) diff = -1;

          return {
            ...evt,
            userRsvp: newRsvp,
            attendeesCount: Math.max(0, evt.attendeesCount + diff),
          };
        }
        return evt;
      })
    );
  };

  // Mark Announcement as read
  const handleMarkRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, read: true } : ann))
    );
  };

  // Directory Filter
  const filteredDirectory = DEMO_DIRECTORY_MEMBERS.filter((mem) => {
    const q = directorySearch.toLowerCase();
    return (
      mem.name.toLowerCase().includes(q) ||
      mem.classification.toLowerCase().includes(q) ||
      mem.company.toLowerCase().includes(q) ||
      mem.role.toLowerCase().includes(q)
    );
  });

  // Toggle Focus Area Selection in Eligibility Checker
  const toggleFocusAreaSelection = (areaTitle: string) => {
    setCheckerData((prev) => {
      const exists = prev.selectedFocusAreas.includes(areaTitle);
      if (exists) {
        return { ...prev, selectedFocusAreas: prev.selectedFocusAreas.filter((a) => a !== areaTitle) };
      } else {
        return { ...prev, selectedFocusAreas: [...prev.selectedFocusAreas, areaTitle] };
      }
    });
  };

  // =========================================================
  // IF SIGNED IN: MEMBER DASHBOARD VIEW
  // =========================================================
  if (isSignedIn) {
    const isAdmin = currentUser?.userRole === 'admin' || currentUser?.role?.toLowerCase().includes('admin') || currentUser?.id === 'mem-000';
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
        {/* Operations / Member Dashboard Banner */}
        <div className="bg-gradient-to-r from-[#0B1D3A] via-[#011E41] to-[#0D2B52] border-b-4 border-[#F7A81B] text-[#F5F1E6] p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              {/* Tag Badge */}
              <div
                className={`inline-flex items-center space-x-1.5 font-montserrat font-extrabold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md ${
                  isAdmin
                    ? 'bg-[#F7A81B] text-[#011E41]'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>
                  {isAdmin
                    ? 'Rotary Admin & Secretariat Control Panel'
                    : 'Rotary Active Member Portal'}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isAdmin ? 'Club Operations & Secretariat Management' : `Welcome, ${currentUser.name}`}
              </h1>
              <p className="text-xs sm:text-sm font-sans text-gray-200 max-w-2xl">
                {isAdmin
                  ? 'Manage online inquiries, review member rosters, inspect bulletin broadcasts, and monitor club project timelines.'
                  : 'Access your digital member badge, track meeting attendance, review weekly announcements, and connect with fellow Rotarians.'}
              </p>
            </div>

            {/* Right Status Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-[#1D4ED8]/90 text-white font-montserrat font-semibold text-xs px-4 py-2 rounded-full border border-blue-400/30 shadow-md flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-blue-200" />
                <span>
                  Logged in: <strong>{currentUser.name} {isAdmin ? '(Admin)' : '(Member)'}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsSignedIn(false)}
                className="inline-flex items-center space-x-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/40 px-3.5 py-2 rounded-full text-xs font-montserrat font-bold uppercase transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Toolbar Sub-Navigation Tabs */}
        <div
          className={`p-2 rounded-2xl border shadow-xl flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth ${
            isDark
              ? 'bg-[#121212] border-[#F7A81B]/30'
              : 'bg-white border-gray-200/90 shadow-md'
          }`}
        >
          {[
            { id: 'announcements', label: isAdmin ? 'Announcements (CRUD)' : 'Announcements', icon: Bell, badge: announcements.filter((a) => !a.read).length || undefined },
            ...(isAdmin ? [{ id: 'applications', label: 'Membership Inquiries', icon: FileText, badge: applicationsList.filter((a) => a.status === 'Pending Review').length || 1 }] : []),
            { id: 'events', label: 'Events & Meetings', icon: Calendar, badge: 3 },
            { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
            { id: 'directory', label: 'Member Directory & Chat', icon: Users },
            { id: 'attendance', label: 'Attendance', icon: TrendingUp },
            { id: 'card', label: 'Digital Card', icon: QrCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as DashboardSubTab)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? isDark
                      ? 'bg-[#F7A81B] text-[#011E41] shadow-md'
                      : 'bg-[#011E41] text-[#F7A81B] shadow-md'
                    : isDark
                    ? 'text-[#F5F1E6]/80 hover:text-[#F7A81B] hover:bg-white/5'
                    : 'text-gray-700 hover:text-[#011E41] hover:bg-gray-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? (isDark ? 'text-[#011E41]' : 'text-[#F7A81B]') : 'text-[#F7A81B]'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-extrabold ml-1.5 shadow-sm ${
                      isActive
                        ? isDark
                          ? 'bg-[#011E41] text-[#F7A81B]'
                          : 'bg-[#F7A81B] text-[#011E41]'
                        : 'bg-[#F7A81B] text-[#011E41]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB PANELS */}
        {activeSubTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                className={`p-5 rounded-2xl border space-y-2 ${
                  isDark
                    ? 'bg-[#121212] border-[#F7A81B]/20'
                    : 'bg-[#FAF8F3] border-[#011E41]/15'
                }`}
              >
                <div className="flex items-center justify-between text-[#F7A81B]">
                  <span className="text-xs font-montserrat font-bold uppercase tracking-wider">
                    Attendance Rate
                  </span>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#F7A81B]">
                  {DEMO_ATTENDANCE.percentage}%
                </div>
                <p className="text-[11px] font-sans opacity-80">
                  {DEMO_ATTENDANCE.meetingsAttended} of {DEMO_ATTENDANCE.totalMeetingsHeld} meetings in {DEMO_ATTENDANCE.rotaryYear}
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border space-y-2 ${
                  isDark
                    ? 'bg-[#121212] border-[#F7A81B]/20'
                    : 'bg-[#FAF8F3] border-[#011E41]/15'
                }`}
              >
                <div className="flex items-center justify-between text-[#F7A81B]">
                  <span className="text-xs font-montserrat font-bold uppercase tracking-wider">
                    Upcoming RSVP
                  </span>
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#F7A81B]">
                  {eventsList.filter((e) => e.userRsvp === 'Yes').length} Confirmed
                </div>
                <p className="text-[11px] font-sans opacity-80">
                  Next meeting: Tuesday @ The Manila Peninsula
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border space-y-2 ${
                  isDark
                    ? 'bg-[#121212] border-[#F7A81B]/20'
                    : 'bg-[#FAF8F3] border-[#011E41]/15'
                }`}
              >
                <div className="flex items-center justify-between text-[#F7A81B]">
                  <span className="text-xs font-montserrat font-bold uppercase tracking-wider">
                    Club Roster
                  </span>
                  <Users className="w-5 h-5" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#F7A81B]">
                  132 Members
                </div>
                <p className="text-[11px] font-sans opacity-80">
                  11 Nationalities • District 3830
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border space-y-2 ${
                  isDark
                    ? 'bg-[#121212] border-[#F7A81B]/20'
                    : 'bg-[#FAF8F3] border-[#011E41]/15'
                }`}
              >
                <div className="flex items-center justify-between text-[#F7A81B]">
                  <span className="text-xs font-montserrat font-bold uppercase tracking-wider">
                    Rotary ID
                  </span>
                  <Award className="w-5 h-5" />
                </div>
                <div className="font-mono text-xl font-bold text-[#F7A81B]">
                  {CURRENT_DEMO_MEMBER.rotaryId}
                </div>
                <p className="text-[11px] font-sans opacity-80">
                  Classification: {CURRENT_DEMO_MEMBER.classification}
                </p>
              </div>
            </div>

            {/* Next Event & Bulletins */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`font-serif text-xl font-bold ${isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'}`}>
                    Next Featured Club Event
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('events')}
                    className="text-xs font-montserrat font-bold text-[#F7A81B] hover:underline inline-flex items-center space-x-1"
                  >
                    <span>View All Events</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {eventsList[0] && (
                  <div
                    className={`p-6 rounded-3xl border shadow-lg space-y-4 ${
                      isDark
                        ? 'bg-[#121212] border-[#F7A81B]/30'
                        : 'bg-[#FAF8F3] border-[#011E41]/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block bg-[#011E41] text-[#F7A81B] border border-[#F7A81B]/40 text-[10px] font-montserrat font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2">
                          {eventsList[0].type}
                        </span>
                        <h4 className="font-serif text-xl font-bold">
                          {eventsList[0].title}
                        </h4>
                      </div>

                      <span className="text-xs font-montserrat font-bold px-3 py-1 rounded-xl bg-[#F7A81B]/20 text-[#F7A81B] border border-[#F7A81B]/40 shrink-0">
                        {eventsList[0].attendeesCount} Attending
                      </span>
                    </div>

                    {eventsList[0].speaker && (
                      <p className="text-xs font-sans text-[#F7A81B] font-medium">
                        Guest Speaker: {eventsList[0].speaker}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs opacity-90 pt-2 border-t border-[#F7A81B]/20">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-[#F7A81B] shrink-0" />
                        <span>{eventsList[0].date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-[#F7A81B] shrink-0" />
                        <span>{eventsList[0].time}</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-[#F7A81B] shrink-0" />
                        <span>{eventsList[0].location}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F7A81B]/20 flex items-center justify-between gap-3">
                      <span className="text-xs font-montserrat font-bold uppercase tracking-wider">
                        Your RSVP:
                      </span>

                      <div className="flex items-center space-x-2">
                        {(['Yes', 'Maybe', 'No'] as const).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleRsvpChange(eventsList[0].id, status)}
                            className={`px-3.5 py-1.5 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                              eventsList[0].userRsvp === status
                                ? 'bg-[#F7A81B] text-[#011E41] shadow-md'
                                : isDark
                                ? 'bg-white/5 hover:bg-white/10 text-white/80'
                                : 'bg-black/5 hover:bg-black/10 text-black/80'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`font-serif text-xl font-bold ${isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'}`}>
                    Recent Bulletins
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('announcements')}
                    className="text-xs font-montserrat font-bold text-[#F7A81B] hover:underline inline-flex items-center space-x-1"
                  >
                    <span>All Announcements</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {announcements.slice(0, 3).map((ann) => (
                    <div
                      key={ann.id}
                      onClick={() => handleMarkRead(ann.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        !ann.read
                          ? isDark
                            ? 'bg-[#011E41] border-[#F7A81B]'
                            : 'bg-[#FAF8F3] border-[#F7A81B]'
                          : isDark
                          ? 'bg-[#121212] border-[#F7A81B]/20 opacity-80'
                          : 'bg-[#FAF8F3] border-[#011E41]/10 opacity-80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-montserrat font-bold uppercase text-[#F7A81B]">
                          {ann.category}
                        </span>
                        {!ann.read && (
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-sm mt-1 leading-snug">
                        {ann.title}
                      </h4>
                      <p className="text-xs font-sans opacity-80 line-clamp-2 mt-1">
                        {ann.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* APPLICATIONS LOG & EMAIL NOTIFICATION MANAGER */}
        {activeSubTab === 'applications' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className={`font-serif text-2xl font-bold flex items-center space-x-2 ${isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'}`}>
                  <span>Membership Applications Log</span>
                  <span className="bg-[#F7A81B] text-[#011E41] text-xs font-montserrat font-extrabold px-2.5 py-0.5 rounded-full">
                    {applicationsList.length} Total
                  </span>
                </h2>
                <p className="text-xs font-sans opacity-80 mt-1">
                  Manage online membership inquiries, review applicant responses, and inspect live email notifications routed to <strong>{ADMIN_NOTIFICATION_EMAIL}</strong>.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Admin Recipient & Domain Integrity Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#011E41] via-[#022A5C] to-[#011E41] border border-[#F7A81B]/40 text-[#F5F1E6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-[#F7A81B] shrink-0" />
                <div>
                  <span className="font-montserrat font-bold text-[#F7A81B] block">
                    Verified Notification Recipient
                  </span>
                  <span>All web submissions auto-trigger emails to: <strong className="underline text-[#F7A81B]">{ADMIN_NOTIFICATION_EMAIL}</strong></span>
                </div>
              </div>
              <div className="text-[11px] font-mono opacity-80 bg-black/30 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
                Official RCM Domain: rotaryclubmakati.org
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#F7A81B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                placeholder="Search applications by name, classification, or company..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs font-sans ${
                  isDark ? 'bg-[#121212] border-[#F7A81B]/30 text-[#F5F1E6]' : 'bg-[#FAF8F3] border-[#011E41]/20 text-[#011E41]'
                }`}
              />
            </div>

            {/* Applications List Table */}
            <div className={`rounded-3xl border shadow-xl overflow-hidden ${isDark ? 'bg-[#121212] border-[#F7A81B]/30' : 'bg-white border-[#011E41]/15'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className={`font-montserrat font-bold uppercase text-[10px] tracking-wider border-b ${
                    isDark ? 'bg-[#011E41] border-[#F7A81B]/20 text-[#F7A81B]' : 'bg-[#F0EDE6] border-[#011E41]/15 text-[#011E41]'
                  }`}>
                    <tr>
                      <th className="p-4">Ref ID & Date</th>
                      <th className="p-4">Applicant Info</th>
                      <th className="p-4">Classification & Company</th>
                      <th className="p-4">Notification Status</th>
                      <th className="p-4">Review Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {applicationsList
                      .filter((app) => {
                        const q = appSearch.toLowerCase();
                        return (
                          app.fullName.toLowerCase().includes(q) ||
                          app.classification.toLowerCase().includes(q) ||
                          app.company.toLowerCase().includes(q) ||
                          app.id.toLowerCase().includes(q)
                        );
                      })
                      .map((app) => (
                        <tr key={app.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <span className="font-mono font-bold text-[#F7A81B] block">{app.id}</span>
                            <span className="text-[11px] opacity-70 block">{app.submittedAt}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-sm block">{app.fullName}</span>
                            <span className="text-[11px] opacity-80 block">{app.email}</span>
                            <span className="text-[11px] opacity-70 block">{app.phone}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-[#F7A81B] block">{app.classification || 'N/A'}</span>
                            <span className="text-[11px] opacity-80 block">{app.company || 'N/A'}</span>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Sent to Keith</span>
                              </span>
                              <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30 block">
                                <Send className="w-3 h-3" />
                                <span>Auto-reply Sent</span>
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value as SubmittedApplication['status'])}
                              className={`p-1.5 rounded-lg border text-xs font-montserrat font-bold ${
                                isDark ? 'bg-[#011E41] border-[#F7A81B]/40 text-[#F5F1E6]' : 'bg-[#F0EDE6] border-[#011E41]/20 text-[#011E41]'
                              }`}
                            >
                              <option value="Pending Review">⏳ Pending Review</option>
                              <option value="Approved for Interview">🎯 Approved for Interview</option>
                              <option value="Interview Scheduled">📅 Interview Scheduled</option>
                              <option value="Interview Confirmed">✅ Interview Confirmed</option>
                              <option value="Rejected">❌ Rejected</option>
                              <option value="Contacted">📞 Contacted</option>
                              <option value="Archived">📁 Archived</option>
                            </select>
                            {app.interviewWeek && (
                              <span className="text-[10px] text-[#F7A81B] font-mono block mt-1">
                                {app.interviewWeek}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedInterviewApp(app);
                                  setIsAdminInterviewModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-[#F7A81B] border border-[#F7A81B]/40 font-montserrat font-bold text-xs uppercase transition-all cursor-pointer inline-flex items-center space-x-1"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Manage Interview</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAppModal(app);
                                  setIsNotificationModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-bold text-xs uppercase transition-all cursor-pointer inline-flex items-center space-x-1"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Inspect Email</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS */}
        {activeSubTab === 'announcements' && (
          <div className="space-y-6 animate-fadeIn">
            <AdminAnnouncementsPage
              currentUser={{
                role: isAdmin ? 'ADMIN' : 'MEMBER',
                name: currentUser.name,
              }}
            />
          </div>
        )}

        {/* EVENTS */}
        {activeSubTab === 'events' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className={`font-serif text-2xl font-bold ${isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'}`}>
                Upcoming Club Calendar & RSVP
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {eventsList.map((evt) => (
                <div
                  key={evt.id}
                  className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 shadow-lg ${
                    isDark
                      ? 'bg-[#121212] border-[#F7A81B]/30'
                      : 'bg-[#FAF8F3] border-[#011E41]/20'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-[#011E41] text-[#F7A81B] border border-[#F7A81B]/40 text-[10px] font-montserrat font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {evt.type}
                      </span>
                      <span className="text-xs font-montserrat font-bold text-[#F7A81B]">
                        {evt.attendeesCount} Attending
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold leading-snug">{evt.title}</h3>
                    <div className="space-y-2 text-xs opacity-90 pt-3 border-t border-[#F7A81B]/20">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-[#F7A81B]" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-[#F7A81B]" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#F7A81B]" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F7A81B]/20 space-y-2">
                    <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider block opacity-80">
                      Your Attendance RSVP:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Yes', 'Maybe', 'No'] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleRsvpChange(evt.id, status)}
                          className={`py-2 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                            evt.userRsvp === status
                              ? 'bg-[#F7A81B] text-[#011E41] shadow-md'
                              : isDark
                              ? 'bg-white/5 hover:bg-white/10 text-white/80'
                              : 'bg-black/5 hover:bg-black/10 text-black/80'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATTENDANCE */}
        {activeSubTab === 'attendance' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className={`font-serif text-2xl font-bold ${isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'}`}>
                Personal Attendance Record
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div
                className={`lg:col-span-5 p-8 rounded-3xl border text-center space-y-6 shadow-xl ${
                  isDark
                    ? 'bg-[#121212] border-[#F7A81B]/30'
                    : 'bg-[#FAF8F3] border-[#011E41]/20'
                }`}
              >
                <div className="font-serif text-5xl font-extrabold text-[#F7A81B]">
                  {DEMO_ATTENDANCE.percentage}%
                </div>
                <p className="text-xs font-montserrat font-bold uppercase tracking-wider opacity-80">
                  Meeting Attendance Rate
                </p>
              </div>

              <div
                className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border space-y-4 ${
                  isDark
                    ? 'bg-[#121212] border-[#F7A81B]/30'
                    : 'bg-[#FAF8F3] border-[#011E41]/20'
                }`}
              >
                <h3 className="font-serif text-xl font-bold text-[#F7A81B]">
                  Recent Meeting Log
                </h3>
                <div className="space-y-3">
                  {DEMO_ATTENDANCE.recentHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold block">{item.meetingName}</span>
                        <span className="opacity-70 font-mono">{item.date}</span>
                      </div>
                      <span className="font-bold uppercase text-[#F7A81B] bg-[#F7A81B]/20 px-3 py-1 rounded-full">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIGITAL CARD */}
        {activeSubTab === 'card' && (
          <div className="animate-fadeIn">
            <DigitalMemberCard member={CURRENT_DEMO_MEMBER} isDark={isDark} />
          </div>
        )}

        {/* DIRECTORY & CHAT */}
        {activeSubTab === 'directory' && (
          <MemberDirectorySection isDark={isDark} />
        )}
      </div>
    );
  }

  // =========================================================
  // IF NOT SIGNED IN: ADVANCED PUBLIC MEMBERSHIP PAGE
  // =========================================================
  return (
    <div className="w-full animate-fadeIn">
      {/* SECTION 1: HERO / INTRO BLOCK */}
      <section
        className="relative w-full overflow-hidden text-[#F5F1E6] py-16 px-4 select-none min-h-[380px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px] flex flex-col justify-center items-center z-0"
      >
        {/* Layer 0: Full-Bleed Auto-Rotating Background Slider (z-0) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
          className="overflow-hidden pointer-events-none select-none"
        >
          {MEMBERSHIP_HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === heroSlideIndex;
            const isFailed = heroImageErrors[slide.id];
            const imgSrc = isFailed ? slide.fallbackSrc : slide.src;

            return (
              <div
                key={slide.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1.08)' : 'scale(1.0)',
                  transition: 'opacity 1000ms ease-in-out, transform 2000ms ease-out',
                  willChange: 'opacity, transform',
                }}
              >
                <img
                  src={imgSrc}
                  alt=""
                  aria-hidden="true"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  referrerPolicy="no-referrer"
                  onLoad={() => {}}
                  onError={() => {
                    handleHeroImageError(slide.id);
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    filter: 'brightness(0.95) contrast(1.15) saturate(1.15)',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Layer 1: Dark Navy Gradient Overlay for Readability (z-1) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            background: 'linear-gradient(180deg, rgba(10, 25, 60, 0.65) 0%, rgba(10, 25, 60, 0.80) 100%)',
          }}
          className="pointer-events-none"
        />

        {/* Layer 2: Foreground Text Content & Controls (z-10) */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5 my-auto px-4 w-full max-w-full overflow-hidden">
          <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-[#011E41]/85 backdrop-blur-md px-3.5 sm:px-4 py-1.5 rounded-full border border-white/20 shadow-xl max-w-full">
            <UserCheck className="w-4 h-4 text-[#F7A81B] shrink-0" />
            <span className="truncate">Membership • Rotary Club of Makati</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-extrabold text-[#F7A81B] tracking-tight leading-tight drop-shadow-lg break-words [word-break:break-word] max-w-full">
            Be Part of Something Bigger Than Yourself
          </h1>

          <p className="text-sm sm:text-lg font-sans font-light opacity-95 leading-relaxed max-w-2xl mx-auto drop-shadow-md px-2 text-slate-100 break-words [word-break:break-word] max-w-full">
            Join the Rotary Club of Makati — the mother club of all Rotary Clubs in Makati, chartered March 12, 1966.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col items-center space-y-3 w-full max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => scrollToRef(applicationSectionRef)}
                className="w-full sm:w-auto bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-extrabold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply Now</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToRef(scheduleVisitSectionRef)}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-[#F5F1E6] border border-white/30 font-montserrat font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 backdrop-blur-xs"
              >
                <Calendar className="w-4 h-4 text-[#F7A81B]" />
                <span>Schedule a Visit</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-1">
              <button
                type="button"
                onClick={onOpenMemberLogin || onOpenLogin}
                className="w-full sm:w-auto bg-[#011E41]/90 hover:bg-[#032E63] text-[#F7A81B] border border-[#F7A81B]/60 font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md backdrop-blur-xs"
              >
                <LogIn className="w-4 h-4 text-[#F7A81B]" />
                <span>Member Sign In</span>
              </button>

              <button
                type="button"
                onClick={onOpenAdminLogin || onOpenLogin}
                className="w-full sm:w-auto bg-[#0A2540]/90 hover:bg-[#011E41] text-slate-200 border border-white/20 font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md backdrop-blur-xs"
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Admin Sign In</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] font-montserrat text-[#F7A81B]/80 pt-1">
            📅 Regular Meetings: Every Tuesday, Noontime @ The Conservatory, The Manila Peninsula
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER FOR PUBLIC MEMBERSHIP PAGE CONTENT */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">

      {/* SECTION 2: WHY JOIN ROTARY? */}
      <section className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/15 px-4 py-1.5 rounded-full border border-[#F7A81B]/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F7A81B]" />
            <span>Rotary Value Proposition</span>
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#011E41]'}`}>
            Why Join Rotary Club of Makati?
          </h2>
          <p className={`text-base font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Discover four core pillars that define the Rotary experience at the premier mother club of Makati.
          </p>
        </div>

        {/* Two-Column Layout: Value Pillars + Membership Video Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 4 Value Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: Globe,
                title: 'Global Network',
                desc: 'Kasapi ka ng pinaka-malaking service club sa Makati at bahagi ng 1.4M+ Rotarians worldwide sa 46,000+ clubs.',
                bgImg: '/pillar-cards/global-network.jpg',
              },
              {
                icon: HeartHandshake,
                title: 'Real Impact',
                desc: 'Sumali sa mga totoong proyekto sa 7 focus areas: Disease Prevention, Water & Sanitation, Maternal & Child Health, Education, Economic Development, Peacebuilding, and Environment.',
                bgImg: '/pillar-cards/real-impact.jpg',
              },
              {
                icon: Users,
                title: 'Professional Fellowship',
                desc: 'Makasama ang mga business leaders, CEOs, at professionals na dedicated sa "Service Above Self."',
                bgImg: '/pillar-cards/professional-fellowship.jpg',
              },
              {
                icon: Compass,
                title: 'Personal Growth',
                desc: 'Leadership opportunities sa loob ng club at sa Rotary International district level.',
                bgImg: '/pillar-cards/personal-growth.jpg',
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden p-6 rounded-2xl border border-white/20 hover:border-[#F7A81B] shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[220px]"
                >
                  {/* Background Image Layer */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={pillar.bgImg}
                      alt={pillar.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center scale-100 transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: 'brightness(0.85) contrast(1.1)' }}
                    />
                    {/* Dark Gradient Overlay for Maximum Text Contrast (WCAG AA) */}
                    <div
                      className="absolute inset-0 z-10 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(1, 20, 46, 0.55) 0%, rgba(1, 20, 46, 0.85) 100%)',
                      }}
                    />
                  </div>

                  {/* Card Content Layer */}
                  <div className="relative z-20 space-y-4 flex flex-col justify-between h-full">
                    <div className="w-12 h-12 rounded-xl bg-[#011E41]/90 text-[#F7A81B] border border-[#F7A81B]/50 flex items-center justify-center shadow-lg shrink-0 backdrop-blur-xs">
                      <Icon className="w-6 h-6 text-[#F7A81B]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-white drop-shadow-sm">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-sans leading-relaxed text-slate-200 drop-shadow-sm opacity-95">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Video Card */}
          <div
            className={`lg:col-span-5 p-6 rounded-2xl border shadow-xl flex flex-col justify-between space-y-4 ${
              isDark
                ? 'bg-[#1E293B]/90 border-slate-700/80 hover:border-[#F7A81B]'
                : 'bg-white border-slate-200 hover:border-[#F7A81B]'
            } transition-colors duration-300`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 bg-[#F7A81B]/20 text-[#F7A81B] border border-[#F7A81B]/40 text-[11px] font-montserrat font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  <Youtube className="w-3.5 h-3.5" />
                  <span>Membership in Action</span>
                </span>
                <span className="text-xs font-montserrat font-bold text-[#F7A81B]">
                  Featured Series
                </span>
              </div>

              {/* Thumbnail Container with Centered Play Button Overlay */}
              <div
                onClick={() => setIsMembershipVideoOpen(true)}
                className="group relative aspect-video rounded-xl overflow-hidden border border-[#F7A81B]/40 hover:border-[#F7A81B] shadow-2xl cursor-pointer bg-black"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsMembershipVideoOpen(true);
                  }
                }}
                aria-label="Play IMPACT Pilot Episode"
              >
                <img
                  src="https://i.ytimg.com/vi/4RVVt5bMwRQ/maxresdefault.jpg"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== 'https://i.ytimg.com/vi/4RVVt5bMwRQ/hqdefault.jpg') {
                      target.src = 'https://i.ytimg.com/vi/4RVVt5bMwRQ/hqdefault.jpg';
                    }
                  }}
                  alt="IMPACT — Stories of the Rotary Club of Makati"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors" />

                {/* Centered Gold Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#011E41]/90 border-2 border-[#F7A81B] text-[#F7A81B] flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#F7A81B] group-hover:text-[#011E41] backdrop-blur-sm motion-reduce:transition-none">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
                  </div>
                </div>
              </div>

              {/* Video Title & Framing Copy Caption */}
              <div className="space-y-2 pt-1">
                <h3
                  onClick={() => setIsMembershipVideoOpen(true)}
                  className={`font-serif text-lg font-bold leading-snug cursor-pointer hover:text-[#F7A81B] transition-colors ${
                    isDark ? 'text-white' : 'text-[#011E41]'
                  }`}
                >
                  IMPACT — Stories of the Rotary Club of Makati (Pilot Episode)
                </h3>
                <p className="text-xs font-sans font-medium text-[#F7A81B] italic leading-relaxed">
                  "See what membership actually looks like — real projects, real members, real impact."
                </p>
                <p className={`text-xs font-sans leading-relaxed pt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  A digital video series that brings to life the stories behind the most meaningful projects of RC Makati.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMembershipVideoOpen(true)}
              className="w-full bg-[#F7A81B] hover:bg-[#E5980E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2 shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Pilot Episode</span>
            </button>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP VIDEO LIGHTBOX MODAL */}
      {isMembershipVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsMembershipVideoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="membership-video-modal-title"
        >
          <div
            className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-5 overflow-hidden ${
              isDark ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-white border-slate-200 text-[#011E41]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-montserrat font-bold text-[#F7A81B] uppercase tracking-widest bg-[#F7A81B]/20 px-3 py-1 rounded-full border border-[#F7A81B]/40 inline-flex items-center space-x-1">
                  <Youtube className="w-3 h-3 text-[#F7A81B]" />
                  <span>Rotary Club of Makati Stories</span>
                </span>
                <h3
                  id="membership-video-modal-title"
                  className="font-serif text-xl sm:text-2xl font-extrabold leading-tight pt-1"
                >
                  IMPACT — Stories of the Rotary Club of Makati (Pilot Episode)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsMembershipVideoOpen(false)}
                aria-label="Close video player"
                className="p-2.5 rounded-full hover:bg-white/10 text-[#F7A81B] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Embedded Playable YouTube Iframe */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
              <iframe
                src="https://www.youtube.com/embed/4RVVt5bMwRQ?autoplay=1&rel=0"
                title="IMPACT — Stories of the Rotary Club of Makati (Pilot Episode)"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Description */}
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-sans font-semibold text-[#F7A81B] italic">
                "See what membership actually looks like — real projects, real members, real impact."
              </p>
              <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                A digital video series that brings to life the stories behind the most meaningful projects of RC Makati — starting with this pilot episode.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-700/60 flex justify-between items-center text-xs">
              <span className={`font-montserrat ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Rotary Club of Makati • YouTube @RCM3830
              </span>
              <a
                href="https://www.youtube.com/watch?v=4RVVt5bMwRQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F7A81B] font-montserrat font-bold uppercase tracking-wider hover:underline inline-flex items-center space-x-1"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: MEMBERSHIP BENEFITS */}
      <section className="relative overflow-hidden p-6 sm:p-10 rounded-3xl text-white shadow-2xl border border-[#F7A81B]/30 my-6">
        {/* Background image layer (z-0) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/benefits-section/bg.jpg"
            alt="Membership Benefits section background"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://static.wixstatic.com/media/b2fb7d_e95fea3b58284b6a98e28b7f1cdca5ee~mv2.jpg';
            }}
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
        <div className="relative z-10 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/20 px-4 py-1.5 rounded-full border border-[#F7A81B]/40 shadow-sm backdrop-blur-md">
              <Award className="w-3.5 h-3.5 text-[#F7A81B]" />
              <span>Rotarian Privileges</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Membership Benefits & Opportunities
            </h2>
            <p className="text-base font-sans leading-relaxed text-slate-200">
              Exclusive privileges, international access, and meaningful leadership avenues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Exclusive Networking & Fellowship',
                desc: 'Access sa exclusive weekly luncheons, fellowship gatherings, at inter-club networking sa Makati.',
              },
              {
                title: 'International Conventions & Conferences',
                desc: 'Participation sa international Rotary conventions, Asia-Pacific summits, at District 3830 conferences.',
              },
              {
                title: 'Committee & Project Leadership',
                desc: 'Take key leadership roles sa club committees, service avenues, at major humanitarian missions.',
              },
              {
                title: 'Rotary Foundation & Global Grants',
                desc: 'Direct involvement sa Rotary Foundation grants at global matching service opportunities.',
              },
              {
                title: 'Prestigious Recognition Programs',
                desc: 'Recognition programs gaya ng Service Above Self Award, Arch Klumph Society, Paul Harris Fellow, atbp.',
              },
              {
                title: 'Matched Clubs Network',
                desc: 'Access sa matched clubs network: 21 Brother Clubs sa Pilipinas at 10 Sister Clubs worldwide.',
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#011E41]/90 border border-[#F7A81B]/30 backdrop-blur-md space-y-3 shadow-xl transition-all hover:-translate-y-1 hover:border-[#F7A81B] text-slate-100"
              >
                <div className="flex items-center space-x-3 text-[#F7A81B]">
                  <div className="p-2 rounded-lg bg-[#0A2540] text-[#F7A81B] border border-[#F7A81B]/30 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm font-sans leading-relaxed text-slate-200">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: MEMBER STORIES & EXPERIENCE */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/15 px-4 py-1.5 rounded-full border border-[#F7A81B]/30 shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 text-[#F7A81B]" />
            <span>Member Voices</span>
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#011E41]'}`}>
            Member Stories & Experience
          </h2>
          <p className={`text-base font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Honest perspectives and real experiences from Rotarians serving in the Rotary Club of Makati.
          </p>
        </div>

        {/* 3 Video Format Placeholder Cards for Real Member Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              slot: '01',
              title: 'Real Member Video Testimonial 1',
              tag: 'Video Slot 01 • Coming Soon',
              desc: 'Reserved for verified Rotary Club of Makati member video interview or story.',
            },
            {
              slot: '02',
              title: 'Real Member Video Testimonial 2',
              tag: 'Video Slot 02 • Coming Soon',
              desc: 'Reserved for verified Rotary Club of Makati member video interview or story.',
            },
            {
              slot: '03',
              title: 'Real Member Video Testimonial 3',
              tag: 'Video Slot 03 • Coming Soon',
              desc: 'Reserved for verified Rotary Club of Makati member video interview or story.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 shadow-sm transition-all duration-300 hover:border-[#F7A81B]/60 ${
                isDark
                  ? 'bg-[#1E293B]/80 border-slate-700/80 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              {/* Video Format Frame / Thumbnail Placeholder */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-dashed border-[#F7A81B]/40 bg-[#0D1B2A]/90 flex flex-col items-center justify-center p-4 text-center group cursor-pointer shadow-inner">
                {/* Subtle Background Mesh Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#011E41]/80 via-transparent to-[#F7A81B]/10 pointer-events-none" />

                <div className="relative z-10 w-12 h-12 rounded-full bg-[#F7A81B]/20 border border-[#F7A81B]/60 text-[#F7A81B] flex items-center justify-center shadow-md mb-2 group-hover:scale-110 group-hover:bg-[#F7A81B] group-hover:text-[#011E41] transition-all">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>

                <div className="relative z-10 space-y-1">
                  <p className="text-xs font-montserrat font-bold text-[#F7A81B] uppercase tracking-wider">
                    {item.tag}
                  </p>
                  <p className="text-[11px] font-sans text-slate-300">
                    Video Format Reserved
                  </p>
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2 flex-grow">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-[#F7A81B] shrink-0" />
                  <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-[#011E41]'}`}>
                    {item.title}
                  </h3>
                </div>
                <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {item.desc}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-700/30 flex items-center justify-between text-[11px] font-montserrat text-slate-400">
                <span className="font-semibold text-[#F7A81B]">RC Makati Member Voice</span>
                <span className="uppercase tracking-wider">No Mock Video</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-action for Real Members */}
        <div
          className={`max-w-5xl mx-auto p-6 rounded-2xl border text-center space-y-3 shadow-sm ${
            isDark
              ? 'bg-[#1E293B]/60 border-slate-700/70'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <p className={`text-xs sm:text-sm font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Are you an active Rotary Club of Makati member? We want to feature your real video story!
          </p>
          <div>
            <a
              href="mailto:secretariat@rotaryclubmakati.org?subject=Member%20Video%20Testimonial%20Submission"
              className="inline-flex items-center space-x-2 bg-[#F7A81B] hover:bg-[#E5980E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Submit Your Member Video Story</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 5: MEMBERSHIP ELIGIBILITY CHECKER (Interactive Form) */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/15 px-4 py-1.5 rounded-full border border-[#F7A81B]/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F7A81B]" />
            <span>Interactive Assessment</span>
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#011E41]'}`}>
            Membership Eligibility Checker
          </h2>
          <p className={`text-sm font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            This quick self-assessment helps guide your application process.
          </p>
        </div>

        <div
          className={`max-w-5xl mx-auto p-6 sm:p-10 rounded-2xl border shadow-xl ${
            isDark
              ? 'bg-[#1E293B] border-slate-700 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-700/60">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-montserrat font-bold text-xs transition-colors ${
                    checkerStep === stepNum
                      ? 'bg-[#F7A81B] text-[#011E41] shadow-md'
                      : checkerStep > stepNum
                      ? 'bg-[#011E41] text-[#F7A81B] border border-[#F7A81B]'
                      : isDark
                      ? 'bg-slate-800 text-slate-500'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {checkerStep > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span className="hidden sm:inline text-xs font-montserrat font-bold uppercase opacity-80">
                  Step {stepNum}
                </span>
              </div>
            ))}
          </div>

          {/* STEP 1: Industry */}
          {checkerStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-xl text-[#F7A81B]">
                  Step 1: What is your profession or industry?
                </h3>
                <p className={`text-xs font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Rotary aims to represent a diverse cross-section of business & professional classifications.
                </p>
              </div>

              <select
                value={checkerData.industry}
                onChange={(e) => setCheckerData({ ...checkerData, industry: e.target.value })}
                className={`w-full p-3.5 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#F7A81B] ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                {[
                  'Technology & Artificial Intelligence',
                  'Healthcare & Medicine',
                  'Banking, Finance & Wealth Management',
                  'Law & Legal Services',
                  'Education & Foundations',
                  'Retail & Hospitality',
                  'Manufacturing & Logistics',
                  'Real Estate & Construction',
                  'Architecture & Urban Planning',
                  'Government & Diplomatic Corps',
                  'Non-Profit & Social Enterprise',
                  'Other Business Sector',
                ].map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setCheckerStep(2)}
                className="w-full bg-[#F7A81B] hover:bg-[#E5980E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl cursor-pointer shadow-md transition-all"
              >
                Continue to Step 2
              </button>
            </div>
          )}

          {/* STEP 2: Experience */}
          {checkerStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-xl text-[#F7A81B]">
                  Step 2: How many years of experience in your field?
                </h3>
                <p className={`text-xs font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Select your current career duration.
                </p>
              </div>

              <div className="space-y-2">
                {['Less than 2 years', '2–5 years', '6–10 years', '11–15 years', '16+ years'].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      checkerData.yearsExp === option
                        ? 'bg-[#F7A81B]/20 border-[#F7A81B] text-[#F7A81B]'
                        : isDark
                        ? 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-200'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="yearsExp"
                      checked={checkerData.yearsExp === option}
                      onChange={() => setCheckerData({ ...checkerData, yearsExp: option })}
                      className="accent-[#F7A81B]"
                    />
                    <span className="text-xs font-montserrat font-bold">{option}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCheckerStep(1)}
                  className={`w-1/3 text-xs font-montserrat font-bold uppercase py-3 rounded-xl cursor-pointer border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCheckerStep(3)}
                  className="w-2/3 bg-[#F7A81B] hover:bg-[#E5980E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider py-3 rounded-xl cursor-pointer shadow-md transition-all"
                >
                  Continue to Step 3
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Availability */}
          {checkerStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-xl text-[#F7A81B]">
                  Step 3: Can you attend weekly Tuesday luncheon meetings?
                </h3>
                <p className={`text-xs font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  RC Makati meets every Tuesday, 12:00 PM – 2:00 PM at The Manila Peninsula.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  'Yes definitely',
                  'Interested but need schedule details',
                  'Not sure yet',
                  'Need more info on make-up meetings',
                ].map((avail) => (
                  <label
                    key={avail}
                    className={`flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      checkerData.availability === avail
                        ? 'bg-[#F7A81B]/20 border-[#F7A81B] text-[#F7A81B]'
                        : isDark
                        ? 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-200'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="availability"
                      checked={checkerData.availability === avail}
                      onChange={() => setCheckerData({ ...checkerData, availability: avail })}
                      className="accent-[#F7A81B]"
                    />
                    <span className="text-xs font-montserrat font-bold">{avail}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCheckerStep(2)}
                  className={`w-1/3 text-xs font-montserrat font-bold uppercase py-3 rounded-xl cursor-pointer border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCheckerStep(4)}
                  className="w-2/3 bg-[#F7A81B] hover:bg-[#E5980E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider py-3 rounded-xl cursor-pointer shadow-md transition-all"
                >
                  Continue to Step 4
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Focus Areas */}
          {checkerStep === 4 && !checkerCompleted && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-xl text-[#F7A81B]">
                  Step 4: Which Rotary Focus Areas interest you most?
                </h3>
                <p className={`text-xs font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Select the causes you are passionate about serving.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FOCUS_AREAS.map((area) => {
                  const isSelected = checkerData.selectedFocusAreas.includes(area.title);
                  return (
                    <button
                      type="button"
                      key={area.id}
                      onClick={() => toggleFocusAreaSelection(area.title)}
                      className={`p-3 rounded-xl border text-left text-xs font-sans transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#F7A81B] text-[#011E41] font-bold border-[#F7A81B]'
                          : isDark
                          ? 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-200'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-800'
                      }`}
                    >
                      <span className="truncate pr-2">{area.title}</span>
                      {isSelected && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCheckerStep(3)}
                  className={`w-1/3 text-xs font-montserrat font-bold uppercase py-3 rounded-xl cursor-pointer border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCheckerCompleted(true)}
                  className="w-2/3 bg-[#F7A81B] hover:bg-[#E5980E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider py-3 rounded-xl cursor-pointer shadow-md transition-all"
                >
                  See Result
                </button>
              </div>
            </div>
          )}

          {/* RESULT STATE */}
          {checkerCompleted && (
            <div className="space-y-6 animate-fadeIn text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#F7A81B]/20 border border-[#F7A81B] text-[#F7A81B] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#F7A81B]">
                  {checkerData.availability === 'Yes definitely'
                    ? 'Great Fit! You are ready to proceed.'
                    : "We'd love to welcome you as our guest first!"}
                </h3>

                <p className={`text-sm font-sans max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {checkerData.availability === 'Yes definitely'
                    ? `Your background in ${checkerData.industry} and passion for ${checkerData.selectedFocusAreas.join(
                        ', '
                      )} align strongly with Rotary's service mission.`
                    : 'Guests are always welcome to observe a regular Tuesday meeting at The Manila Peninsula before formally applying.'}
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToRef(applicationSectionRef)}
                  className="w-full sm:w-auto bg-[#F7A81B] hover:bg-[#E5980E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Proceed to Online Application
                </button>

                <button
                  type="button"
                  onClick={() => scrollToRef(scheduleVisitSectionRef)}
                  className={`w-full sm:w-auto font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border cursor-pointer transition-all ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  }`}
                >
                  Schedule a Guest Visit
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6: SCHEDULE A VISIT TO A MEETING */}
      <section ref={scheduleVisitSectionRef} className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/15 px-4 py-1.5 rounded-full border border-[#F7A81B]/30 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#F7A81B]" />
            <span>Observe a Luncheon</span>
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#011E41]'}`}>
            Schedule a Visit to a Meeting
          </h2>
          <p className={`text-base font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Guests are welcome to observe a regular meeting before applying. Please confirm your visit with our Membership Committee.
          </p>
        </div>

        {/* Meeting Location Callout Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#011E41] via-[#022A5C] to-[#011E41] border border-[#F7A81B]/40 text-white max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-[#F7A81B] shrink-0" />
            <div>
              <span className="font-montserrat font-bold text-sm block text-[#F7A81B]">
                📅 Every Tuesday, Noontime (12:00 PM – 2:00 PM)
              </span>
              <span className="text-xs font-sans text-slate-200 block mt-0.5">
                📍 The Conservatory, The Manila Peninsula, Ayala Ave., Makati City
              </span>
            </div>
          </div>
        </div>

        {/* Visit Booking Form */}
        <div
          className={`max-w-5xl mx-auto p-6 sm:p-10 rounded-2xl border shadow-xl ${
            isDark
              ? 'bg-[#1E293B] border-slate-700 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {visitSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#F7A81B] mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-[#F7A81B]">
                Guest Visit Request Confirmed!
              </h3>
              <p className={`text-sm font-sans max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Thank you, {visitFormData.firstName}. Our Secretariat will confirm your seat reservation at The Manila Peninsula for {visitFormData.preferredDate || 'next Tuesday'}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setVisitSubmitted(false);
                  setVisitSubmitError(null);
                  setVisitFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    preferredDate: '',
                    guestsCount: '1',
                    message: '',
                  });
                }}
                className="bg-[#F7A81B] text-[#011E41] font-montserrat font-bold text-xs uppercase px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#E5980E]"
              >
                Schedule Another Visit
              </button>
            </div>
          ) : (
            <form onSubmit={handleScheduleVisitSubmit} className="space-y-4">
              {visitSubmitError && (
                <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start space-x-3 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-red-300 block">Submission Error</span>
                    <p className="opacity-90">{visitSubmitError}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-xs font-montserrat font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    First Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={visitFormData.firstName}
                    onChange={(e) => setVisitFormData({ ...visitFormData, firstName: e.target.value })}
                    placeholder="e.g. Maria"
                    className={`w-full p-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#F7A81B] ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-montserrat font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Last Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={visitFormData.lastName}
                    onChange={(e) => setVisitFormData({ ...visitFormData, lastName: e.target.value })}
                    placeholder="e.g. Santos"
                    className={`w-full p-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#F7A81B] ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-xs font-montserrat font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={visitFormData.email}
                    onChange={(e) => setVisitFormData({ ...visitFormData, email: e.target.value })}
                    placeholder="maria@example.com"
                    className={`w-full p-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#F7A81B] ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-montserrat font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={visitFormData.phone}
                    onChange={(e) => setVisitFormData({ ...visitFormData, phone: e.target.value })}
                    placeholder="+63 917 888 1966"
                    className={`w-full p-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#F7A81B] ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-xs font-montserrat font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Preferred Date to Visit
                  </label>
                  <input
                    type="date"
                    value={visitFormData.preferredDate}
                    onChange={(e) => setVisitFormData({ ...visitFormData, preferredDate: e.target.value })}
                    className={`w-full p-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#F7A81B] ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-montserrat font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Number of Guests
                  </label>
                  <select
                    value={visitFormData.guestsCount}
                    onChange={(e) => setVisitFormData({ ...visitFormData, guestsCount: e.target.value })}
                    className={`w-full p-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#F7A81B] ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="1">1 Guest (Just me)</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4+">4 or more guests</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-montserrat font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Optional Notes / Special Inquiries
                </label>
                <textarea
                  rows={3}
                  value={visitFormData.message}
                  onChange={(e) => setVisitFormData({ ...visitFormData, message: e.target.value })}
                  placeholder="Let us know if you have specific dietary preferences or project interests..."
                  className={`w-full p-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#F7A81B] ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isVisitSubmitting}
                className={`w-full bg-[#F7A81B] hover:bg-[#E5980E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 ${
                  isVisitSubmitting ? 'opacity-70 cursor-wait' : 'cursor-pointer'
                }`}
              >
                {isVisitSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#011E41]" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirm Guest Visit Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CANDIDATE STATUS & INTERVIEW TRACKER */}
      <section className="scroll-mt-24">
        <ApplicantStatusTracker theme={theme} />
      </section>

      {/* SECTION 7: ONLINE APPLICATION (Summary + QR Code + Direct Link + Interactive Form) */}
      <section ref={applicationSectionRef} className="space-y-12 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-[10px] uppercase tracking-widest bg-[#F7A81B]/10 px-3 py-1 rounded-full border border-[#F7A81B]/30">
            <QrCode className="w-3.5 h-3.5 text-[#F7A81B]" />
            <span>Application Center</span>
          </div>
          <h2 className={`font-serif text-3xl font-bold ${isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'}`}>
            Online Membership Application
          </h2>
          <p className="text-xs font-sans opacity-80">
            Ready to make a difference? Complete our membership application to start your journey.
          </p>
        </div>



        {/* Interactive Web Application Form Wizard */}
        <div className="max-w-5xl mx-auto">
          <MembershipApplicationForm
            theme={theme}
            onApplicationSubmitted={(app) => {
              setLastSubmittedApp(app);
              setSelectedAppModal(app);
              setIsNotificationModalOpen(true);
              setApplicationsList(getSavedApplications());
            }}
          />
        </div>
      </section>

      {/* SECTION 8: CONTACT & VERIFIED FOOTER REFERENCE */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-[#011E41] via-[#022A5C] to-[#011E41] border border-[#F7A81B]/40 text-[#F5F1E6] space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#F7A81B]/20 pb-6">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-xl text-[#F7A81B]">
              Rotary Club of Makati, Inc.
            </h3>
            <p className="text-xs font-sans opacity-85">
              MRCFI Building, 8001 Camia St., Guadalupe Viejo, Makati City, Philippines
            </p>
            <p className="text-xs font-mono opacity-80">
              Phone: (632) 8997863 to 65
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={RCM_INFO.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#F7A81B] hover:text-[#011E41] text-xs font-montserrat font-bold border border-white/20 transition-all cursor-pointer"
            >
              Facebook
            </a>
            <a
              href={RCM_INFO.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#F7A81B] hover:text-[#011E41] text-xs font-montserrat font-bold border border-white/20 transition-all cursor-pointer"
            >
              YouTube
            </a>
            <a
              href={RCM_INFO.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#F7A81B] hover:text-[#011E41] text-xs font-montserrat font-bold border border-white/20 transition-all cursor-pointer"
            >
              TikTok
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans opacity-80 gap-2">
          <span>Official Rotary District 3830 • Chartered March 12, 1966</span>
          <span className="text-[#F7A81B] font-montserrat font-bold">Rotary Club of Makati Secretariat & Membership Committee</span>
        </div>
      </section>
      </div>

      {/* Application Notification & Email Dispatch Modal */}
      <ApplicationNotificationModal
        application={selectedAppModal}
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        theme={theme}
      />

      {/* Admin Interview Scheduling Modal */}
      <AdminInterviewModal
        application={selectedInterviewApp}
        isOpen={isAdminInterviewModalOpen}
        onClose={() => setIsAdminInterviewModalOpen(false)}
        onUpdateApplication={handleUpdateApplicationDetails}
        theme={theme}
      />
    </div>
  );
};
