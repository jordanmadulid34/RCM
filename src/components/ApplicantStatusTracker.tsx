import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Video,
  Download,
  AlertCircle,
  ChevronRight,
  Send,
  XCircle,
  Info,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { SubmittedApplication } from '../data/rcmMemberData';
import {
  getSavedApplications,
  updateApplicationDetails,
} from '../services/notificationService';
import { calculateInterviewWeek, formatReadableDate, formatReadableTime } from '../utils/dateUtils';
import { downloadInterviewInvitationPDF } from '../utils/pdfGenerator';

interface ApplicantStatusTrackerProps {
  theme?: 'dark' | 'light';
  initialRefId?: string;
}

export const ApplicantStatusTracker: React.FC<ApplicantStatusTrackerProps> = ({
  theme = 'dark',
  initialRefId = '',
}) => {
  const isDark = theme === 'dark';

  const [searchRef, setSearchRef] = useState<string>(initialRefId);
  const [matchedApp, setMatchedApp] = useState<SubmittedApplication | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [allApps, setAllApps] = useState<SubmittedApplication[]>([]);

  // Reschedule Modal state
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState<boolean>(false);
  const [rescheduleReason, setRescheduleReason] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  useEffect(() => {
    const apps = getSavedApplications();
    setAllApps(apps);
    if (initialRefId) {
      handleSearch(initialRefId, apps);
    }
  }, [initialRefId]);

  const handleSearch = (query: string, appList: SubmittedApplication[] = allApps) => {
    setHasSearched(true);
    setActionSuccessMsg('');
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setMatchedApp(null);
      return;
    }

    const found = appList.find(
      (app) =>
        app.id.toLowerCase() === trimmed ||
        app.email.toLowerCase() === trimmed
    );
    setMatchedApp(found || null);
  };

  const handleConfirmAttendance = () => {
    if (!matchedApp) return;

    const updatedList = updateApplicationDetails(matchedApp.id, {
      status: 'Interview Confirmed',
      attendanceStatus: 'Confirmed',
    });

    const refreshed = updatedList.find((a) => a.id === matchedApp.id) || null;
    setMatchedApp(refreshed);
    setAllApps(updatedList);
    setActionSuccessMsg('Your interview attendance has been successfully confirmed! We look forward to meeting you.');
  };

  const handleSubmitRescheduleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedApp) return;

    if (!rescheduleReason.trim()) {
      alert('Please state the reason for your reschedule request.');
      return;
    }

    const updatedList = updateApplicationDetails(matchedApp.id, {
      status: 'Rescheduled',
      attendanceStatus: 'Reschedule Requested',
      rescheduleReason,
      reschedulePreferredDate: preferredDate,
    });

    const refreshed = updatedList.find((a) => a.id === matchedApp.id) || null;
    setMatchedApp(refreshed);
    setAllApps(updatedList);
    setIsRescheduleModalOpen(false);
    setActionSuccessMsg('Your reschedule request has been submitted to the Secretariat. Our team will contact you shortly.');
  };

  // Status Pipeline Steps
  const getStepState = (app: SubmittedApplication, stepIndex: number) => {
    const statusMap: Record<string, number> = {
      'Pending Review': 1,
      'Under Review': 2,
      'Contacted': 2,
      'Approved for Interview': 3,
      'Interview Scheduled': 4,
      'Rescheduled': 4,
      'Interview Confirmed': 5,
      'Interview Completed': 6,
      'Accepted': 7,
      'Approved': 7,
    };

    const currentStep = statusMap[app.status] || 1;
    if (app.status === 'Rejected' || app.status === 'Cancelled') {
      return 'error';
    }
    if (currentStep > stepIndex) return 'completed';
    if (currentStep === stepIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl border shadow-xl space-y-8 ${
        isDark
          ? 'bg-[#1E293B] border-slate-700 text-slate-100'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/15 px-3 py-1 rounded-full border border-[#F7A81B]/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F7A81B]" />
            <span>Real-time Candidate Portal</span>
          </div>
          <h2 className={`font-serif text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-[#011E41]'}`}>
            Application Status & Interview Tracker
          </h2>
          <p className={`text-xs sm:text-sm font-sans mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Track your membership application status, review interview details, confirm attendance, or download your invitation.
          </p>
        </div>

        {/* Demo Reference Quick-Pills for Instant Testing */}
        <div className="space-y-1 text-right">
          <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-[#F7A81B] block">
            Test Demo Ref IDs:
          </span>
          <div className="flex flex-wrap gap-2 justify-end">
            {allApps.slice(0, 3).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setSearchRef(a.id);
                  handleSearch(a.id);
                }}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-[#F7A81B] hover:text-[#011E41] border-slate-700 text-slate-200'
                    : 'bg-slate-100 hover:bg-[#F7A81B] hover:text-[#011E41] border-slate-300 text-slate-800'
                }`}
              >
                {a.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(searchRef);
        }}
        className="flex flex-col sm:flex-row gap-3 max-w-2xl"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#F7A81B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            placeholder="Enter Reference ID (e.g., RCM-APP-2026-8794) or Email..."
            className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#F7A81B] ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-white'
                : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>
        <button
          type="submit"
          className="bg-[#F7A81B] hover:bg-[#E5980E] text-[#011E41] font-montserrat font-bold text-xs uppercase px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer shrink-0 flex items-center justify-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>Track Status</span>
        </button>
      </form>

      {/* Action Notification Message */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-sans flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* RESULT SECTION */}
      {hasSearched && (
        <>
          {!matchedApp ? (
            <div className="p-8 text-center rounded-3xl border border-dashed border-white/20 space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold">Application Not Found</h3>
              <p className="text-xs opacity-80 max-w-md mx-auto">
                No application matches <strong>"{searchRef}"</strong>. Please check your Reference ID or email address, or contact the Secretariat at (632) 8997863.
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              {/* Applicant Card Summary Header */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#011E41] via-[#022A5C] to-[#011E41] border border-[#F7A81B]/40 text-[#F5F1E6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#F7A81B] uppercase block">
                    REF ID: {matchedApp.id} • Submitted {matchedApp.submittedAt}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    {matchedApp.fullName}
                  </h3>
                  <p className="text-xs opacity-90">
                    {matchedApp.classification || 'Business & Professional Classification'} • {matchedApp.company || 'N/A'}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider opacity-70">
                    Current Application Status
                  </span>
                  <span className={`px-4 py-1.5 rounded-full font-montserrat font-extrabold text-xs uppercase shadow-md ${
                    matchedApp.status === 'Approved for Interview' || matchedApp.status === 'Interview Scheduled' || matchedApp.status === 'Interview Confirmed'
                      ? 'bg-emerald-500 text-white'
                      : matchedApp.status === 'Rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-[#F7A81B] text-[#011E41]'
                  }`}>
                    {matchedApp.status}
                  </span>
                </div>
              </div>

              {/* Status Pipeline Step Progress Bar */}
              <div className="p-6 rounded-3xl border bg-black/20 border-white/10 space-y-4">
                <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#F7A81B] block">
                  Application Lifecycle Progress:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { step: 1, label: 'Submitted' },
                    { step: 2, label: 'Under Review' },
                    { step: 3, label: 'Approved' },
                    { step: 4, label: 'Scheduled' },
                    { step: 5, label: 'Confirmed' },
                    { step: 6, label: 'Completed' },
                  ].map((s) => {
                    const state = getStepState(matchedApp, s.step);
                    return (
                      <div
                        key={s.step}
                        className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                          state === 'completed' || state === 'active'
                            ? 'bg-[#F7A81B]/20 border-[#F7A81B] text-[#F7A81B]'
                            : state === 'error'
                            ? 'bg-red-500/20 border-red-500 text-red-400'
                            : 'bg-white/5 border-white/10 opacity-50'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold uppercase opacity-80">
                          Step {s.step}
                        </div>
                        <div className="text-xs font-montserrat font-bold truncate">
                          {s.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* INTERVIEW DETAILS CARD (if approved or scheduled) */}
              {(matchedApp.status === 'Approved for Interview' ||
                matchedApp.status === 'Interview Scheduled' ||
                matchedApp.status === 'Interview Confirmed' ||
                matchedApp.status === 'Rescheduled') && (
                <div className="p-6 sm:p-8 rounded-3xl border border-[#F7A81B]/50 bg-gradient-to-b from-[#011E41]/80 to-[#01142B] space-y-6 shadow-2xl">
                  {/* Interview Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F7A81B]/30 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#F7A81B] text-[#011E41] flex items-center justify-center font-bold">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-montserrat font-bold text-[#F7A81B] block">
                          DYNAMIC INTERVIEW WEEK
                        </span>
                        <h4 className="font-serif font-bold text-xl text-white">
                          {matchedApp.interviewWeek || calculateInterviewWeek()}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => downloadInterviewInvitationPDF(matchedApp)}
                      className="bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2 shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Invitation PDF</span>
                    </button>
                  </div>

                  {/* Interview Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1">
                      <span className="text-[10px] uppercase font-montserrat font-bold text-[#F7A81B] block">
                        Assigned Date
                      </span>
                      <span className="font-bold text-sm block">
                        {formatReadableDate(matchedApp.interviewDate)}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1">
                      <span className="text-[10px] uppercase font-montserrat font-bold text-[#F7A81B] block">
                        Assigned Time
                      </span>
                      <span className="font-bold text-sm block">
                        {formatReadableTime(matchedApp.interviewTime)}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1">
                      <span className="text-[10px] uppercase font-montserrat font-bold text-[#F7A81B] block">
                        Interview Format
                      </span>
                      <span className="font-bold text-sm block flex items-center space-x-1">
                        {matchedApp.interviewType === 'Face-to-Face' ? (
                          <MapPin className="w-4 h-4 text-[#F7A81B]" />
                        ) : (
                          <Video className="w-4 h-4 text-[#F7A81B]" />
                        )}
                        <span>{matchedApp.interviewType || 'Face-to-Face'}</span>
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1 sm:col-span-2">
                      <span className="text-[10px] uppercase font-montserrat font-bold text-[#F7A81B] block">
                        Location / Access Link
                      </span>
                      {matchedApp.venue && (
                        <p className="font-medium text-xs leading-snug">
                          📍 {matchedApp.venue}
                        </p>
                      )}
                      {matchedApp.meetingLink && (
                        <a
                          href={matchedApp.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 font-mono underline block truncate hover:text-sky-300"
                        >
                          🔗 {matchedApp.meetingLink}
                        </a>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1">
                      <span className="text-[10px] uppercase font-montserrat font-bold text-[#F7A81B] block">
                        Attendance Status
                      </span>
                      <span className={`font-montserrat font-bold text-xs uppercase inline-block px-2.5 py-0.5 rounded-full ${
                        matchedApp.attendanceStatus === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {matchedApp.attendanceStatus || 'Pending Confirmation'}
                      </span>
                    </div>
                  </div>

                  {/* Candidate Preparation Instructions */}
                  {matchedApp.instructions && (
                    <div className="p-4 rounded-2xl bg-[#F7A81B]/10 border border-[#F7A81B]/30 space-y-1 text-xs">
                      <span className="font-montserrat font-bold uppercase text-[#F7A81B] text-[10px] block">
                        Preparation Instructions from Secretariat:
                      </span>
                      <p className="opacity-90 leading-relaxed italic">
                        "{matchedApp.instructions}"
                      </p>
                    </div>
                  )}

                  {/* Interactive Action Controls */}
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs opacity-80">
                      Please confirm whether you can attend the assigned interview schedule.
                    </div>

                    <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                      {matchedApp.attendanceStatus !== 'Confirmed' && (
                        <button
                          type="button"
                          onClick={handleConfirmAttendance}
                          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-montserrat font-bold text-xs uppercase px-5 py-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm Attendance</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setIsRescheduleModalOpen(true)}
                        className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-[#F5F1E6] font-montserrat font-bold text-xs uppercase px-5 py-3 rounded-xl border border-white/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Request Reschedule</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* RESCHEDULE REQUEST MODAL */}
      {isRescheduleModalOpen && matchedApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsRescheduleModalOpen(false)}
        >
          <div
            className={`relative w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-5 ${
              isDark ? 'bg-[#01142B] border-[#F7A81B]/50 text-[#F5F1E6]' : 'bg-white border-[#011E41]/20 text-[#011E41]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#F7A81B]">
                  Request Schedule Adjustment
                </h3>
                <p className="text-xs opacity-80 mt-0.5">
                  Ref: {matchedApp.id} • {matchedApp.fullName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsRescheduleModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-[#F7A81B]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRescheduleRequest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Preferred Date to Reschedule *
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    isDark ? 'bg-[#121212] border-white/20 text-[#F5F1E6]' : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Reason for Adjustment *
                </label>
                <textarea
                  required
                  rows={3}
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Please state why you are requesting a schedule change..."
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    isDark ? 'bg-[#121212] border-white/20 text-[#F5F1E6]' : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Reschedule Request</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
