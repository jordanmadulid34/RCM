import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { DEMO_ANNOUNCEMENTS, INITIAL_DEMO_EVENTS } from '../data/rcmMemberData';
import {
  ShieldCheck,
  LogOut,
  Users,
  Calendar,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Building,
  Briefcase,
  Globe,
  MapPin,
  Sparkles,
  MessageSquare,
  Trash2,
  X,
  Send,
  Megaphone,
  Plus,
  Edit3,
  Image as ImageIcon,
} from 'lucide-react';
import { AdminEmailComposeModal } from './AdminEmailComposeModal';
import { AdminDeleteConfirmModal } from './AdminDeleteConfirmModal';

interface AdminSupabaseDashboardProps {
  onLogOut: () => void;
  userEmail?: string;
}

export const AdminSupabaseDashboard: React.FC<AdminSupabaseDashboardProps> = ({
  onLogOut,
  userEmail,
}) => {
  const [activeSection, setActiveSection] = useState<'applications' | 'visit_requests' | 'contact_messages' | 'announcements' | 'events'>('applications');

  // Toast Notification State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Membership Applications State
  const [applications, setApplications] = useState<any[]>([]);
  const [appsLoading, setAppsLoading] = useState<boolean>(true);
  const [appsError, setAppsError] = useState<string | null>(null);
  const [appSearch, setAppSearch] = useState<string>('');
  const [expandedAppId, setExpandedAppId] = useState<string | number | null>(null);

  // Visit Requests State
  const [visitRequests, setVisitRequests] = useState<any[]>([]);
  const [visitsLoading, setVisitsLoading] = useState<boolean>(true);
  const [visitsError, setVisitsError] = useState<string | null>(null);
  const [visitSearch, setVisitSearch] = useState<string>('');

  // Contact Messages State
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [messageSearch, setMessageSearch] = useState<string>('');

  // Announcements State
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState<boolean>(true);
  const [announcementsError, setAnnouncementsError] = useState<string | null>(null);
  const [announcementSearch, setAnnouncementSearch] = useState<string>('');

  // Announcement Form Modal State
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState<boolean>(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  // Events & Meetings Admin State
  const [adminEvents, setAdminEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [eventSearch, setEventSearch] = useState<string>('');

  // Event Form Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventType, setEventType] = useState<string>('General Meeting');
  const [eventDate, setEventDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('12:00 PM – 2:00 PM');
  const [eventLocation, setEventLocation] = useState<string>('The Conservatory, The Manila Peninsula');
  const [eventVirtualLink, setEventVirtualLink] = useState<string>('');
  const [eventImageUrl, setEventImageUrl] = useState<string>('');
  const [eventSubmitting, setEventSubmitting] = useState<boolean>(false);

  // Email Compose Modal State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailModalProps, setEmailModalProps] = useState<{
    recipientEmail: string;
    recipientName: string;
    defaultSubject: string;
    defaultMessage: string;
    relatedRecordId: string | number;
    relatedTableName: 'membership_applications' | 'visit_requests' | 'contact_messages';
  } | null>(null);

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteModalProps, setDeleteModalProps] = useState<{
    recordId: string | number;
    recordTitle: string;
    recordSubtitle?: string;
    recordDate?: string;
    tableName: 'membership_applications' | 'visit_requests' | 'contact_messages' | 'announcements';
    tableLabel: string;
  } | null>(null);

  // Helper to extract a valid, non-undefined recipient name from any record
  const getCleanRecipientName = (record: any, fallback: string): string => {
    if (!record) return fallback;
    const candidates = [
      record.full_name,
      record.fullName,
      record.name,
      record.applicant_name,
      `${record.first_name || ''} ${record.last_name || ''}`.trim(),
      `${record.firstName || ''} ${record.lastName || ''}`.trim(),
    ];
    for (const val of candidates) {
      if (
        val &&
        typeof val === 'string' &&
        val.trim() !== '' &&
        val.trim().toLowerCase() !== 'undefined' &&
        val.trim().toLowerCase() !== 'null' &&
        val.trim().toLowerCase() !== 'undefined undefined'
      ) {
        return val.trim();
      }
    }
    return fallback;
  };

  // Trigger Email Modal for Membership Application
  const handleOpenEmailModalForApp = (app: any) => {
    const name = getCleanRecipientName(app, 'Applicant');
    setEmailModalProps({
      recipientEmail: app.email,
      recipientName: name,
      defaultSubject: 'Follow-up on your RC Makati Membership Application',
      defaultMessage: `Dear ${name},\n\nThank you for submitting your membership application to the Rotary Club of Makati.\n\nThe Membership Committee has reviewed your application and would like to invite you for a brief interaction and panel interview (via Zoom or in person during our weekly meeting).\n\nPlease let us know your available days and times this coming week so we can confirm the schedule.\n\nWarm regards,\nRotary Club of Makati Secretariat & Membership Committee`,
      relatedRecordId: app.id,
      relatedTableName: 'membership_applications',
    });
    setEmailModalOpen(true);
  };

  // Trigger Email Modal for Visit Request
  const handleOpenEmailModalForVisit = (vr: any) => {
    const guestName = getCleanRecipientName(vr, 'Guest');
    setEmailModalProps({
      recipientEmail: vr.email,
      recipientName: guestName,
      defaultSubject: 'Your Visit Request to Rotary Club of Makati',
      defaultMessage: `Dear ${guestName},\n\nWe received your request to visit the Rotary Club of Makati on ${vr.preferred_date || 'our upcoming meeting'}.\n\nWe would be delighted to welcome you to our weekly meeting! Please let us know if you have any questions or dietary requirements prior to your visit.\n\nMeeting Details:\n- Location: The Peninsula Manila\n- Meeting Time: Tuesdays at 12:00 PM\n\nWarm regards,\nRotary Club of Makati Secretariat`,
      relatedRecordId: vr.id,
      relatedTableName: 'visit_requests',
    });
    setEmailModalOpen(true);
  };

  // Trigger Email Modal for Contact Message
  const handleOpenEmailModalForMessage = (msg: any) => {
    const name = getCleanRecipientName(msg, 'Inquirer');
    setEmailModalProps({
      recipientEmail: msg.email,
      recipientName: name,
      defaultSubject: `Response to your inquiry - Rotary Club of Makati`,
      defaultMessage: `Dear ${name},\n\nThank you for reaching out to the Rotary Club of Makati regarding "${msg.subject || 'your inquiry'}".\n\nWe received your message and would be glad to assist you further.\n\nPlease feel free to reply with any additional questions.\n\nWarm regards,\nRotary Club of Makati Secretariat`,
      relatedRecordId: msg.id,
      relatedTableName: 'contact_messages',
    });
    setEmailModalOpen(true);
  };

  // Trigger Delete Modal for Membership Application
  const handleOpenDeleteModalForApp = (app: any) => {
    setDeleteModalProps({
      recordId: app.id,
      recordTitle: app.full_name || app.fullName || 'Membership Application',
      recordSubtitle: `${app.email || ''} • Classification: ${app.classification || 'N/A'}`,
      recordDate: formatDate(app.created_at || app.createdAt),
      tableName: 'membership_applications',
      tableLabel: 'Membership Application',
    });
    setDeleteModalOpen(true);
  };

  // Trigger Delete Modal for Visit Request
  const handleOpenDeleteModalForVisit = (vr: any) => {
    const name = `${vr.first_name || ''} ${vr.last_name || ''}`.trim() || 'Visit Request';
    setDeleteModalProps({
      recordId: vr.id,
      recordTitle: name,
      recordSubtitle: `${vr.email || ''} • Visit Date: ${vr.preferred_date || 'N/A'}`,
      recordDate: formatDate(vr.created_at),
      tableName: 'visit_requests',
      tableLabel: 'Visit Request',
    });
    setDeleteModalOpen(true);
  };

  // Trigger Delete Modal for Contact Message
  const handleOpenDeleteModalForMessage = (msg: any) => {
    setDeleteModalProps({
      recordId: msg.id,
      recordTitle: msg.full_name || 'Contact Message',
      recordSubtitle: `${msg.email || ''} • Subject: ${msg.subject || 'General Inquiry'}`,
      recordDate: formatDate(msg.created_at),
      tableName: 'contact_messages',
      tableLabel: 'Contact Message',
    });
    setDeleteModalOpen(true);
  };

  // Trigger Delete Modal for Announcement
  const handleOpenDeleteModalForAnnouncement = (ann: any) => {
    setDeleteModalProps({
      recordId: ann.id,
      recordTitle: ann.title || 'Announcement',
      recordSubtitle: (ann.content || ann.body || '').substring(0, 80) + '...',
      recordDate: formatDate(ann.created_at),
      tableName: 'announcements',
      tableLabel: 'Announcement',
    });
    setDeleteModalOpen(true);
  };

  // Open Create Announcement Modal
  const handleOpenCreateAnnouncement = () => {
    setEditingAnnouncement(null);
    setFormTitle('');
    setFormContent('');
    setFormImageUrl('');
    setIsAnnouncementModalOpen(true);
  };

  // Open Edit Announcement Modal
  const handleOpenEditAnnouncement = (ann: any) => {
    setEditingAnnouncement(ann);
    setFormTitle(ann.title || '');
    setFormContent(ann.content || ann.body || '');
    setFormImageUrl(ann.image_url || ann.imageUrl || '');
    setIsAnnouncementModalOpen(true);
  };

  // Remove row from local state on success
  const handleSuccessDelete = (deletedId: string | number, message: string) => {
    if (deleteModalProps?.tableName === 'membership_applications') {
      setApplications((prev) => prev.filter((a) => a.id !== deletedId));
    } else if (deleteModalProps?.tableName === 'visit_requests') {
      setVisitRequests((prev) => prev.filter((v) => v.id !== deletedId));
    } else if (deleteModalProps?.tableName === 'contact_messages') {
      setContactMessages((prev) => prev.filter((m) => m.id !== deletedId));
    } else if (deleteModalProps?.tableName === 'announcements') {
      setAnnouncements((prev) => prev.filter((a) => a.id !== deletedId));
    }
    showToast('success', message);
  };

  // Update Status for Membership Application
  const handleUpdateAppStatus = async (appId: string | number, newStatus: string) => {
    // Locate existing app record to check previous status and email details
    const targetApp = applications.find((a) => a.id === appId);
    const prevStatus = targetApp?.status;

    try {
      const { data, error } = await supabase
        .from('membership_applications')
        .update({ status: newStatus })
        .eq('id', appId)
        .select();

      if (error) {
        console.error('Error updating application status:', error);
        showToast('error', `Failed to update status: ${error.message}`);
        return;
      }

      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      showToast('success', `Membership application status updated to "${newStatus}".`);

      // Trigger automatic congratulatory email ONLY when status transitions TO "Approved"
      if (newStatus === 'Approved' && prevStatus !== 'Approved' && targetApp) {
        const recipientEmail = targetApp.email;
        const recipientName = getCleanRecipientName(targetApp, 'Valued Member');

        if (recipientEmail) {
          try {
            const subject = 'Congratulations! Your RC Makati Membership Application has been Approved';
            const message = `Dear ${recipientName},\n\nWe are delighted to inform you that your membership application to the Rotary Club of Makati has been officially APPROVED!\n\nWelcome to our Rotary family! The Membership Committee will reach out to you shortly with onboarding details, orientation schedules, and member portal access information.\n\nWe look forward to formally welcoming you at our upcoming weekly meeting.\n\nWarmest regards,\nRotary Club of Makati Secretariat & Membership Committee`;

            const { data: emailRes, error: emailErr } = await supabase.functions.invoke('send-admin-email', {
              body: {
                recipient: recipientEmail,
                recipientEmail,
                recipientName,
                subject,
                message,
                recordId: String(appId),
                tableName: 'membership_applications',
              },
            });

            if (emailErr) {
              console.error('Approval email dispatch error:', emailErr);
              showToast('error', `Status saved as Approved, but approval email failed: ${emailErr.message || JSON.stringify(emailErr)}`);
            } else if (emailRes && !emailRes.success) {
              console.error('Approval email rejected by Resend API:', emailRes);
              showToast('error', `Status saved as Approved, but email rejected: ${emailRes.message || emailRes.error || 'Resend error'}`);
            } else {
              showToast('success', `Approval notification email sent successfully to ${recipientEmail}!`);
            }
          } catch (sendEx: any) {
            console.error('Unexpected error sending approval email:', sendEx);
            showToast('error', `Status saved as Approved, but email failed: ${sendEx.message || 'Unknown error'}`);
          }
        }
      }
    } catch (err: any) {
      console.error('Unexpected error updating application status:', err);
      showToast('error', `Status update error: ${err.message || 'Unknown error'}`);
    }
  };

  // Update Status for Visit Request
  const handleUpdateVisitStatus = async (visitId: string | number, newStatus: string) => {
    try {
      const { data, error } = await supabase
        .from('visit_requests')
        .update({ status: newStatus })
        .eq('id', visitId)
        .select();

      if (error) {
        console.error('Error updating visit request status:', error);
        showToast('error', `Failed to update status: ${error.message}`);
        return;
      }

      setVisitRequests((prev) =>
        prev.map((vr) => (vr.id === visitId ? { ...vr, status: newStatus } : vr))
      );
      showToast('success', `Visit request status updated to "${newStatus}".`);
    } catch (err: any) {
      console.error('Unexpected error updating visit request status:', err);
      showToast('error', `Status update error: ${err.message || 'Unknown error'}`);
    }
  };

  // Update Status for Contact Message
  const handleUpdateMessageStatus = async (messageId: string | number, newStatus: string) => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', messageId)
        .select();

      if (error) {
        console.error('Error updating contact message status:', error);
        showToast('error', `Failed to update status: ${error.message}`);
        return;
      }

      setContactMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, status: newStatus } : msg))
      );
      showToast('success', `Contact message status updated to "${newStatus}".`);
    } catch (err: any) {
      console.error('Unexpected error updating contact message status:', err);
      showToast('error', `Status update error: ${err.message || 'Unknown error'}`);
    }
  };

  // Fetch Membership Applications from Supabase
  const fetchApplications = async () => {
    setAppsLoading(true);
    setAppsError(null);
    try {
      const { data, error } = await supabase
        .from('membership_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching membership applications:', error);
        setAppsError(`Database fetch error (${error.code || 'RLS'}): ${error.message}`);
      } else {
        setApplications(data || []);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching applications:', err);
      setAppsError(err.message || 'Failed to connect to database.');
    } finally {
      setAppsLoading(false);
    }
  };

  // Fetch Visit Requests from Supabase
  const fetchVisitRequests = async () => {
    setVisitsLoading(true);
    setVisitsError(null);
    try {
      const { data, error } = await supabase
        .from('visit_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching visit requests:', error);
        setVisitsError(`Database fetch error (${error.code || 'RLS'}): ${error.message}`);
      } else {
        setVisitRequests(data || []);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching visit requests:', err);
      setVisitsError(err.message || 'Failed to connect to database.');
    } finally {
      setVisitsLoading(false);
    }
  };

  // Fetch Contact Messages from Supabase
  const fetchContactMessages = async () => {
    setMessagesLoading(true);
    setMessagesError(null);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contact messages:', error);
        setMessagesError(`Database fetch error (${error.code || 'RLS'}): ${error.message}`);
      } else {
        setContactMessages(data || []);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching contact messages:', err);
      setMessagesError(err.message || 'Failed to connect to database.');
    } finally {
      setMessagesLoading(false);
    }
  };

  // Fetch Announcements from Supabase
  const fetchAnnouncements = async () => {
    setAnnouncementsLoading(true);
    setAnnouncementsError(null);
    const fallbackAnnouncements = DEMO_ANNOUNCEMENTS.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.summary,
      body: a.summary,
      created_at: a.date,
    }));

    try {
      if (!isSupabaseConfigured) {
        setAnnouncements(fallbackAnnouncements as any);
        return;
      }
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setAnnouncements(fallbackAnnouncements as any);
      } else {
        setAnnouncements(data);
      }
    } catch (_err) {
      setAnnouncements(fallbackAnnouncements as any);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  // Create or Update Announcement
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      showToast('error', 'Title and Content are required fields.');
      return;
    }

    setFormSubmitting(true);
    try {
      const titleVal = formTitle.trim();
      const contentVal = formContent.trim();
      const imageUrlVal = formImageUrl.trim() || null;

      if (editingAnnouncement) {
        // Update
        let payload: any = {
          title: titleVal,
          content: contentVal,
          body: contentVal,
          image_url: imageUrlVal,
        };

        let { data, error } = await supabase
          .from('announcements')
          .update(payload)
          .eq('id', editingAnnouncement.id)
          .select();

        if (error && (error.message.includes('column') || error.code === '42703')) {
          delete payload.body;
          const fallbackRes = await supabase
            .from('announcements')
            .update(payload)
            .eq('id', editingAnnouncement.id)
            .select();
          error = fallbackRes.error;
          data = fallbackRes.data;
        }

        if (error) {
          console.error('Error updating announcement:', error);
          showToast('error', `Failed to update announcement: ${error.message}`);
        } else {
          showToast('success', 'Announcement updated successfully!');
          setIsAnnouncementModalOpen(false);
          setEditingAnnouncement(null);
          fetchAnnouncements();
        }
      } else {
        // Create
        let payload: any = {
          title: titleVal,
          content: contentVal,
          body: contentVal,
          image_url: imageUrlVal,
        };

        let { data, error } = await supabase
          .from('announcements')
          .insert([payload])
          .select();

        if (error && (error.message.includes('column') || error.code === '42703')) {
          delete payload.body;
          const fallbackRes = await supabase
            .from('announcements')
            .insert([payload])
            .select();
          error = fallbackRes.error;
          data = fallbackRes.data;
        }

        if (error) {
          console.error('Error creating announcement:', error);
          showToast('error', `Failed to create announcement: ${error.message}`);
        } else {
          showToast('success', 'Announcement created successfully!');
          setIsAnnouncementModalOpen(false);
          setEditingAnnouncement(null);
          fetchAnnouncements();
        }
      }
    } catch (err: any) {
      console.error('Unexpected error saving announcement:', err);
      showToast('error', `Error: ${err.message || 'Failed to save announcement'}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Fetch Events from Supabase
  const fetchAdminEvents = async () => {
    setEventsLoading(true);
    setEventsError(null);
    const fallbackEvents = INITIAL_DEMO_EVENTS.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.speaker ? `Guest Speaker: ${e.speaker}` : 'Rotary Club of Makati Official Event',
      event_type: e.type,
      event_date: e.date,
      event_time: e.time,
      location: e.location,
    }));

    try {
      if (!isSupabaseConfigured) {
        setAdminEvents(fallbackEvents as any);
        return;
      }
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error || !data || data.length === 0) {
        setAdminEvents(fallbackEvents as any);
      } else {
        setAdminEvents(data);
      }
    } catch (_err) {
      setAdminEvents(fallbackEvents as any);
    } finally {
      setEventsLoading(false);
    }
  };

  // Open Create Event Modal
  const handleOpenCreateEvent = () => {
    setEditingEvent(null);
    setEventTitle('');
    setEventDescription('');
    setEventType('General Meeting');
    setEventDate(new Date().toISOString().split('T')[0]);
    setEventTime('12:00 PM – 2:00 PM');
    setEventLocation('The Conservatory, The Manila Peninsula');
    setEventVirtualLink('');
    setEventImageUrl('');
    setIsEventModalOpen(true);
  };

  // Open Edit Event Modal
  const handleOpenEditEvent = (evt: any) => {
    setEditingEvent(evt);
    setEventTitle(evt.title || '');
    setEventDescription(evt.description || '');
    setEventType(evt.event_type || 'General Meeting');
    setEventDate(evt.event_date || '');
    setEventTime(evt.event_time || '12:00 PM – 2:00 PM');
    setEventLocation(evt.location || 'The Manila Peninsula');
    setEventVirtualLink(evt.virtual_link || '');
    setEventImageUrl(evt.image_url || '');
    setIsEventModalOpen(true);
  };

  // Save Event (Insert or Update)
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventSubmitting(true);
    try {
      const payload = {
        title: eventTitle.trim(),
        description: eventDescription.trim(),
        event_type: eventType,
        event_date: eventDate,
        event_time: eventTime.trim(),
        location: eventLocation.trim(),
        virtual_link: eventVirtualLink.trim() || null,
        image_url: eventImageUrl.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (editingEvent) {
        const { data, error } = await supabase
          .from('events')
          .update(payload)
          .eq('id', editingEvent.id)
          .select();

        if (error) throw error;
        setAdminEvents((prev) =>
          prev.map((item) => (item.id === editingEvent.id ? { ...item, ...payload } : item))
        );
        showToast('success', 'Event successfully updated!');
      } else {
        const { data, error } = await supabase
          .from('events')
          .insert([payload])
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          setAdminEvents((prev) => [...prev, data[0]]);
        }
        showToast('success', 'New event/meeting created successfully!');
      }
      setIsEventModalOpen(false);
    } catch (err: any) {
      showToast('error', `Failed to save event: ${err.message}`);
    } finally {
      setEventSubmitting(false);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (eventId: string | number) => {
    try {
      const { error } = await supabase.from('events').delete().eq('id', eventId);
      if (error) throw error;
      setAdminEvents((prev) => prev.filter((e) => e.id !== eventId));
      showToast('success', 'Event deleted from calendar.');
    } catch (err: any) {
      showToast('error', `Failed to delete event: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchVisitRequests();
    fetchContactMessages();
    fetchAnnouncements();
    fetchAdminEvents();
  }, []);

  const handleRefreshCurrent = () => {
    if (activeSection === 'applications') {
      fetchApplications();
    } else if (activeSection === 'visit_requests') {
      fetchVisitRequests();
    } else if (activeSection === 'contact_messages') {
      fetchContactMessages();
    } else if (activeSection === 'announcements') {
      fetchAnnouncements();
    } else if (activeSection === 'events') {
      fetchAdminEvents();
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
    onLogOut();
  };

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const q = appSearch.toLowerCase().trim();
    if (!q) return true;
    const name = (app.full_name || app.fullName || '').toLowerCase();
    const email = (app.email || '').toLowerCase();
    const classification = (app.classification || '').toLowerCase();
    const status = (app.status || '').toLowerCase();
    return name.includes(q) || email.includes(q) || classification.includes(q) || status.includes(q);
  });

  // Filtered Visit Requests
  const filteredVisits = visitRequests.filter((vr) => {
    const q = visitSearch.toLowerCase().trim();
    if (!q) return true;
    const fullName = `${vr.first_name || ''} ${vr.last_name || ''}`.toLowerCase();
    const email = (vr.email || '').toLowerCase();
    const phone = (vr.phone || '').toLowerCase();
    const date = (vr.preferred_date || '').toLowerCase();
    return fullName.includes(q) || email.includes(q) || phone.includes(q) || date.includes(q);
  });

  // Filtered Contact Messages
  const filteredMessages = contactMessages.filter((msg) => {
    const q = messageSearch.toLowerCase().trim();
    if (!q) return true;
    const name = (msg.full_name || '').toLowerCase();
    const email = (msg.email || '').toLowerCase();
    const phone = (msg.phone || '').toLowerCase();
    const subject = (msg.subject || '').toLowerCase();
    const body = (msg.message || '').toLowerCase();
    return name.includes(q) || email.includes(q) || phone.includes(q) || subject.includes(q) || body.includes(q);
  });

  // Filtered Announcements
  const filteredAnnouncements = announcements.filter((ann) => {
    const q = announcementSearch.toLowerCase().trim();
    if (!q) return true;
    const title = (ann.title || '').toLowerCase();
    const content = (ann.content || ann.body || '').toLowerCase();
    return title.includes(q) || content.includes(q);
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const parseFocusAreas = (focusAreas: any): string[] => {
    if (!focusAreas) return [];
    if (Array.isArray(focusAreas)) return focusAreas;
    if (typeof focusAreas === 'string') {
      try {
        const parsed = JSON.parse(focusAreas);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return focusAreas.split(',').map((s) => s.trim());
      }
    }
    return [String(focusAreas)];
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#CBD5E1] space-y-8 pb-16 font-sans relative">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-md animate-fadeIn">
          <div
            className={`p-4 rounded-2xl border shadow-2xl flex items-center justify-between space-x-3 text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                : 'bg-red-950 border-red-500 text-red-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Admin Header Bar */}
      <div className="bg-gradient-to-r from-[#01142E] via-[#011E41] to-[#0A2540] text-white py-8 px-4 sm:px-8 border-b-4 border-[#F7A81B] shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-[#F7A81B] text-[#011E41] font-montserrat font-extrabold px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow">
              <ShieldCheck className="w-4 h-4" />
              <span>Rotary Secretariat & Admin Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              Club Operations & Application Records
            </h1>
            <p className="text-xs text-[#94A3B8]">
              Authenticated Supabase Admin Access • Live Database Portal
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {userEmail && (
              <div className="bg-[#011E41] border border-[#F7A81B]/40 px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-2 text-[#F7A81B] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{userEmail}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleRefreshCurrent}
              className="bg-[#0A2540] hover:bg-[#011E41] border border-[#F7A81B]/30 text-white font-montserrat font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
              title="Reload live database records"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#F7A81B] ${appsLoading || visitsLoading || messagesLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="bg-red-600/90 hover:bg-red-700 text-white font-montserrat font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex bg-[#011E41] p-1.5 rounded-2xl border border-[#F7A81B]/30 text-xs font-montserrat font-bold gap-2 overflow-x-auto shadow-lg">
          <button
            type="button"
            onClick={() => setActiveSection('applications')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeSection === 'applications'
                ? 'bg-[#F7A81B] text-[#011E41] shadow-md font-extrabold'
                : 'text-[#CBD5E1] hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Membership Applications</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSection === 'applications'
                  ? 'bg-[#011E41] text-[#F7A81B]'
                  : 'bg-[#0A2540] text-[#F7A81B] border border-[#F7A81B]/30'
              }`}
            >
              {applications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('visit_requests')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeSection === 'visit_requests'
                ? 'bg-[#F7A81B] text-[#011E41] shadow-md font-extrabold'
                : 'text-[#CBD5E1] hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Visit Requests</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSection === 'visit_requests'
                  ? 'bg-[#011E41] text-[#F7A81B]'
                  : 'bg-[#0A2540] text-[#F7A81B] border border-[#F7A81B]/30'
              }`}
            >
              {visitRequests.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('contact_messages')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeSection === 'contact_messages'
                ? 'bg-[#F7A81B] text-[#011E41] shadow-md font-extrabold'
                : 'text-[#CBD5E1] hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Messages</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSection === 'contact_messages'
                  ? 'bg-[#011E41] text-[#F7A81B]'
                  : 'bg-[#0A2540] text-[#F7A81B] border border-[#F7A81B]/30'
              }`}
            >
              {contactMessages.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('announcements')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeSection === 'announcements'
                ? 'bg-[#F7A81B] text-[#011E41] shadow-md font-extrabold'
                : 'text-[#CBD5E1] hover:bg-white/10'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Announcements</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSection === 'announcements'
                  ? 'bg-[#011E41] text-[#F7A81B]'
                  : 'bg-[#0A2540] text-[#F7A81B] border border-[#F7A81B]/30'
              }`}
            >
              {announcements.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('events')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeSection === 'events'
                ? 'bg-[#F7A81B] text-[#011E41] shadow-md font-extrabold'
                : 'text-[#CBD5E1] hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Events & Meetings</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSection === 'events'
                  ? 'bg-[#011E41] text-[#F7A81B]'
                  : 'bg-[#0A2540] text-[#F7A81B] border border-[#F7A81B]/30'
              }`}
            >
              {adminEvents.length}
            </span>
          </button>
        </div>

        {/* SECTION 1: Membership Applications */}
        {activeSection === 'applications' && (
          <div className="bg-[#0A2540] p-6 rounded-3xl border border-[#F7A81B]/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#F7A81B]" />
                  <span>Submitted Membership Applications</span>
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Live data retrieved directly from Supabase <code className="text-[#F7A81B]">membership_applications</code> table.
                </p>
              </div>

              {/* Search Control */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search applicant name, classification..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-xs w-full sm:w-72 text-white placeholder:text-slate-400 focus:outline-none focus:border-[#F7A81B]"
                />
              </div>
            </div>

            {/* Error Message */}
            {appsError && (
              <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-red-300 font-bold mb-1">Database Error</strong>
                  <p>{appsError}</p>
                </div>
              </div>
            )}

            {/* Loading Spinner */}
            {appsLoading ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#F7A81B] animate-spin mx-auto" />
                <p className="text-xs text-slate-300">Fetching live applications from Supabase...</p>
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="py-16 text-center bg-[#011E41]/50 rounded-2xl border border-white/5 space-y-2">
                <Users className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-sm font-bold text-white">No membership applications found</p>
                <p className="text-xs text-slate-400">
                  {appSearch ? 'No applications match your search query.' : 'No records stored in membership_applications table.'}
                </p>
              </div>
            ) : (
              <div>
                {/* MOBILE STACKED CARD VIEW (< lg screens) */}
                <div className="block lg:hidden space-y-4">
                  {filteredApps.map((app) => {
                    const isExpanded = expandedAppId === app.id;
                    const focusList = parseFocusAreas(app.focus_areas || app.focusAreas);
                    const name = app.full_name || app.fullName || 'N/A';
                    const email = app.email || 'N/A';
                    const phone = app.phone || 'N/A';
                    const classification = app.classification || 'N/A';
                    const status = app.status || 'Submitted';
                    const createdAt = formatDate(app.created_at || app.createdAt);

                    const whyJoin = app.message || app.why_join || app.statement_of_interest || app.whyJoin || 'None provided';
                    const howHeard = app.how_heard || app.howHeard || 'N/A';
                    const attendance = app.attendance || app.meeting_attendance || app.attendanceConfirmation || 'N/A';
                    const connection = app.connection || app.rotary_connection || app.rotaryConnection || 'N/A';
                    const company = app.company || 'N/A';
                    const position = app.position || 'N/A';
                    const address = app.address || 'N/A';
                    const sponsor = app.sponsor_name || app.sponsorName || 'N/A';

                    return (
                      <div
                        key={`mob-${app.id || Math.random()}`}
                        className="bg-[#011E41] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3 shadow-lg"
                      >
                        <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                          <div>
                            <h4 className="font-serif font-bold text-base text-white">{name}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">{email} • {phone}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{createdAt}</span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-[#F7A81B] bg-[#F7A81B]/10 px-2.5 py-1 rounded-lg border border-[#F7A81B]/20 inline-block">
                            {classification}
                          </span>

                          <select
                            value={status}
                            onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                            className={`font-montserrat font-extrabold px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider border cursor-pointer focus:outline-none ${
                              status.toLowerCase().includes('approve')
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : status.toLowerCase().includes('reject')
                                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                : status.toLowerCase().includes('interview')
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : 'bg-amber-500/20 text-[#F7A81B] border-[#F7A81B]/40'
                            }`}
                          >
                            <option value="Pending Review" className="bg-[#011E41] text-amber-300">Pending Review</option>
                            <option value="Under Interview" className="bg-[#011E41] text-blue-300">Under Interview</option>
                            <option value="Approved" className="bg-[#011E41] text-emerald-300">Approved</option>
                            <option value="Rejected" className="bg-[#011E41] text-red-300">Rejected</option>
                          </select>
                        </div>

                        {focusList.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {focusList.map((area, idx) => (
                              <span
                                key={idx}
                                className="bg-[#0A2540] text-slate-300 text-[10px] px-2 py-0.5 rounded-md border border-white/10"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEmailModalForApp(app)}
                            className="p-2 bg-[#0A2540] hover:bg-[#F7A81B] text-[#F7A81B] hover:text-[#011E41] rounded-xl transition border border-[#F7A81B]/30 cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                            className="p-2 bg-[#0A2540] text-slate-200 rounded-xl transition border border-white/10 cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold"
                          >
                            <span>{isExpanded ? 'Hide Details' : 'View Dossier'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModalForApp(app)}
                            className="p-2 bg-red-950/60 text-red-300 hover:text-white rounded-xl transition border border-red-500/40 cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>

                        {/* Expandable Dossier on Mobile Card */}
                        {isExpanded && (
                          <div className="p-4 rounded-xl bg-[#01142E] border border-[#F7A81B]/30 space-y-3 text-xs mt-3 animate-fadeIn">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase text-[#F7A81B]">Statement of Interest</span>
                              <p className="text-slate-200 italic leading-relaxed">{whyJoin}</p>
                            </div>
                            <div className="space-y-1 text-slate-300 text-[11px] border-t border-white/5 pt-2">
                              <p><strong>Attendance:</strong> {attendance}</p>
                              <p><strong>How Heard:</strong> {howHeard}</p>
                              <p><strong>Connection:</strong> {connection}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* DESKTOP MULTI-COLUMN TABLE VIEW (lg+ screens) */}
                <div className="hidden lg:block overflow-x-auto border border-white/10 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#011E41] text-[#F7A81B] font-montserrat font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-3.5">Full Name & Contact</th>
                        <th className="p-3.5">Classification</th>
                        <th className="p-3.5">Avenues of Service</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Submitted Date</th>
                        <th className="p-3.5 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {filteredApps.map((app) => {
                        const isExpanded = expandedAppId === app.id;
                        const focusList = parseFocusAreas(app.focus_areas || app.focusAreas);
                        const name = app.full_name || app.fullName || 'N/A';
                        const email = app.email || 'N/A';
                        const phone = app.phone || 'N/A';
                        const classification = app.classification || 'N/A';
                        const status = app.status || 'Submitted';
                        const createdAt = formatDate(app.created_at || app.createdAt);

                        const whyJoin = app.message || app.why_join || app.statement_of_interest || app.whyJoin || 'None provided';
                        const howHeard = app.how_heard || app.howHeard || 'N/A';
                        const attendance = app.attendance || app.meeting_attendance || app.attendanceConfirmation || 'N/A';
                        const connection = app.connection || app.rotary_connection || app.rotaryConnection || 'N/A';
                        const company = app.company || 'N/A';
                        const position = app.position || 'N/A';
                        const address = app.address || 'N/A';
                        const sponsor = app.sponsor_name || app.sponsorName || 'N/A';

                        return (
                          <React.Fragment key={app.id || Math.random()}>
                            <tr
                              onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                              className={`hover:bg-[#011E41]/70 transition-colors cursor-pointer ${
                                isExpanded ? 'bg-[#011E41]/90' : ''
                              }`}
                            >
                              <td className="p-3.5">
                                <span className="font-bold text-sm text-white block">{name}</span>
                                <span className="text-[11px] text-slate-400 block mt-0.5">
                                  {email} • {phone}
                                </span>
                              </td>

                              <td className="p-3.5">
                                <span className="font-bold text-[#F7A81B] bg-[#F7A81B]/10 px-2.5 py-1 rounded-lg border border-[#F7A81B]/20 inline-block">
                                  {classification}
                                </span>
                                {(company !== 'N/A' || position !== 'N/A') && (
                                  <span className="text-[10px] text-slate-400 block mt-1">
                                    {position !== 'N/A' ? position : ''} {company !== 'N/A' ? `@ ${company}` : ''}
                                  </span>
                                )}
                              </td>

                              <td className="p-3.5">
                                {focusList.length > 0 ? (
                                  <div className="flex flex-wrap gap-1 max-w-xs">
                                    {focusList.map((area, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-[#0A2540] text-slate-300 text-[10px] px-2 py-0.5 rounded-md border border-white/10"
                                      >
                                        {area}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-500 italic">None selected</span>
                                )}
                              </td>

                              <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={status}
                                  onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                                  className={`font-montserrat font-extrabold px-2.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider border transition cursor-pointer focus:outline-none ${
                                    status.toLowerCase().includes('approve')
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                      : status.toLowerCase().includes('reject')
                                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                      : status.toLowerCase().includes('interview')
                                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                      : 'bg-amber-500/20 text-[#F7A81B] border-[#F7A81B]/40'
                                  }`}
                                >
                                  <option value="Pending Review" className="bg-[#011E41] text-amber-300">Pending Review</option>
                                  <option value="Under Interview" className="bg-[#011E41] text-blue-300">Under Interview</option>
                                  <option value="Approved" className="bg-[#011E41] text-emerald-300">Approved</option>
                                  <option value="Rejected" className="bg-[#011E41] text-red-300">Rejected</option>
                                </select>
                              </td>

                              <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                                {createdAt}
                              </td>

                              <td className="p-3.5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEmailModalForApp(app)}
                                    className="p-1.5 bg-[#011E41] hover:bg-[#F7A81B] text-[#F7A81B] hover:text-[#011E41] rounded-lg transition border border-[#F7A81B]/30 cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                                    title="Send email to applicant"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>Email Applicant</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                                    className="p-1.5 bg-[#011E41] hover:bg-[#0A2540] text-slate-300 rounded-lg transition border border-white/20 cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                                  >
                                    <span>{isExpanded ? 'Hide' : 'Expand'}</span>
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleOpenDeleteModalForApp(app)}
                                    className="p-1.5 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition border border-red-500/40 cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                                    title="Delete record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Expandable Row Content */}
                            {isExpanded && (
                              <tr className="bg-[#01142E] border-b border-white/10">
                                <td colSpan={6} className="p-5">
                                  <div className="p-5 rounded-2xl bg-[#011E41] border border-[#F7A81B]/30 space-y-4 text-xs">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                      <span className="text-[#F7A81B] font-montserrat font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#F7A81B]" />
                                        <span>Full Application Dossier (ID: {app.id})</span>
                                      </span>
                                      <span className="text-slate-400 text-[11px]">
                                        Submitted: {createdAt}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      <div className="p-3 rounded-xl bg-[#0A2540] border border-white/5 space-y-1">
                                        <span className="text-[10px] font-bold uppercase text-[#F7A81B] block">Personal Info</span>
                                        <p className="text-white font-bold">{name}</p>
                                        <p className="text-slate-300">{email}</p>
                                        <p className="text-slate-300">{phone}</p>
                                        {address !== 'N/A' && <p className="text-slate-400 text-[11px] mt-1">Address: {address}</p>}
                                      </div>

                                      <div className="p-3 rounded-xl bg-[#0A2540] border border-white/5 space-y-1">
                                        <span className="text-[10px] font-bold uppercase text-[#F7A81B] block">Vocation & Company</span>
                                        <p className="text-white font-bold">{classification}</p>
                                        <p className="text-slate-300">{position} {company !== 'N/A' ? `@ ${company}` : ''}</p>
                                        {sponsor !== 'N/A' && <p className="text-amber-300 text-[11px]">Sponsor: {sponsor}</p>}
                                      </div>

                                      <div className="p-3 rounded-xl bg-[#0A2540] border border-white/5 space-y-1">
                                        <span className="text-[10px] font-bold uppercase text-[#F7A81B] block">Meeting Attendance & Referral</span>
                                        <p className="text-slate-200"><strong>Attendance:</strong> {attendance}</p>
                                        <p className="text-slate-200"><strong>How Heard:</strong> {howHeard}</p>
                                        <p className="text-slate-200"><strong>Rotary Connection:</strong> {connection}</p>
                                      </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-[#0A2540] border border-white/5 space-y-1">
                                      <span className="text-[10px] font-bold uppercase text-[#F7A81B] block">Statement of Interest / Why Join</span>
                                      <p className="text-slate-200 italic leading-relaxed text-xs">
                                        "{whyJoin}"
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: Visit Requests */}
        {activeSection === 'visit_requests' && (
          <div className="bg-[#0A2540] p-6 rounded-3xl border border-[#F7A81B]/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#F7A81B]" />
                  <span>Meeting Visit & Guest Requests</span>
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Live data retrieved directly from Supabase <code className="text-[#F7A81B]">visit_requests</code> table.
                </p>
              </div>

              {/* Search Control */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search guest name, email, date..."
                  value={visitSearch}
                  onChange={(e) => setVisitSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-xs w-full sm:w-72 text-white placeholder:text-slate-400 focus:outline-none focus:border-[#F7A81B]"
                />
              </div>
            </div>

            {/* Error Message */}
            {visitsError && (
              <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-red-300 font-bold mb-1">Database Error</strong>
                  <p>{visitsError}</p>
                </div>
              </div>
            )}

            {/* Loading Spinner */}
            {visitsLoading ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#F7A81B] animate-spin mx-auto" />
                <p className="text-xs text-slate-300">Fetching visit requests from Supabase...</p>
              </div>
            ) : filteredVisits.length === 0 ? (
              <div className="py-16 text-center bg-[#011E41]/50 rounded-2xl border border-white/5 space-y-2">
                <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-sm font-bold text-white">No visit requests found</p>
                <p className="text-xs text-slate-400">
                  {visitSearch ? 'No guest requests match your search query.' : 'No records stored in visit_requests table.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-white/10 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#011E41] text-[#F7A81B] font-montserrat font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-3.5">Guest Name & Contact</th>
                      <th className="p-3.5">Preferred Visit Date</th>
                      <th className="p-3.5">No. of Guests</th>
                      <th className="p-3.5">Notes / Message</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Request Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {filteredVisits.map((vr) => {
                      const guestName = `${vr.first_name || ''} ${vr.last_name || ''}`.trim() || 'Anonymous Guest';
                      const email = vr.email || 'N/A';
                      const phone = vr.phone || 'N/A';
                      const prefDate = vr.preferred_date || 'N/A';
                      const guestCount = vr.number_of_guests || 1;
                      const notes = vr.notes || 'None provided';
                      const status = vr.status || 'Pending';
                      const createdAt = formatDate(vr.created_at);

                      return (
                        <tr key={vr.id || Math.random()} className="hover:bg-[#011E41]/70 transition-colors">
                          <td className="p-3.5">
                            <span className="font-bold text-sm text-white block">{guestName}</span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {email} • {phone}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-[#F7A81B] bg-[#F7A81B]/10 px-2.5 py-1 rounded-lg border border-[#F7A81B]/20 inline-block font-mono text-[11px]">
                              {prefDate}
                            </span>
                          </td>

                          <td className="p-3.5 font-bold text-slate-300">
                            {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                          </td>

                          <td className="p-3.5 max-w-xs text-slate-300 italic">
                            <span className="line-clamp-2">"{notes}"</span>
                          </td>

                          <td className="p-3.5">
                            <select
                              value={status}
                              onChange={(e) => handleUpdateVisitStatus(vr.id, e.target.value)}
                              className={`font-montserrat font-extrabold px-2.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider border transition cursor-pointer focus:outline-none ${
                                status.toLowerCase().includes('confirm') || status.toLowerCase().includes('approve')
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : status.toLowerCase().includes('cancel') || status.toLowerCase().includes('decline')
                                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                  : 'bg-amber-500/20 text-[#F7A81B] border-[#F7A81B]/40'
                              }`}
                            >
                              <option value="Pending" className="bg-[#011E41] text-amber-300">Pending</option>
                              <option value="Confirmed" className="bg-[#011E41] text-emerald-300">Confirmed</option>
                              <option value="Cancelled" className="bg-[#011E41] text-red-300">Cancelled</option>
                              <option value="Completed" className="bg-[#011E41] text-blue-300">Completed</option>
                            </select>
                          </td>

                          <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                            {createdAt}
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEmailModalForVisit(vr)}
                                className="p-1.5 bg-[#011E41] hover:bg-[#F7A81B] text-[#F7A81B] hover:text-[#011E41] rounded-lg transition border border-[#F7A81B]/30 cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                                title="Send email to guest"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Email Guest</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenDeleteModalForVisit(vr)}
                                className="p-1.5 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition border border-red-500/40 cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                                title="Delete visit request"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: Contact Messages */}
        {activeSection === 'contact_messages' && (
          <div className="bg-[#0A2540] p-6 rounded-3xl border border-[#F7A81B]/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#F7A81B]" />
                  <span>Submitted Contact Messages</span>
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Live data retrieved directly from Supabase <code className="text-[#F7A81B]">contact_messages</code> table.
                </p>
              </div>

              {/* Search Control */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search name, email, subject..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-xs w-full sm:w-72 text-white placeholder:text-slate-400 focus:outline-none focus:border-[#F7A81B]"
                />
              </div>
            </div>

            {/* Error Message */}
            {messagesError && (
              <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-red-300 font-bold mb-1">Database Error</strong>
                  <p>{messagesError}</p>
                </div>
              </div>
            )}

            {/* Loading Spinner */}
            {messagesLoading ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#F7A81B] animate-spin mx-auto" />
                <p className="text-xs text-slate-300">Fetching contact messages from Supabase...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="py-16 text-center bg-[#011E41]/50 rounded-2xl border border-white/5 space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-sm font-bold text-white">No contact messages found</p>
                <p className="text-xs text-slate-400">
                  {messageSearch ? 'No messages match your search query.' : 'No records stored in contact_messages table.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-white/10 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#011E41] text-[#F7A81B] font-montserrat font-bold uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-3.5">Sender Name & Email</th>
                      <th className="p-3.5">Phone Number</th>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Message Content</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date Received</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {filteredMessages.map((msg) => {
                      const fullName = msg.full_name || 'Anonymous';
                      const email = msg.email || 'N/A';
                      const phone = msg.phone || 'N/A';
                      const subject = msg.subject || 'General Inquiry';
                      const messageBody = msg.message || 'No message content';
                      const status = msg.status || 'Pending';
                      const createdAt = formatDate(msg.created_at);

                      return (
                        <tr key={msg.id || Math.random()} className="hover:bg-[#011E41]/70 transition-colors">
                          <td className="p-3.5">
                            <span className="font-bold text-sm text-white block">{fullName}</span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {email}
                            </span>
                          </td>

                          <td className="p-3.5 font-mono text-slate-300">
                            {phone}
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-[#F7A81B] bg-[#F7A81B]/10 px-2.5 py-1 rounded-lg border border-[#F7A81B]/20 inline-block text-[11px]">
                              {subject}
                            </span>
                          </td>

                          <td className="p-3.5 max-w-md text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {messageBody}
                          </td>

                          <td className="p-3.5">
                            <select
                              value={status}
                              onChange={(e) => handleUpdateMessageStatus(msg.id, e.target.value)}
                              className={`font-montserrat font-extrabold px-2.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider border transition cursor-pointer focus:outline-none ${
                                status.toLowerCase().includes('respond') || status.toLowerCase().includes('closed')
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : status.toLowerCase().includes('progress')
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                  : 'bg-amber-500/20 text-[#F7A81B] border-[#F7A81B]/40'
                              }`}
                            >
                              <option value="Pending" className="bg-[#011E41] text-amber-300">Pending</option>
                              <option value="In Progress" className="bg-[#011E41] text-blue-300">In Progress</option>
                              <option value="Responded" className="bg-[#011E41] text-emerald-300">Responded</option>
                              <option value="Closed" className="bg-[#011E41] text-slate-300">Closed</option>
                            </select>
                          </td>

                          <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                            {createdAt}
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEmailModalForMessage(msg)}
                                className="p-1.5 bg-[#011E41] hover:bg-[#F7A81B] text-[#F7A81B] hover:text-[#011E41] rounded-lg transition border border-[#F7A81B]/30 cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                                title="Reply to message"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Reply</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenDeleteModalForMessage(msg)}
                                className="p-1.5 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition border border-red-500/40 cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                                title="Delete message"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: Announcements Tab */}
        {activeSection === 'announcements' && (
          <div className="bg-[#0A2540] p-6 rounded-3xl border border-[#F7A81B]/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#F7A81B]" />
                  <span>Club Announcements & Bulletins</span>
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Manage official broadcasts stored in Supabase <code className="text-[#F7A81B]">announcements</code> table.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Control */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
                  <input
                    type="text"
                    placeholder="Search title, content..."
                    value={announcementSearch}
                    onChange={(e) => setAnnouncementSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-xs w-full sm:w-60 text-white placeholder:text-slate-400 focus:outline-none focus:border-[#F7A81B]"
                  />
                </div>

                {/* Create Announcement Button */}
                <button
                  type="button"
                  onClick={handleOpenCreateAnnouncement}
                  className="bg-[#F7A81B] hover:bg-[#f59e0b] text-[#011E41] font-montserrat font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Create Announcement</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {announcementsError && (
              <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-red-300 font-bold mb-1">Database Error</strong>
                  <span>{announcementsError}</span>
                </div>
              </div>
            )}

            {/* Table / List View */}
            {announcementsLoading ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#F7A81B] animate-spin mx-auto" />
                <p className="text-xs text-slate-300 font-mono">Loading announcements from Supabase...</p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-[#011E41]/50 rounded-2xl border border-white/10 max-w-md mx-auto px-6">
                <Megaphone className="w-10 h-10 text-[#F7A81B]/60 mx-auto" />
                <h4 className="font-serif font-bold text-white text-base">No Announcements Found</h4>
                <p className="text-xs text-slate-400">
                  {announcementSearch.trim()
                    ? 'No announcements matched your search query.'
                    : 'No announcements have been created yet. Click "Create Announcement" to publish your first update.'}
                </p>
                {!announcementSearch.trim() && (
                  <button
                    type="button"
                    onClick={handleOpenCreateAnnouncement}
                    className="inline-flex items-center gap-1.5 bg-[#F7A81B] text-[#011E41] font-extrabold text-xs px-4 py-2 rounded-xl mt-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Announcement</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAnnouncements.map((ann) => {
                  const title = ann.title || 'Untitled Announcement';
                  const content = ann.content || ann.body || '';
                  const imageUrl = ann.image_url || ann.imageUrl || null;
                  const dateStr = formatDate(ann.created_at);

                  return (
                    <div
                      key={ann.id}
                      className="bg-[#011E41] p-5 rounded-2xl border border-[#F7A81B]/30 flex flex-col justify-between space-y-4 hover:border-[#F7A81B]/60 transition shadow-lg"
                    >
                      <div className="space-y-3">
                        {imageUrl && (
                          <div className="w-full h-40 bg-slate-900 rounded-xl overflow-hidden relative border border-white/10">
                            <img
                              src={imageUrl}
                              alt={title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-mono text-[#F7A81B] font-bold text-[10px] uppercase bg-[#0A2540] px-2.5 py-0.5 rounded-full border border-[#F7A81B]/30">
                            Announcement Record
                          </span>
                          <span className="flex items-center space-x-1 font-mono text-[11px] text-slate-400">
                            <Clock className="w-3 h-3 text-[#F7A81B]" />
                            <span>{dateStr}</span>
                          </span>
                        </div>

                        <h4 className="font-serif font-bold text-lg text-white leading-snug">
                          {title}
                        </h4>

                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line line-clamp-4">
                          {content}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">ID: {String(ann.id).substring(0, 8)}...</span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditAnnouncement(ann)}
                            className="p-1.5 bg-[#0A2540] hover:bg-[#F7A81B] text-[#F7A81B] hover:text-[#011E41] rounded-lg transition border border-[#F7A81B]/30 cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                            title="Edit announcement"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModalForAnnouncement(ann)}
                            className="p-1.5 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition border border-red-500/40 cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                            title="Delete announcement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: Events & Meetings */}
        {activeSection === 'events' && (
          <div className="bg-[#0A2540] p-6 rounded-3xl border border-[#F7A81B]/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#F7A81B]" />
                  <span>Club Events & Meetings Calendar Management</span>
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Create, edit, and manage events visible on the member portal calendar in Supabase.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleOpenCreateEvent}
                  className="bg-[#F7A81B] hover:bg-[#f59e0b] text-[#011E41] font-montserrat font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Event</span>
                </button>
              </div>
            </div>

            {eventsLoading ? (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#F7A81B] animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Loading events from Supabase...</p>
              </div>
            ) : adminEvents.length === 0 ? (
              <div className="py-12 text-center bg-[#011E41]/50 rounded-2xl border border-white/5 space-y-3 max-w-md mx-auto px-6">
                <Calendar className="w-8 h-8 text-[#F7A81B] mx-auto" />
                <h4 className="font-serif text-lg font-bold text-white">No Events Scheduled Yet</h4>
                <p className="text-xs text-slate-400">Click "Create New Event" above to schedule weekly meetings, service projects, or board meetings.</p>
                <button
                  type="button"
                  onClick={handleOpenCreateEvent}
                  className="mt-2 inline-flex items-center space-x-2 bg-[#F7A81B] text-[#011E41] font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Event</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-[#011E41] p-5 rounded-2xl border border-white/10 hover:border-[#F7A81B]/40 transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-[#0A2540] text-[#F7A81B] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-[#F7A81B]/30">
                          {evt.event_type || 'General Meeting'}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{evt.event_date}</span>
                      </div>
                      <h4 className="font-serif font-bold text-white text-base">{evt.title}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2">{evt.description}</p>
                      <div className="text-xs text-slate-400 space-y-1 pt-1 font-mono">
                        <p>🕒 {evt.event_time || '12:00 PM'}</p>
                        <p>📍 {evt.location || 'The Manila Peninsula'}</p>
                        {evt.virtual_link && <p className="text-[#F7A81B] truncate">🔗 {evt.virtual_link}</p>}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditEvent(evt)}
                        className="px-3 py-1.5 bg-[#0A2540] hover:bg-slate-800 text-[#F7A81B] border border-[#F7A81B]/30 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Render Create / Edit Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0A2540] border border-[#F7A81B]/40 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#011E41] rounded-2xl border border-[#F7A81B]/30 text-[#F7A81B]">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">
                    {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {editingAnnouncement
                      ? 'Update the title, content body, or optional image URL.'
                      : 'Publish an official update to all club members.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-5">
              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-montserrat font-bold text-slate-200 uppercase tracking-wider">
                  Announcement Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 61st Charter Anniversary Fellowship Assembly"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B]"
                />
              </div>

              {/* Content Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-montserrat font-bold text-slate-200 uppercase tracking-wider">
                  Content Body <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write the complete announcement text here..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B] resize-y"
                />
              </div>

              {/* Optional Image URL Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-montserrat font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                  <span>Header Image URL</span>
                  <span className="text-[10px] text-slate-400 lowercase font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-montserrat font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#F7A81B] hover:bg-[#f59e0b] text-[#011E41] text-xs font-montserrat font-extrabold transition shadow-lg flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{formSubmitting ? 'Saving...' : editingAnnouncement ? 'Update Announcement' : 'Publish Announcement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Create / Edit Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0A2540] border border-[#F7A81B]/40 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#011E41] rounded-2xl border border-[#F7A81B]/30 text-[#F7A81B]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">
                    {editingEvent ? 'Edit Event / Meeting' : 'Schedule New Event / Meeting'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Publish event onto the member calendar and RSVP feed.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-montserrat font-bold text-slate-200 uppercase tracking-wider">
                  Event Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Regular Tuesday Luncheon & Guest Speaker"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-sm text-white focus:outline-none focus:border-[#F7A81B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-montserrat font-bold text-slate-200 uppercase tracking-wider">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-sm text-white focus:outline-none focus:border-[#F7A81B]"
                  >
                    <option value="General Meeting">General Meeting</option>
                    <option value="Board Meeting">Board Meeting</option>
                    <option value="Committee Meeting">Committee Meeting</option>
                    <option value="Social Event">Social Event</option>
                    <option value="Community Service">Community Service</option>
                    <option value="Fundraiser">Fundraiser</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-montserrat font-bold text-slate-200 uppercase tracking-wider">
                    Event Date (YYYY-MM-DD) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-sm text-white focus:outline-none focus:border-[#F7A81B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-montserrat font-bold text-slate-200 uppercase tracking-wider">
                    Event Time Range
                  </label>
                  <input
                    type="text"
                    placeholder="12:00 PM – 2:00 PM"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-sm text-white focus:outline-none focus:border-[#F7A81B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-montserrat font-bold text-slate-200 uppercase tracking-wider">
                    Location Venue
                  </label>
                  <input
                    type="text"
                    placeholder="The Conservatory, The Manila Peninsula"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-sm text-white focus:outline-none focus:border-[#F7A81B]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-montserrat font-bold text-slate-200 uppercase tracking-wider">
                  Virtual Link (Zoom/Teams - Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://zoom.us/j/123456789"
                  value={eventVirtualLink}
                  onChange={(e) => setEventVirtualLink(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-sm text-white focus:outline-none focus:border-[#F7A81B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-montserrat font-bold text-slate-200 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Details regarding agenda, guest speakers, attire, and guidelines..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#011E41] border border-[#F7A81B]/30 rounded-xl text-sm text-white focus:outline-none focus:border-[#F7A81B]"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs font-montserrat font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={eventSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#F7A81B] hover:bg-[#f59e0b] text-[#011E41] text-xs font-montserrat font-extrabold transition shadow-lg flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {eventSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{eventSubmitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Email Compose Modal */}
      {emailModalProps && (
        <AdminEmailComposeModal
          isOpen={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
          recipientEmail={emailModalProps.recipientEmail}
          recipientName={emailModalProps.recipientName}
          defaultSubject={emailModalProps.defaultSubject}
          defaultMessage={emailModalProps.defaultMessage}
          relatedRecordId={emailModalProps.relatedRecordId}
          relatedTableName={emailModalProps.relatedTableName}
          adminEmail={userEmail}
          onEmailSent={(msg) => showToast('success', msg)}
        />
      )}

      {/* Render Delete Confirm Modal */}
      {deleteModalProps && (
        <AdminDeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          recordId={deleteModalProps.recordId}
          recordTitle={deleteModalProps.recordTitle}
          recordSubtitle={deleteModalProps.recordSubtitle}
          recordDate={deleteModalProps.recordDate}
          tableName={deleteModalProps.tableName}
          tableLabel={deleteModalProps.tableLabel}
          userEmail={userEmail}
          onSuccessDelete={handleSuccessDelete}
          onErrorDelete={(err) => showToast('error', err)}
        />
      )}
    </div>
  );
};
