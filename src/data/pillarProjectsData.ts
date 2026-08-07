// Full 28-project catalog — verify every image URL resolves correctly; source: rotaryclubmakati.org/projects/[pillar] pages.

export interface PillarCatalogProject {
  id: string;
  title: string;
  pillarId: string;
  pillarName: string;
  imageUrl?: string;
  videoUrl?: string;
  type?: 'photo' | 'video';
  excerpt?: string;
}

// Source: rotaryclubmakati.org/projects/disease-prevention — 8 projects
export const DiseasePreventionProjects: PillarCatalogProject[] = [
  {
    id: 'dp-1',
    title: 'Polio Plus Program',
    pillarId: 'disease-prevention',
    pillarName: 'Disease Prevention & Treatment',
    imageUrl: 'https://static.wixstatic.com/media/941b16_c7f3a903128341189db574743bf22539~mv2.jpg',
    excerpt:
      "From the historic spot in Guadalupe Viejo where RI President James Bomar initiated a polio immunization activity in 1979, the Rotary Club of Makati's legacy evolved into the global End Polio Now campaign after 36 years of impactful efforts.",
  },
  {
    id: 'dp-2',
    title: 'Stop TB Now Project',
    pillarId: 'disease-prevention',
    pillarName: 'Disease Prevention & Treatment',
    imageUrl: 'https://static.wixstatic.com/media/941b16_1b106fe9c46d451f9f0c679ca331457d~mv2.jpeg',
    excerpt:
      'Our enduring commitment to combatting pulmonary tuberculosis through strategic partnerships and interventions continues to save lives and protect vulnerable communities from the devastating impact of the disease.',
  },
  {
    id: 'dp-3',
    title: 'PGH Surgical Missions',
    pillarId: 'disease-prevention',
    pillarName: 'Disease Prevention & Treatment',
    imageUrl: 'https://static.wixstatic.com/media/941b16_b5dbc984533b429297f98f66bc19d746~mv2.jpeg',
    excerpt:
      "Initiated by the late Serafin 'Boy' Hilvano in 1989, the PGH Surgical Missions, offering free surgery for various ailments, persist 26 years after his passing, embodying his enduring legacy of compassion and healthcare for the underserved.",
  },
  {
    id: 'dp-4',
    title: 'Medical Missions',
    pillarId: 'disease-prevention',
    pillarName: 'Disease Prevention & Treatment',
    imageUrl: 'https://static.wixstatic.com/media/941b16_10efc9654d1a499da8c4554a5febda96~mv2.jpeg',
    excerpt:
      'Decades of impactful medical and dental missions spanning various communities within and beyond Metro Manila.',
  },
  {
    id: 'dp-5',
    title: 'Air Quality Monitoring System',
    pillarId: 'disease-prevention',
    pillarName: 'Disease Prevention & Treatment',
    imageUrl: 'https://static.wixstatic.com/media/941b16_036ed96854ba4cb69db75edce7174d29~mv2.jpeg',
    excerpt:
      'On its 50th anniversary, the Rotary Club of Makati launched an Air Quality Monitoring System to address worsening air quality, providing real-time data and advisories through a collaborative app with the University of the Philippines.',
  },
  {
    id: 'dp-6',
    title: 'Breast & Cervical Cancer Screening',
    pillarId: 'disease-prevention',
    pillarName: 'Disease Prevention & Treatment',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_119bebeea4324403ba2cb40f252f1dd9~mv2.jpg',
    excerpt:
      'Community-wide health screening and early detection program targeting breast and cervical cancer for women in underserved barangays.',
  },
  {
    id: 'dp-7',
    title: 'SUPEERHERO',
    pillarId: 'disease-prevention',
    pillarName: 'Disease Prevention & Treatment',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_529d9bcf80f7431fb8c9ea3531deb68f~mv2.jpg',
    excerpt:
      'Youth-centered wellness, mental health, and peer support initiative empowering students to serve as health ambassadors.',
  },
  {
    id: 'dp-8',
    title: 'Saving Ruby',
    pillarId: 'disease-prevention',
    pillarName: 'Disease Prevention & Treatment',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_4df377ce6c404ab9b65dc836bb0aa705~mv2.png',
    excerpt:
      'Specialized pediatric medical assistance program providing life-saving medical care and surgery for pediatric patients.',
  },
];

// Source: rotaryclubmakati.org/projects/water-sanitation — 2 projects
export const WaterSanitationProjects: PillarCatalogProject[] = [
  {
    id: 'ws-1',
    title: '3H Water Project',
    pillarId: 'water-sanitation',
    pillarName: 'Water & Sanitation',
    imageUrl: 'https://static.wixstatic.com/media/941b16_42cc8a5cc96f489c9e5759140e605318~mv2.jpeg',
    excerpt:
      "The Rotary Club of Makati's San Fernando Water Project, funded by a matching grant, efficiently provided water to 1,000 households. With the surplus, the Club initiated a second project, demonstrating a sustainable model for community development.",
  },
  {
    id: 'ws-2',
    title: 'GK Water System',
    pillarId: 'water-sanitation',
    pillarName: 'Water & Sanitation',
    imageUrl: 'https://static.wixstatic.com/media/941b16_49afe1d200c44146b4227c232a7e8d53~mv2.jpeg',
    excerpt:
      "With $48,000 from two TRF matching grants, the project brought clean and affordable water to 157 households, significantly improving lives and moving the community closer to its aspiration of becoming a true 'paraiso' — paradise.",
  },
];

// Source: rotaryclubmakati.org/projects/maternal-child-care — 1 project
export const MaternalChildCareProjects: PillarCatalogProject[] = [
  {
    id: 'mc-1',
    title: 'Supplemental Feeding Program',
    pillarId: 'maternal-child-care',
    pillarName: 'Maternal & Child Health',
    imageUrl: 'https://static.wixstatic.com/media/941b16_e2b9330a6d1b4e91b6066c76b73f5c54~mv2.jpeg',
    type: 'photo',
    excerpt:
      "A companion project to the Club's anti-TB treatment work, since 'TB is the sister of malnutrition.' The program includes a mothers' class where children's mothers train in meal planning, budgeting, food preparation, and health topics such as sanitation, hygiene, and responsible parenthood.",
  },
];

// Source: rotaryclubmakati.org/projects/basic-education — 8 projects
export const BasicEducationProjects: PillarCatalogProject[] = [
  {
    id: 'be-0',
    title: 'RC Makati AI Academy',
    pillarId: 'basic-education',
    pillarName: 'Basic Education & Literacy',
    type: 'video',
    imageUrl: 'https://i.ytimg.com/vi/VXwVbzl7doU/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=VXwVbzl7doU',
    excerpt:
      "A historic milestone: the first graduation of the RC Makati AI Academy, honoring 70 scholars as Certified AI Practitioners on February 28, 2026 — ethical builders of the nation's digital future.",
  },
  {
    id: 'be-1',
    title: 'Books Across the Seas',
    pillarId: 'basic-education',
    pillarName: 'Basic Education & Literacy',
    imageUrl: 'https://static.wixstatic.com/media/941b16_3dd02a0816f645c1a47e5cb7bc694b75~mv2.jpeg',
    excerpt:
      'Spanning 27 years, the project has distributed 15 million books to 65,000 schools nationwide, sustaining itself through strategic partnerships and a donation-based model for operational expenses.',
  },
  {
    id: 'be-2',
    title: 'Teaching the Deaf to Speak',
    pillarId: 'basic-education',
    pillarName: 'Basic Education & Literacy',
    imageUrl: 'https://static.wixstatic.com/media/941b16_322993c028494662a47309666ac7badb~mv2.jpeg',
    excerpt:
      'Advocating for the oral language teaching method, providing annual donations, supporting infrastructure improvements, and actively engaging with students and faculty through various initiatives.',
  },
  {
    id: 'be-3',
    title: 'Mentoring the Mentors',
    pillarId: 'basic-education',
    pillarName: 'Basic Education & Literacy',
    imageUrl: 'https://static.wixstatic.com/media/941b16_df2ce6b17c0942d898c55284c022a77f~mv2.jpeg',
    excerpt:
      'Providing training to public school teachers in effective methods of instruction as well as in character development and values formation.',
  },
  {
    id: 'be-4',
    title: 'Concentrated Language Encounter',
    pillarId: 'basic-education',
    pillarName: 'Basic Education & Literacy',
    imageUrl: 'https://static.wixstatic.com/media/941b16_23864e39247c476d81048af0030cb785~mv2.jpeg',
    excerpt:
      'Successfully involved 343 principals and teachers, benefiting over 31,600 students from Gr. 1 to Gr. 4 in all 28 public elementary schools in Makati, and was subsequently adopted by the Department of Education for nationwide implementation.',
  },
  {
    id: 'be-5',
    title: 'English Proficiency Program',
    pillarId: 'basic-education',
    pillarName: 'Basic Education & Literacy',
    imageUrl: 'https://static.wixstatic.com/media/941b16_549ce9c535ff49bf800c40a4402d1bcc~mv2.jpeg',
    excerpt:
      'Enhancing the English proficiency and communication skills of three batches of scholars from Heneral Pio del Pilar National High School, fostering improved academic performance and success in their chosen fields.',
  },
  {
    id: 'be-6',
    title: 'Dualtech Scholars',
    pillarId: 'basic-education',
    pillarName: 'Basic Education & Literacy',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_0175728456304e5db3b54d06d27b5a62~mv2.jpg',
    excerpt:
      'Scholarship and technical-vocational training sponsorship for deserving young men preparing for industrial electro-mechanics careers.',
  },
  {
    id: 'be-7',
    title: 'SciQuest',
    pillarId: 'basic-education',
    pillarName: 'Basic Education & Literacy',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_c8a13090aa5443ca8a0d8185dd96fb4a~mv2.jpg',
    excerpt:
      'Interactive science education initiative bringing hands-on science exhibits and learning modules to public school students.',
  },
];

// Source: rotaryclubmakati.org/projects/economic-development — 6 projects
export const EconomicDevelopmentProjects: PillarCatalogProject[] = [
  {
    id: 'ed-1',
    title: 'Career Guidance',
    pillarId: 'economic-development',
    pillarName: 'Economic & Community Development',
    imageUrl: 'https://static.wixstatic.com/media/941b16_e9a50dfcd16d4daebd7e2d2167f4182d~mv2.jpeg',
    excerpt:
      'Annual career guidance program for Pamantasan ng Makati seniors, providing insights into various fields, admission requirements, scholarship programs, and employment prospects, and aligning individual strengths and interests.',
  },
  {
    id: 'ed-2',
    title: 'Reforestation of La Mesa Watershed',
    pillarId: 'economic-development',
    pillarName: 'Economic & Community Development',
    imageUrl: 'https://static.wixstatic.com/media/941b16_41a7b843b1354c718c8b28b9d6454bfe~mv2.jpeg',
    excerpt:
      "In partnership with ABS-CBN Foundation's Bantay Kalikasan, implemented a reforestation project in the La Mesa watershed, planting 47,822 trees on 76.5 hectares with a matching grant of US$75,472 from The Rotary Foundation.",
  },
  {
    id: 'ed-3',
    title: 'ARK Feedback Project',
    pillarId: 'economic-development',
    pillarName: 'Economic & Community Development',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_5ba3ca4237a5446f8b1620070e5b4b4d~mv2.jpg',
    excerpt:
      'Rural community nutrition and economic self-sufficiency initiative partnering with Advancement for Rural Kids in agrarian communities.',
  },
  {
    id: 'ed-4',
    title: 'Start Up Village',
    pillarId: 'economic-development',
    pillarName: 'Economic & Community Development',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_6a1eaad6b2514ae3ae4479f709550b4b~mv2.jpg',
    excerpt:
      'Incubation program supporting micro-entrepreneurs and early-stage social impact enterprises through mentorship and seed capital.',
  },
  {
    id: 'ed-5',
    title: 'Rotary Homes',
    pillarId: 'economic-development',
    pillarName: 'Economic & Community Development',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_2819b63aefc348b69e03700461a85ccd~mv2.jpg',
    excerpt:
      "Recognized by RC Manila as among the Top Ten Service Projects in the Philippines during Rotary's centennial celebration on June 1, 2019, with Rotary Homes conferred the Top Service Project Award.",
  },
  {
    id: 'ed-6',
    title: 'Tulong Dunong',
    pillarId: 'economic-development',
    pillarName: 'Economic & Community Development',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_c0f3f9723a7941899962ccbcffc724ee~mv2.jpg',
    excerpt:
      'Educational sponsorship and livelihood support program providing holistic financial and academic assistance to youth in need.',
  },
];

// Source: rotaryclubmakati.org/projects/environment — 2 projects
export const EnvironmentProjects: PillarCatalogProject[] = [
  {
    id: 'env-1',
    title: 'Save Our Reefs',
    pillarId: 'environment',
    pillarName: 'Environment',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_daebb40a8d074468890b4fc57e3ff879~mv2.jpg',
    excerpt:
      'First initiated in 2021 in Narvacan, Ilocos Sur with 200 reef buds, the project has grown to more than 400 reef buds, with additional sites now established in Padre Burgos, Quezon and La Union.',
  },
  {
    id: 'env-2',
    title: 'BGC Green Way',
    pillarId: 'environment',
    pillarName: 'Environment',
    type: 'video',
    imageUrl: 'https://i.ytimg.com/vi/Zq39I1kWVK4/maxresdefault.jpg',
    videoUrl: 'https://youtu.be/Zq39I1kWVK4',
    excerpt:
      'Listen to the voices of the community who walk it, use it, and live around it. What was once just a pathway is now a shared space for movement, connection, and well-being — an example of what happens when the public and private sectors work toward a common goal.',
  },
];

// Source: rotaryclubmakati.org/projects/peacebuilding — 1 project
export const PeacebuildingProjects: PillarCatalogProject[] = [
  {
    id: 'pb-1',
    title: 'Sanlakbay Drug Rehab',
    pillarId: 'peacebuilding',
    pillarName: 'Peacebuilding & Conflict Prevention',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_e95fea3b58284b6a98e28b7f1cdca5ee~mv2.jpg',
    excerpt:
      'Community-based drug rehabilitation and spiritual transformation program providing holistic recovery support and skills training.',
  },
];

export const ALL_28_PROJECTS: PillarCatalogProject[] = [
  ...DiseasePreventionProjects,
  ...WaterSanitationProjects,
  ...MaternalChildCareProjects,
  ...BasicEducationProjects,
  ...EconomicDevelopmentProjects,
  ...EnvironmentProjects,
  ...PeacebuildingProjects,
];

export const ALL_PILLAR_PROJECTS_MAP: Record<string, PillarCatalogProject[]> = {
  'disease-prevention': DiseasePreventionProjects,
  'water-sanitation': WaterSanitationProjects,
  'maternal-child-care': MaternalChildCareProjects,
  'basic-education': BasicEducationProjects,
  'economic-development': EconomicDevelopmentProjects,
  'environment': EnvironmentProjects,
  'peacebuilding': PeacebuildingProjects,
};
