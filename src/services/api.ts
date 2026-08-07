import { MembershipInquiry, Project, RotaryEvent } from '../types';

const STORAGE_KEYS = {
  INQUIRIES: 'rcm_membership_inquiries',
  PROJECTS: 'rcm_admin_projects',
  EVENTS: 'rcm_admin_events',
  SYSTEM_LOGS: 'rcm_application_logs',
};

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  type: 'APPLICATION' | 'SECURITY' | 'CONTENT' | 'SYSTEM';
  details: string;
  ipAddress?: string;
}

const DEFAULT_SYSTEM_LOGS: SystemLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-07-26T18:32:10Z',
    action: 'Membership Application Logged',
    actor: 'Atty. Roberto Tan (Applicant)',
    type: 'APPLICATION',
    details: 'New candidate membership application submitted via online portal. Classification: Corporate Law / Dispute Resolution.',
    ipAddress: '112.198.118.42',
  },
  {
    id: 'log-002',
    timestamp: '2026-07-26T19:05:44Z',
    action: 'Membership Application Logged',
    actor: 'Dr. Maria Clara Santos (Applicant)',
    type: 'APPLICATION',
    details: 'New candidate membership application submitted via online portal. Classification: Medical Specialties / Cardiology.',
    ipAddress: '180.191.102.15',
  },
  {
    id: 'log-003',
    timestamp: '2026-07-26T21:10:00Z',
    action: 'Admin Session Authenticated',
    actor: 'Pres. Eduardo Francisco (Admin)',
    type: 'SECURITY',
    details: 'Administrator credentials verified. Access granted to Club Operations & Application Logs.',
    ipAddress: '120.28.64.91',
  },
  {
    id: 'log-004',
    timestamp: '2026-07-27T02:15:22Z',
    action: 'Content Publication Audit',
    actor: 'Pres. Eduardo Francisco (Admin)',
    type: 'CONTENT',
    details: 'Published Kaunlaran No. 2 Weekly Bulletin to official club portal.',
    ipAddress: '120.28.64.91',
  },
  {
    id: 'log-005',
    timestamp: '2026-07-27T05:40:11Z',
    action: 'Live Marquee Ticker Broadcast',
    actor: 'Pres. Eduardo Francisco (Admin)',
    type: 'SYSTEM',
    details: 'Updated live site marquee ticker broadcast across all active user sessions.',
    ipAddress: '120.28.64.91',
  },
];

const DEFAULT_INQUIRIES: MembershipInquiry[] = [
  {
    id: 'inq-101',
    fullName: 'Atty. Roberto Tan',
    email: 'rtan@tanlaw.ph',
    phone: '+63 917 555 1234',
    company: 'Tan & Associates Law',
    position: 'Managing Partner',
    classification: 'Corporate Law / Dispute Resolution',
    statementOfInterest: 'Seeking to contribute pro-bono legal counsel for RCM community development and clean water initiatives in District 3830.',
    status: 'PENDING_REVIEW',
    createdAt: '2026-07-20T10:30:00Z',
  },
  {
    id: 'inq-102',
    fullName: 'Dr. Maria Clara Santos',
    email: 'mcsantos@makatimed.com.ph',
    phone: '+63 918 888 9900',
    company: 'Makati Medical Center',
    position: 'Chief of Cardiology',
    classification: 'Medical Specialties / Cardiology',
    statementOfInterest: 'Eager to support RCM Gift of Life congenital heart surgery program for indigent children.',
    status: 'PENDING_REVIEW',
    createdAt: '2026-07-22T14:15:00Z',
  },
];

export const StorageService = {
  getInquiries(): MembershipInquiry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(DEFAULT_INQUIRIES));
        return DEFAULT_INQUIRIES;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_INQUIRIES;
    }
  },

  updateInquiryStatus(id: string, status: 'APPROVED' | 'REJECTED'): void {
    const inquiries = this.getInquiries();
    const target = inquiries.find((inq) => inq.id === id);
    const updated = inquiries.map((inq) =>
      inq.id === id ? { ...inq, status } : inq
    );
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));

    if (target) {
      this.addLog({
        action: `Application ${status}`,
        actor: 'Admin Secretariat',
        type: 'APPLICATION',
        details: `Candidate membership application for ${target.fullName} (${target.classification}) was ${status.toLowerCase()}.`,
      });
    }
  },

  saveInquiry(inquiry: Omit<MembershipInquiry, 'id' | 'createdAt' | 'status'>): MembershipInquiry {
    const inquiries = this.getInquiries();
    const newInquiry: MembershipInquiry = {
      ...inquiry,
      id: 'inq-' + Date.now(),
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString(),
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));

    this.addLog({
      action: 'New Membership Application Submitted',
      actor: `${inquiry.fullName} (Candidate)`,
      type: 'APPLICATION',
      details: `Application received for classification: ${inquiry.classification} from ${inquiry.company}. Email: ${inquiry.email}.`,
      ipAddress: '112.198.120.88',
    });

    return newInquiry;
  },

  getSystemLogs(): SystemLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYSTEM_LOGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SYSTEM_LOGS, JSON.stringify(DEFAULT_SYSTEM_LOGS));
        return DEFAULT_SYSTEM_LOGS;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_SYSTEM_LOGS;
    }
  },

  addLog(entry: Omit<SystemLogEntry, 'id' | 'timestamp'>): SystemLogEntry {
    const logs = this.getSystemLogs();
    const newEntry: SystemLogEntry = {
      ...entry,
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.SYSTEM_LOGS, JSON.stringify(logs));
    return newEntry;
  },

  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  },

  addProject(project: Project): void {
    const projects = this.getProjects();
    projects.unshift(project);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  getEvents(): RotaryEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  },

  addEvent(event: RotaryEvent): void {
    const events = this.getEvents();
    events.unshift(event);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  restoreAllDefaults(): {
    inquiries: MembershipInquiry[];
    logs: SystemLogEntry[];
    projects: Project[];
    events: RotaryEvent[];
  } {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(DEFAULT_INQUIRIES));
    localStorage.setItem(STORAGE_KEYS.SYSTEM_LOGS, JSON.stringify(DEFAULT_SYSTEM_LOGS));
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    return {
      inquiries: DEFAULT_INQUIRIES,
      logs: DEFAULT_SYSTEM_LOGS,
      projects: [],
      events: [],
    };
  },
};
