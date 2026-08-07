export type TabType = 'Home' | 'About Us' | 'Board of Directors' | 'Roster of Presidents' | 'Partnerships' | 'Projects' | 'News' | 'Membership' | 'Contact Us' | 'Announcements' | 'Admin' | 'MemberPortal';

export type PageView = string;

export type ThemeType = 'light' | 'dark';

export interface FocusArea {
  id: string;
  title: string;
  iconUrl: string;
  imageUrl?: string;
  shortDesc: string;
  fullDesc: string;
  sampleProjects: string[];
}

export interface ClubProject {
  id: string;
  title: string;
  focusAreaId: string;
  focusAreaTitle: string;
  imageUrl: string;
  summary: string;
  impactMetric: string;
  location: string;
  year: string;
}

export interface Officer {
  role: string;
  name: string;
  note?: string;
}

export interface MembershipInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  classification: string;
  statementOfInterest: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'Water, Sanitation & Hygiene' | 'Disease Prevention & Treatment' | 'Basic Education & Literacy' | 'Maternal & Child Health' | 'Peacebuilding & Conflict Prevention' | 'Community Economic Development' | 'Environment';
  summary: string;
  description: string;
  budgetPhp: number;
  raisedPhp: number;
  status: 'Active' | 'Completed' | 'Planned';
  startDate: string;
  beneficiariesCount: number;
  location: string;
  imageUrl: string;
  galleryImages: string[];
  keyAchievements: string[];
  chairperson: string;
  partners: string[];
  sdgAlignment: number[];
}

export interface RotaryEvent {
  id: string;
  title: string;
  slug: string;
  category: 'Weekly Meeting' | 'Service Project' | 'Fellowship' | 'District Event' | 'Fundraiser';
  date: string;
  time: string;
  location: string;
  address: string;
  description: string;
  imageUrl: string;
  feePhp: number;
  registeredCount: number;
  speakerName?: string;
  dressCode?: string;
  agenda?: { time: string; item: string }[];
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  authorName: string;
  authorRole: string;
  summary: string;
  content: string;
  imageUrl: string;
}

export type AnnouncementCategory =
  | 'club_business'
  | 'project_update'
  | 'event_reminder'
  | 'board_notice'
  | 'membership_update';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY';
  created_at: string;
  expires_at?: string | null;
  is_published: boolean;
  published?: boolean;
  created_by?: string;
  authorName?: string;
}
