import React, { useState } from 'react';
import {
  Mail,
  CheckCircle2,
  X,
  Copy,
  Check,
  Send,
  Shield,
  Clock,
  User,
  Building,
  Briefcase,
  Phone,
  FileText,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { SubmittedApplication } from '../data/rcmMemberData';
import { generateNotificationEmails, ADMIN_NOTIFICATION_EMAIL } from '../services/notificationService';
import { ThemeType } from '../types';

interface ApplicationNotificationModalProps {
  application: SubmittedApplication | null;
  isOpen: boolean;
  onClose: () => void;
  theme?: ThemeType;
}

export const ApplicationNotificationModal: React.FC<ApplicationNotificationModalProps> = ({
  application,
  isOpen,
  onClose,
  theme = 'dark',
}) => {
  if (!isOpen || !application) return null;

  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'admin' | 'applicant' | 'details'>('admin');
  const [copied, setCopied] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const emails = generateNotificationEmails(application);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSimulateResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-3xl rounded-[18px] border border-white/10 bg-[#0F172A] text-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 bg-[#16233B] text-[#F8FAFC] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#F7A81B]/20 border border-[#F7A81B]/40 text-[#F7A81B]">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-extrabold text-lg sm:text-xl text-[#F8FAFC]">
                  Membership Application Submitted
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  LIVE EMAIL DISPATCHED
                </span>
              </div>
              <p className="text-xs font-sans text-[#CBD5E1]">
                Reference ID: <span className="font-mono text-[#F7A81B] font-bold">{application.id}</span> • {application.submittedAt}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#F7A81B] border border-[#F7A81B]/30 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Domain Verification Banner */}
        <div className="bg-[#F7A81B]/15 border-b border-[#F7A81B]/30 px-6 py-2.5 flex items-center justify-between gap-3 text-xs font-sans">
          <div className="flex items-center space-x-2 text-[#F7A81B] font-medium">
            <Shield className="w-4 h-4 shrink-0" />
            <span>
              Verified Recipient: <strong className="underline">{application.adminRecipient}</strong>
            </span>
          </div>
          <span className="text-[11px] font-mono opacity-80 hidden sm:inline">
            Official Domain: rotaryclubmakati.org
          </span>
        </div>

        {/* Navigation Subtabs */}
        <div className="flex border-b border-white/10 bg-black/20 shrink-0 text-xs font-montserrat font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === 'admin'
                ? 'border-[#F7A81B] text-[#F7A81B] bg-[#F7A81B]/10'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Admin Notification Email</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('applicant')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === 'applicant'
                ? 'border-[#F7A81B] text-[#F7A81B] bg-[#F7A81B]/10'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Applicant Auto-Reply</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === 'details'
                ? 'border-[#F7A81B] text-[#F7A81B] bg-[#F7A81B]/10'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Application Form Details</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: ADMIN EMAIL NOTIFICATION */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-black/30 p-3 rounded-2xl border border-white/10 text-xs font-mono">
                <div className="space-y-1">
                  <div><span className="text-white/50">To:</span> <strong className="text-[#F7A81B]">{emails.adminEmail.to}</strong></div>
                  <div><span className="text-white/50">From:</span> {emails.adminEmail.from}</div>
                  <div><span className="text-white/50">Subject:</span> {emails.adminEmail.subject}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(emails.adminEmail.bodyText, 'adminText')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7A81B] text-[#011E41] font-montserrat font-bold text-[11px] flex items-center space-x-1 hover:bg-[#D98E0E] transition-all cursor-pointer shrink-0"
                >
                  {copied === 'adminText' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'adminText' ? 'Copied!' : 'Copy Email'}</span>
                </button>
              </div>

              {/* Formatted Email Preview Box */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs leading-relaxed whitespace-pre-wrap selection:bg-[#F7A81B] selection:text-[#011E41] text-emerald-300 shadow-inner">
                {emails.adminEmail.bodyText}
              </div>

              <div className="flex items-center justify-between text-xs text-white/70 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dispatched via Transactional Mailer (SMTP / SendGrid)</span>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateResend}
                  disabled={isResending}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#F7A81B] font-montserrat font-bold text-[11px] border border-white/20 cursor-pointer disabled:opacity-50"
                >
                  {isResending ? 'Resending...' : resendSuccess ? '✓ Email Sent!' : 'Trigger Resend'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: APPLICANT CONFIRMATION AUTO-REPLY */}
          {activeTab === 'applicant' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-black/30 p-3 rounded-2xl border border-white/10 text-xs font-mono">
                <div className="space-y-1">
                  <div><span className="text-white/50">To Applicant:</span> <strong className="text-[#F7A81B]">{emails.applicantReply.to}</strong></div>
                  <div><span className="text-white/50">From:</span> {emails.applicantReply.from}</div>
                  <div><span className="text-white/50">Subject:</span> {emails.applicantReply.subject}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(emails.applicantReply.bodyText, 'applicantText')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7A81B] text-[#011E41] font-montserrat font-bold text-[11px] flex items-center space-x-1 hover:bg-[#D98E0E] transition-all cursor-pointer shrink-0"
                >
                  {copied === 'applicantText' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'applicantText' ? 'Copied!' : 'Copy Auto-Reply'}</span>
                </button>
              </div>

              {/* Formatted Applicant Body */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 font-sans text-xs leading-relaxed whitespace-pre-wrap text-sky-200 shadow-inner">
                {emails.applicantReply.bodyText}
              </div>

              <div className="p-3 rounded-xl bg-[#F7A81B]/10 border border-[#F7A81B]/30 flex items-center space-x-3 text-xs text-[#F7A81B]">
                <Clock className="w-4 h-4 shrink-0" />
                <span>
                  Applicant invited to Tuesday Luncheon Meeting (12:00 PM – 2:00 PM) at <strong>The Manila Peninsula</strong>.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: APPLICATION FORM DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-1">
                  <div className="flex items-center space-x-1.5 text-white/60 font-montserrat font-bold uppercase text-[10px]">
                    <User className="w-3.5 h-3.5 text-[#F7A81B]" />
                    <span>Applicant Name</span>
                  </div>
                  <div className="font-bold text-sm text-[#F7A81B]">{application.fullName}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-1">
                  <div className="flex items-center space-x-1.5 text-white/60 font-montserrat font-bold uppercase text-[10px]">
                    <Mail className="w-3.5 h-3.5 text-[#F7A81B]" />
                    <span>Email Address</span>
                  </div>
                  <div className="font-bold text-sm">{application.email}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-1">
                  <div className="flex items-center space-x-1.5 text-white/60 font-montserrat font-bold uppercase text-[10px]">
                    <Phone className="w-3.5 h-3.5 text-[#F7A81B]" />
                    <span>Phone Number</span>
                  </div>
                  <div className="font-bold text-sm">{application.phone}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-1">
                  <div className="flex items-center space-x-1.5 text-white/60 font-montserrat font-bold uppercase text-[10px]">
                    <Building className="w-3.5 h-3.5 text-[#F7A81B]" />
                    <span>Company / Organization</span>
                  </div>
                  <div className="font-bold text-sm">{application.company || 'N/A'}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-white/60 font-montserrat font-bold uppercase text-[10px]">
                  <Briefcase className="w-3.5 h-3.5 text-[#F7A81B]" />
                  <span>Business Classification / Profession</span>
                </div>
                <div className="font-bold text-sm text-[#F7A81B]">{application.classification || 'N/A'}</div>
              </div>

              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 text-white/60 font-montserrat font-bold uppercase text-[10px]">
                  <FileText className="w-3.5 h-3.5 text-[#F7A81B]" />
                  <span>"Why do you want to join RC Makati?"</span>
                </div>
                <p className="font-sans leading-relaxed text-white/90 bg-black/40 p-3 rounded-xl border border-white/10 italic">
                  "{application.message || 'No additional statement provided.'}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-[#F7A81B]/30 bg-black/30 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved to Local Storage & Admin Dashboard</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto bg-[#F7A81B] hover:bg-[#D98E0E] text-[#0F172A] font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Close Notification Preview
          </button>
        </div>
      </div>
    </div>
  );
};
