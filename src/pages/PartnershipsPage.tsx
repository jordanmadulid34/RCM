// Source: individual project pages under rotaryclubmakati.org/projects/ — these partnerships were identified from project descriptions, not from a dedicated partners page (the club's site does not have one). Verify this list with the club before treating it as exhaustive.

import React, { useState, useEffect } from 'react';
import {
  Handshake,
  Sparkles,
  Building,
  Globe,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  HeartHandshake,
  Award,
  GraduationCap,
  TreePine,
  Stethoscope,
  BookOpen,
  Image as ImageIcon,
  Info
} from 'lucide-react';
import { TabType, ThemeType } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface PartnershipsPageProps {
  setActiveTab: (tab: TabType) => void;
  onSelectFocusArea?: (focusId: string) => void;
  theme: ThemeType;
}

// Background image rotation array for the Partnerships & Collaborations hero band
// Auto-rotating background cycling through partner & organization logos with clean horizontal slide
const PARTNERSHIP_HERO_SLIDES = [
  {
    id: 1,
    src: 'https://static.wixstatic.com/media/941b16_b8f80fe80e2243b7ae964af0f2049fc4~mv2.jpeg',
    fallbackSrc: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    alt: 'Rotary Club of Makati Partners & Collaborations — KadaKareer, DUALTECH, Alay Kapwa, Caritas, Knowledge Channel, NGF, Ayala Foundation, Kyäni, ABS-CBN Bantay Kalikasan, Globe, Manna Cuisine, World Vision, DepEd',
  },
  {
    id: 2,
    src: 'https://static.wixstatic.com/media/b2fb7d_b1fbf77300f9440ca4f20030468fcc2c~mv2.jpg',
    fallbackSrc: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    alt: 'KadaKareer Education & Innovation Partner',
  },
  {
    id: 3,
    src: 'https://static.wixstatic.com/media/941b16_41a7b843b1354c718c8b28b9d6454bfe~mv2.jpeg',
    fallbackSrc: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    alt: 'ABS-CBN Foundation Bantay Kalikasan',
  },
  {
    id: 4,
    src: 'https://static.wixstatic.com/media/b2fb7d_18c2b22ec6ac417db7c39790b1a8d22e~mv2.jpg',
    fallbackSrc: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    alt: 'Caritas Manila Community & Nutrition Partner',
  },
  {
    id: 5,
    src: 'https://static.wixstatic.com/media/941b16_23864e39247c476d81048af0030cb785~mv2.jpeg',
    fallbackSrc: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    alt: 'Department of Education (DepEd) Government Partner',
  },
  {
    id: 6,
    src: 'https://static.wixstatic.com/media/b2fb7d_a9b11276feb747a9a98acbff46597292~mv2.jpg',
    fallbackSrc: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    alt: 'Sisters of Mary Silang Cavite',
  },
  {
    id: 7,
    src: 'https://static.wixstatic.com/media/b2fb7d_ca7371be21054818ab83365c2c4cdbcd~mv2.jpg',
    fallbackSrc: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    alt: 'ARK Advancement for Rural Kids',
  },
  {
    id: 8,
    src: 'https://static.wixstatic.com/media/941b16_036ed96854ba4cb69db75edce7174d29~mv2.jpeg',
    fallbackSrc: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    alt: 'University of the Philippines Academic Partner',
  },
  {
    id: 9,
    src: 'https://static.wixstatic.com/media/941b16_3dd02a0816f645c1a47e5cb7bc694b75~mv2.jpeg',
    fallbackSrc: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    alt: 'Philippine National Bank Books Across the Seas',
  },
  {
    id: 10,
    src: 'https://static.wixstatic.com/media/941b16_e9a50dfcd16d4daebd7e2d2167f4182d~mv2.jpeg',
    fallbackSrc: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    alt: 'Pamantasan ng Makati (UMak) Higher Education Partner',
  },
  {
    id: 11,
    src: 'https://static.wixstatic.com/media/941b16_3368ef7ebae5442da13a7c0a4a6d871e~mv2.jpeg',
    fallbackSrc: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    alt: 'Department of Social Welfare and Development (DSWD)',
  },
  {
    id: 12,
    src: 'https://static.wixstatic.com/media/b2fb7d_2819b63aefc348b69e03700461a85ccd~mv2.jpg',
    fallbackSrc: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    alt: 'Rotary Club of Makati Foundation (MRCFI)',
  },
];

export const PartnershipsPage: React.FC<PartnershipsPageProps> = ({
  setActiveTab,
  onSelectFocusArea,
  theme,
}) => {
  const { t } = useI18n();
  const isDark = theme === 'dark';

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [heroImgErrors, setHeroImgErrors] = useState<Record<number, boolean>>({});

  // Detect reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Auto-advance slideshow every 4.5 seconds (looping infinitely)
  useEffect(() => {
    if (PARTNERSHIP_HERO_SLIDES.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % PARTNERSHIP_HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleHeroImageError = (id: number) => {
    setHeroImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const ORGANIZATIONAL_PARTNERS = [
    {
      id: 'abs-cbn',
      name: 'ABS-CBN Foundation — Bantay Kalikasan',
      category: 'Media & Environment Partner',
      icon: TreePine,
      image: 'https://static.wixstatic.com/media/941b16_41a7b843b1354c718c8b28b9d6454bfe~mv2.jpeg',
      imageAlt: "RC Makati reforestation project in La Mesa Watershed with ABS-CBN Foundation's Bantay Kalikasan",
      context:
        "In partnership with ABS-CBN Foundation's Bantay Kalikasan, RC Makati implemented a reforestation project in the La Mesa watershed, planting 47,822 trees on 76.5 hectares with a matching grant of US$75,472 from The Rotary Foundation.",
      relatedProjectTitle: 'Reforestation of La Mesa Watershed',
      focusAreaId: 'environment',
    },
    {
      id: 'sisters-of-mary',
      name: 'Sisters of Mary, Silang, Cavite',
      category: 'Community & Youth Partner',
      icon: Stethoscope,
      image: 'https://static.wixstatic.com/media/b2fb7d_a9b11276feb747a9a98acbff46597292~mv2.jpg',
      imageAlt: 'RC Makati dental mission and student support at Sisters of Mary in Silang, Cavite',
      context:
        'RC Makati continues a long-standing partnership with the Sisters of Mary, supporting the holistic development of its students — from AI Academy scholarships to dental missions, mental health awareness, and environmental projects.',
      relatedProjectTitle: 'Dental Missions & AI Academy',
      focusAreaId: 'disease-prevention',
    },
    {
      id: 'ark',
      name: 'ARK — Advancement for Rural Kids',
      category: 'Rural Livelihood Partner',
      icon: HeartHandshake,
      image: 'https://static.wixstatic.com/media/b2fb7d_ca7371be21054818ab83365c2c4cdbcd~mv2.jpg',
      imageAlt: "RC Makati board members joining ARK's Insider Trip in Sorsogon for rural education and livelihood",
      context:
        "RC Makati sent board members to join ARK's Insider Trip in Sorsogon, viewing the impact of Wave 11 projects firsthand — one of several joint initiatives with ARK on rural education and livelihood.",
      relatedProjectTitle: 'ARK Insider Trip & Rural Livelihoods',
      focusAreaId: 'economic-community-development',
    },
    {
      id: 'up',
      name: 'University of the Philippines',
      category: 'Academic & Innovation Partner',
      icon: GraduationCap,
      image: 'https://static.wixstatic.com/media/941b16_036ed96854ba4cb69db75edce7174d29~mv2.jpeg',
      imageAlt: 'Air Quality Monitoring System launch in collaboration with University of the Philippines',
      context:
        'In collaboration with the University of the Philippines, RC Makati launched an Air Quality Monitoring System providing real-time data and advisories through a joint app.',
      relatedProjectTitle: 'Air Quality Monitoring System',
      focusAreaId: 'disease-prevention',
    },
    {
      id: 'deped',
      name: 'Department of Education (DepEd)',
      category: 'Government Education Partner',
      icon: BookOpen,
      image: 'https://static.wixstatic.com/media/941b16_23864e39247c476d81048af0030cb785~mv2.jpeg',
      imageAlt: 'Concentrated Language Encounter program with Department of Education for Makati public elementary schools',
      context:
        "RC Makati's Concentrated Language Encounter program successfully involved 343 principals and teachers, benefiting over 31,600 students across all 28 public elementary schools in Makati — and was subsequently adopted by the Department of Education for nationwide implementation.",
      relatedProjectTitle: 'Concentrated Language Encounter',
      focusAreaId: 'basic-education',
    },
    {
      id: 'pnb',
      name: 'Philippine National Bank (PNB)',
      category: 'Education Partner (Books Across the Seas Program)',
      icon: BookOpen,
      image: 'https://static.wixstatic.com/media/941b16_3dd02a0816f645c1a47e5cb7bc694b75~mv2.jpeg',
      imageAlt: 'PNB partnership with RC Makati for Books Across the Seas Program',
      context:
        'In partnership with RC Makati for the Books Across the Seas Program, Philippine National Bank (PNB) provides vital logistics, transport, and educational support to deliver reading materials to public school libraries.',
      relatedProjectTitle: 'Books Across the Seas Program',
      focusAreaId: 'basic-education',
    },
    {
      id: 'rex-book-store',
      name: 'Rex Book Store',
      category: 'Education Partner (Books Across the Seas Program)',
      icon: BookOpen,
      image: 'https://primer.com.ph/tips-guides/wp-content/uploads/sites/5/2017/01/rex.jpg',
      imageAlt: 'Rex Book Store partnership with RC Makati for Books Across the Seas Program',
      context:
        'Rex Book Store collaborates with RC Makati under the Books Across the Seas Program, donating textbooks, learning resources, and curriculum materials to enrich public school libraries nationwide.',
      relatedProjectTitle: 'Books Across the Seas Program',
      focusAreaId: 'basic-education',
    },
    {
      id: 'kadakareer',
      name: 'KadaKareer',
      category: 'Education & Innovation Partner',
      icon: Sparkles,
      image: 'https://static.wixstatic.com/media/b2fb7d_b1fbf77300f9440ca4f20030468fcc2c~mv2.jpg',
      imageAlt: 'KadaKareer youth education and career guidance seminar with RC Makati',
      context:
        'KadaKareer partners with RC Makati as an Education & Innovation Partner to empower youth through digital career exploration tools, skills workshops, and interactive mentorship programs.',
      relatedProjectTitle: 'Career Guidance Seminar (Grade 10)',
      focusAreaId: 'basic-education',
    },
    {
      id: 'pid',
      name: 'Philippine Institute for the Deaf (PID)',
      category: 'Special Education & Rehabilitation Partner',
      icon: BookOpen,
      image: 'https://static.wixstatic.com/media/941b16_322993c028494662a47309666ac7badb~mv2.jpeg',
      imageAlt: 'Philippine Institute for the Deaf partnership with RC Makati for Teaching the Deaf to Speak',
      context:
        'Partner in special education and speech rehabilitation for hearing-impaired children, helping deaf students develop speech and integration skills.',
      relatedProjectTitle: 'Teaching the Deaf to Speak',
      focusAreaId: 'basic-education',
    },
    {
      id: 'umak',
      name: 'Pamantasan ng Makati (UMak)',
      category: 'Academic & Career Guidance Partner',
      icon: GraduationCap,
      image: 'https://static.wixstatic.com/media/941b16_e9a50dfcd16d4daebd7e2d2167f4182d~mv2.jpeg',
      imageAlt: 'Pamantasan ng Makati career guidance seminar and youth scholarship partnership with RC Makati',
      context:
        'Academic partner for annual senior career guidance, scholarship programs, and youth leadership training for Pamantasan ng Makati students.',
      relatedProjectTitle: 'Career Guidance',
      focusAreaId: 'basic-education',
    },
    {
      id: 'caritas',
      name: 'Caritas Manila',
      category: 'Community Nutrition & Welfare Partner',
      icon: HeartHandshake,
      image: 'https://static.wixstatic.com/media/b2fb7d_18c2b22ec6ac417db7c39790b1a8d22e~mv2.jpg',
      imageAlt: 'Caritas Manila partnership with RC Makati for Damayan Supplementary Nutrition Program',
      context:
        'Co-implementer of urban nutrition and health intervention programs for indigent families in Metro Manila, including the Damayan Supplementary Nutrition Program.',
      relatedProjectTitle: 'Damayan Supplementary Nutrition Program',
      focusAreaId: 'maternal-child-care',
    },
    {
      id: 'dswd',
      name: 'Department of Social Welfare and Development (DSWD)',
      category: 'Government Welfare & Child Protection Partner',
      icon: HeartHandshake,
      image: 'https://static.wixstatic.com/media/b2fb7d_2819b63aefc348b69e03700461a85ccd~mv2.jpg',
      imageAlt: 'DSWD collaboration with RC Makati for School for Street Children and disaster relief',
      context:
        'Government partner for community welfare, disaster relief distribution, and street children protection programs, joining hands to create the School for Street Children.',
      relatedProjectTitle: 'School for Street Children',
      focusAreaId: 'community-development',
    },
    {
      id: 'child-protection-welfare-bureau',
      name: 'Child Protection Welfare Bureau',
      category: 'Government Welfare & Child Protection Partner',
      icon: HeartHandshake,
      image: 'https://tse4.mm.bing.net/th/id/OIP.dMkZX1cxgVFMVJvDP__G1wHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      imageAlt: 'Child Protection Welfare Bureau partnership with RC Makati for child protection and welfare programs',
      context:
        'Dedicated partner for child advocacy, welfare, and protective services, collaborating with RC Makati on child protection initiatives, guidance, and community welfare programs.',
      relatedProjectTitle: 'School for Street Children',
      focusAreaId: 'community-development',
    },
    {
      id: 'mrcfi',
      name: 'Rotary Club of Makati Foundation, Inc. (MRCFI)',
      category: 'Institutional Endowment & Funding Arm',
      icon: Sparkles,
      image: 'https://static.wixstatic.com/media/b2fb7d_2819b63aefc348b69e03700461a85ccd~mv2.jpg',
      imageAlt: 'Rotary Club of Makati Foundation, Inc. (MRCFI) institutional endowment and matching grant funding',
      context:
        'The Club\'s own institutional funding arm, providing matching grants and permanent endowment for high-impact sustainable projects for over five decades.',
      relatedProjectTitle: 'Rotary Homes & Livelihood Center',
      focusAreaId: 'community-development',
    },
  ];

  const handleProjectClick = (focusAreaId: string) => {
    if (onSelectFocusArea) {
      onSelectFocusArea(focusAreaId);
    }
    setActiveTab('Projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fadeIn space-y-0">
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO BAND (AUTO-ROTATING BRIGHT PHOTO SLIDE BACKGROUND)         */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative py-20 lg:py-24 overflow-hidden min-h-[440px] flex items-center justify-center border-b border-[#F7A81B]/20 w-full bg-[#011E41]">
        {/* Layer 1: Horizontal Sliding Background Image Track (z-0) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#011E41]">
          {PARTNERSHIP_HERO_SLIDES.map((slide, index) => {
            const totalSlides = PARTNERSHIP_HERO_SLIDES.length;
            const isCurrent = index === currentHeroIndex;
            const isPrev = index === (currentHeroIndex - 1 + totalSlides) % totalSlides;
            const isNext = index === (currentHeroIndex + 1) % totalSlides;

            let translateX = '100%';
            let opacity = 0;
            let zIndex = 0;

            if (isCurrent) {
              translateX = '0%';
              opacity = 1;
              zIndex = 10;
            } else if (isPrev) {
              translateX = '-100%';
              opacity = 1;
              zIndex = 5;
            } else if (isNext) {
              translateX = '100%';
              opacity = 1;
              zIndex = 5;
            }

            const isError = heroImgErrors[slide.id];
            const imgSrc = isError ? slide.fallbackSrc : slide.src;

            return (
              <div
                key={slide.id}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{
                  transform: prefersReducedMotion ? 'none' : `translateX(${translateX})`,
                  opacity: prefersReducedMotion ? (isCurrent ? 1 : 0) : opacity,
                  zIndex,
                  transition: prefersReducedMotion
                    ? 'none'
                    : 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)',
                  willChange: 'transform',
                }}
              >
                <img
                  src={imgSrc}
                  alt={slide.alt}
                  referrerPolicy="no-referrer"
                  onError={() => handleHeroImageError(slide.id)}
                  className="w-full h-full object-cover object-center scale-100"
                />
              </div>
            );
          })}
        </div>

        {/* Layer 2: Subtle Full-Width Dark Overlay for Text Legibility over Full-Bleed Sliding Background */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Layer 3: Foreground Content directly over full-bleed sliding background (z-20) */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 space-y-6 w-full max-w-full overflow-hidden">
          <div className="inline-flex items-center space-x-2 bg-[#011E41]/80 border border-[#F7A81B] text-[#F7A81B] px-3.5 sm:px-4 py-1.5 rounded-full shadow-lg backdrop-blur-sm max-w-full">
            <Handshake className="w-4 h-4 text-[#F7A81B] shrink-0" />
            <span className="font-montserrat font-bold text-[10px] sm:text-xs uppercase tracking-widest text-[#F7A81B] truncate">
              {t('GLOBAL & LOCAL ALLIANCES')}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] max-w-4xl mx-auto break-words [word-break:break-word] max-w-full">
            {t('Partnerships & Collaborations')}
          </h1>

          <p className="font-sans text-sm sm:text-lg text-slate-100 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] break-words [word-break:break-word] max-w-full">
            RC Makati's work is made possible through collaboration — with corporations, foundations, schools, government agencies, and fellow Rotary clubs.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3 text-xs font-montserrat font-bold uppercase tracking-wider text-[#F7A81B]">
            <span className="bg-[#011E41]/80 border border-[#F7A81B]/60 text-[#F7A81B] px-4 py-2 rounded-full shadow-md backdrop-blur-sm">
              NGOs & Foundations
            </span>
            <span className="bg-[#011E41]/80 border border-[#F7A81B]/60 text-[#F7A81B] px-4 py-2 rounded-full shadow-md backdrop-blur-sm">
              Academic Institutions
            </span>
            <span className="bg-[#011E41]/80 border border-[#F7A81B]/60 text-[#F7A81B] px-4 py-2 rounded-full shadow-md backdrop-blur-sm">
              Government Agencies
            </span>
            <span className="bg-[#011E41]/80 border border-[#F7A81B]/60 text-[#F7A81B] px-4 py-2 rounded-full shadow-md backdrop-blur-sm">
              Global Rotary Network
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. ORGANIZATIONAL PARTNERS SECTION                                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        className={`py-20 transition-colors duration-300 border-b ${
          isDark
            ? 'bg-[#011E41] border-[#F7A81B]/20 text-[#F5F1E6]'
            : 'bg-[#FAFAF7] border-[#E5E1D8] text-[#1A1F2B]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/10 px-3.5 py-1 rounded-full border border-[#F7A81B]/30">
              <Building className="w-4 h-4 text-[#F7A81B]" />
              <span>Institutional Collaborators</span>
            </div>

            <h2
              className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold ${
                isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'
              }`}
            >
              Organizational Partners
            </h2>

            <p className="text-sm sm:text-base font-sans italic opacity-85 max-w-2xl mx-auto leading-relaxed">
              Working hand-in-hand with leading institutions to execute sustainable, high-value community programs.
            </p>
          </div>

          {/* Grid of Partner Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ORGANIZATIONAL_PARTNERS.map((partner) => {
              const IconComp = partner.icon;
              return (
                <div
                  key={partner.id}
                  className={`rounded-3xl border transition-all duration-300 hover:-translate-y-1 shadow-md flex flex-col justify-between h-full overflow-hidden group ${
                    isDark
                      ? 'bg-[#121212] border-[#F7A81B]/30 hover:border-[#F7A81B]'
                      : 'bg-white border-[#E5E1D8] hover:border-[#17458F]/40 hover:shadow-xl'
                  }`}
                >
                  {/* Photo Header with Overlay Badge & Icon */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-white border-b border-[#F7A81B]/20 flex items-center justify-center">
                    {partner.image ? (
                      <img
                        src={partner.image}
                        alt={partner.imageAlt}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#011E41] via-[#013366] to-[#011E41] flex flex-col items-center justify-center p-4 text-center">
                        <ImageIcon className="w-8 h-8 text-[#F7A81B]/60 mb-2" />
                        <span className="text-[11px] font-montserrat font-bold text-[#F7A81B] tracking-wider uppercase">
                          Official Photo Pending
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                    {/* Category Badge & Icon Overlaid on Bottom of Photo Header */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-montserrat font-extrabold uppercase tracking-widest bg-[#011E41]/90 border border-[#F7A81B]/60 text-[#F7A81B] px-3 py-1 rounded-full backdrop-blur-md shadow-md">
                        {partner.category}
                      </span>
                      <div className="p-2 rounded-xl bg-[#011E41]/90 text-[#F7A81B] border border-[#F7A81B]/50 backdrop-blur-md shadow-md">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-3">
                      {/* Partner Name */}
                      <h3
                        className={`font-serif text-xl font-bold leading-snug ${
                          isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'
                        }`}
                      >
                        {partner.name}
                      </h3>

                      {/* Context Paragraph */}
                      <p className="text-xs sm:text-sm font-sans leading-relaxed opacity-90 font-light">
                        {partner.context}
                      </p>
                    </div>

                    {/* Related Project Link Button */}
                    <div className="pt-4 border-t border-[#F7A81B]/15 mt-4">
                      <button
                        type="button"
                        onClick={() => handleProjectClick(partner.focusAreaId)}
                        className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-[#011E41] text-[#F7A81B] hover:bg-[#F7A81B] hover:text-[#011E41] border border-[#F7A81B]/30'
                            : 'bg-[#F0EDE6] text-[#011E41] hover:bg-[#F7A81B] hover:text-[#011E41] border border-[#011E41]/15'
                        }`}
                      >
                        <span className="truncate pr-2">
                          Project: {partner.relatedProjectTitle}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Roster List View */}
          <div className="mt-12 pt-8 border-t border-[#F7A81B]/20 space-y-4">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F7A81B] text-center sm:text-left">
              Organizational Partners Directory
            </h3>
            <div
              className={`rounded-2xl border overflow-hidden shadow-md divide-y ${
                isDark
                  ? 'bg-black border-[#F7A81B]/30 divide-[#F7A81B]/15 text-[#F5F1E6]'
                  : 'bg-black border-black divide-gray-800 text-white'
              }`}
            >
              {ORGANIZATIONAL_PARTNERS.map((partner) => (
                <div
                  key={`list-${partner.id}`}
                  className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/5 transition-colors"
                >
                  <span className="font-montserrat font-bold text-sm tracking-wide text-white">
                    {partner.name}
                  </span>
                  <span className="font-montserrat font-semibold text-xs text-[#F7A81B] sm:text-right">
                    {partner.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. OUR FOUNDATION SECTION (MRCFI)                                  */}
      {/* ------------------------------------------------------------------ */}
      <section
        className={`py-20 transition-colors duration-300 border-b ${
          isDark
            ? 'bg-[#121212] border-[#F7A81B]/15 text-[#F5F1E6]'
            : 'bg-[#F0EDE6] border-[#011E41]/10 text-[#2A2A2A]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`p-8 sm:p-12 rounded-3xl border-2 shadow-2xl relative overflow-hidden ${
              isDark
                ? 'bg-[#011E41] border-[#F7A81B] text-[#F5F1E6]'
                : 'bg-[#FAF8F3] border-[#F7A81B] text-[#011E41]'
            }`}
          >
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#F7A81B]" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center space-x-2 bg-[#F7A81B] text-[#011E41] px-4 py-1 rounded-full text-xs font-montserrat font-extrabold uppercase tracking-widest shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Our Foundation</span>
                </div>

                <h2
                  className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold ${
                    isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'
                  }`}
                >
                  Makati Rotary Club Foundation, Inc. (MRCFI)
                </h2>

                <p className="text-base sm:text-lg leading-relaxed font-light opacity-95">
                  RC Makati's own funding arm, <strong className="font-semibold text-[#F7A81B]">MRCFI</strong>, allows the club to carry out long-term projects that benefit large numbers of people. In its early years, it derived funds from rental income from its 3-storey arcade at the Makati Commercial Center.
                </p>

                <p className="text-xs sm:text-sm leading-relaxed opacity-85 font-sans">
                  Unlike third-party partners, MRCFI serves as RC Makati's dedicated institutional cornerstone — ensuring matching grant capabilities, permanent asset management, and perpetual project sustainability for over five decades.
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="p-7 rounded-2xl bg-[#011E41] border-2 border-[#F7A81B] text-[#F5F1E6] text-center space-y-3.5 shadow-2xl w-full">
                  <Building className="w-12 h-12 text-[#F7A81B] mx-auto" />
                  <div className="font-serif text-xl font-bold text-[#F7A81B]">
                    MRCFI Building
                  </div>
                  <p className="text-xs font-sans opacity-85">
                    8001 Camia St., Guadalupe Viejo, Makati City
                  </p>
                  <div className="pt-2 border-t border-[#F7A81B]/30">
                    <span className="inline-block text-[11px] font-montserrat uppercase tracking-wider text-[#F7A81B] font-extrabold">
                      Permanent Financial Cornerstone
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. ROTARY NETWORK SECTION (MATCHED CLUBS SUMMARY)                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        className={`relative py-20 sm:py-24 transition-colors duration-300 border-b overflow-hidden ${
          isDark ? 'border-[#F7A81B]/20 text-[#F5F1E6]' : 'border-[#011E41]/20 text-[#F5F1E6]'
        }`}
      >
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/brotherhood_agreement.jpg"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://static.wixstatic.com/media/83b216_7a92dd9abba14620a42d323fe4cb88c6~mv2.jpg';
            }}
            alt="National & Global Rotary Alliances Signing"
            className="w-full h-full object-cover object-center filter brightness-90 transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#011E41]/90 via-[#011E41]/85 to-[#011E41]/95 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-white">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#F7A81B]/15 px-4 py-1.5 rounded-full border border-[#F7A81B]/40 backdrop-blur-md shadow-lg">
              <Globe className="w-4 h-4 text-[#F7A81B]" />
              <span>Rotary Network</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">
              National & Global Rotary Alliances
            </h2>

            <p className="text-base font-light text-slate-200 leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
              Our global and domestic network of matched clubs creates a wide bridge for joint grants, disaster relief, and cross-cultural fellowships.
            </p>
          </div>

          <div
            className={`rounded-3xl border shadow-2xl overflow-hidden max-w-5xl mx-auto backdrop-blur-md ${
              isDark
                ? 'bg-[#011E41]/85 border-[#F7A81B]/40'
                : 'bg-[#011E41]/80 border-[#F7A81B]/50'
            }`}
          >
            {/* Banner Photo Header */}
            <div className="relative aspect-[16/6] sm:aspect-[16/5] w-full overflow-hidden bg-black/40 border-b border-[#F7A81B]/20">
              <img
                src="/assets/images/brotherhood_agreement.jpg"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://static.wixstatic.com/media/941b16_fee94a5547814ae6b8ff9aa69c809b81~mv2.jpeg';
                }}
                alt="Rotary Club of Makati National and Global Alliances — Brother and Sister Clubs fellowship"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                <span className="text-xs font-montserrat font-extrabold uppercase tracking-widest bg-[#011E41]/90 border border-[#F7A81B]/60 text-[#F7A81B] px-3.5 py-1 rounded-full backdrop-blur-md shadow-md">
                  Rotary International Network
                </span>
              </div>
            </div>

            <div className="p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F7A81B]">
                  21 Brother Clubs across the Philippines <br className="hidden sm:inline" />
                  <span className="text-[#F5F1E6] dark:text-[#F5F1E6] font-normal text-xl sm:text-2xl">
                    & 10 Sister Clubs around the world
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-sans opacity-85 max-w-2xl leading-relaxed">
                  Maintained through periodic visits, joint global grant sponsorships, medical caravans, and youth exchanges.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('About Us');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 shrink-0 flex items-center space-x-2 cursor-pointer"
              >
                <span>See Full Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. CLOSING CTA                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F3] dark:bg-[#121212] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-[#F7A81B] text-[#011E41] p-8 sm:p-12 text-center space-y-6 shadow-2xl border-2 border-[#D98E0E]">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#011E41]">
              Interested in Partnering with RC Makati?
            </h2>
            <p className="font-sans text-base sm:text-lg max-w-2xl mx-auto font-medium text-[#011E41]/90">
              Collaborate with the Mother Club of Makati on sustainable community initiatives across our 7 Rotary focus areas.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('Contact Us');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#011E41] hover:bg-[#011E41]/90 text-[#F5F1E6] font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-xl inline-flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4 text-[#F7A81B]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
