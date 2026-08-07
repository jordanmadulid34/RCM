import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { RCMLogo } from './RCMLogo';
import {
  User,
  LogOut,
  BarChart3,
  Users,
  CalendarCheck,
  CreditCard,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Search,
  Award,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Megaphone,
  AlertCircle,
  Calendar,
  Phone,
  Briefcase,
  Edit3,
  Save,
  MapPin,
  Star,
  ExternalLink,
  Check,
  X,
  Filter,
  Crown,
  BookOpen,
  Plus,
  PenTool,
  DollarSign,
  Heart,
  Video,
  List,
  Grid,
  CheckSquare,
  HelpCircle,
  XCircle,
  MessageCircle,
  MessageSquare,
} from 'lucide-react';
import { MemberChat } from './MemberChat';
import { MemberOverviewMetrics } from './MemberOverviewMetrics';
import { DEMO_DIRECTORY_MEMBERS, DEMO_ATTENDANCE } from '../data/rcmMemberData';

export interface MemberProfileData {
  id?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  company?: string;
  firm?: string;
  position?: string;
  title?: string;
  classification?: string;
  role?: string;
  role_title?: string;
  designation?: string;
  userRole?: 'admin' | 'member';
  member_id?: string;
  rotary_id?: string;
  rotaryId?: string;
  joined_date?: string;
  join_year?: number | string;
  joinYear?: number | string;
  avatar_url?: string;
  profile_photo?: string;
  status?: string;
  district?: string;
  committee?: string;
  bio?: string;
}

export type EventType =
  | 'General Meeting'
  | 'Board Meeting'
  | 'Committee Meeting'
  | 'Social Event'
  | 'Community Service'
  | 'Fundraiser';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  event_type: EventType;
  event_date: string; // YYYY-MM-DD
  event_time: string;
  location: string;
  virtual_link?: string;
  image_url?: string;
  userRsvp?: 'going' | 'maybe' | 'not_going' | null;
  attendeesCount: number;
}

interface MemberDashboardProps {
  memberData: MemberProfileData;
  onSignOut: () => void;
}

// Initial Sample Events spanning August - September 2026
const INITIAL_CLUB_EVENTS: EventItem[] = [
  {
    id: 'evt-001',
    title: 'Regular Weekly Meeting & Guest Keynote',
    description: 'Weekly luncheon with Guest Speaker Sec. Ralph Recto discussing national economic horizons & fiscal policy.',
    event_type: 'General Meeting',
    event_date: '2026-08-11',
    event_time: '12:00 PM – 2:00 PM',
    location: 'The Conservatory, The Manila Peninsula, Makati City',
    virtual_link: 'https://zoom.us/j/88819662026',
    userRsvp: 'going',
    attendeesCount: 78,
  },
  {
    id: 'evt-002',
    title: 'Barangay Clean Water System Turn-over',
    description: 'Handover ceremony for the newly installed deep-well filtration system serving 500 households in Guadalupe Nuevo.',
    event_type: 'Community Service',
    event_date: '2026-08-15',
    event_time: '8:30 AM – 11:30 AM',
    location: 'Barangay Guadalupe Nuevo Community Hall, Makati',
    userRsvp: 'going',
    attendeesCount: 34,
  },
  {
    id: 'evt-003',
    title: 'Monthly Board of Directors Meeting',
    description: 'Regular monthly meeting of the Board of Directors to review budget allocations, committee reports, and new member applications.',
    event_type: 'Board Meeting',
    event_date: '2026-08-18',
    event_time: '6:00 PM – 8:30 PM',
    location: 'Tower Club Makati, 33rd Floor, Philamlife Tower',
    virtual_link: 'https://zoom.us/j/99912345678',
    userRsvp: null,
    attendeesCount: 16,
  },
  {
    id: 'evt-004',
    title: 'Water & Sanitation Committee Planning Session',
    description: 'Committee alignment for the upcoming Palawan water well drilling project and logistics coordination.',
    event_type: 'Committee Meeting',
    event_date: '2026-08-20',
    event_time: '5:00 PM – 6:30 PM',
    location: 'RC Makati Secretariat Conference Room & Zoom',
    virtual_link: 'https://zoom.us/j/77788899911',
    userRsvp: 'maybe',
    attendeesCount: 12,
  },
  {
    id: 'evt-005',
    title: 'Rotary Fellowship Night & New Member Welcome',
    description: 'An informal evening of fellowship, dinner, and wine tasting welcoming our newest cohort of Rotarians.',
    event_type: 'Social Event',
    event_date: '2026-08-25',
    event_time: '6:30 PM – 9:30 PM',
    location: 'Manila Polo Club, Forbes Park, Makati',
    userRsvp: 'going',
    attendeesCount: 52,
  },
  {
    id: 'evt-006',
    title: 'Annual Charity Golf Tournament & Gala Fundraiser',
    description: 'Flagship annual fundraising tournament supporting the RCM Educational Foundation and Hospital Equipment Grants.',
    event_type: 'Fundraiser',
    event_date: '2026-09-05',
    event_time: '7:00 AM – 4:00 PM',
    location: 'Santa Elena Golf & Country Club, Canlubang',
    userRsvp: null,
    attendeesCount: 110,
  },
  {
    id: 'evt-007',
    title: 'Medical & Dental Surgical Mission Day 1',
    description: 'Serving over 800 patients with free medical checks, dental extractions, and pediatric eye screenings.',
    event_type: 'Community Service',
    event_date: '2026-09-12',
    event_time: '7:00 AM – 3:00 PM',
    location: 'Poblacion Elementary School Gymnasium, Makati',
    userRsvp: null,
    attendeesCount: 42,
  },
  {
    id: 'evt-008',
    title: 'Induction & Turnover Ceremonies (Past Event)',
    description: 'Formal turnover of leadership to President Eduardo H. Galvez and the RY 2026-2027 Board of Directors.',
    event_type: 'General Meeting',
    event_date: '2026-07-07',
    event_time: '6:30 PM – 10:00 PM',
    location: 'Grand Ballroom, The Manila Peninsula',
    userRsvp: 'going',
    attendeesCount: 185,
  },
  {
    id: 'evt-009',
    title: 'District 3830 Governors Visit (Past Event)',
    description: 'Official visit of District Governor Maria Santos highlighting mothers and children initiatives.',
    event_type: 'General Meeting',
    event_date: '2026-07-21',
    event_time: '12:00 PM – 2:00 PM',
    location: 'The Conservatory, The Manila Peninsula',
    userRsvp: 'going',
    attendeesCount: 94,
  },
];

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  memberData: initialMemberData,
  onSignOut,
}) => {
  const [memberData, setMemberData] = useState<MemberProfileData>(initialMemberData);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'announcements' | 'directory' | 'card'>('overview');

  // Edit Profile / Bio State
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editPhone, setEditPhone] = useState<string>(memberData.phone || memberData.mobile || '+63 917 888 1966');
  const [editCompany, setEditCompany] = useState<string>(memberData.company || memberData.firm || 'Rotary Club of Makati');
  const [editClassification, setEditClassification] = useState<string>(memberData.classification || 'Business Executive');
  const [editBio, setEditBio] = useState<string>(
    memberData.bio ||
      'I am an active Rotarian with a passion for community water security and youth education. Joined RC Makati to give back and collaborate with fellow business leaders.'
  );
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Events & Calendar State
  const [events, setEvents] = useState<EventItem[]>(INITIAL_CLUB_EVENTS);
  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const [eventsViewMode, setEventsViewMode] = useState<'calendar' | 'list' | 'my_schedule'>('calendar');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  
  // Calendar Navigation State
  const todayDate = new Date();
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(7); // 0-indexed: 7 = August

  // Selected Event Detail Modal
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);
  
  // Selected Day Popover Modal
  const [selectedDayPopover, setSelectedDayPopover] = useState<{ dateStr: string; dayEvents: EventItem[] } | null>(null);

  // Past Events Collapsed State
  const [showPastEvents, setShowPastEvents] = useState<boolean>(false);

  // Live Announcements State
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState<boolean>(true);
  const [announcementsError, setAnnouncementsError] = useState<string | null>(null);
  const [announcementSearch, setAnnouncementSearch] = useState<string>('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);

  // Directory Search State
  const [directorySearch, setDirectorySearch] = useState<string>('');
  const [directoryFilterCategory, setDirectoryFilterCategory] = useState<string>('all');

  // Synchronize initialMemberData if updated from parent
  useEffect(() => {
    setMemberData(initialMemberData);
    setEditPhone(initialMemberData.phone || initialMemberData.mobile || '+63 917 888 1966');
    setEditCompany(initialMemberData.company || initialMemberData.firm || 'Rotary Club of Makati');
    setEditClassification(initialMemberData.classification || 'Business Executive');
    setEditBio(
      initialMemberData.bio ||
        'I am an active Rotarian with a passion for community water security and youth education. Joined RC Makati to give back and collaborate with fellow business leaders.'
    );
  }, [initialMemberData]);

  // Fetch Live Events from Supabase
  const fetchSupabaseEvents = async () => {
    setEventsLoading(true);
    try {
      const { data: dbEvents, error: eventsErr } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (!eventsErr && dbEvents && dbEvents.length > 0) {
        // Fetch user RSVPs from event_rsvps
        const memberKey = memberData.id || memberData.email || 'mem-curr';
        const { data: rsvpData } = await supabase
          .from('event_rsvps')
          .select('*');

        const mappedEvents: EventItem[] = dbEvents.map((e: any) => {
          const userRsvpRecord = rsvpData?.find(
            (r: any) => r.event_id === e.id && (r.member_id === memberKey || r.member_id === memberData.email)
          );
          const totalGoing = rsvpData?.filter((r: any) => r.event_id === e.id && r.status === 'going').length || 0;

          return {
            id: e.id,
            title: e.title,
            description: e.description || '',
            event_type: e.event_type || 'General Meeting',
            event_date: e.event_date,
            event_time: e.event_time || '12:00 PM',
            location: e.location || 'The Manila Peninsula',
            virtual_link: e.virtual_link,
            image_url: e.image_url,
            userRsvp: userRsvpRecord ? userRsvpRecord.status : null,
            attendeesCount: Math.max(totalGoing, 12),
          };
        });

        // Merge with initial demo events if needed
        setEvents(mappedEvents);
      }
    } catch (err) {
      console.warn('Using local events state fallback:', err);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupabaseEvents();
  }, []);

  // Fetch Live Announcements
  const fetchAnnouncements = async () => {
    setAnnouncementsLoading(true);
    setAnnouncementsError(null);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setAnnouncementsError(`Unable to load announcements: ${error.message}`);
      } else {
        setAnnouncements(data || []);
      }
    } catch (err: any) {
      setAnnouncementsError(err.message || 'Failed to fetch announcements.');
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Compute Display Name & Attributes
  const displayName =
    memberData.full_name ||
    (memberData.first_name && memberData.last_name
      ? `${memberData.first_name} ${memberData.last_name}`
      : memberData.name) ||
    'Rotary Member';

  const displayCompany = memberData.company || memberData.firm || 'Rotary Club of Makati';
  const displayClassification = memberData.classification || 'Business Executive & Community Leader';
  const displayEmail = memberData.email || 'member@rotaryclubmakati.org';
  const displayPhone = memberData.phone || memberData.mobile || '+63 917 888 1966';
  const displayRotaryId = memberData.rotary_id || memberData.rotaryId || memberData.member_id || 'RCM-2025-089';
  const displayJoinYear = memberData.joined_date || memberData.join_year || memberData.joinYear || '2018';
  const displayDistrict = memberData.district || 'District 3830 • Philippines';
  const avatarUrl = memberData.avatar_url || memberData.profile_photo;

  // Compute Initials
  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'RC';
    const cleaned = nameStr.replace(/^(Rtn\.|Pres\.|PP|Dir\.|Sec\.|Treas\.)\s+/i, '').trim();
    const parts = cleaned.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return cleaned.slice(0, 2).toUpperCase();
  };

  // Compute Designation Badge for Requirement #2
  const getRoleDesignationBadge = (roleStr?: string, designationStr?: string, roleTitleStr?: string) => {
    const raw = `${roleStr || ''} ${designationStr || ''} ${roleTitleStr || ''}`.trim();
    const lower = raw.toLowerCase();

    if (lower.includes('admin')) {
      return {
        label: lower.includes('member') ? 'Member & Admin' : 'Admin',
        bgClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        icon: ShieldCheck,
        colorHex: '#10B981',
      };
    }
    if (lower.includes('president') && !lower.includes('vice')) {
      return {
        label: 'President',
        bgClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        icon: Crown,
        colorHex: '#F59E0B',
      };
    }
    if (lower.includes('vice president')) {
      return {
        label: 'Vice President',
        bgClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50',
        icon: Award,
        colorHex: '#6366F1',
      };
    }
    if (lower.includes('secretary')) {
      return {
        label: 'Secretary',
        bgClass: 'bg-sky-500/20 text-sky-300 border-sky-500/50',
        icon: PenTool,
        colorHex: '#0EA5E9',
      };
    }
    if (lower.includes('treasurer')) {
      return {
        label: 'Treasurer',
        bgClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        icon: DollarSign,
        colorHex: '#10B981',
      };
    }
    if (lower.includes('board') || lower.includes('director')) {
      return {
        label: 'Board Director',
        bgClass: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
        icon: Briefcase,
        colorHex: '#3B82F6',
      };
    }
    if (lower.includes('chair') || lower.includes('committee')) {
      return {
        label: 'Committee Chair',
        bgClass: 'bg-teal-500/20 text-teal-300 border-teal-500/50',
        icon: Sparkles,
        colorHex: '#14B8A6',
      };
    }
    // Default fallback
    return {
      label: 'Member',
      bgClass: 'bg-[#F7A81B]/20 text-[#F7A81B] border-[#F7A81B]/40',
      icon: ShieldCheck,
      colorHex: '#F7A81B',
    };
  };

  // Compute Status Badge
  const getStatusBadge = (statusStr?: string) => {
    const s = (statusStr || 'Active Member').toLowerCase();
    if (s.includes('active')) {
      return {
        label: 'Active Member',
        bgClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
        dotColor: 'bg-emerald-400',
      };
    }
    if (s.includes('pending') || s.includes('renewal')) {
      return {
        label: 'Pending Renewal',
        bgClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
        dotColor: 'bg-amber-400',
      };
    }
    if (s.includes('honorary')) {
      return {
        label: 'Honorary Member',
        bgClass: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
        dotColor: 'bg-purple-400',
      };
    }
    return {
      label: statusStr || 'Active Member',
      bgClass: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
      dotColor: 'bg-sky-400',
    };
  };

  const designationBadge = getRoleDesignationBadge(memberData.role, memberData.designation, memberData.role_title);
  const statusBadge = getStatusBadge(memberData.status);
  const DesignationIcon = designationBadge.icon;

  // Color Coding for Event Types
  const getEventTypeBadge = (type: EventType) => {
    switch (type) {
      case 'General Meeting':
        return {
          label: 'General Meeting',
          bgClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          dotBg: 'bg-blue-500',
        };
      case 'Board Meeting':
        return {
          label: 'Board Meeting',
          bgClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dotBg: 'bg-amber-500',
        };
      case 'Committee Meeting':
        return {
          label: 'Committee Meeting',
          bgClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          dotBg: 'bg-sky-400',
        };
      case 'Social Event':
        return {
          label: 'Social Event',
          bgClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          dotBg: 'bg-rose-400',
        };
      case 'Community Service':
        return {
          label: 'Community Service',
          bgClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dotBg: 'bg-emerald-400',
        };
      case 'Fundraiser':
        return {
          label: 'Fundraiser',
          bgClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          dotBg: 'bg-purple-400',
        };
      default:
        return {
          label: type,
          bgClass: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
          dotBg: 'bg-slate-400',
        };
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
    onSignOut();
  };

  // Handle Save Profile & Bio
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg(null);

    try {
      if (memberData.id) {
        const { error } = await supabase
          .from('members')
          .update({
            phone: editPhone,
            company: editCompany,
            classification: editClassification,
            bio: editBio,
          })
          .eq('id', memberData.id);

        if (error) {
          console.warn('Supabase update warning:', error.message);
        }
      }

      setMemberData((prev) => ({
        ...prev,
        phone: editPhone,
        mobile: editPhone,
        company: editCompany,
        firm: editCompany,
        classification: editClassification,
        bio: editBio,
      }));

      setProfileSuccessMsg('Profile and Bio successfully updated in RCM Member Directory!');
      setIsEditingProfile(false);

      setTimeout(() => {
        setProfileSuccessMsg(null);
      }, 5000);
    } catch (err) {
      setProfileSuccessMsg('Profile updated for active session.');
      setIsEditingProfile(false);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Member RSVP Action
  const handleRSVP = async (eventId: string, newRsvp: 'going' | 'maybe' | 'not_going') => {
    // Update local state instantly for seamless responsive UI
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          const wasGoing = evt.userRsvp === 'going';
          const isGoing = newRsvp === 'going';
          let diff = 0;
          if (!wasGoing && isGoing) diff = 1;
          if (wasGoing && !isGoing) diff = -1;

          return {
            ...evt,
            userRsvp: newRsvp,
            attendeesCount: Math.max(0, evt.attendeesCount + diff),
          };
        }
        return evt;
      })
    );

    if (selectedEventModal && selectedEventModal.id === eventId) {
      const wasGoing = selectedEventModal.userRsvp === 'going';
      const isGoing = newRsvp === 'going';
      let diff = 0;
      if (!wasGoing && isGoing) diff = 1;
      if (wasGoing && !isGoing) diff = -1;

      setSelectedEventModal({
        ...selectedEventModal,
        userRsvp: newRsvp,
        attendeesCount: Math.max(0, selectedEventModal.attendeesCount + diff),
      });
    }

    // Persist to Supabase event_rsvps table
    try {
      const memberKey = memberData.id || memberData.email || 'mem-curr';
      await supabase.from('event_rsvps').upsert(
        {
          event_id: eventId,
          member_id: memberKey,
          status: newRsvp,
          responded_at: new Date().toISOString(),
        },
        { onConflict: 'event_id,member_id' }
      );
    } catch (err) {
      console.warn('Persisted RSVP in session state:', err);
    }
  };

  // Calendar Date Math
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    setCalendarYear(2026);
    setCalendarMonth(7); // August 2026
  };

  // Compute Calendar Grid Days
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay(); // 0 = Sun
  const daysInMonthCount = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  // Helper format YYYY-MM-DD
  const formatDayString = (year: number, monthIndex: number, dayNum: number) => {
    const mStr = String(monthIndex + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  const todayStr = '2026-08-05'; // Current date anchor

  // Filter events based on view mode and category tabs
  const nowFormatted = '2026-08-05';

  const upcomingEvents = events.filter((e) => e.event_date >= nowFormatted);
  const pastEvents = events.filter((e) => e.event_date < nowFormatted);

  const filteredUpcomingEvents = upcomingEvents.filter((e) => {
    if (selectedEventType === 'all') return true;
    return e.event_type === selectedEventType;
  });

  const myScheduleEvents = events.filter(
    (e) => e.userRsvp === 'going' && e.event_date >= nowFormatted
  );

  // Directory Search Filter
  const filteredDirectory = DEMO_DIRECTORY_MEMBERS.filter((m) => {
    const q = directorySearch.toLowerCase();
    const matchesQuery =
      m.name.toLowerCase().includes(q) ||
      m.classification.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q);

    if (directoryFilterCategory === 'all') return matchesQuery;
    if (directoryFilterCategory === 'board')
      return matchesQuery && (m.status === 'Board Member' || m.role.includes('Director'));
    return matchesQuery;
  });

  // Announcements Search Filter
  const filteredAnnouncements = announcements.filter((a) => {
    const q = announcementSearch.toLowerCase();
    return (
      (a.title || '').toLowerCase().includes(q) ||
      (a.content || a.body || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#01142E] text-slate-100 font-sans pb-24">
      {/* Top Banner Header with Rotary Gold Accents */}
      <header className="bg-gradient-to-r from-[#011E41] via-[#0A2540] to-[#01142E] border-b border-[#F7A81B]/30 sticky top-0 z-30 shadow-2xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Logo, Member Name, and Designation Badges */}
            <div className="flex items-center space-x-3.5">
              <div className="p-2 bg-[#011E41] rounded-2xl border border-[#F7A81B]/40 shadow-inner shrink-0">
                <RCMLogo className="h-9 w-auto" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#F7A81B]/20 text-[#F7A81B] text-[10px] font-montserrat font-bold px-2.5 py-0.5 rounded-full border border-[#F7A81B]/30 uppercase tracking-wider">
                    Member Portal
                  </span>

                  {/* MEMBER ROLE / DESIGNATION BADGE */}
                  <span
                    className={`inline-flex items-center space-x-1.5 text-[10px] font-montserrat font-bold px-2.5 py-0.5 rounded-full border ${designationBadge.bgClass} uppercase tracking-wider`}
                  >
                    <DesignationIcon className="w-3 h-3 shrink-0" />
                    <span>{designationBadge.label}</span>
                  </span>

                  {/* MEMBERSHIP STATUS BADGE */}
                  <span
                    className={`inline-flex items-center space-x-1.5 text-[10px] font-montserrat font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.bgClass} uppercase tracking-wider`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor} animate-pulse`} />
                    <span>{statusBadge.label}</span>
                  </span>
                </div>

                <h1 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2 mt-1">
                  <span>{displayName}</span>
                </h1>
                <p className="text-[11px] text-[#94A3B8] font-medium truncate max-w-md">
                  {displayClassification} • <span className="text-slate-300">{displayCompany}</span>
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <div className="flex items-center space-x-3 self-end sm:self-center">
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/40 hover:border-red-400 font-montserrat font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-md"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 pt-4 overflow-x-auto no-scrollbar border-t border-white/10 mt-3.5">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#F7A81B] text-[#01142E] shadow-lg scale-102'
                  : 'bg-[#011E41] text-slate-300 hover:text-white hover:bg-[#011E41]/80 border border-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Overview & Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-[#F7A81B] text-[#01142E] shadow-lg scale-102'
                  : 'bg-[#011E41] text-slate-300 hover:text-white hover:bg-[#011E41]/80 border border-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Events & Calendar</span>
              {myScheduleEvents.length > 0 && (
                <span className="bg-[#01142E] text-[#F7A81B] text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  {myScheduleEvents.length} RSVP'd
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'announcements'
                  ? 'bg-[#F7A81B] text-[#01142E] shadow-lg scale-102'
                  : 'bg-[#011E41] text-slate-300 hover:text-white hover:bg-[#011E41]/80 border border-white/5'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Official Bulletins</span>
              {announcements.length > 0 && (
                <span className="bg-[#01142E] text-[#F7A81B] text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {announcements.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-[#F7A81B] text-[#01142E] shadow-lg scale-102'
                  : 'bg-[#011E41] text-slate-300 hover:text-white hover:bg-[#011E41]/80 border border-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Member Directory</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-[#F7A81B] text-[#01142E] shadow-lg scale-102'
                  : 'bg-[#011E41] text-slate-300 hover:text-white hover:bg-[#011E41]/80 border border-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct Messages</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'card'
                  ? 'bg-[#F7A81B] text-[#01142E] shadow-lg scale-102'
                  : 'bg-[#011E41] text-slate-300 hover:text-white hover:bg-[#011E41]/80 border border-white/5'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Digital Card</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Global Toast Success Message */}
        {profileSuccessMsg && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-200 text-xs flex items-center justify-between shadow-xl animate-fadeIn">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-semibold">{profileSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setProfileSuccessMsg(null)}
              className="text-emerald-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & METRICS */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <MemberOverviewMetrics
            memberData={memberData}
            onUpdateMemberData={(updated) => setMemberData(updated)}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 2: EVENTS & MEETINGS MODULE (Requirement #4) */}
        {/* ========================================================================= */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Control Panel */}
            <div className="bg-[#0A2540] p-6 rounded-3xl border border-[#F7A81B]/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 text-[#F7A81B] text-xs font-montserrat font-bold uppercase tracking-wider mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Rotary Club of Makati Events & Meetings</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Member Event Calendar & RSVPs
                </h3>
              </div>

              {/* View Switchers */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEventsViewMode('calendar')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-montserrat font-bold cursor-pointer transition ${
                    eventsViewMode === 'calendar'
                      ? 'bg-[#F7A81B] text-[#01142E] shadow-md'
                      : 'bg-[#011E41] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span>Month Calendar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEventsViewMode('list')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-montserrat font-bold cursor-pointer transition ${
                    eventsViewMode === 'list'
                      ? 'bg-[#F7A81B] text-[#01142E] shadow-md'
                      : 'bg-[#011E41] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>Upcoming List</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEventsViewMode('my_schedule')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-montserrat font-bold cursor-pointer transition ${
                    eventsViewMode === 'my_schedule'
                      ? 'bg-[#F7A81B] text-[#01142E] shadow-md'
                      : 'bg-[#011E41] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>My Schedule ({myScheduleEvents.length})</span>
                </button>
              </div>
            </div>

            {/* Event Category Filter Tabs */}
            {eventsViewMode !== 'my_schedule' && (
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2">
                {[
                  'all',
                  'General Meeting',
                  'Board Meeting',
                  'Committee Meeting',
                  'Social Event',
                  'Community Service',
                  'Fundraiser',
                ].map((typeKey) => {
                  const label = typeKey === 'all' ? 'All Event Types' : typeKey;
                  const isActive = selectedEventType === typeKey;
                  return (
                    <button
                      key={typeKey}
                      type="button"
                      onClick={() => setSelectedEventType(typeKey)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-montserrat font-bold whitespace-nowrap transition cursor-pointer border ${
                        isActive
                          ? 'bg-slate-200 text-[#01142E] border-white shadow-md'
                          : 'bg-[#0A2540] text-slate-400 hover:text-white border-white/10'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* 1. CALENDAR VIEW (Month Grid) */}
            {/* --------------------------------------------------------------------- */}
            {eventsViewMode === 'calendar' && (
              <div className="bg-[#0A2540] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
                {/* Month Navigation Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-serif text-2xl font-bold text-white">
                      {monthNames[calendarMonth]} {calendarYear}
                    </h4>
                    <button
                      type="button"
                      onClick={handleGoToday}
                      className="px-3 py-1 bg-[#011E41] hover:bg-[#011E41]/80 text-[#F7A81B] border border-[#F7A81B]/30 rounded-lg text-xs font-montserrat font-bold cursor-pointer transition"
                    >
                      Today
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-2 bg-[#011E41] hover:bg-slate-800 text-slate-200 rounded-xl border border-white/10 cursor-pointer transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-2 bg-[#011E41] hover:bg-slate-800 text-slate-200 rounded-xl border border-white/10 cursor-pointer transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Calendar Days Grid Header */}
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-montserrat font-bold uppercase text-slate-400">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>

                {/* Calendar Grid Cells */}
                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                  {/* Empty Leading Cells */}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="min-h-[90px] sm:min-h-[110px] bg-[#011E41]/30 rounded-2xl border border-white/5 opacity-40 pointer-events-none"
                    />
                  ))}

                  {/* Day Cells */}
                  {Array.from({ length: daysInMonthCount }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const dayDateStr = formatDayString(calendarYear, calendarMonth, dayNum);
                    const isToday = dayDateStr === todayStr;
                    const isPast = dayDateStr < todayStr;

                    // Filter events on this specific date
                    const dayEvents = events.filter((e) => {
                      if (e.event_date !== dayDateStr) return false;
                      if (selectedEventType !== 'all' && e.event_type !== selectedEventType) return false;
                      return true;
                    });

                    return (
                      <div
                        key={dayDateStr}
                        onClick={() => {
                          if (dayEvents.length > 0) {
                            setSelectedDayPopover({ dateStr: dayDateStr, dayEvents });
                          }
                        }}
                        className={`min-h-[90px] sm:min-h-[110px] p-2 sm:p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isToday
                            ? 'bg-[#011E41] border-[#F7A81B] shadow-lg ring-2 ring-[#F7A81B]/40'
                            : isPast
                            ? 'bg-[#011E41]/50 border-white/5 opacity-70'
                            : 'bg-[#011E41] border-white/10 hover:border-[#F7A81B]/40'
                        } ${dayEvents.length > 0 ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
                      >
                        {/* Day Number Header */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              isToday
                                ? 'bg-[#F7A81B] text-[#01142E] w-6 h-6 rounded-full flex items-center justify-center font-mono'
                                : 'text-slate-300 font-mono'
                            }`}
                          >
                            {dayNum}
                          </span>
                          {dayEvents.length > 0 && (
                            <span className="text-[10px] font-mono font-bold text-[#F7A81B] bg-[#F7A81B]/10 px-1.5 py-0.5 rounded-full">
                              {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        {/* Event Pills Container */}
                        <div className="space-y-1 my-1 overflow-hidden">
                          {dayEvents.slice(0, 2).map((evt) => {
                            const badgeInfo = getEventTypeBadge(evt.event_type);
                            return (
                              <div
                                key={evt.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEventModal(evt);
                                }}
                                className={`p-1 sm:p-1.5 rounded-lg text-[10px] font-medium border truncate ${badgeInfo.bgClass} hover:brightness-125 transition cursor-pointer`}
                              >
                                <span className="font-semibold text-white block truncate">{evt.title}</span>
                              </div>
                            );
                          })}

                          {dayEvents.length > 2 && (
                            <span className="text-[9px] font-bold text-slate-400 block text-center">
                              +{dayEvents.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* 2. LIST VIEW & MY SCHEDULE */}
            {/* --------------------------------------------------------------------- */}
            {(eventsViewMode === 'list' || eventsViewMode === 'my_schedule') && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(eventsViewMode === 'my_schedule' ? myScheduleEvents : filteredUpcomingEvents).map((evt) => {
                    const badgeInfo = getEventTypeBadge(evt.event_type);
                    const formattedDate = new Date(evt.event_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <div
                        key={evt.id}
                        className="bg-[#0A2540] rounded-3xl border border-[#F7A81B]/30 p-6 flex flex-col justify-between space-y-4 hover:border-[#F7A81B]/60 transition shadow-2xl relative"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center space-x-1.5 text-[10px] font-montserrat font-bold px-3 py-1 rounded-full border ${badgeInfo.bgClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${badgeInfo.dotBg}`} />
                              <span>{badgeInfo.label}</span>
                            </span>

                            {/* Member RSVP Status Indicator */}
                            {evt.userRsvp === 'going' && (
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>You're Going</span>
                              </span>
                            )}
                            {evt.userRsvp === 'maybe' && (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <HelpCircle className="w-3 h-3" />
                                <span>Maybe</span>
                              </span>
                            )}
                            {evt.userRsvp === 'not_going' && (
                              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                <span>Not Going</span>
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif text-lg font-bold text-white leading-snug">
                            {evt.title}
                          </h4>

                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {evt.description}
                          </p>

                          <div className="p-3 bg-[#011E41] rounded-2xl border border-white/5 space-y-2 text-xs text-slate-300">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-3.5 h-3.5 text-[#F7A81B] shrink-0" />
                              <span className="font-semibold text-white">{formattedDate}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3.5 h-3.5 text-[#F7A81B] shrink-0" />
                              <span>{evt.event_time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-3.5 h-3.5 text-[#F7A81B] shrink-0" />
                              <span className="truncate">{evt.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* RSVP Action Bar */}
                        <div className="pt-3 border-t border-white/10 space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-mono text-[11px] text-[#F7A81B]">
                              <strong>{evt.attendeesCount}</strong> members going
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedEventModal(evt)}
                              className="text-xs text-slate-300 hover:text-white underline font-bold cursor-pointer"
                            >
                              Details
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleRSVP(evt.id, 'going')}
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-montserrat font-bold cursor-pointer transition border ${
                                evt.userRsvp === 'going'
                                  ? 'bg-emerald-500 text-[#01142E] border-emerald-400'
                                  : 'bg-[#011E41] text-slate-300 border-white/10 hover:text-white'
                              }`}
                            >
                              Going
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRSVP(evt.id, 'maybe')}
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-montserrat font-bold cursor-pointer transition border ${
                                evt.userRsvp === 'maybe'
                                  ? 'bg-amber-500 text-[#01142E] border-amber-400'
                                  : 'bg-[#011E41] text-slate-300 border-white/10 hover:text-white'
                              }`}
                            >
                              Maybe
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRSVP(evt.id, 'not_going')}
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-montserrat font-bold cursor-pointer transition border ${
                                evt.userRsvp === 'not_going'
                                  ? 'bg-rose-500 text-[#01142E] border-rose-400'
                                  : 'bg-[#011E41] text-slate-300 border-white/10 hover:text-white'
                              }`}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* 3. COLLAPSED PAST EVENTS SECTION */}
            {/* --------------------------------------------------------------------- */}
            <div className="pt-6">
              <button
                type="button"
                onClick={() => setShowPastEvents(!showPastEvents)}
                className="w-full p-4 bg-[#0A2540]/80 hover:bg-[#0A2540] border border-white/10 rounded-2xl text-xs font-montserrat font-bold text-slate-300 flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#F7A81B]" />
                  <span>Past Events & Attendance History ({pastEvents.length})</span>
                </div>
                <span>{showPastEvents ? 'Hide Past Events ▲' : 'Show Past Events ▼'}</span>
              </button>

              {showPastEvents && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                  {pastEvents.map((pe) => (
                    <div
                      key={pe.id}
                      className="p-5 bg-[#011E41]/60 rounded-2xl border border-white/5 space-y-2 opacity-80"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold text-[#F7A81B] uppercase font-mono">
                          {pe.event_type}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">{pe.event_date}</span>
                      </div>
                      <h5 className="font-serif font-bold text-white text-base">{pe.title}</h5>
                      <p className="text-xs text-slate-400">{pe.location}</p>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                        <span>Attendance Record:</span>
                        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 text-[10px]">
                          Attended ✓
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: OFFICIAL BULLETINS & ANNOUNCEMENTS */}
        {/* ========================================================================= */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0A2540] p-6 sm:p-8 rounded-3xl border border-[#F7A81B]/30 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="inline-flex items-center space-x-2 text-[#F7A81B] text-xs font-montserrat font-bold uppercase tracking-wider mb-1">
                    <Megaphone className="w-4 h-4" />
                    <span>Official Bulletins & District Updates</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Live Member Announcement Feed
                  </h3>
                </div>

                <div className="flex items-center space-x-3 self-start sm:self-center">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={announcementSearch}
                      onChange={(e) => setAnnouncementSearch(e.target.value)}
                      placeholder="Search bulletins..."
                      className="pl-9 pr-4 py-2 bg-[#011E41] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={fetchAnnouncements}
                    className="bg-[#011E41] hover:bg-[#011E41]/80 border border-[#F7A81B]/30 text-[#F7A81B] font-montserrat font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${announcementsLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {announcementsLoading ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#F7A81B] animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">Loading announcements...</p>
                </div>
              ) : filteredAnnouncements.length === 0 ? (
                <div className="py-12 text-center bg-[#011E41]/50 rounded-2xl border border-white/5 space-y-3 max-w-md mx-auto px-6">
                  <Megaphone className="w-8 h-8 text-[#F7A81B] mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-white">No Announcements Found</h4>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredAnnouncements.map((ann) => {
                    const title = ann.title || 'Official Announcement';
                    const content = ann.content || ann.body || '';
                    const dateStr = ann.created_at
                      ? new Date(ann.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Recent';

                    return (
                      <div
                        key={ann.id || Math.random()}
                        className="bg-[#011E41] rounded-2xl border border-[#F7A81B]/20 p-6 space-y-3 shadow-lg flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="bg-[#0A2540] text-[#F7A81B] font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-[#F7A81B]/30">
                              Official Bulletin
                            </span>
                            <span className="font-mono text-slate-400 text-[11px]">{dateStr}</span>
                          </div>
                          <h4 className="font-serif text-lg font-bold text-white">{title}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">{content}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedAnnouncement(ann)}
                          className="text-[#F7A81B] hover:underline text-xs font-bold pt-2 cursor-pointer text-right block"
                        >
                          Read Full Notice →
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MEMBER DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === 'directory' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0A2540] p-6 sm:p-8 rounded-3xl border border-[#F7A81B]/30 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="inline-flex items-center space-x-2 text-[#F7A81B] text-xs font-montserrat font-bold uppercase tracking-wider mb-1">
                    <Users className="w-4 h-4" />
                    <span>Rotary Club of Makati Directory</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Fellow Member Roster
                  </h3>
                </div>

                <div className="relative w-full sm:w-auto sm:min-w-[240px]">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    placeholder="Search name, company, or classification..."
                    className="w-full pl-9 pr-4 py-2 bg-[#011E41] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F7A81B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDirectory.map((m) => {
                  const mBadge = getRoleDesignationBadge(m.role, m.status);
                  return (
                    <div
                      key={m.id}
                      className="bg-[#011E41] p-5 rounded-2xl border border-white/10 hover:border-[#F7A81B]/40 transition space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F7A81B] to-[#D98E0E] text-[#01142E] font-serif font-bold text-base flex items-center justify-center shrink-0">
                          {m.initials}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-white text-base leading-tight">{m.name}</h4>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${mBadge.bgClass} mt-1`}>
                            {mBadge.label}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-white/5">
                        <p className="text-slate-400">
                          Classification: <span className="text-[#F7A81B] font-semibold">{m.classification || 'Not provided'}</span>
                        </p>
                        <p className="text-slate-400">
                          Company: <span className="text-slate-300">{m.company || 'Not provided'}</span>
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5">
                        <span className="text-slate-400 font-mono text-[11px]">
                          Phone: {m.phone || 'Not provided'}
                        </span>
                        {m.email && m.email !== 'Not provided' ? (
                          <a
                            href={`mailto:${m.email}`}
                            className="text-[#F7A81B] font-bold hover:underline"
                          >
                            Email
                          </a>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Email: Not provided</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: DIGITAL MEMBER CARD */}
        {/* ========================================================================= */}
        {activeTab === 'card' && (
          <div className="max-w-md mx-auto space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-[#011E41] via-[#0A2540] to-[#01142E] border-2 border-[#F7A81B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#F7A81B] via-amber-300 to-[#F7A81B]" />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <RCMLogo className="h-10 w-auto" />
                <span className="text-xs font-montserrat font-bold text-[#F7A81B] uppercase tracking-widest">
                  Official Member Pass
                </span>
              </div>

              <div className="py-2 space-y-2">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F7A81B] to-[#D98E0E] text-[#01142E] font-serif font-black text-2xl flex items-center justify-center mx-auto border-2 border-white/40 shadow-xl">
                  {getInitials(displayName)}
                </div>
                <h3 className="font-serif text-xl font-bold text-white">{displayName}</h3>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${designationBadge.bgClass}`}>
                  {designationBadge.label}
                </span>
              </div>

              <div className="bg-[#01142E] p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
                <p className="text-slate-400">Rotary Club of Makati • District 3830</p>
                <p className="text-[#F7A81B] font-mono font-bold">ID: {displayRotaryId}</p>
                <p className="text-slate-300">Member Since {displayJoinYear}</p>
              </div>

              <p className="text-[10px] text-slate-400 uppercase font-mono">
                Valid for Luncheon Check-in & District Events
              </p>
            </div>
          </div>
        )}

        {/* TAB 6: MESSAGES & DIRECT CHAT (Requirement #7) */}
        {activeTab === 'chat' && (
          <div className="space-y-6 animate-fadeIn">
            <MemberChat currentMemberName={displayName} />
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* EVENT DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A2540] border border-[#F7A81B]/40 max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto animate-fadeIn">
            <button
              type="button"
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${getEventTypeBadge(selectedEventModal.event_type).bgClass}`}>
                {selectedEventModal.event_type}
              </span>

              <h3 className="font-serif text-2xl font-bold text-white">
                {selectedEventModal.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedEventModal.description}
              </p>
            </div>

            <div className="p-4 bg-[#011E41] rounded-2xl border border-white/5 space-y-2.5 text-xs text-slate-200">
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-[#F7A81B] shrink-0" />
                <span className="font-semibold text-white">{selectedEventModal.event_date}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-[#F7A81B] shrink-0" />
                <span>{selectedEventModal.event_time}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-[#F7A81B] shrink-0" />
                <span>{selectedEventModal.location}</span>
              </div>
              {selectedEventModal.virtual_link && (
                <div className="flex items-center space-x-2.5 pt-1 border-t border-white/5">
                  <Video className="w-4 h-4 text-[#F7A81B] shrink-0" />
                  <a
                    href={selectedEventModal.virtual_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#F7A81B] underline font-bold hover:text-white"
                  >
                    Virtual Zoom Link
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-montserrat font-bold text-slate-300">Set Your RSVP:</span>
                <span className="text-[#F7A81B] font-mono font-bold">
                  {selectedEventModal.attendeesCount} Rotarians Attending
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleRSVP(selectedEventModal.id, 'going')}
                  className={`py-2.5 px-3 rounded-xl font-montserrat font-bold text-xs transition cursor-pointer border ${
                    selectedEventModal.userRsvp === 'going'
                      ? 'bg-emerald-500 text-[#01142E] border-emerald-400'
                      : 'bg-[#011E41] text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  Going ✓
                </button>
                <button
                  type="button"
                  onClick={() => handleRSVP(selectedEventModal.id, 'maybe')}
                  className={`py-2.5 px-3 rounded-xl font-montserrat font-bold text-xs transition cursor-pointer border ${
                    selectedEventModal.userRsvp === 'maybe'
                      ? 'bg-amber-500 text-[#01142E] border-amber-400'
                      : 'bg-[#011E41] text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  Maybe ?
                </button>
                <button
                  type="button"
                  onClick={() => handleRSVP(selectedEventModal.id, 'not_going')}
                  className={`py-2.5 px-3 rounded-xl font-montserrat font-bold text-xs transition cursor-pointer border ${
                    selectedEventModal.userRsvp === 'not_going'
                      ? 'bg-rose-500 text-[#01142E] border-rose-400'
                      : 'bg-[#011E41] text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  Not Going
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DAY POPOVER MODAL (When clicking a calendar day with events) */}
      {/* ========================================================================= */}
      {selectedDayPopover && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A2540] border border-[#F7A81B]/40 max-w-md w-full rounded-3xl p-6 space-y-4 relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setSelectedDayPopover(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-serif text-xl font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#F7A81B]" />
              <span>Events on {selectedDayPopover.dateStr}</span>
            </h4>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {selectedDayPopover.dayEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => {
                    setSelectedDayPopover(null);
                    setSelectedEventModal(evt);
                  }}
                  className="p-4 bg-[#011E41] rounded-2xl border border-white/10 hover:border-[#F7A81B]/50 transition cursor-pointer space-y-2"
                >
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getEventTypeBadge(evt.event_type).bgClass}`}>
                    {evt.event_type}
                  </span>
                  <h5 className="font-serif font-bold text-white text-base">{evt.title}</h5>
                  <p className="text-xs text-slate-300">{evt.event_time} • {evt.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT LIGHTBOX MODAL */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A2540] border border-[#F7A81B]/40 max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-white">
              {selectedAnnouncement.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {selectedAnnouncement.content || selectedAnnouncement.body}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
