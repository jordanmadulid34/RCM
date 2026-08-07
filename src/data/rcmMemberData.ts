export interface MemberProfile {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  role: string;
  userRole: 'admin' | 'member';
  classification: string;
  company: string;
  joinYear: number;
  rotaryId: string;
  avatarUrl?: string;
  status: 'Active Member' | 'Honorary Member' | 'Board Member';
  district: string;
}

export type ApplicationStatus =
  | 'Pending Review'
  | 'Under Review'
  | 'Approved for Interview'
  | 'Interview Scheduled'
  | 'Interview Confirmed'
  | 'Interview Completed'
  | 'Accepted'
  | 'Rejected'
  | 'Cancelled'
  | 'Rescheduled'
  | 'Contacted'
  | 'Invited to Luncheon'
  | 'Approved'
  | 'Archived';

export interface InterviewHistoryItem {
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export interface NotificationHistoryItem {
  timestamp: string;
  type: string;
  subject: string;
  recipient: string;
}

export interface SubmittedApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  classification: string;
  message: string;
  submittedAt: string;
  status: ApplicationStatus;
  adminRecipient: string;
  adminEmailDelivered: boolean;
  applicantReplyDelivered: boolean;
  source: 'Online Application Form' | 'Google Form Sync' | 'Inquiry Portal';

  // Membership Approval & Interview Scheduling fields
  approvalDate?: string;
  approvedBy?: string;
  interviewWeek?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewType?: 'Face-to-Face' | 'Zoom' | 'Google Meet' | 'Microsoft Teams';
  venue?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPasscode?: string;
  adminRemarks?: string;
  instructions?: string;
  attendanceStatus?: 'Pending Confirmation' | 'Confirmed' | 'Reschedule Requested';
  rescheduleReason?: string;
  reschedulePreferredDate?: string;
  interviewHistory?: InterviewHistoryItem[];
  notificationHistory?: NotificationHistoryItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'President\'s Message' | 'Club Update' | 'District News' | 'Project Alert';
  summary: string;
  read: boolean;
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  speaker?: string;
  type: 'Weekly Meeting' | 'Fellowship' | 'Service Project' | 'District Event';
  userRsvp: 'Yes' | 'No' | 'Maybe' | 'Pending';
  attendeesCount: number;
}

export interface AttendanceRecord {
  rotaryYear: string;
  totalMeetingsHeld: number;
  meetingsAttended: number;
  makeupsDone: number;
  percentage: number;
  recentHistory: {
    date: string;
    meetingName: string;
    status: 'Present' | 'Absent' | 'Make-up';
  }[];
}

export const ADMIN_DEMO_MEMBER: MemberProfile = {
  id: 'mem-005',
  name: 'Keith Ejay Balete',
  initials: 'KEB',
  email: 'Not provided',
  phone: 'Not provided',
  role: 'Member & Admin',
  userRole: 'admin',
  classification: 'Not provided',
  company: 'Not provided',
  joinYear: 2026,
  rotaryId: 'Not provided',
  status: 'Active Member',
  district: 'District 3830',
};

export const CURRENT_DEMO_MEMBER: MemberProfile = {
  id: 'mem-001',
  name: 'John Deil Tibay',
  initials: 'JDT',
  email: 'Not provided',
  phone: 'Not provided',
  role: 'Member',
  userRole: 'member',
  classification: 'Not provided',
  company: 'Not provided',
  joinYear: 2026,
  rotaryId: 'Not provided',
  status: 'Active Member',
  district: 'District 3830',
};

export const DEMO_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'President\'s Weekly Message: Strengthening Our Water & Literacy Missions',
    date: 'July 21, 2026',
    category: 'President\'s Message',
    summary: 'Fellow Rotarians, as we step into Q3, our focus turns toward expanding deep-well water installations in Palawan and donating e-learning hubs to Makati public elementary schools.',
    read: false,
  },
  {
    id: 'ann-2',
    title: 'District 3830 Governor Visit Scheduled for Next Tuesday',
    date: 'July 18, 2026',
    category: 'District News',
    summary: 'District Governor Maria Santos will be our guest of honor at The Manila Peninsula Conservatory. Please ensure your RSVPs are updated for seating.',
    read: false,
  },
  {
    id: 'ann-3',
    title: 'Annual Medical & Surgical Mission Volunteer Call',
    date: 'July 12, 2026',
    category: 'Project Alert',
    summary: 'Registration is now open for physicians, non-medical volunteers, and logistics coordinators for our upcoming 3-day health mission in Barangay Poblacion.',
    read: true,
  },
];

export const INITIAL_DEMO_EVENTS: ClubEvent[] = [
  {
    id: 'evt-1',
    title: 'Regular Weekly Meeting & Luncheon',
    date: 'Tuesday, July 28, 2026',
    time: '12:00 PM – 2:00 PM',
    location: 'The Conservatory, The Manila Peninsula, Makati City',
    speaker: 'Hon. Undersecretary of Health - Healthcare Innovations',
    type: 'Weekly Meeting',
    userRsvp: 'Yes',
    attendeesCount: 78,
  },
  {
    id: 'evt-2',
    title: 'Barangay Clean Water System Handover',
    date: 'Saturday, August 1, 2026',
    time: '8:30 AM – 11:30 AM',
    location: 'Barangay Guadalupe Nuevo, Makati City',
    type: 'Service Project',
    userRsvp: 'Pending',
    attendeesCount: 34,
  },
  {
    id: 'evt-3',
    title: 'Monthly Fellowship Night & New Member Welcome',
    date: 'Thursday, August 13, 2026',
    time: '6:30 PM – 9:30 PM',
    location: 'Manila Polo Club, Forbes Park, Makati',
    type: 'Fellowship',
    userRsvp: 'Maybe',
    attendeesCount: 52,
  },
];

export const DEMO_ATTENDANCE: AttendanceRecord = {
  rotaryYear: 'RY 2025–2026',
  totalMeetingsHeld: 24,
  meetingsAttended: 22,
  makeupsDone: 1,
  percentage: 92,
  recentHistory: [
    { date: 'July 21, 2026', meetingName: 'Regular Tuesday Meeting #24', status: 'Present' },
    { date: 'July 14, 2026', meetingName: 'Regular Tuesday Meeting #23', status: 'Present' },
    { date: 'July 07, 2026', meetingName: 'Regular Tuesday Meeting #22', status: 'Present' },
    { date: 'June 30, 2026', meetingName: 'Induction & Turnover Ceremonies', status: 'Present' },
    { date: 'June 23, 2026', meetingName: 'Regular Tuesday Meeting #20', status: 'Make-up' },
    { date: 'June 16, 2026', meetingName: 'Regular Tuesday Meeting #19', status: 'Present' },
  ],
};

export const DEMO_DIRECTORY_MEMBERS: MemberProfile[] = [
  {
    id: 'mem-001',
    name: 'John Deil Tibay',
    initials: 'JDT',
    email: 'Not provided',
    phone: 'Not provided',
    role: 'Member',
    userRole: 'member',
    classification: 'Not provided',
    company: 'Not provided',
    joinYear: 2026,
    rotaryId: 'Not provided',
    status: 'Active Member',
    district: 'District 3830',
  },
  {
    id: 'mem-002',
    name: 'Jordan Madulid',
    initials: 'JM',
    email: 'Not provided',
    phone: 'Not provided',
    role: 'Member',
    userRole: 'member',
    classification: 'Not provided',
    company: 'Not provided',
    joinYear: 2026,
    rotaryId: 'Not provided',
    status: 'Active Member',
    district: 'District 3830',
  },
  {
    id: 'mem-003',
    name: 'Klaus Pampilo',
    initials: 'KP',
    email: 'Not provided',
    phone: 'Not provided',
    role: 'Member',
    userRole: 'member',
    classification: 'Not provided',
    company: 'Not provided',
    joinYear: 2026,
    rotaryId: 'Not provided',
    status: 'Active Member',
    district: 'District 3830',
  },
  {
    id: 'mem-004',
    name: 'Rainier Matthew Maturgo',
    initials: 'RMM',
    email: 'Not provided',
    phone: 'Not provided',
    role: 'Member',
    userRole: 'member',
    classification: 'Not provided',
    company: 'Not provided',
    joinYear: 2026,
    rotaryId: 'Not provided',
    status: 'Active Member',
    district: 'District 3830',
  },
  {
    id: 'mem-005',
    name: 'Keith Ejay Balete',
    initials: 'KEB',
    email: 'Not provided',
    phone: 'Not provided',
    role: 'Member & Admin',
    userRole: 'admin',
    classification: 'Not provided',
    company: 'Not provided',
    joinYear: 2026,
    rotaryId: 'Not provided',
    status: 'Active Member',
    district: 'District 3830',
  },
];
