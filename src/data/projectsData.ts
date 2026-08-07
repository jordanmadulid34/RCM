// Source: rotaryclubmakati.org/blog — refresh this list periodically with the club's newest project posts to keep this feed current.

export interface ProjectPost {
  id: string;
  title: string;
  date: string;
  type: 'photo' | 'video';
  imageUrl: string;
  videoUrl?: string;
  pillar: string;
  pillarId: string;
  excerpt: string;
  fullStoryUrl: string;
  isMilestone?: boolean;
  placeholderLabel?: string;
}

export const REAL_RCM_PROJECTS: ProjectPost[] = [
  {
    id: 'post-1',
    title: "RC Makati's Hatch+ Cohort 2 Completes Final Pitch",
    date: 'June 3, 2026',
    type: 'photo',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_9946319f5a2845d18303c2396cb5011a~mv2.jpg',
    pillar: 'Economic & Community Development',
    pillarId: 'economic-development',
    excerpt:
      'After months of learning sessions, mentoring, and collaboration, RC Makati formally concluded the HATCH+ Cohort 2 Incubation Program through its Final Pitch at the RC Makati Clubhouse — 13 sessions of intensive mentoring and business development for socially relevant startups.',
    fullStoryUrl: 'https://www.rotaryclubmakati.org/post/rc-makati-s-hatch-cohort-2-completes-final-pitch',
  },
  {
    id: 'post-2',
    title: 'Club Conducts Dental Mission at Sisters of Mary',
    date: 'May 28, 2026',
    type: 'photo',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_a9b11276feb747a9a98acbff46597292~mv2.jpg',
    pillar: 'Disease Prevention & Treatment',
    pillarId: 'disease-prevention',
    excerpt:
      "RC Makati continued its long-standing partnership with the Sisters of Mary in Silang, Cavite — from AI Academy scholarships to mental health awareness and environmental projects, this dental mission is the latest chapter in supporting the students' holistic development.",
    fullStoryUrl: 'https://www.rotaryclubmakati.org/post/club-conducts-dental-mission-at-sisters-of-mary',
  },
  {
    id: 'post-3',
    title: 'RC Makati Expands Save Our Reefs Project to La Union',
    date: 'May 20, 2026',
    type: 'photo',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_7120845956ba471a8faed4ec2c05839c~mv2.jpg',
    pillar: 'Environment',
    pillarId: 'environment',
    excerpt:
      'First initiated in 2021 in Narvacan, Ilocos Sur with 200 reef buds, the Save Our Reefs project has grown to more than 400 reef buds, and has now expanded to a second site in Padre Burgos, Quezon.',
    fullStoryUrl: 'https://www.rotaryclubmakati.org/post/rc-makati-expands-save-our-reefs-project-to-la-union',
  },
  {
    id: 'post-4',
    title: 'The BGC Greenway Project',
    date: 'April 23, 2026',
    type: 'video',
    imageUrl: 'https://i.ytimg.com/vi/Zq39I1kWVK4/maxresdefault.jpg',
    videoUrl: 'https://youtu.be/Zq39I1kWVK4',
    pillar: 'Environment',
    pillarId: 'environment',
    excerpt:
      'Listen to the voices of the community who walk it, use it, and live around it. What was once just a pathway is now a shared space for movement, connection, and well-being — an example of what happens when the public and private sectors work toward a common goal.',
    fullStoryUrl: 'https://www.rotaryclubmakati.org/post/the-bgc-greenway-project',
  },
  {
    id: 'post-5',
    title: 'RC Makati Hosts Career Guidance Seminar for Grade 10 Students of Gen. Pio del Pilar NHS',
    date: 'April 8, 2026',
    type: 'photo',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_b1fbf77300f9440ca4f20030468fcc2c~mv2.jpg',
    pillar: 'Basic Education & Literacy',
    pillarId: 'basic-education',
    excerpt:
      'As part of its Vocational Service commitment, RC Makati brought together 150 Grade 10 students of Gen. Pio del Pilar National High School in Barangay Poblacion for a session on future career paths and professional aspirations.',
    fullStoryUrl: 'https://www.rotaryclubmakati.org/post/rc-makati-hosts-career-guidance-seminar-for-grade-10-students-of-gen-pio-del-pilar-nhs',
  },
  {
    id: 'post-6',
    title: "RC Makati Participates at ARK's Insider Trip in Sorsogon",
    date: 'April 8, 2026',
    type: 'photo',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_ca7371be21054818ab83365c2c4cdbcd~mv2.jpg',
    pillar: 'Economic & Community Development',
    pillarId: 'economic-development',
    excerpt:
      'The Club sent Dir. Patrick & Mitzi Parungao, incoming Dir. Bom Villatuya, and PE Chris Ferareza to join Dir. Philip Soliven — a board member of Advancement for Rural Kids (ARK) — for an Insider Trip in Sorsogon to see the impact of Wave 11 projects firsthand.',
    fullStoryUrl: 'https://www.rotaryclubmakati.org/post/rc-makati-participates-at-ark-s-insider-trip-in-sorsogon',
  },
  {
    id: 'post-7',
    title: 'Rotary Club of Makati AI Academy Celebrates First Graduation',
    date: 'April 6, 2026',
    type: 'video',
    imageUrl: 'https://i.ytimg.com/vi/VXwVbzl7doU/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=VXwVbzl7doU',
    pillar: 'Basic Education & Literacy',
    pillarId: 'basic-education',
    excerpt:
      "A historic milestone: the first graduation of the RC Makati AI Academy, honoring 70 scholars as Certified AI Practitioners on February 28, 2026 — ethical builders of the nation's digital future.",
    fullStoryUrl: 'https://www.rotaryclubmakati.org/post/rotary-club-of-makati-ai-academy-celebrates-first-graduation-1',
  },
  {
    id: 'post-8',
    title: 'SDE: RC Makati 60th Charter Anniversary',
    date: 'April 6, 2026',
    type: 'video',
    imageUrl: 'https://i.ytimg.com/vi/XNs3LUd2KOc/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=XNs3LUd2KOc',
    pillar: 'Club Milestone',
    pillarId: 'milestones',
    isMilestone: true,
    excerpt:
      "Same-Day-Edit highlight of the Rotary Club of Makati's 60th Charter Anniversary, held March 13, 2026 at the Marriott Grand Ballroom.",
    fullStoryUrl: 'https://www.rotaryclubmakati.org/post/sde-rc-makati-60th-charter-anniversary',
  },
];
