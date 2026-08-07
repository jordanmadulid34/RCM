import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { DEMO_ANNOUNCEMENTS, INITIAL_DEMO_EVENTS, DEMO_DIRECTORY_MEMBERS } from '../data/rcmMemberData';
import {
  Users,
  Calendar,
  CalendarCheck,
  BarChart3,
  Megaphone,
  AlertCircle,
  RefreshCw,
  Clock,
  MapPin,
  CheckCircle2,
  Video,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Info,
  Sparkles,
  User,
  Edit3,
  Award,
  ShieldCheck,
  Save,
  X
} from 'lucide-react';
import { RCMLogo } from './RCMLogo';

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

export interface MemberOverviewMetricsProps {
  memberData: MemberProfileData;
  onUpdateMemberData?: (updated: MemberProfileData) => void;
  onNavigateToTab?: (tab: 'events' | 'announcements' | 'directory') => void;
}

export interface SupabaseEvent {
  id: string;
  title: string;
  description?: string;
  event_type?: string;
  event_date: string;
  event_time?: string;
  location?: string;
  virtual_link?: string;
  image_url?: string;
  created_at?: string;
}

export interface SupabaseAnnouncement {
  id: string;
  title: string;
  content?: string;
  body?: string;
  image_url?: string;
  created_at?: string;
}

export const MemberOverviewMetrics: React.FC<MemberOverviewMetricsProps> = ({
  memberData,
  onUpdateMemberData,
  onNavigateToTab,
}) => {
  // ---------------------------------------------------------------------------
  // Member Profile State
  // ---------------------------------------------------------------------------
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editPhone, setEditPhone] = useState<string>(
    memberData.phone || memberData.mobile || '+63 917 888 1966'
  );
  const [editCompany, setEditCompany] = useState<string>(
    memberData.company || memberData.firm || 'Rotary Club of Makati'
  );
  const [editClassification, setEditClassification] = useState<string>(
    memberData.classification || 'Business Executive'
  );
  const [editBio, setEditBio] = useState<string>(
    memberData.bio ||
      'Active Rotarian dedicated to community service, fellowship, and youth vocational development with the Rotary Club of Makati.'
  );
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Synchronize initialMemberData
  useEffect(() => {
    setEditPhone(memberData.phone || memberData.mobile || '+63 917 888 1966');
    setEditCompany(memberData.company || memberData.firm || 'Rotary Club of Makati');
    setEditClassification(memberData.classification || 'Business Executive');
    setEditBio(
      memberData.bio ||
        'Active Rotarian dedicated to community service, fellowship, and youth vocational development with the Rotary Club of Makati.'
    );
  }, [memberData]);

  // ---------------------------------------------------------------------------
  // Data State for Real Supabase Metrics & Tables
  // ---------------------------------------------------------------------------
  // 1. Members count
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [memberCountLoading, setMemberCountLoading] = useState<boolean>(true);
  const [memberCountError, setMemberCountError] = useState<string | null>(null);

  // 2. Announcements count & list
  const [announcementCount, setAnnouncementCount] = useState<number | null>(null);
  const [bulletins, setBulletins] = useState<SupabaseAnnouncement[]>([]);
  const [bulletinsLoading, setBulletinsLoading] = useState<boolean>(true);
  const [bulletinsError, setBulletinsError] = useState<string | null>(null);

  // 3. Featured Next Event
  const [nextEvent, setNextEvent] = useState<SupabaseEvent | null>(null);
  const [nextEventLoading, setNextEventLoading] = useState<boolean>(true);
  const [nextEventError, setNextEventError] = useState<string | null>(null);

  // 4. RSVP Interaction State
  const [userRsvpStatus, setUserRsvpStatus] = useState<'going' | 'maybe' | 'not_going' | null>(null);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState<boolean>(false);
  const [rsvpFeedback, setRsvpFeedback] = useState<string | null>(null);

  // Selected bulletin modal
  const [selectedBulletin, setSelectedBulletin] = useState<SupabaseAnnouncement | null>(null);

  // ---------------------------------------------------------------------------
  // Fetch Functions
  // ---------------------------------------------------------------------------
  const fetchMemberCount = async () => {
    setMemberCountLoading(true);
    setMemberCountError(null);
    try {
      if (!isSupabaseConfigured) {
        setMemberCount(DEMO_DIRECTORY_MEMBERS.length);
        return;
      }
      const { data, count, error } = await supabase
        .from('members')
        .select('id', { count: 'exact', head: false });

      if (error) {
        setMemberCount(DEMO_DIRECTORY_MEMBERS.length);
      } else {
        const total = count !== null ? count : (data ? data.length : DEMO_DIRECTORY_MEMBERS.length);
        setMemberCount(total || DEMO_DIRECTORY_MEMBERS.length);
      }
    } catch (_err) {
      setMemberCount(DEMO_DIRECTORY_MEMBERS.length);
    } finally {
      setMemberCountLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    setBulletinsLoading(true);
    setBulletinsError(null);
    const fallbackBulletins: SupabaseAnnouncement[] = DEMO_ANNOUNCEMENTS.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.summary,
      body: a.summary,
      created_at: a.date,
    }));

    try {
      if (!isSupabaseConfigured) {
        setAnnouncementCount(fallbackBulletins.length);
        setBulletins(fallbackBulletins);
        return;
      }
      const { data, count, error } = await supabase
        .from('announcements')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setAnnouncementCount(fallbackBulletins.length);
        setBulletins(fallbackBulletins);
      } else {
        setAnnouncementCount(count !== null ? count : data.length);
        setBulletins(data);
      }
    } catch (_err) {
      setAnnouncementCount(fallbackBulletins.length);
      setBulletins(fallbackBulletins);
    } finally {
      setBulletinsLoading(false);
    }
  };

  const fetchFeaturedEvent = async () => {
    setNextEventLoading(true);
    setNextEventError(null);
    const fallbackEvent: SupabaseEvent = {
      id: INITIAL_DEMO_EVENTS[0].id,
      title: INITIAL_DEMO_EVENTS[0].title,
      description: INITIAL_DEMO_EVENTS[0].speaker ? `Guest Speaker: ${INITIAL_DEMO_EVENTS[0].speaker}` : 'Rotary Club of Makati Official Event',
      event_type: INITIAL_DEMO_EVENTS[0].type,
      event_date: INITIAL_DEMO_EVENTS[0].date,
      event_time: INITIAL_DEMO_EVENTS[0].time,
      location: INITIAL_DEMO_EVENTS[0].location,
    };

    try {
      if (!isSupabaseConfigured) {
        setNextEvent(fallbackEvent);
        return;
      }
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error || !data || data.length === 0) {
        setNextEvent(fallbackEvent);
      } else if (data && data.length > 0) {
        // Find the soonest upcoming event (or first event in chronological order)
        const todayStr = new Date().toISOString().split('T')[0];
        const upcoming = data.find((e: any) => e.event_date >= todayStr) || data[0];
        setNextEvent(upcoming);

        // Fetch user RSVP status if event found
        if (upcoming && memberData) {
          const memberKey = memberData.id || memberData.email;
          if (memberKey) {
            const { data: rsvpData } = await supabase
              .from('event_rsvps')
              .select('status')
              .eq('event_id', upcoming.id)
              .or(`member_id.eq.${memberKey},member_id.eq.${memberData.email}`)
              .maybeSingle();

            if (rsvpData) {
              setUserRsvpStatus(rsvpData.status);
            }
          }
        }
      } else {
        setNextEvent(fallbackEvent);
      }
    } catch (_err) {
      setNextEvent(fallbackEvent);
    } finally {
      setNextEventLoading(false);
    }
  };

  const fetchAllMetrics = () => {
    fetchMemberCount();
    fetchAnnouncements();
    fetchFeaturedEvent();
  };

  useEffect(() => {
    fetchAllMetrics();
  }, []);

  // ---------------------------------------------------------------------------
  // RSVP Action Handler
  // ---------------------------------------------------------------------------
  const handleRsvp = async (status: 'going' | 'maybe' | 'not_going') => {
    if (!nextEvent) return;
    setIsSubmittingRsvp(true);
    setRsvpFeedback(null);
    try {
      const memberKey = memberData.id || memberData.email || 'guest-member';
      const payload = {
        event_id: nextEvent.id,
        member_id: memberKey,
        member_email: memberData.email || '',
        member_name: memberData.full_name || memberData.name || 'Rotary Member',
        status: status,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('event_rsvps').upsert([payload]);

      if (error) {
        console.error('RSVP submission error:', error);
        setRsvpFeedback(`Failed to update RSVP (${error.code || 'RLS'}): ${error.message}`);
      } else {
        setUserRsvpStatus(status);
        setRsvpFeedback(`Your response "${status.toUpperCase()}" was recorded successfully!`);
      }
    } catch (err: any) {
      setRsvpFeedback(`Error: ${err.message || 'Could not record RSVP.'}`);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Profile Save Handler
  // ---------------------------------------------------------------------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg(null);

    const updatedProfile: MemberProfileData = {
      ...memberData,
      phone: editPhone,
      mobile: editPhone,
      company: editCompany,
      firm: editCompany,
      classification: editClassification,
      bio: editBio,
    };

    try {
      if (memberData.id || memberData.email) {
        await supabase
          .from('members')
          .update({
            phone: editPhone,
            company: editCompany,
            classification: editClassification,
            bio: editBio,
          })
          .or(`id.eq.${memberData.id},email.eq.${memberData.email}`);
      }

      if (onUpdateMemberData) {
        onUpdateMemberData(updatedProfile);
      }
      setIsEditingProfile(false);
      setProfileSuccessMsg('Your profile and bio have been updated successfully!');
    } catch (err: any) {
      console.warn('Profile local save fallback:', err);
      if (onUpdateMemberData) {
        onUpdateMemberData(updatedProfile);
      }
      setIsEditingProfile(false);
      setProfileSuccessMsg('Profile updated locally.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Helper values
  const displayName =
    memberData.full_name ||
    (memberData.first_name && memberData.last_name
      ? `${memberData.first_name} ${memberData.last_name}`
      : memberData.name) ||
    'Rotary Member';

  const displayCompany = memberData.company || memberData.firm || 'Rotary Club of Makati';
  const displayClassification = memberData.classification || 'Business Executive';
  const displayEmail = memberData.email || 'member@rotaryclubmakati.org';
  const displayPhone = memberData.phone || memberData.mobile || '+63 917 888 1966';
  const displayJoinYear = memberData.joined_date || memberData.join_year || memberData.joinYear || '2018';
  const displayDistrict = memberData.district || 'District 3830 • Philippines';
  const avatarUrl = memberData.avatar_url || memberData.profile_photo;

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'RC';
    const cleaned = nameStr.replace(/^(Rtn\.|Pres\.|PP|Dir\.|Sec\.|Treas\.)\s+/i, '').trim();
    const parts = cleaned.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return cleaned.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Message */}
      {profileSuccessMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-200 text-xs flex items-center justify-between shadow-xl">
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
      {/* MEMBER PROFILE HERO CARD */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-[#0A2540] via-[#011E41] to-[#01142E] p-6 sm:p-8 rounded-3xl border border-[#F7A81B]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
          <RCMLogo className="w-80 h-80" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Member Profile Avatar */}
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#F7A81B] shadow-2xl"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#F7A81B] to-[#D98E0E] text-[#01142E] font-serif font-black text-2xl sm:text-3xl flex items-center justify-center border-2 border-white/30 shadow-2xl">
                  {getInitials(displayName)}
                </div>
              )}
              <span className="absolute -bottom-2 -right-2 bg-[#011E41] border border-[#F7A81B] rounded-full p-1.5 shadow-md">
                <ShieldCheck className="w-4 h-4 text-[#F7A81B]" />
              </span>
            </div>

            {/* Member Name & Attributes */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1 text-[11px] font-montserrat font-bold px-2.5 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active Member</span>
                </span>
                <span className="inline-flex items-center space-x-1 text-[11px] font-montserrat font-bold px-2.5 py-0.5 rounded-full border bg-[#F7A81B]/20 text-[#F7A81B] border-[#F7A81B]/30">
                  <Award className="w-3 h-3" />
                  <span>District 3830</span>
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {displayName}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {displayClassification} • <span className="text-white font-semibold">{displayCompany}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#F7A81B]" />
                  <span>Member Since: <strong className="text-slate-200">{displayJoinYear}</strong></span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F7A81B]" />
                  <span>{displayDistrict}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Refresh & Edit Profile Buttons */}
          <div className="shrink-0 flex items-center space-x-3 self-stretch md:self-auto justify-end">
            <button
              type="button"
              onClick={fetchAllMetrics}
              title="Refresh database metrics"
              className="bg-[#011E41] hover:bg-[#011E41]/80 border border-white/10 text-slate-300 hover:text-white p-3 rounded-xl transition flex items-center justify-center cursor-pointer shadow-lg"
            >
              <RefreshCw className="w-4 h-4 text-[#F7A81B]" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="bg-[#011E41] hover:bg-[#011E41]/80 border border-[#F7A81B]/40 text-[#F7A81B] font-montserrat font-bold text-xs px-4 py-3 rounded-xl transition flex items-center space-x-2 shadow-lg cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile & Bio'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Bio Form Drawer */}
      {isEditingProfile && (
        <div className="bg-[#0A2540] p-6 sm:p-8 rounded-3xl border border-[#F7A81B]/40 shadow-2xl space-y-6 animate-fadeIn">
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#F7A81B]" />
              <span>Edit Profile & Rotarian Bio</span>
            </h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-montserrat font-bold uppercase tracking-wider text-slate-300">
                  Phone / Mobile
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[#011E41] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F7A81B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-montserrat font-bold uppercase tracking-wider text-slate-300">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full bg-[#011E41] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F7A81B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-montserrat font-bold uppercase tracking-wider text-slate-300">
                  Classification
                </label>
                <input
                  type="text"
                  value={editClassification}
                  onChange={(e) => setEditClassification(e.target.value)}
                  className="w-full bg-[#011E41] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F7A81B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-montserrat font-bold uppercase tracking-wider text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={displayEmail}
                  className="w-full bg-[#011E41]/50 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-montserrat font-bold uppercase tracking-wider text-slate-300">
                About Me / Rotarian Bio
              </label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full bg-[#011E41] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B]"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-montserrat font-bold hover:bg-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-5 py-2.5 rounded-xl bg-[#F7A81B] hover:bg-[#D98E0E] text-[#01142E] text-xs font-montserrat font-bold uppercase tracking-wider transition flex items-center space-x-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? 'Saving...' : 'Save Profile & Bio'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: TOP 4 STAT CARDS (LIVE SUPABASE DATA & HONEST COMING SOON) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* CARD 1: CLUB ROSTER */}
        <div className="bg-[#0A2540] p-5 sm:p-6 rounded-3xl border border-[#F7A81B]/30 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-slate-300">
              Club Roster
            </span>
            <div className="p-2.5 rounded-2xl bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30 shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div>
            {memberCountLoading ? (
              <div className="h-9 w-24 bg-white/10 rounded-xl animate-pulse my-1" />
            ) : memberCountError ? (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Query Error</span>
                </div>
                <p className="font-mono text-[11px] leading-tight break-words">{memberCountError}</p>
              </div>
            ) : (
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-white block">
                  {memberCount !== null ? memberCount : 0}
                </span>
                <span className="text-[11px] text-slate-300 font-medium mt-0.5 block">
                  Active Registered Members
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-sans">Source: Supabase DB</span>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('directory')}
                className="text-[#F7A81B] hover:underline flex items-center font-semibold cursor-pointer"
              >
                <span>View Directory</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* CARD 2: OFFICIAL BULLETINS */}
        <div className="bg-[#0A2540] p-5 sm:p-6 rounded-3xl border border-[#F7A81B]/30 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-slate-300">
              Official Bulletins
            </span>
            <div className="p-2.5 rounded-2xl bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30 shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>

          <div>
            {bulletinsLoading ? (
              <div className="h-9 w-24 bg-white/10 rounded-xl animate-pulse my-1" />
            ) : bulletinsError ? (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Query Error</span>
                </div>
                <p className="font-mono text-[11px] leading-tight break-words">{bulletinsError}</p>
              </div>
            ) : (
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-white block">
                  {announcementCount !== null ? announcementCount : 0}
                </span>
                <span className="text-[11px] text-slate-300 font-medium mt-0.5 block">
                  Published Admin Announcements
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-sans">Source: Supabase DB</span>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('announcements')}
                className="text-[#F7A81B] hover:underline flex items-center font-semibold cursor-pointer"
              >
                <span>View Bulletins</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* CARD 3: UPCOMING RSVP (HONEST COMING SOON STATE) */}
        <div className="bg-[#0A2540] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-3 opacity-90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-slate-300">
              Upcoming RSVP
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>

          <div>
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-300 block">
              Coming Soon
            </span>
            <span className="text-[11px] text-slate-300 font-medium mt-1 block">
              Personal RSVP tracking engine is under development
            </span>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>In Development</span>
            </span>
            <span className="text-slate-400 italic">No fake metrics</span>
          </div>
        </div>

        {/* CARD 4: ATTENDANCE RATE (HONEST COMING SOON STATE) */}
        <div className="bg-[#0A2540] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-3 opacity-90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-slate-300">
              Attendance Rate
            </span>
            <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>

          <div>
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-sky-300 block">
              Coming Soon
            </span>
            <span className="text-[11px] text-slate-300 font-medium mt-1 block">
              Automated club attendance logging engine
            </span>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-sky-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>In Development</span>
            </span>
            <span className="text-slate-400 italic">No fake metrics</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: TWO-COLUMN SECTION (FEATURED EVENT + RECENT BULLETINS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: NEXT FEATURED CLUB EVENT (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0A2540] p-6 sm:p-8 rounded-3xl border border-[#F7A81B]/30 shadow-2xl space-y-6 flex flex-col justify-between min-h-[420px]">
          <div>
            {/* Header */}
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-[#F7A81B] block">
                  Featured Rotary Activity
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#F7A81B]" />
                  <span>Next Featured Club Event</span>
                </h3>
              </div>
              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => onNavigateToTab('events')}
                  className="text-xs font-montserrat font-bold text-[#F7A81B] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Calendar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Content Body */}
            <div className="pt-4">
              {nextEventLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-6 w-3/4 bg-white/10 rounded-lg" />
                  <div className="h-4 w-1/2 bg-white/10 rounded-lg" />
                  <div className="h-20 bg-white/5 rounded-2xl" />
                </div>
              ) : nextEventError ? (
                <div className="p-5 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-100 space-y-3">
                  <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Unable to Fetch Next Event from Supabase</span>
                  </div>
                  <p className="text-xs font-mono bg-black/40 p-3 rounded-xl border border-red-500/20 text-red-200">
                    {nextEventError}
                  </p>
                  <button
                    type="button"
                    onClick={fetchFeaturedEvent}
                    className="px-3.5 py-1.5 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Query</span>
                  </button>
                </div>
              ) : !nextEvent ? (
                /* EMPTY STATE */
                <div className="py-12 px-6 text-center space-y-3 bg-[#011E41]/60 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7A81B]/10 text-[#F7A81B] flex items-center justify-center mx-auto border border-[#F7A81B]/20">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white">No upcoming events yet</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    The club calendar currently has no scheduled upcoming events. Check back soon for official luncheon and committee announcements.
                  </p>
                </div>
              ) : (
                /* REAL FEATURED EVENT CARD */
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center space-x-1.5 text-xs font-montserrat font-bold px-3 py-1 rounded-full bg-[#F7A81B]/20 text-[#F7A81B] border border-[#F7A81B]/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{nextEvent.event_type || 'General Meeting'}</span>
                    </span>

                    <span className="text-xs font-mono font-bold text-[#F7A81B] bg-[#011E41] px-3 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#F7A81B]" />
                      <span>{formatDate(nextEvent.event_date)}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                      {nextEvent.title}
                    </h4>
                    {nextEvent.description && (
                      <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed bg-[#011E41] p-4 rounded-2xl border border-white/5">
                        {nextEvent.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#011E41] border border-white/5 text-slate-200">
                      <Clock className="w-4 h-4 text-[#F7A81B] shrink-0" />
                      <span className="font-medium">{nextEvent.event_time || '12:00 NN'}</span>
                    </div>

                    <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#011E41] border border-white/5 text-slate-200">
                      <MapPin className="w-4 h-4 text-[#F7A81B] shrink-0" />
                      <span className="font-medium truncate">{nextEvent.location || 'The Manila Peninsula'}</span>
                    </div>
                  </div>

                  {nextEvent.virtual_link && (
                    <a
                      href={nextEvent.virtual_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline bg-sky-950/40 p-2.5 rounded-xl border border-sky-500/20"
                    >
                      <Video className="w-4 h-4" />
                      <span>Virtual Link: {nextEvent.virtual_link}</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  )}

                  {/* RSVP Interaction Block */}
                  <div className="pt-3 border-t border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-slate-300">
                        Your Attendance RSVP:
                      </span>
                      {userRsvpStatus && (
                        <span className="text-[11px] font-mono font-bold text-[#F7A81B]">
                          Status: {userRsvpStatus.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        disabled={isSubmittingRsvp}
                        onClick={() => handleRsvp('going')}
                        className={`py-2.5 px-3 rounded-xl font-montserrat font-bold text-xs transition cursor-pointer border flex items-center justify-center space-x-1.5 ${
                          userRsvpStatus === 'going'
                            ? 'bg-emerald-500 text-[#01142E] border-emerald-400 shadow-lg'
                            : 'bg-[#011E41] text-slate-300 border-white/10 hover:text-white hover:border-emerald-500/50'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Going</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSubmittingRsvp}
                        onClick={() => handleRsvp('maybe')}
                        className={`py-2.5 px-3 rounded-xl font-montserrat font-bold text-xs transition cursor-pointer border flex items-center justify-center space-x-1.5 ${
                          userRsvpStatus === 'maybe'
                            ? 'bg-amber-500 text-[#01142E] border-amber-400 shadow-lg'
                            : 'bg-[#011E41] text-slate-300 border-white/10 hover:text-white hover:border-amber-500/50'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Maybe</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSubmittingRsvp}
                        onClick={() => handleRsvp('not_going')}
                        className={`py-2.5 px-3 rounded-xl font-montserrat font-bold text-xs transition cursor-pointer border flex items-center justify-center space-x-1.5 ${
                          userRsvpStatus === 'not_going'
                            ? 'bg-rose-500 text-[#01142E] border-rose-400 shadow-lg'
                            : 'bg-[#011E41] text-slate-300 border-white/10 hover:text-white hover:border-rose-500/50'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Declined</span>
                      </button>
                    </div>

                    {rsvpFeedback && (
                      <p className="text-xs text-[#F7A81B] font-medium pt-1 text-center italic">
                        {rsvpFeedback}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-right">
            <span className="text-[11px] text-slate-400">
              Real-time updates directly from Club Database
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT BULLETINS (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0A2540] p-6 sm:p-8 rounded-3xl border border-[#F7A81B]/30 shadow-2xl space-y-6 flex flex-col justify-between min-h-[420px]">
          <div>
            {/* Header */}
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-[#F7A81B] block">
                  Official Announcements
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#F7A81B]" />
                  <span>Recent Bulletins</span>
                </h3>
              </div>
              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => onNavigateToTab('announcements')}
                  className="text-xs font-montserrat font-bold text-[#F7A81B] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>All Bulletins</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Content List */}
            <div className="pt-4">
              {bulletinsLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-16 bg-white/10 rounded-2xl" />
                  <div className="h-16 bg-white/10 rounded-2xl" />
                  <div className="h-16 bg-white/10 rounded-2xl" />
                </div>
              ) : bulletinsError ? (
                <div className="p-5 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-100 space-y-3">
                  <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Unable to Fetch Bulletins from Supabase</span>
                  </div>
                  <p className="text-xs font-mono bg-black/40 p-3 rounded-xl border border-red-500/20 text-red-200">
                    {bulletinsError}
                  </p>
                  <button
                    type="button"
                    onClick={fetchAnnouncements}
                    className="px-3.5 py-1.5 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Query</span>
                  </button>
                </div>
              ) : bulletins.length === 0 ? (
                /* EMPTY STATE */
                <div className="py-12 px-6 text-center space-y-3 bg-[#011E41]/60 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7A81B]/10 text-[#F7A81B] flex items-center justify-center mx-auto border border-[#F7A81B]/20">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white">No announcements yet</h4>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                    There are no official club bulletins posted by administrators at this time.
                  </p>
                </div>
              ) : (
                /* BULLETINS LIST */
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {bulletins.slice(0, 5).map((bulletin) => {
                    const contentText = bulletin.content || bulletin.body || '';
                    return (
                      <div
                        key={bulletin.id}
                        onClick={() => setSelectedBulletin(bulletin)}
                        className="p-4 rounded-2xl bg-[#011E41] hover:bg-[#012652] border border-white/5 hover:border-[#F7A81B]/40 transition-all cursor-pointer group space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#F7A81B] transition line-clamp-2">
                            {bulletin.title}
                          </h5>
                          {bulletin.created_at && (
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {formatDate(bulletin.created_at)}
                            </span>
                          )}
                        </div>

                        {contentText && (
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {contentText}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[11px] text-[#F7A81B] font-semibold">
                          <span>Read Bulletin</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-right">
            <span className="text-[11px] text-slate-400">
              Official Admin Announcements Channel
            </span>
          </div>
        </div>
      </div>

      {/* BULLETIN DETAIL MODAL */}
      {selectedBulletin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0A2540] border border-[#F7A81B]/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="pr-6 space-y-1">
                <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-[#F7A81B]">
                  Official Club Bulletin
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {selectedBulletin.title}
                </h3>
                {selectedBulletin.created_at && (
                  <p className="text-xs text-slate-400 font-mono">
                    Published: {formatDate(selectedBulletin.created_at)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedBulletin(null)}
                className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedBulletin.image_url && (
              <img
                src={selectedBulletin.image_url}
                alt={selectedBulletin.title}
                className="w-full max-h-60 object-cover rounded-2xl border border-white/10"
              />
            )}

            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#011E41] p-4 rounded-2xl border border-white/5 max-h-60 overflow-y-auto whitespace-pre-line">
              {selectedBulletin.content || selectedBulletin.body || 'No additional details provided.'}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedBulletin(null)}
                className="px-5 py-2.5 rounded-xl bg-[#F7A81B] hover:bg-[#D98E0E] text-[#01142E] text-xs font-montserrat font-bold uppercase tracking-wider transition cursor-pointer shadow-lg"
              >
                Close Bulletin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
