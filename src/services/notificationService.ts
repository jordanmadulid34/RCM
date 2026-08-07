import { SubmittedApplication } from '../data/rcmMemberData';
import { calculateInterviewWeek, formatReadableDate, formatReadableTime } from '../utils/dateUtils';

export const ADMIN_NOTIFICATION_EMAIL = 'balete.keith@adlas.onesms.edu.ph';

const STORAGE_KEY = 'rcm_membership_applications_v1';

export const INITIAL_APPLICATIONS: SubmittedApplication[] = [
  {
    id: 'RCM-APP-2026-8801',
    fullName: 'Maria Cristina Santos',
    email: 'mc.santos@makatitech.ph',
    phone: '+63 917 890 1234',
    company: 'Makati Tech Innovations Corp.',
    classification: 'Software Engineering & Cloud Architecture',
    message: 'I have been following RC Makati\'s clean water projects in Palawan and literacy initiatives in Barangay Poblacion. I want to contribute my technical background and volunteer time to support community development.',
    submittedAt: '2026-07-22 14:30:15',
    status: 'Pending Review',
    adminRecipient: ADMIN_NOTIFICATION_EMAIL,
    adminEmailDelivered: true,
    applicantReplyDelivered: true,
    source: 'Online Application Form',
  },
  {
    id: 'RCM-APP-2026-8794',
    fullName: 'Engr. David Luis Fernando',
    email: 'dfernando@fernando-const.com',
    phone: '+63 918 456 7890',
    company: 'Fernando Structural Construction',
    classification: 'Civil & Structural Engineering',
    message: 'Interested in partnering for community infrastructure and disaster resilience programs. Referred by Rotarian Keith Ejay Balete.',
    submittedAt: '2026-07-20 09:15:00',
    status: 'Interview Scheduled',
    interviewWeek: calculateInterviewWeek(),
    interviewDate: '2026-08-04',
    interviewTime: '14:00',
    interviewType: 'Face-to-Face',
    venue: 'Secretariat Boardroom, MRCFI Building, 8001 Camia St., Guadalupe Viejo, Makati City',
    adminRemarks: 'Candidate candidate was highly recommended for infrastructure committee leadership.',
    instructions: 'Please bring 2 valid IDs and corporate profile background.',
    attendanceStatus: 'Confirmed',
    adminRecipient: ADMIN_NOTIFICATION_EMAIL,
    adminEmailDelivered: true,
    applicantReplyDelivered: true,
    source: 'Online Application Form',
  }
];

export function getSavedApplications(): SubmittedApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse saved applications', err);
    return INITIAL_APPLICATIONS;
  }
}

export function restoreDefaultApplications(): SubmittedApplication[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  } catch (err) {
    console.error('Error restoring default applications', err);
  }
  return INITIAL_APPLICATIONS;
}

export function saveApplication(app: Omit<SubmittedApplication, 'id' | 'submittedAt' | 'adminRecipient' | 'adminEmailDelivered' | 'applicantReplyDelivered' | 'status'>): SubmittedApplication {
  const existing = getSavedApplications();
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `RCM-APP-2026-${randomNum}`;

  const newApp: SubmittedApplication = {
    ...app,
    id: newId,
    submittedAt: timestamp,
    status: 'Pending Review',
    adminRecipient: ADMIN_NOTIFICATION_EMAIL,
    adminEmailDelivered: true,
    applicantReplyDelivered: true,
    interviewHistory: [
      {
        timestamp: new Date().toISOString(),
        action: 'Application Submitted',
        actor: app.fullName,
        details: 'Application submitted online with status Pending Review.',
      },
    ],
  };

  const updated = [newApp, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving application to storage', err);
  }

  return newApp;
}

export function updateApplicationStatus(id: string, newStatus: SubmittedApplication['status']): SubmittedApplication[] {
  const existing = getSavedApplications();
  const updated = existing.map((app) => {
    if (app.id === id) {
      const history = app.interviewHistory || [];
      const newHistoryItem = {
        timestamp: new Date().toISOString(),
        action: `Status updated to ${newStatus}`,
        actor: 'Admin / System',
        details: `Application status changed from ${app.status} to ${newStatus}.`,
      };
      return { ...app, status: newStatus, interviewHistory: [newHistoryItem, ...history] };
    }
    return app;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error updating application status', err);
  }
  return updated;
}

export function updateApplicationDetails(id: string, updates: Partial<SubmittedApplication>): SubmittedApplication[] {
  const existing = getSavedApplications();
  const updated = existing.map((app) => {
    if (app.id === id) {
      const history = app.interviewHistory || [];
      const newHistoryItem = {
        timestamp: new Date().toISOString(),
        action: `Application Details Updated`,
        actor: 'Admin / System',
        details: `Updated fields: ${Object.keys(updates).join(', ')}. Status: ${updates.status || app.status}.`,
      };
      return {
        ...app,
        ...updates,
        interviewHistory: [newHistoryItem, ...history],
        updatedAt: new Date().toISOString(),
      };
    }
    return app;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error updating application details', err);
  }
  return updated;
}

// Generate Email Contents
export interface GeneratedEmails {
  adminEmail: {
    to: string;
    from: string;
    subject: string;
    bodyText: string;
    bodyHtml: string;
  };
  applicantReply: {
    to: string;
    from: string;
    subject: string;
    bodyText: string;
    bodyHtml: string;
  };
}

export function generateNotificationEmails(app: SubmittedApplication): GeneratedEmails {
  const isInterviewEmail =
    app.status === 'Approved for Interview' ||
    app.status === 'Interview Scheduled' ||
    app.status === 'Interview Confirmed' ||
    app.status === 'Rescheduled';

  const adminSubject = isInterviewEmail
    ? `Membership Application Update — ${app.fullName} [${app.status}]`
    : `New Membership Application Received — ${app.fullName}`;

  const adminBodyText = `
MEMBERSHIP APPLICATION NOTIFICATION
Rotary Club of Makati — Membership Committee
--------------------------------------------------

Applicant Name: ${app.fullName}
Email Address: ${app.email}
Phone Number: ${app.phone}
Company / Organization: ${app.company || 'N/A'}
Business Classification: ${app.classification || 'N/A'}
Application Status: ${app.status}

${
  isInterviewEmail
    ? `INTERVIEW SCHEDULING DETAILS:
- Interview Week: ${app.interviewWeek || calculateInterviewWeek()}
- Interview Date: ${formatReadableDate(app.interviewDate)}
- Interview Time: ${formatReadableTime(app.interviewTime)}
- Interview Type: ${app.interviewType || 'Face-to-Face'}
- Venue / Meeting Link: ${app.venue || app.meetingLink || 'To Be Finalized'}
- Meeting ID / Passcode: ${app.meetingId ? `${app.meetingId} (Passcode: ${app.meetingPasscode || 'N/A'})` : 'N/A'}
- Attendance Status: ${app.attendanceStatus || 'Pending Confirmation'}
- Committee Remarks: "${app.adminRemarks || 'None'}"
- Instructions: "${app.instructions || 'None'}"`
    : `Reason for Joining RC Makati:
"${app.message || 'No additional message provided.'}"`
}

Submission Timestamp: ${app.submittedAt}
Application Reference ID: ${app.id}
Primary Admin Recipient: ${app.adminRecipient}

Direct Action Link:
https://rotaryclubmakati.org/membership?appRef=${app.id}

--------------------------------------------------
Rotary Club of Makati Secretariat
MRCFI Building, 8001 Camia St., Guadalupe Viejo, Makati City
Phone: (632) 8997863 to 65
`.trim();

  const applicantSubject = isInterviewEmail
    ? `Rotary Club of Makati — Membership Interview Invitation (${app.fullName})`
    : `Thank You for Applying to the Rotary Club of Makati`;

  const applicantBodyText = isInterviewEmail
    ? `
Dear ${app.fullName},

Congratulations! The Membership Committee of the Rotary Club of Makati is pleased to invite you for your Membership Qualification Interview.

INTERVIEW DETAILS:
--------------------------------------------------
• Application Reference ID: ${app.id}
• Status: ${app.status}
• Interview Week: ${app.interviewWeek || calculateInterviewWeek()}
• Scheduled Date: ${formatReadableDate(app.interviewDate)}
• Scheduled Time: ${formatReadableTime(app.interviewTime)}
• Interview Format: ${app.interviewType || 'Face-to-Face'}
${app.venue ? `• Physical Venue: ${app.venue}` : ''}
${app.meetingLink ? `• Virtual Link: ${app.meetingLink}` : ''}
${app.meetingId ? `• Meeting ID: ${app.meetingId} | Passcode: ${app.meetingPasscode}` : ''}
• Attendance Status: ${app.attendanceStatus || 'Pending Confirmation'}

${
  app.instructions
    ? `PREPARATION & INSTRUCTIONS:
"${app.instructions}"`
    : ''
}

NEXT STEPS:
1. Please confirm your attendance or request a schedule adjustment by accessing your Application Portal:
   https://rotaryclubmakati.org/membership?appRef=${app.id}
2. You may also download your official PDF Interview Invitation directly from your portal.

If you have questions, please reply directly to this email or call our Secretariat at (632) 8997863.

Yours in Rotary Service,

Membership Committee & Secretariat
Rotary Club of Makati, Inc.
"Service Above Self"
rotaryclubmakati.org
`.trim()
    : `
Dear ${app.fullName},

Thank you for submitting your application to join the Rotary Club of Makati — The Mother Club of Makati (District 3830).

We have successfully received your information under Reference ID: ${app.id}.

WHAT HAPPENS NEXT:
1. Review by Membership Committee: Our committee will review your background and business classification.
2. Guest Meeting Invitation: You are warmly invited to attend our regular weekly luncheon meeting as our guest.
   - When: Every Tuesday, 12:00 PM – 2:00 PM
   - Where: The Conservatory, The Manila Peninsula, Ayala Ave., Makati City
3. Member Interview: A committee member will reach out via email (${app.email}) or phone (${app.phone}) to answer any questions and coordinate your guest attendance.

If you have urgent inquiries, feel free to reply to this email or contact our Secretariat at (632) 8997863.

Yours in Rotary Service,

Keith Balete & Membership Committee
Rotary Club of Makati, Inc.
"Service Above Self"
rotaryclubmakati.org
`.trim();

  return {
    adminEmail: {
      to: app.adminRecipient,
      from: 'secretariat@rotaryclubmakati.org',
      subject: adminSubject,
      bodyText: adminBodyText,
      bodyHtml: adminBodyText.replace(/\n/g, '<br/>'),
    },
    applicantReply: {
      to: app.email,
      from: 'secretariat@rotaryclubmakati.org',
      subject: applicantSubject,
      bodyText: applicantBodyText,
      bodyHtml: applicantBodyText.replace(/\n/g, '<br/>'),
    },
  };
}
