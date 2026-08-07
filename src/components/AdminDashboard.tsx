import React, { useState } from 'react';
import { PageView, MembershipInquiry, Project, RotaryEvent, NewsArticle } from '../types';
import { StorageService } from '../services/api';
import { AdminAnnouncementsPage } from './AdminAnnouncementsPage';
import { AdminInterviewModal } from './AdminInterviewModal';
import { SubmittedApplication } from '../data/rcmMemberData';
import { getSavedApplications, updateApplicationDetails, restoreDefaultApplications } from '../services/notificationService';
import { AnnouncementService } from '../lib/announcements';
import {
  ShieldCheck,
  UserCheck,
  FolderPlus,
  CalendarPlus,
  Newspaper,
  Megaphone,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  Users,
  Bell,
  FileText,
  Lock,
  Search,
  Filter,
  Calendar,
  Mail,
  Send,
  RotateCcw,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: PageView) => void;
  projects: Project[];
  events: RotaryEvent[];
  news: NewsArticle[];
  announcementMarquee: string;
  onUpdateMarquee: (text: string) => void;
  onRefreshData: () => void;
  currentUser?: { id: string; name: string; role: string; email: string } | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  projects,
  events,
  news,
  announcementMarquee,
  onUpdateMarquee,
  onRefreshData,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'interviews' | 'inquiries' | 'announcements' | 'logs' | 'projects' | 'events' | 'news' | 'marquee'>('interviews');

  // Applications & Interview Management State
  const [applications, setApplications] = useState<SubmittedApplication[]>(() => getSavedApplications());
  const [selectedApp, setSelectedApp] = useState<SubmittedApplication | null>(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [appSearch, setAppSearch] = useState('');

  const handleUpdateApplication = (id: string, updates: Partial<SubmittedApplication>) => {
    const updatedList = updateApplicationDetails(id, updates);
    setApplications(updatedList);
    if (selectedApp && selectedApp.id === id) {
      const refreshed = updatedList.find((a) => a.id === id) || null;
      setSelectedApp(refreshed);
    }
  };

  // Inquiries & System Logs State
  const [inquiries, setInquiries] = useState<MembershipInquiry[]>(StorageService.getInquiries());
  const [systemLogs, setSystemLogs] = useState(StorageService.getSystemLogs());
  const [logFilter, setLogFilter] = useState<'ALL' | 'APPLICATION' | 'SECURITY' | 'CONTENT' | 'SYSTEM'>('ALL');
  const [logSearch, setLogSearch] = useState('');

  // Marquee Edit State
  const [marqueeInput, setMarqueeInput] = useState(announcementMarquee);

  // New Project Form Modal State
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjCategory, setNewProjCategory] = useState<Project['category']>('Water, Sanitation & Hygiene');
  const [newProjBudget, setNewProjBudget] = useState('2500000');
  const [newProjSummary, setNewProjSummary] = useState('');

  // New Event Form Modal State
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-08-04');
  const [newEventCategory, setNewEventCategory] = useState<RotaryEvent['category']>('Weekly Meeting');
  const [newEventSpeaker, setNewEventSpeaker] = useState('');

  const handleInquiryStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    StorageService.updateInquiryStatus(id, status);
    setInquiries(StorageService.getInquiries());
    setSystemLogs(StorageService.getSystemLogs());
  };

  const handleRestoreAllDefaults = () => {
    if (window.confirm('Restore all default announcements, membership applications, inquiries, and system logs to their original initial state? Any custom test items will be cleared.')) {
      AnnouncementService.restoreDefaults();
      const restoredStorage = StorageService.restoreAllDefaults();
      const restoredApps = restoreDefaultApplications();
      setInquiries(restoredStorage.inquiries);
      setSystemLogs(restoredStorage.logs);
      setApplications(restoredApps);
      onRefreshData();
      alert('All default records (Announcements, Membership Applications, Inquiries, and System Logs) have been restored!');
    }
  };

  const handleSaveMarquee = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMarquee(marqueeInput);
    alert('Live Marquee Ticker updated successfully across the entire site!');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle || !newProjSummary) return;

    const newProj: Project = {
      id: 'proj-' + Date.now(),
      title: newProjTitle,
      slug: newProjTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newProjCategory,
      summary: newProjSummary,
      description: newProjSummary + ' Full humanitarian project initiative executed under District 3830 guidelines.',
      budgetPhp: Number(newProjBudget) || 2000000,
      raisedPhp: 500000,
      status: 'Active',
      startDate: '2026-07-01',
      beneficiariesCount: 5000,
      location: 'Makati & Surrounding Areas',
      imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80',
      galleryImages: ['https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80'],
      keyAchievements: ['Initiated district community transformation project.'],
      chairperson: 'Dir. Alex Tan',
      partners: ['Rotary Club of Makati', 'MRCFI Foundation'],
      sdgAlignment: [3, 4, 6],
    };

    StorageService.addProject(newProj);
    onRefreshData();
    setShowAddProjectModal(false);
    setNewProjTitle('');
    setNewProjSummary('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;

    const newEvt: RotaryEvent = {
      id: 'evt-' + Date.now(),
      title: newEventTitle,
      slug: newEventTitle.toLowerCase().replace(/\s+/g, '-'),
      category: newEventCategory,
      date: newEventDate,
      time: '12:15 PM - 2:00 PM',
      location: 'The Peninsula Manila',
      address: 'Ayala Ave cor. Makati Ave, Makati City',
      description: 'Official Rotary Club of Makati Tuesday Fellowship Meeting.',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
      feePhp: 1800,
      registeredCount: 0,
      speakerName: newEventSpeaker || undefined,
      dressCode: 'Business Formal / Rotary Pin Required',
      agenda: [
        { time: '12:00 PM', item: 'Fellowship Lunch' },
        { time: '12:30 PM', item: 'Call to Order & Four-Way Test' },
        { time: '1:15 PM', item: 'Keynote Address' },
      ],
    };

    StorageService.addEvent(newEvt);
    onRefreshData();
    setShowAddEventModal(false);
    setNewEventTitle('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white py-10 px-4 sm:px-8 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-500 text-blue-950 font-extrabold px-3 py-1 rounded-full text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Rotary Admin & Secretariat Control Panel</span>
            </div>
            <h1 className="text-3xl font-extrabold">Club Operations Management</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={handleRestoreAllDefaults}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-blue-950 font-extrabold flex items-center gap-1.5 shadow transition cursor-pointer"
              title="Restore all default sample announcements, applications, inquiries, and logs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore All Default Data</span>
            </button>

            <span className="bg-blue-900 px-3 py-1.5 rounded-xl border border-blue-700 text-slate-200">
              Logged in: <strong>{currentUser?.name || 'Administrator'} (Admin)</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex bg-white p-2 rounded-2xl border border-slate-200 text-xs font-bold gap-2 overflow-x-auto no-scrollbar shadow-sm">
          {[
            { id: 'interviews', label: 'Membership Approvals & Interviews', icon: Calendar, count: applications.filter((a) => a.status === 'Pending Review' || a.status === 'Approved for Interview').length },
            { id: 'announcements', label: 'Announcements (CRUD)', icon: Bell },
            { id: 'inquiries', label: 'Membership Inquiries', icon: UserCheck, count: inquiries.filter((i) => i.status === 'PENDING_REVIEW').length },
            { id: 'logs', label: 'Application & System Logs', icon: FileText, count: systemLogs.length },
            { id: 'projects', label: 'Projects Manager', icon: FolderPlus, count: projects.length },
            { id: 'events', label: 'Events & Meetings', icon: CalendarPlus, count: events.length },
            { id: 'news', label: 'News Bulletins', icon: Newspaper, count: news.length },
            { id: 'marquee', label: 'Marquee Ticker', icon: Megaphone },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                  isActive ? 'bg-blue-950 text-amber-400 shadow-md' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-amber-400 text-blue-950' : 'bg-slate-200 text-slate-800'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB: Membership Approvals & Interview Scheduling */}
        {activeTab === 'interviews' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-3 py-1 rounded-full text-[11px] mb-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Dynamic Interview Week Scheduling</span>
                </div>
                <h3 className="font-extrabold text-xl text-blue-950">Membership Applications & Interview Workflow</h3>
                <p className="text-xs text-slate-500">
                  Review submitted applications, approve/reject candidates, assign interview dates, and send automated interview invitation notifications.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search applicant name, classification..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64 text-slate-900"
                />
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Ref ID & Date</th>
                    <th className="p-3">Applicant Name & Contact</th>
                    <th className="p-3">Classification & Company</th>
                    <th className="p-3">Dynamic Interview Week</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {applications
                    .filter((a) => {
                      const q = appSearch.toLowerCase();
                      return (
                        a.fullName.toLowerCase().includes(q) ||
                        a.classification.toLowerCase().includes(q) ||
                        a.company.toLowerCase().includes(q) ||
                        a.id.toLowerCase().includes(q)
                      );
                    })
                    .map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <span className="font-mono font-bold text-blue-950 block">{app.id}</span>
                          <span className="text-[10px] text-slate-500 block">{app.submittedAt}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-sm text-slate-900 block">{app.fullName}</span>
                          <span className="text-[11px] text-slate-500 block">{app.email} • {app.phone}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-amber-700 block">{app.classification || 'N/A'}</span>
                          <span className="text-[11px] text-slate-500 block">{app.company || 'N/A'}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200 inline-block">
                            {app.interviewWeek || 'Dynamic Target'}
                          </span>
                          {app.interviewDate && (
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {app.interviewDate} @ {app.interviewTime}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`inline-block font-extrabold px-2.5 py-1 rounded-full text-[10px] uppercase ${
                            app.status === 'Approved for Interview' || app.status === 'Interview Scheduled' || app.status === 'Interview Confirmed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : app.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedApp(app);
                              setIsInterviewModalOpen(true);
                            }}
                            className="bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold px-3 py-1.5 rounded-lg text-xs shadow flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Schedule / Review</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Announcements CRUD Manager */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <AdminAnnouncementsPage
              onNavigate={onNavigate}
              currentUser={currentUser || { role: 'ADMIN', name: 'Administrator' }}
            />
          </div>
        )}

        {/* TAB 1: Membership Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-xl text-blue-950">Candidate Membership Inquiries</h3>
                <p className="text-xs text-slate-500">Review candidate submissions prior to classification review.</p>
              </div>
            </div>

            <div className="space-y-4">
              {inquiries.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">No inquiries received yet.</p>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-2 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-blue-950">{inq.fullName}</span>
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {inq.classification}
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            inq.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inq.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>

                      <p className="text-slate-700">
                        <strong>{inq.position}</strong> @ {inq.company} • Phone: {inq.phone} • Email: {inq.email}
                      </p>
                      <p className="text-slate-600 italic">"{inq.statementOfInterest}"</p>
                    </div>

                    {inq.status === 'PENDING_REVIEW' && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleInquiryStatus(inq.id, 'APPROVED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shadow"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve Classification</span>
                        </button>
                        <button
                          onClick={() => handleInquiryStatus(inq.id, 'REJECTED')}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shadow"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: Application & System Logs (Admin Only) */}
        {activeTab === 'logs' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-3 py-1 rounded-full text-[11px] mb-2">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Admin Restricted Access — Internal Audit Trail</span>
                </div>
                <h3 className="font-extrabold text-xl text-blue-950">Application Logs & Audit Trail</h3>
                <p className="text-xs text-slate-500">
                  Real-time record of membership application submissions, status updates, security logins, and portal activities. Restricted strictly to authorized administrators.
                </p>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-48 text-slate-900"
                  />
                </div>
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold"
                >
                  <option value="ALL">All Log Types</option>
                  <option value="APPLICATION">Applications Only</option>
                  <option value="SECURITY">Security & Access</option>
                  <option value="CONTENT">Content Audit</option>
                  <option value="SYSTEM">System Events</option>
                </select>
              </div>
            </div>

            {/* Logs List */}
            <div className="space-y-3 text-xs">
              {systemLogs
                .filter((log) => logFilter === 'ALL' || log.type === logFilter)
                .filter(
                  (log) =>
                    !logSearch ||
                    log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
                    log.actor.toLowerCase().includes(logSearch.toLowerCase()) ||
                    log.details.toLowerCase().includes(logSearch.toLowerCase())
                )
                .map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-blue-950 text-sm">{log.action}</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            log.type === 'APPLICATION'
                              ? 'bg-blue-100 text-blue-900'
                              : log.type === 'SECURITY'
                              ? 'bg-rose-100 text-rose-900'
                              : log.type === 'CONTENT'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {log.type}
                        </span>
                        {log.ipAddress && (
                          <span className="text-[10px] text-slate-400 font-mono">IP: {log.ipAddress}</span>
                        )}
                      </div>
                      <p className="text-slate-700">{log.details}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Actor / Source: <strong>{log.actor}</strong></p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-lg">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 2: Projects Manager */}
        {activeTab === 'projects' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-xl text-blue-950">Rotary Service Projects Directory</h3>
                <p className="text-xs text-slate-500">Manage humanitarian service projects and funding targets.</p>
              </div>
              <button
                onClick={() => setShowAddProjectModal(true)}
                className="bg-blue-950 text-amber-400 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {projects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-blue-950 text-sm">{p.title}</span>
                    <span className="bg-blue-950 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">{p.category}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{p.summary}</p>
                  <div className="flex items-center justify-between text-slate-500 font-semibold pt-1">
                    <span>Budget: ₱{(p.budgetPhp / 1000000).toFixed(1)}M</span>
                    <span>Status: {p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Events Manager */}
        {activeTab === 'events' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-xl text-blue-950">Events & Tuesday Luncheon Schedule</h3>
                <p className="text-xs text-slate-500">Schedule meetings, keynote speakers, and fellowship events.</p>
              </div>
              <button
                onClick={() => setShowAddEventModal(true)}
                className="bg-blue-950 text-amber-400 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule New Event</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {events.map((e) => (
                <div key={e.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-extrabold text-blue-950 text-sm block">{e.title}</span>
                    <span className="text-slate-600">{e.date} ({e.time}) @ {e.location}</span>
                    {e.speakerName && <p className="text-amber-700 font-bold">Speaker: {e.speakerName}</p>}
                  </div>
                  <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-[10px]">
                    {e.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: News Bulletins */}
        {activeTab === 'news' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-xl text-blue-950">Published Press Bulletins</h3>
              <p className="text-xs text-slate-500">All news articles currently live on the public portal.</p>
            </div>

            <div className="space-y-3 text-xs">
              {news.map((n) => (
                <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-extrabold text-blue-950 text-sm block">{n.title}</span>
                    <span className="text-slate-500">{n.publishedAt} • By {n.authorName} ({n.authorRole})</span>
                  </div>
                  <span className="bg-blue-950 text-amber-300 font-bold px-2.5 py-1 rounded text-[10px]">{n.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Live Marquee Ticker */}
        {activeTab === 'marquee' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-xl text-blue-950">Live Site Ticker Broadcast</h3>
              <p className="text-xs text-slate-500">Broadcast immediate announcements across the top banner of the entire platform.</p>
            </div>

            <form onSubmit={handleSaveMarquee} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Marquee Broadcast Text</label>
                <textarea
                  rows={3}
                  value={marqueeInput}
                  onChange={(e) => setMarqueeInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-blue-950 font-extrabold px-6 py-2.5 rounded-xl text-xs shadow flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Publish Marquee Broadcast</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-blue-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-extrabold text-lg text-blue-950">Add New Humanitarian Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  className="w-full bg-slate-50 border p-2 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Budget (PHP)</label>
                <input
                  type="number"
                  value={newProjBudget}
                  onChange={(e) => setNewProjBudget(e.target.value)}
                  className="w-full bg-slate-50 border p-2 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Summary</label>
                <textarea
                  rows={3}
                  required
                  value={newProjSummary}
                  onChange={(e) => setNewProjSummary(e.target.value)}
                  className="w-full bg-slate-50 border p-2 rounded-xl"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="bg-amber-500 text-blue-950 font-extrabold px-4 py-2 rounded-xl flex-1">
                  Save Project
                </button>
                <button type="button" onClick={() => setShowAddProjectModal(false)} className="bg-slate-200 px-4 py-2 rounded-xl">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-blue-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-extrabold text-lg text-blue-950">Schedule New Tuesday Meeting / Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-slate-50 border p-2 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Guest Keynote Speaker</label>
                <input
                  type="text"
                  value={newEventSpeaker}
                  onChange={(e) => setNewEventSpeaker(e.target.value)}
                  placeholder="e.g. Sec. Ralph Recto"
                  className="w-full bg-slate-50 border p-2 rounded-xl"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="bg-amber-500 text-blue-950 font-extrabold px-4 py-2 rounded-xl flex-1">
                  Schedule Event
                </button>
                <button type="button" onClick={() => setShowAddEventModal(false)} className="bg-slate-200 px-4 py-2 rounded-xl">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Interview Scheduling Modal */}
      <AdminInterviewModal
        application={selectedApp}
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        onUpdateApplication={handleUpdateApplication}
        theme="light"
      />
    </div>
  );
};
