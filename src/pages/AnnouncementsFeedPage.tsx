import React, { useState, useEffect } from 'react';
import { PageView, Announcement, AnnouncementCategory } from '../types';
import {
  AnnouncementService,
  CATEGORY_CONFIG,
  ANNOUNCEMENTS_MIGRATION_SQL,
} from '../lib/announcements';
import {
  Megaphone,
  Calendar,
  Building2,
  HeartHandshake,
  CalendarClock,
  ShieldAlert,
  UserCheck,
  Clock,
  Code2,
  X,
  CheckCircle2,
  AlertCircle,
  Filter,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface AnnouncementsFeedPageProps {
  onNavigate: (page: PageView) => void;
  currentUser?: { role: string; name: string } | null;
}

export const AnnouncementsFeedPage: React.FC<AnnouncementsFeedPageProps> = ({
  onNavigate,
  currentUser,
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = () => {
    // Only fetches published, non-expired announcements for public feed
    const items = AnnouncementService.getPublicAnnouncements();
    setAnnouncements(items);
  };

  const filteredItems = announcements.filter(
    (item) => selectedCategory === 'ALL' || item.category === selectedCategory
  );

  const getCategoryIcon = (cat: AnnouncementCategory) => {
    switch (cat) {
      case 'club_business':
        return <Building2 className="w-4 h-4" />;
      case 'project_update':
        return <HeartHandshake className="w-4 h-4" />;
      case 'event_reminder':
        return <CalendarClock className="w-4 h-4" />;
      case 'board_notice':
        return <ShieldAlert className="w-4 h-4" />;
      case 'membership_update':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Megaphone className="w-4 h-4" />;
    }
  };

  const copyMigrationSql = () => {
    navigator.clipboard.writeText(ANNOUNCEMENTS_MIGRATION_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#011735] text-[#1A1F2B] dark:text-[#F5F1E6] py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-[#17458F] text-white p-8 sm:p-12 rounded-2xl shadow-xl border-b-4 border-[#F7A81B] relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7A81B]/20 text-[#F7A81B] rounded-md text-xs font-bold border border-[#F7A81B]/40">
                <Megaphone className="w-3.5 h-3.5" />
                <span>Rotary Club of Makati • Official Bulletins</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSqlModal(true)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md text-xs font-mono font-semibold transition flex items-center gap-1.5 border border-white/20"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#F7A81B]" />
                  <span>View Supabase Migration & RLS</span>
                </button>

                {(currentUser?.role === 'ADMIN' ||
                  currentUser?.role === 'OFFICER' ||
                  currentUser?.role === 'PAST_PRESIDENT') && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="px-3 py-1.5 bg-[#F7A81B] text-[#1A1F2B] hover:bg-amber-400 font-bold rounded-md text-xs transition flex items-center gap-1 shadow-md"
                  >
                    <span>Manage Announcements →</span>
                  </button>
                )}
              </div>
            </div>

            <h1 className="font-display text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight break-words [word-break:break-word] max-w-full">
              Club Announcements & Official Notices
            </h1>
            <p className="text-slate-200 text-xs sm:text-base max-w-3xl leading-relaxed break-words [word-break:break-word] max-w-full">
              Timely updates, board directives, event deadlines, and project milestones verified by the officers and board of directors of District 3830.
            </p>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="bg-white dark:bg-[#00224D] p-4 rounded-xl border border-slate-200 dark:border-blue-900/50 shadow-sm flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-md font-semibold transition whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-[#17458F] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-blue-950/60 text-[#1A1F2B] dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-blue-900/80'
              }`}
            >
              All Bulletins ({announcements.length})
            </button>

            {Object.entries(CATEGORY_CONFIG).map(([catKey, cfg]) => {
              const count = announcements.filter((a) => a.category === catKey).length;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-3.5 py-2 rounded-md font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === catKey
                      ? 'bg-[#17458F] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-blue-950/60 text-[#1A1F2B] dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-blue-900/80'
                  }`}
                >
                  {getCategoryIcon(catKey as AnnouncementCategory)}
                  <span>{cfg.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#0080C8]" />
            <span>Active Feed • Auto-expires past deadlines</span>
          </div>
        </div>

        {/* Public Feed List */}
        {filteredItems.length > 0 ? (
          <div className="space-y-6">
            {filteredItems.map((item) => {
              const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.club_business;
              const createdDate = new Date(item.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              let expiresFormatted: string | null = null;
              let isExpiringSoon = false;
              if (item.expires_at) {
                const expDate = new Date(item.expires_at);
                expiresFormatted = expDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const diffMs = expDate.getTime() - Date.now();
                if (diffMs > 0 && diffMs < 48 * 60 * 60 * 1000) {
                  isExpiringSoon = true;
                }
              }

              return (
                <article
                  key={item.id}
                  className={`bg-white dark:bg-[#00224D] rounded-xl p-6 shadow-sm border-l-4 ${config.borderColor} border-t border-r border-b border-slate-200 dark:border-blue-900/50 space-y-4 transition hover:shadow-md`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-blue-900/40 pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-extrabold flex items-center gap-1.5 ${config.badgeBg} ${config.badgeText}`}
                      >
                        {getCategoryIcon(item.category)}
                        <span>{config.label}</span>
                      </span>

                      {item.priority === 'URGENT' || item.priority === 'EMERGENCY' ? (
                        <span className="bg-[#A2001D]/10 text-[#A2001D] border border-[#A2001D]/30 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                          Urgent Notice
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span>Posted: {createdDate}</span>
                      {item.authorName && (
                        <span>• By <strong className="text-slate-800 dark:text-slate-200">{item.authorName}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1A1F2B] dark:text-white leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                      {item.body}
                    </p>
                  </div>

                  {/* Expiration Banner if present */}
                  {expiresFormatted && (
                    <div
                      className={`p-3 rounded-lg text-xs font-mono flex items-center justify-between gap-2 ${
                        isExpiringSoon
                          ? 'bg-[#A2001D]/10 border border-[#A2001D]/30 text-[#A2001D]'
                          : 'bg-slate-100 dark:bg-blue-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-blue-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CalendarClock className="w-4 h-4 shrink-0" />
                        <span>
                          <strong>Action Deadline:</strong> Drop-off / RSVP by {expiresFormatted}
                        </span>
                      </div>
                      {isExpiringSoon && (
                        <span className="font-bold uppercase tracking-wider text-[10px]">
                          Expiring Soon
                        </span>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          /* Honest Empty State */
          <div className="bg-white dark:bg-[#00224D] rounded-2xl p-12 text-center border border-slate-200 dark:border-blue-900/50 shadow-sm space-y-4 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 bg-slate-100 dark:bg-blue-900/50 text-slate-400 dark:text-slate-300 rounded-full flex items-center justify-center mx-auto">
              <Megaphone className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#1A1F2B] dark:text-white">
              No Active Announcements Found
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
              There are currently no published announcements in this category. Past notices that have exceeded their expiration dates have dropped off automatically per policy.
            </p>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className="px-4 py-2 bg-[#17458F] text-white font-bold text-xs rounded-md hover:bg-blue-900 transition"
            >
              Reset Category Filters
            </button>
          </div>
        )}
      </div>

      {/* SQL & Security Policy Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1F2B]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#00224D] max-w-3xl w-full rounded-2xl p-6 shadow-2xl border-2 border-[#17458F] space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-blue-900/50 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#17458F] dark:text-sky-400" />
                <h3 className="font-display font-bold text-lg text-[#1A1F2B] dark:text-white">
                  Supabase Database Schema & RLS Policies
                </h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This PostgreSQL migration snippet updates the <code className="bg-slate-100 dark:bg-blue-950 text-[#17458F] dark:text-sky-300 px-1 py-0.5 rounded font-mono">public.announcements</code> table schema and implements strict Row Level Security (RLS) policies.
            </p>

            <div className="bg-[#1A1F2B] text-slate-200 p-4 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed flex-1 border border-slate-800">
              <pre>{ANNOUNCEMENTS_MIGRATION_SQL}</pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={copyMigrationSql}
                className="px-4 py-2 bg-[#17458F] text-white font-bold text-xs rounded-md hover:bg-blue-900 transition flex items-center gap-1.5"
              >
                {copiedSql ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#F7A81B]" />
                    <span>SQL Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Code2 className="w-4 h-4" />
                    <span>Copy PostgreSQL Migration SQL</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-blue-900 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-md hover:bg-slate-300 dark:hover:bg-blue-800 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
