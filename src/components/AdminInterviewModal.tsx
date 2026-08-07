import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Building,
  Mail,
  Phone,
  Send,
  Download,
  History,
  Info,
} from 'lucide-react';
import { SubmittedApplication } from '../data/rcmMemberData';
import { calculateInterviewWeek, formatReadableDate, formatReadableTime } from '../utils/dateUtils';
import { downloadInterviewInvitationPDF } from '../utils/pdfGenerator';

interface AdminInterviewModalProps {
  application: SubmittedApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateApplication: (id: string, updates: Partial<SubmittedApplication>) => void;
  theme?: 'dark' | 'light';
}

export const AdminInterviewModal: React.FC<AdminInterviewModalProps> = ({
  application,
  isOpen,
  onClose,
  onUpdateApplication,
  theme = 'dark',
}) => {
  if (!isOpen || !application) return null;

  const isDark = theme === 'dark';

  // Form state
  const [interviewType, setInterviewType] = useState<'Face-to-Face' | 'Zoom' | 'Google Meet' | 'Microsoft Teams'>(
    application.interviewType || 'Face-to-Face'
  );
  const [interviewDate, setInterviewDate] = useState<string>(
    application.interviewDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );
  const [interviewTime, setInterviewTime] = useState<string>(
    application.interviewTime || '14:00'
  );
  const [venue, setVenue] = useState<string>(
    application.venue || 'Secretariat Boardroom, MRCFI Building, 8001 Camia St., Guadalupe Viejo, Makati City'
  );
  const [meetingLink, setMeetingLink] = useState<string>(
    application.meetingLink || 'https://zoom.us/j/89978631234?pwd=RCM'
  );
  const [meetingId, setMeetingId] = useState<string>(
    application.meetingId || '899 7863 1234'
  );
  const [meetingPasscode, setMeetingPasscode] = useState<string>(
    application.meetingPasscode || 'RCM2026'
  );
  const [adminRemarks, setAdminRemarks] = useState<string>(
    application.adminRemarks || ''
  );
  const [instructions, setInstructions] = useState<string>(
    application.instructions ||
      'Please arrive 10 minutes prior to scheduled time. Dress code: Business Formal / Corporate. Bring 2 valid government IDs.'
  );
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'schedule' | 'history' | 'rejection'>('schedule');
  const [isSuccessAlert, setIsSuccessAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  // Auto calculate dynamic interview week string based on interviewDate or current server date
  const computedInterviewWeek = calculateInterviewWeek(interviewDate);

  const handleApprove = () => {
    const updates: Partial<SubmittedApplication> = {
      status: 'Approved for Interview',
      approvalDate: new Date().toISOString(),
      approvedBy: 'Pres. Eduardo Francisco (Admin)',
      interviewWeek: computedInterviewWeek,
      attendanceStatus: 'Pending Confirmation',
    };
    onUpdateApplication(application.id, updates);
    triggerSuccessAlert('Application Approved! Status set to "Approved for Interview".');
  };

  const handleSaveSchedule = (newStatus: 'Interview Scheduled' | 'Rescheduled') => {
    const updates: Partial<SubmittedApplication> = {
      status: newStatus,
      interviewType,
      interviewDate,
      interviewTime,
      interviewWeek: computedInterviewWeek,
      venue: interviewType === 'Face-to-Face' ? venue : '',
      meetingLink: interviewType !== 'Face-to-Face' ? meetingLink : '',
      meetingId: interviewType !== 'Face-to-Face' ? meetingId : '',
      meetingPasscode: interviewType !== 'Face-to-Face' ? meetingPasscode : '',
      adminRemarks,
      instructions,
      attendanceStatus: application.attendanceStatus === 'Confirmed' ? 'Confirmed' : 'Pending Confirmation',
    };
    onUpdateApplication(application.id, updates);
    triggerSuccessAlert(`Interview details saved and status updated to "${newStatus}". Invitation notification dispatched!`);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please enter a reason or remark for rejecting the application.');
      return;
    }
    const updates: Partial<SubmittedApplication> = {
      status: 'Rejected',
      adminRemarks: rejectionReason,
    };
    onUpdateApplication(application.id, updates);
    triggerSuccessAlert('Application marked as Rejected.');
  };

  const handleCancelInterview = () => {
    const updates: Partial<SubmittedApplication> = {
      status: 'Cancelled',
      adminRemarks: `Interview cancelled by Admin on ${new Date().toLocaleDateString()}`,
    };
    onUpdateApplication(application.id, updates);
    triggerSuccessAlert('Interview cancelled.');
  };

  const triggerSuccessAlert = (msg: string) => {
    setAlertMessage(msg);
    setIsSuccessAlert(true);
    setTimeout(() => {
      setIsSuccessAlert(false);
    }, 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-4xl my-8 rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDark ? 'bg-[#01142B] border-[#F7A81B]/40 text-[#F5F1E6]' : 'bg-white border-[#011E41]/20 text-[#011E41]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#011E41] via-[#022A5C] to-[#011E41] text-[#F5F1E6] border-b border-[#F7A81B]/30 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-[#F7A81B] text-[#011E41] font-montserrat font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                ADMIN WORKFLOW
              </span>
              <span className="text-xs font-mono text-[#F7A81B]">
                REF: {application.id}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#F5F1E6] flex items-center space-x-2">
              <span>Membership Approval & Interview Scheduling</span>
            </h2>
            <p className="text-xs font-sans opacity-80">
              Review applicant profile, approve/reject candidates, and manage dynamic interview schedules.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#F7A81B] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {isSuccessAlert && (
          <div className="bg-emerald-500 text-white p-3 px-6 text-xs font-montserrat font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{alertMessage}</span>
            </div>
          </div>
        )}

        {/* Applicant Context Strip */}
        <div className={`p-4 px-6 border-b text-xs grid grid-cols-1 md:grid-cols-4 gap-3 ${
          isDark ? 'bg-[#011E41]/50 border-white/10' : 'bg-[#FAF8F3] border-[#011E41]/10'
        }`}>
          <div>
            <span className="text-[10px] uppercase font-montserrat font-bold opacity-60 block">Applicant Name</span>
            <span className="font-bold text-sm block">{application.fullName}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-montserrat font-bold opacity-60 block">Classification</span>
            <span className="font-semibold text-[#F7A81B] block">{application.classification || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-montserrat font-bold opacity-60 block">Company / Organization</span>
            <span className="font-medium block">{application.company || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-montserrat font-bold opacity-60 block">Current Status</span>
            <span className={`inline-block font-montserrat font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase mt-0.5 ${
              application.status === 'Approved for Interview' || application.status === 'Interview Scheduled' || application.status === 'Interview Confirmed'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : application.status === 'Rejected'
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-[#F7A81B]/20 text-[#F7A81B] border border-[#F7A81B]/40'
            }`}>
              {application.status}
            </span>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className={`flex border-b text-xs font-montserrat font-bold ${
          isDark ? 'border-white/10 bg-black/20' : 'border-[#011E41]/10 bg-gray-50'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'schedule'
                ? 'border-[#F7A81B] text-[#F7A81B] bg-white/5'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule & Approval</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'history'
                ? 'border-[#F7A81B] text-[#F7A81B] bg-white/5'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail & History ({application.interviewHistory?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rejection')}
            className={`px-6 py-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'rejection'
                ? 'border-red-500 text-red-400 bg-red-500/5'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <XCircle className="w-4 h-4 text-red-400" />
            <span>Reject / Cancel</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* Dynamic Interview Week Display Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#011E41] via-[#022A5C] to-[#011E41] border border-[#F7A81B]/40 text-[#F5F1E6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-[#F7A81B] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-montserrat font-bold text-[#F7A81B] block">
                      DYNAMICALLY COMPUTED INTERVIEW WEEK
                    </span>
                    <span className="font-serif font-bold text-lg text-white">
                      {computedInterviewWeek}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-mono opacity-80 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                  Calculated from Date: {interviewDate}
                </div>
              </div>

              {/* Status Action Buttons Bar */}
              <div className="p-4 rounded-2xl border bg-black/20 border-white/10 space-y-3">
                <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#F7A81B] block">
                  Quick Approval Actions:
                </span>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-montserrat font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve for Interview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveSchedule('Interview Scheduled')}
                    className="bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Save & Schedule Interview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadInterviewInvitationPDF({ ...application, interviewDate, interviewTime, interviewType, venue, meetingLink, meetingId, meetingPasscode, instructions, adminRemarks })}
                    className="bg-white/10 hover:bg-white/20 text-[#F5F1E6] font-montserrat font-bold text-xs uppercase px-4 py-2.5 rounded-xl border border-white/20 transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Invitation PDF</span>
                  </button>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Interview Format / Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                    Interview Type / Format *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Face-to-Face', 'Zoom', 'Google Meet', 'Microsoft Teams'] as const).map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setInterviewType(type)}
                        className={`p-2.5 rounded-xl border text-xs font-montserrat font-bold transition-all flex items-center space-x-2 ${
                          interviewType === type
                            ? 'bg-[#F7A81B] text-[#011E41] border-[#F7A81B]'
                            : isDark
                            ? 'bg-[#121212] border-white/10 text-white/80 hover:bg-white/10'
                            : 'bg-gray-100 border-gray-300 text-gray-800'
                        }`}
                      >
                        {type === 'Face-to-Face' ? <MapPin className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                        <span className="truncate">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                    Assigned Interview Date *
                  </label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className={`w-full p-3 rounded-xl border text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#F7A81B] ${
                      isDark ? 'bg-[#121212] border-white/20 text-[#F5F1E6]' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                  <span className="text-[10px] opacity-70 block pt-0.5">
                    {formatReadableDate(interviewDate)}
                  </span>
                </div>

                {/* Time Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                    Assigned Time (24h or 12h) *
                  </label>
                  <input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className={`w-full p-3 rounded-xl border text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#F7A81B] ${
                      isDark ? 'bg-[#121212] border-white/20 text-[#F5F1E6]' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                  <span className="text-[10px] opacity-70 block pt-0.5">
                    Formatted: {formatReadableTime(interviewTime)}
                  </span>
                </div>

                {/* Attendance Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                    Applicant Attendance Status
                  </label>
                  <div className={`p-3 rounded-xl border text-xs font-montserrat font-bold flex items-center justify-between ${
                    application.attendanceStatus === 'Confirmed'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : application.attendanceStatus === 'Reschedule Requested'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  }`}>
                    <span>{application.attendanceStatus || 'Pending Confirmation'}</span>
                    {application.rescheduleReason && (
                      <span className="text-[10px] opacity-80 italic">(Reason submitted)</span>
                    )}
                  </div>
                </div>

                {/* Venue for Face-to-Face */}
                {interviewType === 'Face-to-Face' ? (
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                      Physical Venue Location *
                    </label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g. Secretariat Boardroom, MRCFI Building..."
                      className={`w-full p-3 rounded-xl border text-xs font-sans ${
                        isDark ? 'bg-[#121212] border-white/20 text-[#F5F1E6]' : 'bg-gray-50 border-gray-300'
                      }`}
                    />
                  </div>
                ) : (
                  <>
                    {/* Virtual Meeting Link */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                        Virtual Meeting URL *
                      </label>
                      <input
                        type="url"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        placeholder="https://zoom.us/j/..."
                        className={`w-full p-3 rounded-xl border text-xs font-sans ${
                          isDark ? 'bg-[#121212] border-white/20 text-[#F5F1E6]' : 'bg-gray-50 border-gray-300'
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                        Meeting ID
                      </label>
                      <input
                        type="text"
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                        className={`w-full p-3 rounded-xl border text-xs font-sans ${
                          isDark ? 'bg-[#121212] border-white/20 text-[#F5F1E6]' : 'bg-gray-50 border-gray-300'
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                        Meeting Passcode
                      </label>
                      <input
                        type="text"
                        value={meetingPasscode}
                        onChange={(e) => setMeetingPasscode(e.target.value)}
                        className={`w-full p-3 rounded-xl border text-xs font-sans ${
                          isDark ? 'bg-[#121212] border-white/20 text-[#F5F1E6]' : 'bg-gray-50 border-gray-300'
                        }`}
                      />
                    </div>
                  </>
                )}

                {/* Instructions */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                    Candidate Preparation & Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Provide specific instructions for attire, documents, or arrival..."
                    className={`w-full p-3 rounded-xl border text-xs font-sans ${
                      isDark ? 'bg-[#121212] border-white/20 text-[#F5F1E6]' : 'bg-gray-50 border-gray-300'
                    }`}
                  />
                </div>

                {/* Admin Internal Remarks */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                    Committee Internal Remarks & Notes
                  </label>
                  <textarea
                    rows={2}
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="Internal notes regarding interviewer assignments, classification checks, or sponsor notes..."
                    className={`w-full p-3 rounded-xl border text-xs font-sans ${
                      isDark ? 'bg-[#121212] border-white/20 text-[#F5F1E6]' : 'bg-gray-50 border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#F7A81B]">
                Application Audit Trail & Workflow Logs
              </h3>

              {(!application.interviewHistory || application.interviewHistory.length === 0) ? (
                <p className="text-xs opacity-70 italic">No history records logged yet.</p>
              ) : (
                <div className="space-y-3">
                  {application.interviewHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border text-xs space-y-1 ${
                        isDark ? 'bg-[#121212] border-white/10' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#F7A81B]">{item.action}</span>
                        <span className="text-[10px] opacity-60 font-mono">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="opacity-90">{item.details}</p>
                      <span className="text-[10px] opacity-60 block">Actor: {item.actor}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'rejection' && (
            <div className="space-y-5 max-w-xl">
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs space-y-2">
                <div className="flex items-center space-x-2 font-bold text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Reject or Cancel Application</span>
                </div>
                <p>
                  Marking an application as Rejected or Cancelled will halt further interview scheduling and notify the candidate.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Rejection Reason / Internal Remarks *
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="State the reason (e.g. classification overlap, incomplete credentials)..."
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    isDark ? 'bg-[#121212] border-white/20 text-[#F5F1E6]' : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReject}
                  className="bg-red-600 hover:bg-red-500 text-white font-montserrat font-bold text-xs uppercase px-5 py-3 rounded-xl cursor-pointer shadow-md"
                >
                  Confirm Rejection
                </button>

                <button
                  type="button"
                  onClick={handleCancelInterview}
                  className="bg-gray-600 hover:bg-gray-500 text-white font-montserrat font-bold text-xs uppercase px-5 py-3 rounded-xl cursor-pointer"
                >
                  Cancel Interview
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-4 px-6 border-t flex items-center justify-between text-xs ${
          isDark ? 'bg-[#011E41]/80 border-white/10' : 'bg-gray-100 border-gray-200'
        }`}>
          <span className="opacity-70 font-mono text-[11px]">
            Rotary Club of Makati Secretariat Admin
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-montserrat font-bold uppercase text-xs cursor-pointer"
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};
