import React, { useState, useEffect } from 'react';
import { Announcement, AnnouncementCategory, PageView } from '../types';
import { AnnouncementService, CATEGORY_CONFIG } from '../lib/announcements';
import { announcementSchema } from '../lib/announcementsSchema';
import {
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Calendar,
  Save,
  Clock,
  Database,
  Code2,
  Loader2,
  Check,
  X,
  FileText,
  Lock,
  RotateCcw,
} from 'lucide-react';

interface AdminAnnouncementsPageProps {
  onNavigate?: (page: PageView) => void;
  currentUser?: { role: string; name: string } | null;
}

export const AdminAnnouncementsPage: React.FC<AdminAnnouncementsPageProps> = ({
  onNavigate,
  currentUser,
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);

  // Form states
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('club_business');
  const [priority, setPriority] = useState<Announcement['priority']>('MEDIUM');
  const [published, setPublished] = useState<boolean>(true);

  // Validation & feedback state
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; body?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const isAdmin =
    currentUser?.role?.toUpperCase().includes('ADMIN') ||
    currentUser?.role?.toUpperCase().includes('BOARD') ||
    currentUser?.role?.toUpperCase().includes('PRESIDENT');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('Restore original default club announcements? Any test additions will be reset.')) {
      const defaults = AnnouncementService.restoreDefaults();
      setAnnouncements(defaults);
      showToast('success', 'Original default announcements restored successfully.');
    }
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      // Call REST API route
      const response = await fetch('/api/announcements', {
        headers: {
          'x-user-role': currentUser?.role || 'ADMIN',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Normalize published status field
        const list: Announcement[] = (data.announcements || []).map((item: any) => ({
          ...item,
          is_published: item.published ?? item.is_published ?? true,
          published: item.published ?? item.is_published ?? true,
        }));
        setAnnouncements(list);
      } else {
        // Fallback to local storage
        setAnnouncements(AnnouncementService.getAllAnnouncements());
      }
    } catch (err) {
      console.warn('API fetch failed, falling back to local storage:', err);
      setAnnouncements(AnnouncementService.getAllAnnouncements());
    } finally {
      setLoading(false);
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setTitle('');
    setBody('');
    setCategory('club_business');
    setPriority('MEDIUM');
    setPublished(true);
    setFieldErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const openEditModal = (ann: Announcement) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setBody(ann.body);
    setCategory(ann.category || 'club_business');
    setPriority(ann.priority || 'MEDIUM');
    setPublished(ann.published ?? ann.is_published ?? true);
    setFieldErrors({});
    setApiError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Validate with Zod
    const result = announcementSchema.safeParse({
      title,
      body,
      published,
      category,
      priority,
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        title: errors.title ? errors.title[0] : undefined,
        body: errors.body ? errors.body[0] : undefined,
      });
      return;
    }

    setFieldErrors({});
    setActionLoadingId(editingId || 'new');

    const payload = {
      title: result.data.title,
      body: result.data.body,
      published: result.data.published,
      category: result.data.category,
      priority: result.data.priority,
      authorName: currentUser?.name || 'Pres. Eduardo Francisco',
    };

    try {
      let response: Response;
      if (editingId) {
        response = await fetch(`/api/announcements/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': currentUser?.role || 'ADMIN',
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/announcements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': currentUser?.role || 'ADMIN',
          },
          body: JSON.stringify(payload),
        });
      }

      if (response.status === 403) {
        setApiError('403 Forbidden: You do not have permission (Admin/Board role required).');
        showToast('error', 'Action rejected: Admin/Board permission required.');
        return;
      }

      if (!response.ok) {
        const errData = await response.json();
        setApiError(errData.error || 'Server error occurred while saving.');
        showToast('error', errData.error || 'Failed to save announcement.');
        return;
      }

      // Sync local state as well
      if (editingId) {
        AnnouncementService.updateAnnouncement(editingId, {
          title: payload.title,
          body: payload.body,
          is_published: payload.published,
          published: payload.published,
        });
        showToast('success', 'Announcement updated successfully!');
      } else {
        AnnouncementService.addAnnouncement({
          title: payload.title,
          body: payload.body,
          category: payload.category as AnnouncementCategory,
          priority: payload.priority as any,
          is_published: payload.published,
          published: payload.published,
          authorName: payload.authorName,
        });
        showToast('success', 'New announcement posted successfully!');
      }

      setShowModal(false);
      await fetchAnnouncements();
    } catch (err: any) {
      console.error('Error saving announcement:', err);
      // Fallback update
      if (editingId) {
        AnnouncementService.updateAnnouncement(editingId, {
          title: payload.title,
          body: payload.body,
          is_published: payload.published,
          published: payload.published,
        });
      } else {
        AnnouncementService.addAnnouncement({
          title: payload.title,
          body: payload.body,
          category: payload.category as AnnouncementCategory,
          priority: payload.priority as any,
          is_published: payload.published,
          published: payload.published,
          authorName: payload.authorName,
        });
      }
      setShowModal(false);
      showToast('success', 'Announcement saved locally.');
      await fetchAnnouncements();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTogglePublished = async (ann: Announcement) => {
    setActionLoadingId(ann.id);
    const targetStatus = !(ann.published ?? ann.is_published);

    try {
      const response = await fetch(`/api/announcements/${ann.id}/toggle`, {
        method: 'PATCH',
        headers: {
          'x-user-role': currentUser?.role || 'ADMIN',
        },
      });

      if (response.status === 403) {
        showToast('error', '403 Forbidden: Only Admin/Board roles can change publication status.');
        return;
      }

      if (response.ok) {
        showToast(
          'success',
          `Announcement ${targetStatus ? 'published' : 'moved to drafts'} successfully!`
        );
      } else {
        // Fallback update
        AnnouncementService.updateAnnouncement(ann.id, {
          is_published: targetStatus,
          published: targetStatus,
        });
        showToast('success', `Status updated to ${targetStatus ? 'Published' : 'Draft'}`);
      }

      await fetchAnnouncements();
    } catch (e) {
      AnnouncementService.updateAnnouncement(ann.id, {
        is_published: targetStatus,
        published: targetStatus,
      });
      showToast('success', `Status updated to ${targetStatus ? 'Published' : 'Draft'}`);
      await fetchAnnouncements();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoadingId(id);
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': currentUser?.role || 'ADMIN',
        },
      });

      if (response.status === 403) {
        showToast('error', '403 Forbidden: Admin/Board permission required to delete.');
        setDeleteConfirmId(null);
        return;
      }

      if (response.ok) {
        showToast('success', 'Announcement deleted successfully.');
      } else {
        AnnouncementService.deleteAnnouncement(id);
        showToast('success', 'Announcement deleted.');
      }

      setDeleteConfirmId(null);
      await fetchAnnouncements();
    } catch (e) {
      AnnouncementService.deleteAnnouncement(id);
      showToast('success', 'Announcement deleted locally.');
      setDeleteConfirmId(null);
      await fetchAnnouncements();
    } finally {
      setActionLoadingId(null);
    }
  };

  // Helper date formatter
  const formatPostedDate = (rawDate: string) => {
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return 'Posted recently';
      return `Posted ${d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}`;
    } catch (e) {
      return 'Posted recently';
    }
  };

  // Split published vs draft announcements and sort newest first
  const publishedList = announcements
    .filter((a) => a.published === true || a.is_published === true)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const draftList = announcements
    .filter((a) => a.published === false && a.is_published === false)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="bg-[#FAFAF7] min-h-screen text-[#1A1F2B] font-sans p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center space-x-3 text-xs font-semibold border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-500'
              : 'bg-[#A2001D] text-white border-red-400'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="opacity-70 hover:opacity-100 pl-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-[#17458F]/10 text-[#17458F] font-montserrat font-bold text-[11px] rounded-md uppercase tracking-wider">
              {isAdmin ? 'Admin Dashboard' : 'Official Bulletins'}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-xs text-[#0080C8] font-medium flex items-center gap-1">
              <Lock className="w-3 h-3" /> {isAdmin ? 'Postgres RLS Protected' : 'Read-Only Member Access'}
            </span>
          </div>
          <h1 className="font-serif font-extrabold text-2xl text-[#17458F] mt-1 flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-[#F7A81B]" />
            <span>Club Announcements & Bulletins</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
            {isAdmin
              ? 'Create, publish, edit, and organize official bulletins for the Rotary Club of Makati. Server-side permissions verify Admin credentials.'
              : 'Official bulletins and messages from the Rotary Club of Makati President and Secretariat. Members have read-only access.'}
          </p>
        </div>

        {isAdmin ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRestoreDefaults}
              className="px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-montserrat font-bold text-xs flex items-center space-x-2 transition shadow-sm cursor-pointer"
              title="Restore Original Default Announcements"
            >
              <RotateCcw className="w-4 h-4 text-amber-700" />
              <span>Restore Defaults</span>
            </button>

            <button
              onClick={() => setShowSqlModal(true)}
              className="px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-[#17458F] font-montserrat font-bold text-xs flex items-center space-x-2 transition shadow-sm cursor-pointer"
              title="Inspect Postgres DB Schema & RLS Rules"
            >
              <Database className="w-4 h-4 text-[#0080C8]" />
              <span>DB Schema & RLS</span>
            </button>

            <button
              onClick={openNewModal}
              className="bg-[#17458F] hover:bg-[#0F326B] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-2 transition cursor-pointer transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 text-[#F7A81B]" />
              <span>Create Announcement</span>
            </button>
          </div>
        ) : (
          <div className="px-4 py-2 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-montserrat font-bold flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Read-Only View • Posting Reserved for Admin</span>
          </div>
        )}
      </div>

      {/* Loading state indicator */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <Loader2 className="w-8 h-8 text-[#17458F] animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">Fetching announcements from server...</p>
        </div>
      ) : announcements.length === 0 ? (
        /* Entirely Empty State */
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm space-y-4 max-w-xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-[#17458F]/10 text-[#17458F] flex items-center justify-center mx-auto">
            <Megaphone className="w-6 h-6 text-[#F7A81B]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#17458F]">No announcements yet</h3>
            <p className="text-xs text-gray-500 mt-1">
              Get started by creating your first official club announcement or board resolution.
            </p>
          </div>
          <button
            onClick={openNewModal}
            className="bg-[#17458F] hover:bg-[#0F326B] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow transition inline-flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#F7A81B]" />
            <span>Create First Announcement</span>
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* SECTION 1: PUBLISHED ANNOUNCEMENTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2.5">
              <div className="flex items-center space-x-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <h2 className="font-serif font-bold text-lg text-[#17458F]">Published Announcements</h2>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
                  {publishedList.length}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-mono">Visible on public feeds</span>
            </div>

            {publishedList.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-gray-500">
                No published announcements. Use the toggle switch on any draft below to publish it.
              </div>
            ) : (
              <div className="grid gap-4">
                {publishedList.map((ann) => (
                  <AnnouncementRow
                    key={ann.id}
                    ann={ann}
                    isAdmin={isAdmin}
                    actionLoadingId={actionLoadingId}
                    deleteConfirmId={deleteConfirmId}
                    setDeleteConfirmId={setDeleteConfirmId}
                    onToggle={handleTogglePublished}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    formatPostedDate={formatPostedDate}
                  />
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: DRAFTS / UNPUBLISHED ANNOUNCEMENTS (ADMIN ONLY) */}
          {isAdmin && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <h2 className="font-serif font-bold text-lg text-[#17458F]">Drafts / Unpublished</h2>
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
                    {draftList.length}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-mono">Private admin view only</span>
              </div>

              {draftList.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-gray-500">
                  No draft announcements currently.
                </div>
              ) : (
                <div className="grid gap-4">
                  {draftList.map((ann) => (
                    <AnnouncementRow
                      key={ann.id}
                      ann={ann}
                      isAdmin={isAdmin}
                      actionLoadingId={actionLoadingId}
                      deleteConfirmId={deleteConfirmId}
                      setDeleteConfirmId={setDeleteConfirmId}
                      onToggle={handleTogglePublished}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      formatPostedDate={formatPostedDate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1F2B]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-serif font-extrabold text-xl text-[#17458F]">
                  {editingId ? 'Edit Announcement' : 'Create New Announcement'}
                </h3>
                <p className="text-xs text-gray-500">
                  Fill in the details below. Validation will verify input length rules.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {apiError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-[#A2001D] text-xs rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Title Input */}
              <div>
                <label className="block font-montserrat font-bold text-gray-800 mb-1">
                  Title / Headline <span className="text-[#A2001D]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (fieldErrors.title) setFieldErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  placeholder="e.g. Weekly Luncheon Speaker: Sec. Ralph Recto (3 - 200 characters)"
                  className={`w-full bg-[#FAFAF7] border p-2.5 rounded-xl text-sm transition focus:outline-none focus:ring-2 ${
                    fieldErrors.title
                      ? 'border-[#A2001D] focus:ring-red-200'
                      : 'border-gray-300 focus:ring-[#17458F]/30 focus:border-[#17458F]'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {fieldErrors.title ? (
                    <span className="text-[#A2001D] font-medium text-[11px]">{fieldErrors.title}</span>
                  ) : (
                    <span className="text-[11px] text-gray-400">Must be between 3 and 200 characters.</span>
                  )}
                  <span className="text-[11px] text-gray-400 font-mono">{title.length}/200</span>
                </div>
              </div>

              {/* Body Textarea */}
              <div>
                <label className="block font-montserrat font-bold text-gray-800 mb-1">
                  Announcement Content / Body <span className="text-[#A2001D]">*</span>
                </label>
                <textarea
                  rows={5}
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    if (fieldErrors.body) setFieldErrors((prev) => ({ ...prev, body: undefined }));
                  }}
                  placeholder="Write the complete announcement bulletin details here (minimum 10 characters)..."
                  className={`w-full bg-[#FAFAF7] border p-2.5 rounded-xl text-xs transition focus:outline-none focus:ring-2 ${
                    fieldErrors.body
                      ? 'border-[#A2001D] focus:ring-red-200'
                      : 'border-gray-300 focus:ring-[#17458F]/30 focus:border-[#17458F]'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {fieldErrors.body ? (
                    <span className="text-[#A2001D] font-medium text-[11px]">{fieldErrors.body}</span>
                  ) : (
                    <span className="text-[11px] text-gray-400">Minimum 10 characters required.</span>
                  )}
                  <span className="text-[11px] text-gray-400 font-mono">{body.length} chars</span>
                </div>
              </div>

              {/* Category & Priority Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-montserrat font-bold text-gray-800 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                    className="w-full bg-[#FAFAF7] border border-gray-300 p-2 rounded-xl text-xs font-semibold focus:border-[#17458F]"
                  >
                    <option value="club_business">Club Business</option>
                    <option value="project_update">Project Milestone</option>
                    <option value="event_reminder">Event & RSVP</option>
                    <option value="board_notice">Board Resolution</option>
                    <option value="membership_update">Membership & Induction</option>
                  </select>
                </div>

                <div>
                  <label className="block font-montserrat font-bold text-gray-800 mb-1">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#FAFAF7] border border-gray-300 p-2 rounded-xl text-xs font-semibold focus:border-[#17458F]"
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
              </div>

              {/* Published Toggle Switch */}
              <div className="pt-2">
                <div className="flex items-center justify-between p-3.5 bg-[#FAFAF7] rounded-xl border border-gray-200">
                  <div className="space-y-0.5">
                    <span className="font-montserrat font-bold text-xs text-gray-800 block">
                      Published Status
                    </span>
                    <span className="text-[11px] text-gray-500 block">
                      {published
                        ? 'Active — Visible on the public announcements feed'
                        : 'Draft — Saved privately for board/admin review'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPublished(!published)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      published ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        published ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={actionLoadingId === (editingId || 'new')}
                  className="bg-[#17458F] hover:bg-[#0F326B] text-white font-montserrat font-bold px-5 py-2.5 rounded-xl text-xs flex-1 flex items-center justify-center space-x-2 shadow cursor-pointer transition disabled:opacity-50"
                >
                  {actionLoadingId === (editingId || 'new') ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 text-[#F7A81B]" />
                  )}
                  <span>{editingId ? 'Save Changes' : 'Publish Announcement'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SQL SCHEMA & RLS RULES MODAL */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1F2B]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-[#17458F]" />
                <h3 className="font-serif font-bold text-lg text-[#17458F]">
                  Postgres Schema & RLS Policies
                </h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Below is the Postgres DDL structure and Row Level Security policy for{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs text-[#17458F]">
                public.announcements
              </code>
              , verified with the <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">is_admin()</code> helper:
            </p>

            <div className="bg-[#1A1F2B] text-amber-200 font-mono text-[11px] p-4 rounded-xl overflow-x-auto leading-relaxed border border-gray-800">
              <pre>{`-- 1. Create Table public.announcements
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  published boolean not null default false,
  category text not null default 'club_business',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- 2. Enable Row Level Security (RLS)
alter table public.announcements enable row level security;

-- 3. Helper function checking admin / board user role
create or replace function public.is_admin()
returns boolean as $$
begin
  return (
    auth.jwt() -> 'user_metadata' ->> 'role' in ('ADMIN', 'BOARD', 'OFFICER')
  );
end;
$$ language plpgsql security definer;

-- 4. Public SELECT policy: Only published = true
create policy "Public can view published announcements"
on public.announcements
for select
using (published = true);

-- 5. Admin / Board INSERT & UPDATE policy via is_admin() helper
create policy "Admins can insert and update announcements"
on public.announcements
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());`}</pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSqlModal(false)}
                className="bg-[#17458F] text-white font-montserrat font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Close SQL Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for individual announcement row with inline action controls
interface AnnouncementRowProps {
  ann: Announcement;
  isAdmin?: boolean;
  actionLoadingId: string | null;
  deleteConfirmId: string | null;
  setDeleteConfirmId: (id: string | null) => void;
  onToggle: (ann: Announcement) => void;
  onEdit: (ann: Announcement) => void;
  onDelete: (id: string) => void;
  formatPostedDate: (dateStr: string) => string;
}

const AnnouncementRow: React.FC<AnnouncementRowProps> = ({
  ann,
  isAdmin = true,
  actionLoadingId,
  deleteConfirmId,
  setDeleteConfirmId,
  onToggle,
  onEdit,
  onDelete,
  formatPostedDate,
}) => {
  const isPub = ann.published ?? ann.is_published ?? true;
  const cfg = CATEGORY_CONFIG[ann.category] || CATEGORY_CONFIG.club_business;
  const isLoading = actionLoadingId === ann.id;
  const isConfirmingDelete = deleteConfirmId === ann.id;

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
        isPub ? 'border-gray-200 hover:border-emerald-300' : 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
      }`}
    >
      <div className="space-y-2 max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Badge */}
          <span className={`px-2.5 py-0.5 rounded-md font-montserrat font-bold text-[10px] ${cfg.badgeBg} ${cfg.badgeText}`}>
            {cfg.label}
          </span>

          {/* Status Badge */}
          <span
            className={`font-montserrat font-bold px-2.5 py-0.5 rounded-md text-[10px] flex items-center space-x-1 ${
              isPub ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
            }`}
          >
            {isPub ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-amber-700" />}
            <span>{isPub ? 'PUBLISHED' : 'DRAFT'}</span>
          </span>

          {/* Priority */}
          <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {ann.priority || 'MEDIUM'} Priority
          </span>
        </div>

        {/* Headline */}
        <h3 className="font-serif font-extrabold text-base text-[#17458F] leading-snug">{ann.title}</h3>

        {/* Body snippet */}
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{ann.body}</p>

        {/* Posted Date */}
        <div className="flex items-center space-x-3 text-[11px] text-gray-500 font-mono pt-1">
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-[#0080C8]" />
            <span className="font-semibold text-gray-700">{formatPostedDate(ann.created_at)}</span>
          </span>
          {ann.authorName && <span>• By {ann.authorName}</span>}
        </div>
      </div>

      {/* Row Actions (Admin Only) */}
      {isAdmin && (
        <div className="flex items-center space-x-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
          {isLoading ? (
            <div className="p-2 text-[#17458F]">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : isConfirmingDelete ? (
            /* Inline Delete Confirmation Bar */
            <div className="flex items-center space-x-2 bg-red-50 p-1.5 rounded-xl border border-red-200 text-xs">
              <span className="text-[#A2001D] font-bold px-2 text-[11px]">Confirm delete?</span>
              <button
                onClick={() => onDelete(ann.id)}
                className="bg-[#A2001D] hover:bg-red-800 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              {/* Toggle Published Button */}
              <button
                type="button"
                onClick={() => onToggle(ann)}
                className={`px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold flex items-center space-x-1.5 border transition cursor-pointer ${
                  isPub
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                }`}
                title={isPub ? 'Move to Drafts' : 'Publish Announcement'}
              >
                {isPub ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                    <span className="hidden sm:inline">Unpublish</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="hidden sm:inline">Publish</span>
                  </>
                )}
              </button>

              {/* Edit Button */}
              <button
                type="button"
                onClick={() => onEdit(ann)}
                className="p-2 bg-blue-50 text-[#17458F] border border-blue-200 rounded-xl hover:bg-blue-100 transition cursor-pointer"
                title="Edit Announcement"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {/* Delete Button (Destructive Cardinal Red #A2001D) */}
              <button
                type="button"
                onClick={() => setDeleteConfirmId(ann.id)}
                className="p-2 bg-red-50 text-[#A2001D] border border-red-200 rounded-xl hover:bg-red-100 transition cursor-pointer"
                title="Delete Announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
