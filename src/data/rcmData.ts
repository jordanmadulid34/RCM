import { FocusArea, ClubProject } from '../types';

export const RCM_IMAGES = {
  heroEvent: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
  teamwork: 'https://static.wixstatic.com/media/941b16_b8f80fe80e2243b7ae964af0f2049fc4~mv2.jpeg',
  leadership: 'https://static.wixstatic.com/media/941b16_fee94a5547814ae6b8ff9aa69c809b81~mv2.jpeg',
  serviceCommunity: 'https://static.wixstatic.com/media/941b16_ec48e9c04bf34a3da602b9d7ba91e962~mv2.jpeg',
  eventBannerA: 'https://static.wixstatic.com/media/b2fb7d_d89839a1bdf44d9cb48eedb8473a91d0~mv2.jpg',
  eventBannerB: 'https://static.wixstatic.com/media/b2fb7d_734ba84f78434780ae9b84e41b6189bb~mv2.jpg',
  groupCeremony: 'https://static.wixstatic.com/media/b2fb7d_252c4335f7034af7aff0e281377869cb~mv2.png',
  districtBadge: 'https://static.wixstatic.com/media/941b16_6f6644683ff84002be72f4eda47c4794~mv2.png',
};

// Source: each focus area's own page on rotaryclubmakati.org/projects/ — these are the club's 7 official areas of focus, matching Rotary International's global focus areas.
export const FOCUS_AREAS: FocusArea[] = [
  {
    id: 'disease-prevention',
    title: 'Disease Prevention & Treatment',
    iconUrl: 'https://static.wixstatic.com/media/b2fb7d_e81071c025cb4fbf91014e6c9f4d7da3~mv2.png',
    imageUrl: 'https://static.wixstatic.com/media/11062b_5fda4a987fe242ab8eefab855972ac51~mv2.jpg',
    shortDesc: 'Setting up clinics, funding surgeries, and running medical missions to bring healthcare within reach.',
    fullDesc: 'We educate and equip communities to stop the spread of life-threatening diseases, supporting free medical clinics, PolioPlus drives, and specialized surgical missions.',
    sampleProjects: ['Annual Medical & Surgical Mission', 'End Polio Now Awareness Walk', 'Barangay Health Center Equipment Upgrade']
  },
  {
    id: 'water-sanitation',
    title: 'Water & Sanitation',
    iconUrl: 'https://static.wixstatic.com/media/b2fb7d_f63f527d873e462da16aa7000cf9a20e~mv2.png',
    imageUrl: 'https://static.wixstatic.com/media/941b16_13c9a5a5cc044f90beae1cfef23a409e~mv2.jpeg',
    shortDesc: 'Bringing clean, affordable water systems to underserved communities across the country.',
    fullDesc: 'Clean water is a fundamental human right. RCM installs water filtration units and handwashing stations in public elementary schools across District 3830.',
    sampleProjects: ['Clean Water in Schools Project', 'Hygiene Station Installations', 'Deep-Well Water Pumps for Remote Communities']
  },
  {
    id: 'maternal-child-care',
    title: 'Maternal & Child Health',
    iconUrl: 'https://static.wixstatic.com/media/b2fb7d_2cfd0609a55545979fa9c175b8e09d78~mv2.png',
    imageUrl: 'https://static.wixstatic.com/media/941b16_e2b9330a6d1b4e91b6066c76b73f5c54~mv2.jpeg',
    shortDesc: 'Supporting the health and nutrition of mothers and children through feeding and wellness programs.',
    fullDesc: 'Ensuring safe deliveries and healthy childhood development through maternal health packages, infant nutrition drives, and community health worker training.',
    sampleProjects: ['First 1,000 Days Maternal Care Kit', 'Barangay Milk Feeding Program', 'Pediatric Heart Surgery Sponsorship']
  },
  {
    id: 'basic-education',
    title: 'Basic Education & Literacy',
    iconUrl: 'https://static.wixstatic.com/media/b2fb7d_b5caeae413e44c899eb10eaf81c126cd~mv2.png',
    imageUrl: 'https://static.wixstatic.com/media/941b16_9c5637aab97d405e97a2de9110f4064f~mv2.jpeg',
    shortDesc: 'Distributing books, training teachers, and supporting scholars from grade school through vocational programs.',
    fullDesc: 'Education breaks the cycle of poverty. RCM provides educational grants, builds school libraries, and conducts teacher training initiatives.',
    sampleProjects: ['RCM Youth Scholarship Program', 'Mobile E-Learning Hubs', 'Public School Reading Caravans']
  },
  {
    id: 'economic-development',
    title: 'Economic & Community Development',
    iconUrl: 'https://static.wixstatic.com/media/b2fb7d_8d6ad2b87ee140b4b84cc0ed1a881bfa~mv2.png',
    imageUrl: 'https://static.wixstatic.com/media/941b16_70514a74d6a4490a8a91d7fe59f7c264~mv2.jpeg',
    shortDesc: 'Building livelihoods and homes, and guiding careers, so communities can thrive financially and socially.',
    fullDesc: 'We invest in people to generate sustainable economic opportunity. RCM mentors micro-entrepreneurs and funds skill development programs for local livelihoods.',
    sampleProjects: ['Makati Women Micro-Loan Assistance', 'Vocational Livelihood Skills Training', 'Community Market Co-op Support']
  },
  {
    id: 'environment',
    title: 'Environment',
    iconUrl: 'https://static.wixstatic.com/media/b2fb7d_00b636edeca842bea68220ee62277041~mv2.png',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_fa49b3ebb8f14d098f42ea47a00b7ffa~mv2.jpg',
    shortDesc: 'Restoring reefs, planting forests, and reclaiming public spaces for a healthier city and coastline.',
    fullDesc: 'Protecting our planet for future generations through mangrove planting, urban greening projects, plastic waste recycling, and climate action education.',
    sampleProjects: ['Laguna Lake Reforestation Drive', 'Urban Community Gardening', 'Makati Coastal & Riverbank Cleanup']
  },
  {
    id: 'peacebuilding',
    title: 'Peacebuilding & Conflict Prevention',
    iconUrl: 'https://static.wixstatic.com/media/b2fb7d_5e8a995911ef43afaa20c4575ad2a020~mv2.png',
    imageUrl: 'https://static.wixstatic.com/media/941b16_773ef6aba90140a5a17efb8274453f4f~mv2.jpeg',
    shortDesc: 'Supporting rehabilitation and reconciliation programs that help individuals and communities heal and reintegrate.',
    fullDesc: 'By addressing the root causes of conflict — poverty, inequality, and lack of dialogue — we build resilient, peaceful communities in Metro Manila and beyond.',
    sampleProjects: ['Youth Leadership Peace Summit', 'Rotaract & Interact Dialogue Series', 'Community Mediator Workshops']
  }
];

export const CLUB_PROJECTS: ClubProject[] = [
  {
    id: 'proj-1',
    title: 'Rotary Medical & Surgical Caravan',
    focusAreaId: 'disease-prevention',
    focusAreaTitle: 'Disease Prevention & Treatment',
    imageUrl: RCM_IMAGES.eventBannerA,
    summary: 'A multi-specialty medical mission serving over 1,200 beneficiaries in Guadalupe Viejo with free consultations, medicines, and minor surgeries.',
    impactMetric: '1,200+ Patients Treated',
    location: 'Guadalupe Viejo, Makati City',
    year: '2025'
  },
  {
    id: 'proj-2',
    title: 'District 3830 Clean Water In Schools',
    focusAreaId: 'water-sanitation',
    focusAreaTitle: 'Water & Sanitation',
    imageUrl: RCM_IMAGES.teamwork,
    summary: 'Installed heavy-duty water filtration systems and touchless hygiene stations across 12 public elementary schools in Makati.',
    impactMetric: '15,000+ Students Benefited',
    location: 'Makati Public Schools',
    year: '2024 - 2025'
  },
  {
    id: 'proj-3',
    title: 'Mother & Child First 1,000 Days Program',
    focusAreaId: 'maternal-child-care',
    focusAreaTitle: 'Maternal & Child Care',
    imageUrl: RCM_IMAGES.groupCeremony,
    summary: 'Comprehensive prenatal care packages, supplemental feeding, and health education for expectant mothers in marginalized barangays.',
    impactMetric: '450 Mothers & Infants Supported',
    location: 'Barangay Rizal & Comembo',
    year: '2025'
  },
  {
    id: 'proj-4',
    title: 'RCM Heritage Scholarship Fund',
    focusAreaId: 'basic-education',
    focusAreaTitle: 'Basic Education & Literacy',
    imageUrl: RCM_IMAGES.eventBannerB,
    summary: 'Four-year college scholarship grants awarded to top-performing underprivileged high school graduates pursuing STEM and Business degrees.',
    impactMetric: '85 Scholars Funded',
    location: 'Makati City Colleges',
    year: 'Ongoing'
  }
];

export const RCM_INFO = {
  charterDate: 'March 12, 1966',
  motto: 'Service Above Self',
  district: 'Rotary International District 3830',
  titleTag: 'The Mother Club of Makati',
  charterVenue: 'Manila Polo Club, Forbes Park',
  office: {
    building: 'MRCFI Building',
    address: '8001 Camia St., Guadalupe Viejo, Makati City, 1211 Metro Manila, Philippines',
    phone: '(632) 8997863 to 65',
    email: 'info@rotaryclubmakati.org',
    meetingSchedule: 'Fridays at 12:30 PM (Weekly Luncheon)',
    meetingVenue: 'Main Ballroom, Manila Polo Club / MRCFI Hall',
    hours: [
      { days: 'Monday – Thursday', time: '7:30 AM – 5:30 PM' },
      { days: 'Friday', time: '7:30 AM – 4:30 PM' },
      { days: 'Saturday – Sunday', time: 'Closed' },
    ],
  },
  socials: {
    facebook: 'https://www.facebook.com/rcmakati',
    instagram: 'https://www.instagram.com/rotaryclubofmakati',
    youtube: 'https://www.youtube.com/@RCM3830',
    tiktok: 'https://www.tiktok.com/@rotaryclubofmakati'
  }
};
