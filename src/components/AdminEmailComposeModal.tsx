import React, { useState, useEffect } from 'react';
import {
  Mail,
  X,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  History,
  FileText,
  Sparkles,
  Info,
  RefreshCw,
  User,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export interface EmailLog {
  id: string;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  message: string;
  related_record_id?: string;
  related_table_name?: string;
  admin_email?: string;
  status: 'success' | 'failed';
  error_message?: string;
  created_at: string;
}

interface AdminEmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
  recipientName: string;
  defaultSubject: string;
  defaultMessage: string;
  relatedRecordId: string | number;
  relatedTableName: 'membership_applications' | 'visit_requests' | 'contact_messages';
  adminEmail?: string;
  onEmailSent?: (successMessage: string) => void;
}

export const AdminEmailComposeModal: React.FC<AdminEmailComposeModalProps> = ({
  isOpen,
  onClose,
  recipientEmail,
  recipientName,
  defaultSubject,
  defaultMessage,
  relatedRecordId,
  relatedTableName,
  adminEmail,
  onEmailSent,
}) => {
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(defaultMessage);
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Sync state when props change
  useEffect(() => {
    if (isOpen) {
      setSubject(defaultSubject);
      setMessage(defaultMessage);
      setSendError(null);
      fetchEmailHistory();
    }
  }, [isOpen, defaultSubject, defaultMessage, relatedRecordId, recipientEmail]);

  // Fetch past emails sent to this record or recipient
  const fetchEmailHistory = async () => {
    setLogsLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .or(`related_record_id.eq.${relatedRecordId},recipient_email.eq.${recipientEmail}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Could not fetch email logs (table might not exist yet):', error.message);
        setEmailLogs([]);
      } else {
        setEmailLogs(data || []);
      }
    } catch (err) {
      console.error('Error fetching email history:', err);
      setEmailLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  // Helper to sanitize recipient name
  const cleanRecipientName = (nameVal: string | undefined): string => {
    if (
      !nameVal ||
      typeof nameVal !== 'string' ||
      nameVal.trim() === '' ||
      nameVal.trim().toLowerCase() === 'undefined' ||
      nameVal.trim().toLowerCase() === 'null'
    ) {
      return 'Valued Recipient';
    }
    return nameVal.trim();
  };

  const handleQuickTemplate = (type: 'interview' | 'visit' | 'inquiry' | 'general') => {
    const displayName = cleanRecipientName(recipientName);
    if (type === 'interview') {
      setSubject(`Follow-up on your RC Makati Membership Application - Interview Invitation`);
      setMessage(
        `Dear ${displayName},\n\nThank you for submitting your membership application to the Rotary Club of Makati.\n\nThe Membership Committee has reviewed your dossier and would like to invite you for a brief interaction and panel interview (via Zoom or in person during our weekly meeting).\n\nPlease reply with your available dates and times this coming week so we can finalize the schedule.\n\nWarm regards,\nRotary Club of Makati Secretariat`
      );
    } else if (type === 'visit') {
      setSubject(`Confirmation of Guest Visit - Rotary Club of Makati`);
      setMessage(
        `Dear ${displayName},\n\nWe received your visit request and are delighted to welcome you to our upcoming Rotary Club meeting.\n\nOur weekly meeting details:\n- Location: The Peninsular Manila / Club Venue\n- Day & Time: Tuesdays at 12:00 PM\n\nPlease let us know if you have any dietary requirements or special accommodations.\n\nWarm regards,\nRotary Club of Makati Secretariat`
      );
    } else if (type === 'inquiry') {
      setSubject(`Response to your inquiry - Rotary Club of Makati`);
      setMessage(
        `Dear ${displayName},\n\nThank you for reaching out to the Rotary Club of Makati.\n\nRegarding your inquiry, we would be pleased to provide you with additional information or connect you with the responsible committee chair.\n\nPlease let us know how we can best assist you further.\n\nWarm regards,\nRotary Club of Makati Secretariat`
      );
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !subject.trim() || !message.trim()) {
      setSendError('Please fill out both subject and message content.');
      return;
    }

    setIsSending(true);
    setSendError(null);

    const activeRecipientName = cleanRecipientName(recipientName);

    try {
      // 1. Invoke Supabase Edge Function 'send-admin-email'
      const { data, error } = await supabase.functions.invoke('send-admin-email', {
        body: {
          recipient: recipientEmail,
          recipientEmail,
          recipientName: activeRecipientName,
          subject,
          message,
          recordId: String(relatedRecordId),
          recordTable: relatedTableName,
          relatedRecordId: String(relatedRecordId),
          relatedTableName,
          adminEmail: adminEmail || 'admin@rotaryclubmakati.org',
        },
      });

      // ALWAYS PRINT THE FULL EDGE FUNCTION RESPONSE DATA/BODY TO CONSOLE FOR DEBUGGING
      console.error('[send-admin-email Edge Function DATA]:', data);
      if (data) {
        console.error('[send-admin-email Edge Function DATA JSON]:', JSON.stringify(data, null, 2));
      }

      let edgeFunctionResponseBody: any = data;

      if (error) {
        console.error('[send-admin-email Edge Function ERROR Object]:', error);
        
        // Attempt to extract response JSON from error.context if present (FunctionsHttpError)
        if ('context' in error && error.context) {
          try {
            const ctxRes = (error as any).context;
            if (typeof ctxRes.clone === 'function') {
              const rawBody = await ctxRes.clone().json();
              console.error('[send-admin-email Edge Function Raw Response Body from error.context]:', JSON.stringify(rawBody, null, 2));
              edgeFunctionResponseBody = rawBody;
            } else if (typeof ctxRes.text === 'function') {
              const rawText = await ctxRes.clone().text();
              console.error('[send-admin-email Edge Function Raw Response Text from error.context]:', rawText);
            }
          } catch (ctxErr) {
            console.error('[Could not parse error.context response body]:', ctxErr);
          }
        }

        let errMsg = edgeFunctionResponseBody?.message || edgeFunctionResponseBody?.error || error.message || JSON.stringify(error);
        if (typeof errMsg === 'object') {
          errMsg = JSON.stringify(errMsg);
        }

        if (errMsg.includes('FunctionsFetchError') || errMsg.includes('404')) {
          errMsg = 'The Edge Function "send-admin-email" is not deployed in Supabase yet. Please deploy the function or check secret settings.';
        }
        setSendError(errMsg);
        
        // Log failure in local email_logs table if accessible
        await logToDatabaseDirectly('failed', errMsg);
        return;
      }

      if (data && !data.success) {
        console.error('[Resend API Rejection Details from data]:', data);
        const errMsg = data.message || data.error || (typeof data === 'object' ? JSON.stringify(data) : 'Resend API rejected email delivery.');
        setSendError(errMsg);
        return;
      }

      // Success!
      fetchEmailHistory();
      if (onEmailSent) {
        onEmailSent(`Email successfully dispatched to ${recipientEmail}`);
      }
      onClose();
    } catch (err: any) {
      console.error('Unexpected email dispatch error:', err);
      const errMsg = err.message || 'An unexpected error occurred while sending email.';
      setSendError(errMsg);
      await logToDatabaseDirectly('failed', errMsg);
    } finally {
      setIsSending(false);
    }
  };

  const logToDatabaseDirectly = async (status: 'success' | 'failed', errorMsg?: string) => {
    try {
      await supabase.from('email_logs').insert([
        {
          recipient_email: recipientEmail,
          recipient_name: recipientName,
          subject,
          message,
          related_record_id: String(relatedRecordId),
          related_table_name: relatedTableName,
          admin_email: adminEmail || 'admin@rotaryclubmakati.org',
          status,
          error_message: errorMsg || null,
        },
      ]);
    } catch {
      // Ignore fallback insert error
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0A2540] border border-[#F7A81B]/40 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#01142E] via-[#011E41] to-[#0A2540] p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F7A81B]/20 border border-[#F7A81B]/50 flex items-center justify-center text-[#F7A81B]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <span>Compose & Send Official Email</span>
              </h2>
              <p className="text-xs text-slate-300">
                Resend API Integration • {relatedTableName.replace('_', ' ')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-[#011E41] px-5 border-b border-white/10 text-xs font-montserrat font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('compose')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'compose'
                ? 'border-[#F7A81B] text-[#F7A81B]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Compose Message</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#F7A81B] text-[#F7A81B]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Email History</span>
            <span className="bg-[#0A2540] text-[#F7A81B] px-2 py-0.5 rounded-full text-[10px]">
              {emailLogs.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'compose' ? (
            <form onSubmit={handleSendEmail} className="space-y-4">
              {/* Resend Test Mode Banner Notice */}
              <div className="bg-[#011E41] border border-[#F7A81B]/30 rounded-2xl p-3.5 text-slate-300 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#F7A81B] font-montserrat font-bold">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#F7A81B]" />
                    <span>Sender: Rotary Club of Makati &lt;onboarding@resend.dev&gt;</span>
                  </span>
                  <span className="bg-[#F7A81B]/20 px-2 py-0.5 rounded text-[10px] uppercase">
                    Resend Test Mode
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Note: In Resend test mode (<code className="text-[#F7A81B]">onboarding@resend.dev</code>), emails can only be delivered to your verified Resend account address. Verify a custom domain in Resend to email external addresses.
                </p>
              </div>

              {/* Error Alert */}
              {sendError && (
                <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Email Delivery Notice</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-red-100">{sendError}</p>
                </div>
              )}

              {/* Recipient "To" Field (Read-only) */}
              <div className="space-y-1">
                <label className="block text-[#F7A81B] font-montserrat font-bold text-[11px] uppercase tracking-wider">
                  Recipient (To)
                </label>
                <div className="flex items-center bg-[#011E41] border border-white/10 rounded-xl px-3 py-2.5 text-white">
                  <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <span className="font-bold text-slate-200">{recipientName}</span>
                  <span className="text-slate-400 ml-2 font-mono text-[11px]">&lt;{recipientEmail}&gt;</span>
                </div>
              </div>

              {/* Subject Field */}
              <div className="space-y-1">
                <label className="block text-[#F7A81B] font-montserrat font-bold text-[11px] uppercase tracking-wider">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  required
                  className="w-full bg-[#011E41] border border-white/20 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-[#F7A81B]"
                />
              </div>

              {/* Quick Template Presets */}
              <div className="space-y-1.5">
                <span className="block text-slate-400 font-montserrat text-[10px] uppercase font-bold">
                  Quick Templates
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickTemplate('interview')}
                    className="bg-[#011E41] hover:bg-[#F7A81B] hover:text-[#011E41] text-slate-300 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer"
                  >
                    + Interview Invite
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickTemplate('visit')}
                    className="bg-[#011E41] hover:bg-[#F7A81B] hover:text-[#011E41] text-slate-300 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer"
                  >
                    + Meeting Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickTemplate('inquiry')}
                    className="bg-[#011E41] hover:bg-[#F7A81B] hover:text-[#011E41] text-slate-300 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer"
                  >
                    + Inquiry Response
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-1">
                <label className="block text-[#F7A81B] font-montserrat font-bold text-[11px] uppercase tracking-wider">
                  Message Content
                </label>
                <textarea
                  rows={7}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your official response..."
                  required
                  className="w-full bg-[#011E41] border border-white/20 rounded-xl p-3.5 text-white placeholder:text-slate-500 text-xs font-sans focus:outline-none focus:border-[#F7A81B] leading-relaxed"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSending}
                  className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-slate-300 font-montserrat font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSending}
                  className="bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Email History Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-bold">Sent Communication Logs</span>
                <button
                  type="button"
                  onClick={fetchEmailHistory}
                  className="text-[#F7A81B] hover:underline text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${logsLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh History</span>
                </button>
              </div>

              {logsLoading ? (
                <div className="py-8 text-center text-slate-400">Loading history...</div>
              ) : emailLogs.length === 0 ? (
                <div className="py-12 text-center bg-[#011E41] rounded-2xl border border-white/5 space-y-2">
                  <History className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-slate-300 font-bold">No previous emails recorded</p>
                  <p className="text-[11px] text-slate-400">
                    Emails sent from this portal will be logged here for audit purposes.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {emailLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl bg-[#011E41] border border-white/10 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{log.subject}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                            log.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center space-x-3">
                        <span>To: {log.recipient_email}</span>
                        <span>•</span>
                        <span>
                          {new Date(log.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {log.admin_email && (
                          <>
                            <span>•</span>
                            <span>Admin: {log.admin_email}</span>
                          </>
                        )}
                      </div>

                      <div className="p-3 bg-[#0A2540] rounded-xl text-slate-200 whitespace-pre-wrap leading-relaxed text-[11px]">
                        {log.message}
                      </div>

                      {log.error_message && (
                        <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-[11px]">
                          <strong>Error details:</strong> {log.error_message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
