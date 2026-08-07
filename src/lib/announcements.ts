import { Announcement, AnnouncementCategory } from '../types';

const STORAGE_KEY = 'rcm_announcements_db';

export const CATEGORY_CONFIG: Record<
  AnnouncementCategory,
  { label: string; borderColor: string; badgeBg: string; badgeText: string }
> = {
  club_business: {
    label: 'Club Business',
    borderColor: 'border-blue-700',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-900',
  },
  project_update: {
    label: 'Project Milestone',
    borderColor: 'border-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
  },
  event_reminder: {
    label: 'Event & Meeting RSVP',
    borderColor: 'border-amber-500',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
  },
  board_notice: {
    label: 'Board Resolution',
    borderColor: 'border-rose-600',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-900',
  },
  membership_update: {
    label: 'Membership & Induction',
    borderColor: 'border-purple-600',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900',
  },
};

export const ANNOUNCEMENTS_MIGRATION_SQL = `-- Supabase / PostgreSQL Schema Migration: Announcements Table with RLS Policies
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'club_business',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    author_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name VARCHAR(150) NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone (including anonymous visitors) can view active published announcements
CREATE POLICY "Public Read Active Announcements"
ON public.announcements
FOR SELECT
USING (
    is_published = TRUE 
    AND (expires_at IS NULL OR expires_at > NOW())
);

-- Policy 2: Club Officers & Board Admins have full access
CREATE POLICY "Officers & Board Full CRUD Access"
ON public.announcements
FOR ALL
TO authenticated
USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('ADMIN', 'OFFICER', 'PAST_PRESIDENT', 'BOARD_DIRECTOR')
)
WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('ADMIN', 'OFFICER', 'PAST_PRESIDENT', 'BOARD_DIRECTOR')
);
`;

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Weekly Luncheon & Guest Speaker Announcement: Sec. Ralph Recto',
    body: 'Join us this coming Tuesday, August 4th, 12:00 PM at The Conservatory, The Manila Peninsula. Finance Secretary Ralph Recto will deliver the keynote address on "Philippine Economic Horizons and Fiscal Reform". Members and prospective inductees are urged to confirm attendance by Monday noon.',
    category: 'event_reminder',
    priority: 'HIGH',
    created_at: '2026-07-24T08:00:00Z',
    expires_at: '2026-08-04T14:00:00Z',
    is_published: true,
    authorName: 'Pres. Eduardo Francisco',
  },
  {
    id: 'ann-002',
    title: 'Board Approval: Allocation for District 3830 Clean Water Phase III',
    body: 'During the July 2026 Board Meeting, the Board of Directors approved a ₱2,500,000 disbursement for the expansion of bio-sand filtration units in rural Rizal communities. Installation commences next week under Dir. Alex Tan.',
    category: 'project_update',
    priority: 'MEDIUM',
    created_at: '2026-07-23T10:30:00Z',
    expires_at: '2026-08-30T23:59:59Z',
    is_published: true,
    authorName: 'Sec. Gabriel Delgado',
  },
  {
    id: 'ann-003',
    title: 'Notice to All Members: FY 2026-2027 Semi-Annual Dues Notice',
    body: 'The Secretariat requests all members to settle semi-annual membership dues on or before August 15, 2026. Electronic invoices have been dispatched to all registered email addresses.',
    category: 'club_business',
    priority: 'URGENT',
    created_at: '2026-07-20T12:00:00Z',
    expires_at: '2026-08-15T23:59:59Z',
    is_published: true,
    authorName: 'Treas. Jose Mari Alvear',
  },
];

export const AnnouncementService = {
  getAllAnnouncements(): Announcement[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
        return INITIAL_ANNOUNCEMENTS;
      }
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_ANNOUNCEMENTS;
    }
  },

  getPublicAnnouncements(): Announcement[] {
    const all = this.getAllAnnouncements();
    const now = new Date().getTime();
    return all.filter((a) => {
      if (!a.is_published) return false;
      if (a.expires_at) {
        const expTime = new Date(a.expires_at).getTime();
        if (expTime <= now) return false;
      }
      return true;
    });
  },

  addAnnouncement(ann: Omit<Announcement, 'id' | 'created_at'>): Announcement {
    const all = this.getAllAnnouncements();
    const newAnn: Announcement = {
      ...ann,
      id: 'ann-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    all.unshift(newAnn);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newAnn;
  },

  updateAnnouncement(id: string, updated: Partial<Announcement>): void {
    const all = this.getAllAnnouncements();
    const list = all.map((a) => (a.id === id ? { ...a, ...updated } : a));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  deleteAnnouncement(id: string): void {
    const all = this.getAllAnnouncements();
    const list = all.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  restoreDefaults(): Announcement[] {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    return INITIAL_ANNOUNCEMENTS;
  },
};
