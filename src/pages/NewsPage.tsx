/* Light Mode card redesign — replaced low-contrast badge/text colors with AA-verified tokens (gold-text on gold-tint, ink for titles, text-muted for dates, royal-blue/azure-text for CTAs). Applies to all card components sitewide. */

// News tab restructured into 4 categories matching rotaryclubmakati.org's own nav (Kaunlaran / News / RCM in the News / RC Makati Video-News). 'RCM in the News' is an honest placeholder — populate once press mentions are sourced.

import React, { useState, useEffect, useRef } from 'react';
import {
  Newspaper,
  Calendar,
  Sparkles,
  X,
  Play,
  ArrowRight,
  BookOpen,
  Feather,
  Facebook,
  Youtube,
  Globe,
  Tv,
  Info,
  Tag,
  Camera,
  Image as ImageIcon,
  ExternalLink,
  Search,
} from 'lucide-react';
import { TabType, ThemeType } from '../types';
import { REAL_RCM_PROJECTS } from '../data/projectsData';
import { RCM_INFO } from '../data/rcmData';
import { GALLERY_ITEMS, GalleryItem } from '../data/galleryData';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface NewsPageProps {
  setActiveTab: (tab: TabType) => void;
  theme: ThemeType;
}

export type NewsSubTab = 'kaunlaran' | 'news' | 'rcm-in-news' | 'video-news' | 'photo-gallery';

export interface NewsletterIssue {
  id: string;
  issueNo: string;
  issueNumberOnly: string;
  rotaryYear: string;
  date: string;
  publishDate: string;
  summary: string;
  postUrl: string;
  pdfUrl?: string;
  coverImage?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  type: 'photo' | 'video';
  imageUrl: string;
  videoUrl?: string;
  pillar?: string;
  excerpt: string;
  placeholderLabel?: string;
}

const KAUNLARAN_ISSUES: NewsletterIssue[] = [
  {
    id: 'k-27-3',
    issueNo: 'Kaunlaran No. 3 — RY 2026-27',
    issueNumberOnly: 'Kaunlaran No. 3',
    rotaryYear: 'RY 2026-27',
    date: '28 July 2026',
    publishDate: '2026-07-28',
    summary: 'RY 2026-27 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-3-28-july-2026',
    pdfUrl: 'https://drive.google.com/file/d/19IGGBKiUQlQDGp3wUHFJgkLypfaw4iYW/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_63a27be0b0bd421792a55aee2c3bfa27~mv2.jpg',
  },
  {
    id: 'k-27-2',
    issueNo: 'Kaunlaran No. 2 — RY 2026-27',
    issueNumberOnly: 'Kaunlaran No. 2',
    rotaryYear: 'RY 2026-27',
    date: '17 July 2026',
    publishDate: '2026-07-17',
    summary: 'RY 2026-27 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-2-17-july-2026',
    pdfUrl: 'https://drive.google.com/file/d/1dnlg27c8gnmq2bodRuSQldvKHoSGbwMM/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_7ca38a479ed449758737d0823a6365fa~mv2.jpg',
  },
  {
    id: 'k-27-1',
    issueNo: 'Kaunlaran No. 1 — RY 2026-27',
    issueNumberOnly: 'Kaunlaran No. 1',
    rotaryYear: 'RY 2026-27',
    date: '7 July 2026',
    publishDate: '2026-07-07',
    summary: 'RY 2026-27 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-1-7-july-2026',
    pdfUrl: 'https://drive.google.com/file/d/1QjweP1DcW32Dd2xaVX1CxRyF69yCFlAg/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_28990254c3d64de6bb88d5c1f380bddc~mv2.jpg',
  },
  {
    id: 'k-35',
    issueNo: 'Kaunlaran No. 35 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 35',
    rotaryYear: 'RY 2025-26',
    date: '23 June 2026',
    publishDate: '2026-06-23',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-35-23-june-2026',
    pdfUrl: 'https://drive.google.com/file/d/10TeUwVuqhAqSJHEiBIPMBQwM3O0osybT/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_3d452d9d767a495eb5c9c286590ea5b7~mv2.jpg',
  },
  {
    id: 'k-34',
    issueNo: 'Kaunlaran No. 34 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 34',
    rotaryYear: 'RY 2025-26',
    date: '9 June 2026',
    publishDate: '2026-06-09',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-34-9-june-2026',
    pdfUrl: 'https://drive.google.com/file/d/1WfLiXSe_6vq4KjtA6T-IltoTV1A24O59/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_d1d314c6c7b745669acbca0dc8c23ce0~mv2.jpg',
  },
  {
    id: 'k-33',
    issueNo: 'Kaunlaran No. 33 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 33',
    rotaryYear: 'RY 2025-26',
    date: '2 June 2026',
    publishDate: '2026-06-02',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-33-2-june-2026',
    pdfUrl: 'https://drive.google.com/file/d/1iybu6zE4OBsRYHpZU9dj-yjsdVtxW-_6/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_e0bc31a88d8c4230b4216151e0f631f6~mv2.jpg',
  },
  {
    id: 'k-32',
    issueNo: 'Kaunlaran No. 32 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 32',
    rotaryYear: 'RY 2025-26',
    date: '26 May 2026',
    publishDate: '2026-05-26',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-32-26-may-2026',
    pdfUrl: 'https://drive.google.com/file/d/1KxSYY-T9aXmrWBsfFeNu7Y7FhkHuNH2Q/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_b14bdc343c1246198ffc6f6ecc3bb081~mv2.jpg',
  },
  {
    id: 'k-31',
    issueNo: 'Kaunlaran No. 31 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 31',
    rotaryYear: 'RY 2025-26',
    date: '19 May 2026',
    publishDate: '2026-05-19',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-31-19-may-2026',
    pdfUrl: 'https://drive.google.com/file/d/19nXCmsePx1yQoDmKe5eJ7cB6HSSJtU4E/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_eacc53dad42f4efe864922fb3c0febcd~mv2.jpg',
  },
  {
    id: 'k-30',
    issueNo: 'Kaunlaran No. 30 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 30',
    rotaryYear: 'RY 2025-26',
    date: '5 May 2026',
    publishDate: '2026-05-05',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-30-5-may-2026',
    pdfUrl: 'https://drive.google.com/file/d/1HLhKybLMx4UILIbLec9ghYQH-drDsIkJ/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_1160dcfd658b4374a5642958b79ca54d~mv2.jpg',
  },
  {
    id: 'k-29',
    issueNo: 'Kaunlaran No. 29 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 29',
    rotaryYear: 'RY 2025-26',
    date: '28 April 2026',
    publishDate: '2026-04-28',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-29-28-april-2026',
    pdfUrl: 'https://drive.google.com/file/d/18nk6CuOxg1-Y337LqhQS05wcyUbIxIDJ/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_2f2d4882fc85473d95965ce019acf983~mv2.jpg',
  },
  {
    id: 'k-28',
    issueNo: 'Kaunlaran No. 28 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 28',
    rotaryYear: 'RY 2025-26',
    date: '21 April 2026',
    publishDate: '2026-04-21',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-28-21-april-2026',
    pdfUrl: 'https://drive.google.com/file/d/1mN-UxlMjRTSvqLvM5oXQ8jIdcKjLRKnu/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_895dec458d214385b8fc7ee4411e473c~mv2.jpg',
  },
  {
    id: 'k-27',
    issueNo: 'Kaunlaran No. 27 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 27',
    rotaryYear: 'RY 2025-26',
    date: '7 April 2026',
    publishDate: '2026-04-07',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-27-7-april-2026',
    pdfUrl: 'https://drive.google.com/file/d/1Bg10Cm_XDWoyp8yCFW3g6ZhQI2hLUARb/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_d1da9b3d3a89480e9bd306cd168159b9~mv2.jpg',
  },
  {
    id: 'k-26',
    issueNo: 'Kaunlaran No. 26 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 26',
    rotaryYear: 'RY 2025-26',
    date: '24 March 2026',
    publishDate: '2026-03-24',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-26-24-march-2026',
    pdfUrl: 'https://drive.google.com/file/d/1YAqNzxTNW01Gb8nwkbRkOqDts_mLwU7L/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_0e86b550ae124a7a8a0d4598e1d50b55~mv2.jpg',
  },
  {
    id: 'k-25',
    issueNo: 'Kaunlaran No. 25 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 25',
    rotaryYear: 'RY 2025-26',
    date: '3 March 2026',
    publishDate: '2026-03-03',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-25-3-march-2026',
    pdfUrl: 'https://drive.google.com/file/d/1_FyefV8IlkbR1GxvE3ddPwbyqfIZdd7Y/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_768c39a9c55c4b9b9cd29ab302513a42~mv2.jpg',
  },
  {
    id: 'k-24',
    issueNo: 'Kaunlaran No. 24 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 24',
    rotaryYear: 'RY 2025-26',
    date: '24 February 2026',
    publishDate: '2026-02-24',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-24-24-february-2026',
    pdfUrl: 'https://drive.google.com/file/d/1Eq-vM07sdcvrw7Lrun9I1yOjxgUIlRG-/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_9dbf4490cc0c461d8f130f7d3af94f87~mv2.jpg',
  },
  {
    id: 'k-23',
    issueNo: 'Kaunlaran No. 23 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 23',
    rotaryYear: 'RY 2025-26',
    date: '17 February 2026',
    publishDate: '2026-02-17',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-23-17-february-2026',
    pdfUrl: 'https://drive.google.com/file/d/1mTnQ5h8TlJWOvLIZv8sIx6KppaOrYW4N/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_ddb23609df054116a5246691f156ea42~mv2.jpg',
  },
  {
    id: 'k-22',
    issueNo: 'Kaunlaran No. 22 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 22',
    rotaryYear: 'RY 2025-26',
    date: '10 February 2026',
    publishDate: '2026-02-10',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-22-10-february-2026',
    pdfUrl: 'https://drive.google.com/file/d/1W9aH9tkAAh5BmaHOuk0wRXSkjK_6Clva/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_d9aab486ba2747cfa08af42d8cca54de~mv2.jpg',
  },
  {
    id: 'k-21',
    issueNo: 'Kaunlaran No. 21 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 21',
    rotaryYear: 'RY 2025-26',
    date: '27 January 2026',
    publishDate: '2026-01-27',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-21-27-january-2026',
    pdfUrl: 'https://drive.google.com/file/d/1dYQJNzHfqu6ar4XD8242Bu1sJXEJid8d/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_bc9812e9af5f4932ad1819904ec01ab5~mv2.jpg',
  },
  {
    id: 'k-20',
    issueNo: 'Kaunlaran No. 20 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 20',
    rotaryYear: 'RY 2025-26',
    date: '20 January 2026',
    publishDate: '2026-01-20',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-20-20-january-2026',
    pdfUrl: 'https://drive.google.com/file/d/1WrF4Ix0J1V5ZCFybiTSdx7-jSMZMqOe1/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_d1c1f56671ea4103a23a76aa66c09842~mv2.jpg',
  },
  {
    id: 'k-19',
    issueNo: 'Kaunlaran No. 19 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 19',
    rotaryYear: 'RY 2025-26',
    date: '13 January 2026',
    publishDate: '2026-01-13',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-19-13-january-2026',
    pdfUrl: 'https://drive.google.com/file/d/1DNVbaU2sprqhku4c3eNEBqXDyZVnnG8S/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_c27be535efd74ff79be673b2a12015a5~mv2.jpg',
  },
  {
    id: 'k-18',
    issueNo: 'Kaunlaran No. 18 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 18',
    rotaryYear: 'RY 2025-26',
    date: '9 December 2025',
    publishDate: '2025-12-09',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-18-9-december-2025',
    pdfUrl: 'https://drive.google.com/file/d/11PqIEY_Au3SBXmfdRQRsNSGVQCzfGzFm/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_a46d4f88c8be4901b2d78b087597f372~mv2.jpg',
  },
  {
    id: 'k-17',
    issueNo: 'Kaunlaran No. 17 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 17',
    rotaryYear: 'RY 2025-26',
    date: '2 December 2025',
    publishDate: '2025-12-02',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-17-2-december-2025',
    pdfUrl: 'https://drive.google.com/file/d/1O5sI3b4GObxLezejMaxAMTXCMVEmf4u8/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_b2987d23877f4549aeee6aaf1842c786~mv2.jpg',
  },
  {
    id: 'k-16',
    issueNo: 'Kaunlaran No. 16 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 16',
    rotaryYear: 'RY 2025-26',
    date: '18 November 2025',
    publishDate: '2025-11-18',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-16-18-november-2025',
    pdfUrl: 'https://drive.google.com/file/d/1TWQQTXw9joseG2PblMcFBpOa9unFLye7/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_9d79a233f48b4b70854ebd4fec455d80~mv2.jpg',
  },
  {
    id: 'k-15',
    issueNo: 'Kaunlaran No. 15 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 15',
    rotaryYear: 'RY 2025-26',
    date: '13 November 2025',
    publishDate: '2025-11-13',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-15-13-november-2025',
    pdfUrl: 'https://drive.google.com/file/d/1ztubjovzPxLIjK7a0Qas2OLcWC6-QQh6/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_949fedada17845a1a778840363132b63~mv2.jpg',
  },
  {
    id: 'k-14',
    issueNo: 'Kaunlaran No. 14 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 14',
    rotaryYear: 'RY 2025-26',
    date: '4 November 2025',
    publishDate: '2025-11-04',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-14-4-november-2025',
    pdfUrl: 'https://drive.google.com/file/d/1h5bRcYv0Y6YHqosxQKEoH0AIMTjQ3gvI/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_a466dece6b0541fc8a4b1ea6c924d907~mv2.jpg',
  },
  {
    id: 'k-13',
    issueNo: 'Kaunlaran No. 13 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 13',
    rotaryYear: 'RY 2025-26',
    date: '28 October 2025',
    publishDate: '2025-10-28',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-13-28-october-2025',
    pdfUrl: 'https://drive.google.com/file/d/15GNEVl94MEhKx9RtDpCSQfJKutYEq1P8/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_ed1b47b6fd134bc0905c3cc0edf0a5b2~mv2.jpg',
  },
  {
    id: 'k-12',
    issueNo: 'Kaunlaran No. 12 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 12',
    rotaryYear: 'RY 2025-26',
    date: '14 October 2025',
    publishDate: '2025-10-14',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-12-14-october-2025',
    pdfUrl: 'https://drive.google.com/file/d/1NZdAqUzn1pDlH_GsHTEpCXw6Rdk6c5-v/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_4a54548ca28b4edfa8235c40ece30d4e~mv2.jpg',
  },
  {
    id: 'k-11',
    issueNo: 'Kaunlaran No. 11 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 11',
    rotaryYear: 'RY 2025-26',
    date: '7 October 2025',
    publishDate: '2025-10-07',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-11-7-october-2025',
    pdfUrl: 'https://drive.google.com/file/d/1Macl0kCjJ_5qGDtH04GaDy56RcuiF7fw/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_4dc930dddd2a4a73b707b75aaea2d333~mv2.jpg',
  },
  {
    id: 'k-10',
    issueNo: 'Kaunlaran No. 10 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 10',
    rotaryYear: 'RY 2025-26',
    date: '23 September 2025',
    publishDate: '2025-09-23',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-10-23-september-2025',
    pdfUrl: 'https://drive.google.com/file/d/14WKhtajtLBzbd5zHWlrDVaHf2orDCKjT/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_625907f5eae2409ab139a8d939b6b819~mv2.jpg',
  },
  {
    id: 'k-9',
    issueNo: 'Kaunlaran No. 9 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 9',
    rotaryYear: 'RY 2025-26',
    date: '9 September 2025',
    publishDate: '2025-09-09',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-9-9-september-2025',
    pdfUrl: 'https://drive.google.com/file/d/1u3j5NMQ25XQUq0WHRKqeUFHIzOc8XUkU/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_f0fa3a204a944c39be6ad4179dc84fa5~mv2.jpg',
  },
  {
    id: 'k-8',
    issueNo: 'Kaunlaran No. 8 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 8',
    rotaryYear: 'RY 2025-26',
    date: '4 September 2025',
    publishDate: '2025-09-04',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-8-4-september-2025',
    pdfUrl: 'https://drive.google.com/file/d/1I5QA3UeFreDY6ve_0q01mqyzS2MDBqvN/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_a5b951ded40145e5a893f299ba7bd417~mv2.jpg',
  },
  {
    id: 'k-7',
    issueNo: 'Kaunlaran No. 7 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 7',
    rotaryYear: 'RY 2025-26',
    date: '26 August 2025',
    publishDate: '2025-08-26',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-7-26-august-2025',
    pdfUrl: 'https://drive.google.com/file/d/1wVbRFnGYCpoEQsEMzFzPJySznLzu2CfL/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_5dfbe7cbf9504b588fb0793b0f4ff19f~mv2.jpg',
  },
  {
    id: 'k-6',
    issueNo: 'Kaunlaran No. 6 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 6',
    rotaryYear: 'RY 2025-26',
    date: '12 August 2025',
    publishDate: '2025-08-12',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-6-12-august-2025',
    pdfUrl: 'https://drive.google.com/file/d/1lCY87gKFM0E-trXJcbWE3cgFscCQ5JUz/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_e3b764a9a62549c3bb7b7bc27108fb96~mv2.jpg',
  },
  {
    id: 'k-5',
    issueNo: 'Kaunlaran No. 5 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 5',
    rotaryYear: 'RY 2025-26',
    date: '5 August 2025',
    publishDate: '2025-08-05',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-5-5-august-2025',
    pdfUrl: 'https://drive.google.com/file/d/1lkoceCExiSkHz0U-PSZFDTzfLb4bHRps/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_cb282bd37654455b89dce271f1380d21~mv2.jpg',
  },
  {
    id: 'k-4',
    issueNo: 'Kaunlaran No. 4 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 4',
    rotaryYear: 'RY 2025-26',
    date: '29 July 2025',
    publishDate: '2025-07-29',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-4',
    pdfUrl: 'https://drive.google.com/file/d/1YS73GTpga1dGWJqescFPPfSKNxROVEAN/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_19a701c51e1b4072be1e67720cd0f79c~mv2.jpg',
  },
  {
    id: 'k-3',
    issueNo: 'Kaunlaran No. 3 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 3',
    rotaryYear: 'RY 2025-26',
    date: '15 July 2025',
    publishDate: '2025-07-15',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-3-15-july-2025',
    pdfUrl: 'https://drive.google.com/file/d/16Op-N1SuRKCcDpeipSyih1wd-oHBXMht/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_bb002838a34647e39394a947c00f33c7~mv2.jpg',
  },
  {
    id: 'k-2',
    issueNo: 'Kaunlaran No. 2 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 2',
    rotaryYear: 'RY 2025-26',
    date: '11 July 2025',
    publishDate: '2025-07-11',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-2-11-july-2025',
    pdfUrl: 'https://drive.google.com/file/d/1rkKQpjFVbDejcpWVn3gnFA6l61T4Quyh/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_3300826e4bfb42dfbb6c69725dffa481~mv2.jpg',
  },
  {
    id: 'k-1',
    issueNo: 'Kaunlaran No. 1 — RY 2025-26',
    issueNumberOnly: 'Kaunlaran No. 1',
    rotaryYear: 'RY 2025-26',
    date: '9 July 2025',
    publishDate: '2025-07-09',
    summary: 'RY 2025-26 Weekly Bulletin — Rotary Club of Makati',
    postUrl: 'https://www.rotaryclubmakati.org/post/kaunlaran-no-1-9-july-2025',
    pdfUrl: 'https://drive.google.com/file/d/1uqyc25dRxZw8734nSCy4sxbkKXBZt1Op/view?usp=sharing',
    coverImage: 'https://static.wixstatic.com/media/b2fb7d_d3e2af6149474ca7b068be5ca74c1eb6~mv2.jpg',
  },
];

// Newly sourced real news posts + general club posts
const GENERAL_NEWS_POSTS: NewsItem[] = [
  {
    id: 'news-batangas',
    title: 'RCM News: Food Share Program in Padre Garcia, Batangas',
    date: 'January 2026 (Date to be confirmed)',
    type: 'video',
    pillar: 'Maternal & Child Health / Nutrition',
    imageUrl: 'https://i.ytimg.com/vi/srgJEuo6nE0/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=srgJEuo6nE0',
    excerpt:
      'In partnership with Kabisig ng Kalahi, RC Makati launched the Food Share Program in Padre Garcia, Batangas, benefiting sixty families from Barangays Tamak and San Miguel with rice distributed in three tranches, alongside community gardening support — part of RC Makati\'s broader Nutrition Program.',
  },
  {
    id: 'news-manila-two-in-one',
    title: 'Two-in-One Project in Manila',
    date: 'December 10, 2025',
    type: 'photo',
    pillar: 'Maternal & Child Health',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_18c2b22ec6ac417db7c39790b1a8d22e~mv2.jpg',
    excerpt:
      'In partnership with Caritas Manila, RC Makati launched the Damayan Supplementary Nutrition Program for 100 malnourished children in Intramuros, alongside the annual Last Angel Christmas gift-giving that brought toys to 120 children.',
  },
  {
    id: 'news-ai-workshop',
    title: 'RCM AI Empowerment Workshop: Equipping Rotarians for the Digital Future',
    date: 'February 25, 2026',
    type: 'photo',
    pillar: 'Basic Education & Literacy',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_9ca5c0980d0144b9953d0bc513ff1e4b~mv2.jpg',
    excerpt:
      'A club workshop on responsible AI use for members, emphasizing that AI is a support tool, not a substitute for human discernment — with Rotary\'s Four-Way Test applied to any AI-generated content.',
  },
  {
    id: 'news-hatch-innovate',
    title: 'Empowering Entrepreneurs to Innovate, Sustain and Succeed',
    date: 'March 22, 2025',
    type: 'photo',
    pillar: 'Economic & Community Development',
    imageUrl: 'https://static.wixstatic.com/media/b2fb7d_61af72bf16df4676861410e08c31a646~mv2.jpg',
    excerpt:
      'The Hatch+ Program reached its final pitching event at the Paing Hechanova Creativity Center, RC Makati Clubhouse — five startups emerged from an initial cohort of ten teams, in partnership with StartUp Village.',
  },
  ...REAL_RCM_PROJECTS.map((proj) => ({
    id: proj.id,
    title: proj.title,
    date: proj.date,
    type: proj.type,
    imageUrl: proj.imageUrl,
    videoUrl: proj.videoUrl,
    pillar: proj.pillar,
    excerpt: proj.excerpt,
  })),
];

// Real video news posts confirmed from rotaryclubmakati.org (8 total real video news items)
const VIDEO_NEWS_POSTS: NewsItem[] = [
  {
    id: 'vid-habagat-relief',
    title: 'RC Makati Video News: Hope Mission for Habagat Victims | A 6-Day Rapid Relief Effort',
    date: 'April 6, 2026',
    type: 'video',
    pillar: 'Disaster Response & Relief',
    imageUrl: 'https://i.ytimg.com/vi/E_o7GpO103U/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=E_o7GpO103U',
    excerpt:
      'A 6-day rapid relief operation across Luzon — from Tondo to Baseco, Laguna to Navotas, and Ilocos Sur — delivering 1,020 food packs, 695 sets of mats and blankets, and 200 slippers, valued at ₱544,700 and reaching 1,795 families.',
  },
  {
    id: 'vid-catanduanes-relief',
    title: 'RC Makati Video-News: Hope Mission in Catanduanes',
    date: 'April 6, 2026',
    type: 'video',
    pillar: 'Disaster Response & Relief',
    imageUrl: 'https://i.ytimg.com/vi/LSg0wZM5-cY/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=LSg0wZM5-cY',
    excerpt:
      "After Super Typhoon Uwan struck Catanduanes, RC Makati's Hope Mission delivered relief across Virac, Gigmoto, Baras, and San Miguel — reaching over 2,100 families in partnership with RC Virac and District 3820.",
  },
  {
    id: 'vid-ugnay-art',
    title: 'RC Makati Video News: UGNAY Art Exhibit 2025',
    date: 'April 6, 2026',
    type: 'video',
    pillar: 'Community Development & Arts',
    imageUrl: 'https://i.ytimg.com/vi/1FHWCoYLnpg/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=1FHWCoYLnpg',
    excerpt:
      'RC Makati opened the Rotary Year with UGNAY, an art exhibit showcasing works by Dominic Rubio and member artists — raising nearly ₱2 million in one week, with ₱500,000 supporting community service projects.',
  },
  {
    id: 'vid-ilocos-medical',
    title: 'RC Makati Video News: Medical Mission in Ilocos Sur',
    date: 'April 6, 2026',
    type: 'video',
    pillar: 'Disease Prevention & Treatment',
    imageUrl: 'https://i.ytimg.com/vi/ppEJMlRdTHE/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=ppEJMlRdTHE',
    excerpt:
      'A race against a looming typhoon — the RC Makati team flew to Laoag and traveled to Vigan to deliver a medical mission to families in Ilocos Sur.',
  },
  {
    id: 'vid-pateros-feeding',
    title: 'RCM Video News: Feeding Program in Pateros',
    date: 'April 6, 2026',
    type: 'video',
    pillar: 'Maternal & Child Health',
    imageUrl: 'https://i.ytimg.com/vi/bVsjYraQ5Vw/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=bVsjYraQ5Vw',
    excerpt:
      'RC Makati launched a Feeding Program at Capt. H. Francisco Elementary School in Pateros, in partnership with Kabisig ng Kalahi and RC Metropolitan Pateros, serving 70 malnourished children ages five to nine with a daily glass of milk for 120 days, alongside book donations from the Books Across the Seas program.',
  },
  {
    id: 'vid-ai-grad',
    title: 'Rotary Club of Makati AI Academy Celebrates First Graduation',
    date: 'February 28, 2026',
    type: 'video',
    pillar: 'Basic Education & Literacy',
    imageUrl: 'https://i.ytimg.com/vi/VXwVbzl7doU/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=VXwVbzl7doU',
    excerpt:
      "A historic milestone: the first graduation of the RC Makati AI Academy, honoring 70 scholars as Certified AI Practitioners on February 28, 2026 — ethical builders of the nation's digital future.",
  },
  {
    id: 'vid-pasig-feeding',
    title: 'RC Makati Video News: Feeding Program Culmination in Pasig',
    date: 'April 24, 2025',
    type: 'video',
    pillar: 'Maternal & Child Health',
    imageUrl: 'https://i.ytimg.com/vi/n46e_H8vzKc/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=n46e_H8vzKc',
    excerpt:
      "Six months, 120 school days — that's how long RC Makati nourished 30 children in Bagong Ilog, Pasig, helping them fight malnutrition. Since its start in 2004, this feeding initiative has helped over 6,000 children escape malnutrition; this Rotary year, 350 more children have already been enrolled.",
  },
  {
    id: 'vid-bgc-greenway-tour',
    title: 'RC Makati Video-News: BGC Greenway Project',
    date: 'February 13, 2024',
    type: 'video',
    pillar: 'Environment',
    imageUrl: 'https://i.ytimg.com/vi/h4yeSVsdwVI/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=h4yeSVsdwVI',
    excerpt:
      "A walking tour of the 1.5-km BGC Greenway Park — the longest greenway in Metro Manila, initiated by RC Makati in 2019 and funded with over ₱28M raised by the club — followed by a certificate-of-appreciation ceremony for the project's partners and sponsors.",
  },
];

// Photo Gallery Collection for RC Makati Activities & Milestones
const PHOTO_GALLERY_POSTS: NewsItem[] = [
  {
    id: 'photo-ugnay-2025',
    title: 'UGNAY Art Exhibit 2025 Gallery',
    date: 'July 15, 2025',
    type: 'photo',
    pillar: 'Community Development & Arts',
    imageUrl: 'https://i.ytimg.com/vi/1FHWCoYLnpg/maxresdefault.jpg',
    excerpt:
      'Exquisite artworks by Dominic Rubio and RC Makati member artists on display during the UGNAY Art Exhibit. Over ₱2M raised for community development initiatives.',
  },
  {
    id: 'photo-bgc-greenway',
    title: 'BGC Greenway Park Walkthrough Photo Gallery',
    date: 'February 13, 2024',
    type: 'photo',
    pillar: 'Environment',
    imageUrl: 'https://i.ytimg.com/vi/h4yeSVsdwVI/maxresdefault.jpg',
    excerpt:
      'Photo documentation of the 1.5-kilometer linear park in Bonifacio Global City built and maintained in partnership with the local government and private sponsors.',
  },
  {
    id: 'photo-pasig-feeding',
    title: '120-Day Malnutrition Feeding Program Gallery',
    date: 'April 24, 2025',
    type: 'photo',
    pillar: 'Maternal & Child Health',
    imageUrl: 'https://i.ytimg.com/vi/n46e_H8vzKc/maxresdefault.jpg',
    excerpt:
      'Heartwarming moments of children receiving daily hot meals and milk in Pasig and Pateros under RC Makati\'s long-running child nutrition campaign.',
  },
  {
    id: 'photo-habagat-relief',
    title: 'Typhoon Relief & Hope Mission Photo Log',
    date: 'April 6, 2026',
    type: 'photo',
    pillar: 'Disaster Response & Relief',
    imageUrl: 'https://i.ytimg.com/vi/E_o7GpO103U/maxresdefault.jpg',
    excerpt:
      'On the ground with RC Makati Rotarians distributing 1,020 food packs, sleeping mats, and footwear to typhoon-affected families across Luzon.',
  },
  {
    id: 'photo-ai-academy',
    title: 'RC Makati AI Academy Graduation Highlights',
    date: 'February 28, 2026',
    type: 'photo',
    pillar: 'Basic Education & Tech',
    imageUrl: 'https://i.ytimg.com/vi/VXwVbzl7doU/maxresdefault.jpg',
    excerpt:
      '70 scholars celebrating their milestone as the first graduating class of Certified AI Practitioners trained under RC Makati\'s digital empowerment program.',
  },
  {
    id: 'photo-ilocos-medical',
    title: 'Ilocos Sur Medical Mission Photo Report',
    date: 'April 6, 2026',
    type: 'photo',
    pillar: 'Disease Prevention & Health',
    imageUrl: 'https://i.ytimg.com/vi/ppEJMlRdTHE/maxresdefault.jpg',
    excerpt:
      'Medical team and Rotarians conducting free consultations, health screenings, and prescription distributions in Laoag and Vigan.',
  },
  {
    id: 'photo-60th-charter',
    title: '60th Diamond Jubilee Gala Photo Album',
    date: 'March 13, 2026',
    type: 'photo',
    pillar: 'Club Milestone',
    imageUrl: 'https://i.ytimg.com/vi/XNs3LUd2KOc/maxresdefault.jpg',
    excerpt:
      'Memorable photos from the 60th Charter Anniversary celebration honoring six decades of community service and leadership at the Marriott Grand Ballroom.',
  },
  {
    id: 'photo-guadalupe-center',
    title: 'Rotary Center Makati Community Hub Gallery',
    date: 'January 15, 2026',
    type: 'photo',
    pillar: 'Youth & Livelihood',
    imageUrl: 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
    excerpt:
      'Inside the Rotary Center Makati featuring the youth computer learning lab, community meeting spaces, and vocational training sessions.',
  },
];

export interface ExternalNewsItem {
  id: string;
  categoryTag: string;
  headline: string;
  date: string;
  videoUrl?: string;
  imageUrl?: string;
  placeholderLabel?: string;
  excerpt: string;
  readMoreUrl: string;
}

// Real sourced stories for RCM in the News
const RCM_IN_THE_NEWS_POSTS: ExternalNewsItem[] = [
  {
    id: 'rcm-news-ilocos-mission',
    categoryTag: 'RC Makati Video-News',
    headline: 'Service Projects in Ilocos Sur',
    date: 'May 14, 2025',
    videoUrl: 'https://www.youtube.com/watch?v=0byyauhxjZg',
    excerpt:
      'President Keith Harrison led RC Makati\'s delegation back to Ilocos Sur for its now-annual service mission — blessing 46 new reef buds in Narvacan (bringing the four-year total to 385), turning over a ₱300,000 donation to RC Vigan\'s eye-care project for schoolchildren, and closing out a $97,500 Global Grant water project in Nagbettedan that brought clean water access to roughly 2,300 households.',
    readMoreUrl: 'https://www.rotaryclubmakati.org/post/rc-makati-video-news-service-projects-in-ilocos-sur',
  },
  {
    id: 'rcm-news-kalibo-brotherhood',
    categoryTag: 'RCM in the News',
    headline: 'RC Makati Signs a Brotherhood Agreement with RC Metro Kalibo',
    date: 'July 2024',
    imageUrl: '/assets/images/brotherhood_agreement.jpg',
    excerpt:
      'President Keith Harrison formalized a Brotherhood Agreement with RC Metro Kalibo, building on five years of joint projects between the two clubs — from disaster response to education support. The signing took place during RC Makati\'s 59th Induction, drawing member clubs from across the Philippines as well as Singapore and Malaysia.',
    readMoreUrl: 'https://www.philippinerotarymagazine.com/post/rc-makati-signs-a-brotherhood-agreemeent-with-rc-metro-kalibo',
  },
  {
    id: 'rcm-news-ai-academy-launch',
    categoryTag: 'RC Makati Video-News',
    headline: 'RC Makati Launches AI Academy',
    date: 'September 3, 2025',
    placeholderLabel: 'Photo: AI Academy Launch Ceremony',
    videoUrl: 'https://www.facebook.com/share/v/19GzzcGuHK/',
    excerpt:
      'On August 30, 2025, RC Makati officially launched its AI Academy at the Club\'s Guadalupe Viejo clubhouse — a flagship initiative giving underprivileged senior high students and out-of-school youth free training in AI and data science. Conceived by Dir. Roger Collantes, the program rests on three pillars: Education, Empowerment, and Employment. President Eddie Galvez and District Governor Reggie Nolido both spoke at the launch, with Nolido pledging to promote the model across the district\'s 121 clubs.',
    readMoreUrl: 'https://www.rotaryclubmakati.org/post/rc-makati-launches-ai-academy',
  },
  {
    id: 'rcm-news-ai-academy-graduation',
    categoryTag: 'RC Makati Video-News',
    headline: 'RC Makati AI Academy Celebrates First Graduation',
    date: 'March 23, 2026',
    videoUrl: 'https://www.youtube.com/watch?v=VXwVbzl7doU',
    excerpt:
      'RC Makati marked its AI Academy\'s first graduation, honoring 70 scholars from BoysTown and GirlsTown as Certified AI Practitioners. Ahead of graduation, the scholars presented AI-powered solutions to real business challenges at a Pitch Day Showcase judged by RCM members. President Eddie Galvez congratulated the graduates as pioneers ready to lead in a technology-driven world.',
    readMoreUrl: 'https://www.rotaryclubmakati.org/post/rotary-club-of-makati-ai-academy-celebrates-first-graduation',
  },
];

function getYouTubeEmbedUrl(url?: string): string {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('v=')) {
    videoId = url.split('v=')[1]?.split('&')[0] || '';
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
}

// Auto-sliding carousel background slides for Newsroom section (19 downloaded local images)
const NEWSROOM_BANNER_SLIDES = [
  '/newsroom-banner/1.jpg',
  '/newsroom-banner/2.jpg',
  '/newsroom-banner/3.jpg',
  '/newsroom-banner/4.jpg',
  '/newsroom-banner/5.jpg',
  '/newsroom-banner/6.jpg',
  '/newsroom-banner/7.jpg',
  '/newsroom-banner/8.jpg',
  '/newsroom-banner/9.jpg',
  '/newsroom-banner/10.jpg',
  '/newsroom-banner/11.jpg',
  '/newsroom-banner/12.jpg',
  '/newsroom-banner/13.jpg',
  '/newsroom-banner/14.jpg',
  '/newsroom-banner/15.jpg',
  '/newsroom-banner/16.jpg',
  '/newsroom-banner/17.jpg',
  '/newsroom-banner/18.jpg',
  '/newsroom-banner/19.jpg',
];

export const NewsPage: React.FC<NewsPageProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const [activeSubTab, setActiveSubTab] = useState<NewsSubTab>('kaunlaran');
  const [selectedRotaryYear, setSelectedRotaryYear] = useState<'all' | 'RY 2026-27' | 'RY 2025-26'>('all');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<NewsletterIssue | null>(null);
  const [isQuillOpen, setIsQuillOpen] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState<'all' | 'projects' | 'recent_events' | 'heritage' | 'videos'>('all');
  const [gallerySearch, setGallerySearch] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-play timer for background slide carousel (advances every 3000ms)
  useEffect(() => {
    if (NEWSROOM_BANNER_SLIDES.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => {
        const nextIdx = (prevIndex + 1) % NEWSROOM_BANNER_SLIDES.length;
        console.log(`[NEWSROOM CAROUSEL] Slide index: ${nextIdx} -> ${NEWSROOM_BANNER_SLIDES[nextIdx]}`);
        return nextIdx;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlideIndex = (currentSlideIndex + 1) % NEWSROOM_BANNER_SLIDES.length;

  const filteredSortedKaunlaranIssues = React.useMemo(() => {
    return KAUNLARAN_ISSUES
      .filter((issue) => selectedRotaryYear === 'all' || issue.rotaryYear === selectedRotaryYear)
      .slice()
      .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  }, [selectedRotaryYear]);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const headerVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = headerVideoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {
        // Silently catch browser autoplay policy restrictions
      });
    }
  }, []);

  useEffect(() => {
    if (selectedNews || selectedIssue || isQuillOpen) {
      closeButtonRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedNews(null);
          setSelectedIssue(null);
          setIsQuillOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedNews, selectedIssue, isQuillOpen]);

  const SUB_TABS: { id: NewsSubTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'kaunlaran', label: 'Kaunlaran', icon: BookOpen },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'rcm-in-news', label: 'RCM in the News', icon: Globe },
    { id: 'video-news', label: 'RC Makati Videos', icon: Tv },
    { id: 'photo-gallery', label: 'Photo Gallery', icon: Camera },
  ];

  return (
    <div className="animate-fadeIn min-h-screen pb-16 space-y-12">
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO HEADER WITH AUTO-SLIDING BACKGROUND IMAGE CAROUSEL       */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative w-full overflow-hidden py-16 sm:py-24 text-center bg-[#0A193C] border-b border-[#F7A81B]/30 shadow-lg">
        {/* Hidden Preloader for Next Slide */}
        <link rel="preload" as="image" href={NEWSROOM_BANNER_SLIDES[nextSlideIndex]} />

        {/* Layer 0: Full-Bleed Auto-Rotating Background Slider (z-0) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
          className="overflow-hidden pointer-events-none select-none"
        >
          {NEWSROOM_BANNER_SLIDES.map((slideSrc, idx) => {
            const isActive = idx === currentSlideIndex;

            return (
              <div
                key={slideSrc + idx}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1.08)' : 'scale(1.0)',
                  transition: 'opacity 1000ms ease-in-out, transform 3000ms ease-linear',
                  willChange: 'opacity, transform',
                }}
              >
                <img
                  src={slideSrc}
                  alt=""
                  aria-hidden="true"
                  referrerPolicy="no-referrer"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    filter: 'brightness(0.95) contrast(1.15) saturate(1.15)',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Layer 1: Dark Navy Gradient Overlay for Readability (z-1) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            background: 'linear-gradient(180deg, rgba(10, 25, 60, 0.65) 0%, rgba(10, 25, 60, 0.80) 100%)',
          }}
          className="pointer-events-none"
        />

        {/* Layer 10: Foreground Content (z-10) */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#0A193C]/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#F7A81B]/40 shadow-sm">
            <Newspaper className="w-4 h-4 text-[#F7A81B]" />
            <span>Official RCM Newsroom</span>
          </div>

          <h1
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FFFFFF]"
            style={{ textShadow: '0 2px 12px rgba(0, 0, 0, 0.85), 0 1px 4px rgba(0, 0, 0, 0.9)' }}
          >
            Club News & Publications
          </h1>

          <p
            className="text-base sm:text-lg font-sans max-w-2xl mx-auto leading-relaxed text-[#E8EDF2]"
            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.85), 0 1px 3px rgba(0, 0, 0, 0.9)' }}
          >
            Kaunlaran weekly bulletin, activity updates, media features, and video coverage straight from RC Makati.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* PAGE BODY CONTAINER (MAX-W-7XL)                                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 2. SUB-TAB BAR (MATCHING OFFICIAL SITE NAV)                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="flex justify-center pb-2 border-b border-[#243447]/10">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 rounded-2xl bg-[#EEE9E0] backdrop-blur-md border border-[#243447]/10">
          {SUB_TABS.map((subTab) => {
            const IconComp = subTab.icon;
            const isActive = activeSubTab === subTab.id;
            return (
              <button
                key={subTab.id}
                type="button"
                onClick={() => setActiveSubTab(subTab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#17458F] text-white shadow-md border border-[#17458F]'
                    : 'bg-transparent text-[#4A5565] hover:text-[#243447] hover:bg-[#D7D2C8]'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#C9982B]'}`} />
                <span>{subTab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================================================================== */}
      {/* SUB-TAB 1: KAUNLARAN (WEEKLY BULLETIN ARCHIVE)                    */}
      {/* ================================================================== */}
      {activeSubTab === 'kaunlaran' && (
        <div className="space-y-12 animate-fadeIn">
          {/* SOWER'S QUILL (PRESIDENT'S MESSAGE) */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
              <Feather className="w-6 h-6 text-[#F7A81B]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F7A81B]">
                The Sower's Quill — President's Column
              </h2>
            </div>

            <div
              tabIndex={0}
              role="button"
              onClick={() => setIsQuillOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsQuillOpen(true);
                }
              }}
              className="p-6 sm:p-8 rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-[16px] transition-all duration-300 shadow-xl hover:shadow-2xl hover:border-[#F7A81B]/40 hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="w-full md:w-48 h-36 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-md">
                  <ImageWithFallback
                    src="https://static.wixstatic.com/media/b2fb7d_a2ecf638cbf14f3997362c23ad6a38cd~mv2.png"
                    alt="The Sower's Quill by Pres. Chris Ferareza"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-3 flex-1">
                  <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-[0.05em] px-3 py-1 rounded-md shadow-sm bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>July 7, 2026 • Inaugural Issue (~4 min read)</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold transition-colors text-[#F8FAFC] group-hover:text-[#F7A81B]">
                    The Sower's Quill
                  </h3>

                  <div className="text-sm font-bold text-[#F7A81B]">
                    Pres. Chris Ferareza
                  </div>

                  <p className="text-sm font-sans leading-relaxed max-w-2xl text-[#CBD5E1]">
                    Inaugural column from Pres. Chris Ferareza on sowing seeds of hope, cultivating ethical leadership, and launching our BERDE, MULAT, and THREEE initiatives in Rotary Year 2026–2027.
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    className="w-full md:w-auto font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all inline-flex items-center justify-center space-x-2 cursor-pointer bg-[#17458F] hover:bg-[#123773] text-white"
                  >
                    <span>Read Full Column</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* KAUNLARAN ARCHIVE GRID */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-[#F7A81B]" />
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                    Kaunlaran Newsletter Archive
                  </h2>
                  <p className="text-xs sm:text-sm font-sans text-[#CBD5E1]">
                    Official weekly bulletin issues of the Rotary Club of Makati, organized by Rotary Year (July to June).
                  </p>
                </div>
              </div>

              {/* Rotary Year Filter Bar */}
              <div className="flex flex-wrap items-center gap-2">
                {(['all', 'RY 2026-27', 'RY 2025-26'] as const).map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedRotaryYear(year)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                      selectedRotaryYear === year
                        ? 'bg-[#F7A81B] text-[#0F172A] border-[#F7A81B] shadow-md'
                        : 'bg-white/5 text-[#CBD5E1] border-white/10 hover:border-[#F7A81B]/40 hover:text-[#F7A81B]'
                    }`}
                  >
                    {year === 'all' ? 'All Years' : year}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {filteredSortedKaunlaranIssues.map((issue) => (
                <a
                  key={issue.id}
                  href={issue.pdfUrl || issue.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={issue.issueNo}
                  aria-label={issue.issueNo}
                  className="group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] p-5 rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-[16px] transition-all duration-200 shadow-lg hover:shadow-2xl hover:border-[#F7A81B]/40 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Portrait Cover Image Frame */}
                    {issue.coverImage ? (
                      <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-3 border border-white/10 bg-black/40 relative group-hover:border-[#F7A81B]/60 transition-colors">
                        <img
                          src={issue.coverImage}
                          alt={`${issue.issueNo} Cover`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-3 border border-white/10 bg-black/40 flex flex-col items-center justify-center p-4 text-center space-y-2">
                        <BookOpen className="w-8 h-8 text-[#F7A81B]/40" />
                        <span className="text-[11px] font-semibold text-[#F7A81B]/70 uppercase tracking-wider">
                          Cover coming soon
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-sm uppercase tracking-wider text-[#F7A81B]">
                        {issue.issueNumberOnly || issue.issueNo}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30 shrink-0">
                        {issue.rotaryYear}
                      </span>
                    </div>

                    <div className="text-[13px] font-sans flex items-center space-x-1.5 font-medium text-[#CBD5E1]">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-[#F7A81B]" />
                      <span>{issue.date}</span>
                    </div>

                    <p className="text-xs font-sans leading-relaxed line-clamp-2 text-[#CBD5E1]">
                      {issue.summary}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#F7A81B] group-hover:underline">
                    <span className="flex items-center space-x-1">
                      <span>VIEW DRIVE</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ================================================================== */}
      {/* SUB-TAB 2: NEWS (GENERAL CLUB ACTIVITY POSTS)                     */}
      {/* ================================================================== */}
      {activeSubTab === 'news' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-[#F7A81B]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                Latest Club News & Activities
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {GENERAL_NEWS_POSTS.map((post) => (
              <div
                key={post.id}
                tabIndex={0}
                role="button"
                onClick={() => setSelectedNews(post)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedNews(post);
                  }
                }}
                className="group rounded-[18px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-[16px] transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:border-[#F7A81B]/40 hover:-translate-y-1.5 cursor-pointer"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                    {post.imageUrl ? (
                      <ImageWithFallback
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-[#16233B] via-[#0F172A] to-[#0A0F1D] flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <div className="w-14 h-14 rounded-full bg-[#F7A81B]/15 border border-[#F7A81B]/40 flex items-center justify-center text-[#F7A81B] shadow-inner">
                          <Camera className="w-6 h-6 text-[#F7A81B]" />
                        </div>
                        <span className="font-montserrat font-bold text-xs text-[#F7A81B] uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[#F7A81B]/10 border border-[#F7A81B]/20">
                          {post.placeholderLabel || 'Official Photo Pending'}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />

                    {post.pillar && (
                      <div className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-[0.05em] px-3 py-1 rounded-md shadow-md bg-[#0F172A]/90 backdrop-blur-md text-[#F7A81B] border border-white/10">
                        {post.pillar}
                      </div>
                    )}

                    {post.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#17458F] text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-1.5 text-[13px] font-sans font-medium uppercase tracking-wider text-[#F7A81B]">
                      <Calendar className="w-3.5 h-3.5 text-[#F7A81B]" />
                      <span>{post.date}</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug transition-colors text-[#F8FAFC] group-hover:text-[#F7A81B]">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-sans leading-relaxed line-clamp-3 text-[#CBD5E1]">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all bg-[#17458F] text-white group-hover:bg-[#123773] shadow-md">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* SUB-TAB 3: RCM IN THE NEWS (FEATURED STORIES & MEDIA COVERAGE)     */}
      {/* ================================================================== */}
      {activeSubTab === 'rcm-in-news' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-[#F7A81B]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                RCM in External Press & Media
              </h2>
            </div>
            <span className="text-xs font-montserrat font-bold text-[#F7A81B] bg-[#F7A81B]/15 px-3 py-1.5 rounded-full border border-[#F7A81B]/30 hidden sm:inline-flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F7A81B]" />
              <span>Sourced Press Features</span>
            </span>
          </div>

          <p className="text-sm sm:text-base font-sans leading-relaxed text-[#CBD5E1]">
            Featured stories, video reports, and press mentions highlighting the Rotary Club of Makati’s service missions, international partnerships, and community initiatives across the Philippines and District 3830.
          </p>

          <div className="space-y-8 max-w-5xl mx-auto">
            {RCM_IN_THE_NEWS_POSTS.map((story) => {
              // Check if Facebook video or extract YouTube video ID
              const isFacebookVideo = Boolean(
                story.videoUrl &&
                  (story.videoUrl.includes('facebook.com') || story.videoUrl.includes('fb.watch'))
              );
              let videoId = '';
              if (story.videoUrl && !isFacebookVideo) {
                if (story.videoUrl.includes('v=')) {
                  videoId = story.videoUrl.split('v=')[1]?.split('&')[0] || '';
                } else if (story.videoUrl.includes('youtu.be/')) {
                  videoId = story.videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
                }
              }

              return (
                <div
                  key={story.id}
                  className="rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-[16px] overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:border-[#F7A81B]/40"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Media Container (Left or Top) */}
                    <div className="lg:col-span-6 bg-black/60 relative flex items-center justify-center min-h-[260px] lg:min-h-[320px]">
                      {isFacebookVideo && story.videoUrl ? (
                        <div className="w-full h-full min-h-[260px] lg:min-h-[320px] aspect-video">
                          <iframe
                            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
                              story.videoUrl
                            )}&show_text=false&t=0`}
                            title={story.headline}
                            className="w-full h-full border-0"
                            style={{ border: 'none', overflow: 'hidden' }}
                            scrolling="no"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      ) : videoId ? (
                        <div className="w-full h-full aspect-video">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={story.headline}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : story.imageUrl ? (
                        <ImageWithFallback
                          src={story.imageUrl}
                          alt={story.headline}
                          className="w-full h-full object-cover min-h-[260px]"
                        />
                      ) : (
                        <div className="w-full h-full min-h-[260px] p-8 bg-gradient-to-br from-[#16233B] via-[#0F172A] to-[#0A0F1D] border-r border-b lg:border-b-0 border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-[#F7A81B]/15 border border-[#F7A81B]/40 flex items-center justify-center text-[#F7A81B] shadow-inner">
                            <Camera className="w-8 h-8 text-[#F7A81B]" />
                          </div>
                          <span className="font-montserrat font-bold text-sm text-[#F7A81B] uppercase tracking-wider px-4 py-2 rounded-xl bg-[#F7A81B]/10 border border-[#F7A81B]/20">
                            {story.placeholderLabel || 'Photo: Event Coverage'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Story Content (Right or Bottom) */}
                    <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-montserrat font-bold uppercase tracking-wider bg-[#17458F] text-white shadow-sm">
                            <Tag className="w-3 h-3 text-white" />
                            <span>{story.categoryTag}</span>
                          </span>

                          <span className="flex items-center space-x-1 text-xs font-montserrat font-bold text-[#F7A81B] uppercase tracking-wider">
                            <Calendar className="w-3.5 h-3.5 text-[#F7A81B]" />
                            <span>{story.date}</span>
                          </span>
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl font-extrabold leading-snug text-[#F8FAFC]">
                          {story.headline}
                        </h3>

                        <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
                          "{story.excerpt}"
                        </p>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <a
                          href={story.readMoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#17458F] hover:bg-[#123773] text-white border border-white/20 font-montserrat font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all duration-200 inline-flex items-center space-x-2.5 cursor-pointer shadow-md"
                        >
                          <span>Read Full Story</span>
                          <ExternalLink className="w-4 h-4 text-white" />
                        </a>
                        {story.videoUrl && (
                          <a
                            href={story.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#F7A81B]/15 hover:bg-[#F7A81B]/25 text-[#F7A81B] border border-[#F7A81B]/40 font-montserrat font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all duration-200 inline-flex items-center space-x-2.5 cursor-pointer shadow-md"
                          >
                            <span>Watch Video</span>
                            <ExternalLink className="w-4 h-4 text-[#F7A81B]" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* SUB-TAB 4: RC MAKATI VIDEOS                                        */}
      {/* ================================================================== */}
      {activeSubTab === 'video-news' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-3">
              <Tv className="w-6 h-6 text-[#F7A81B]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                RC Makati Videos
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {VIDEO_NEWS_POSTS.map((video, index) => {
              const isMirrored =
                video.id === 'vid-pasig-feeding' ||
                video.id === 'vid-bgc-greenway-tour' ||
                index >= VIDEO_NEWS_POSTS.length - 2;

              return (
                <div
                  key={video.id}
                  tabIndex={0}
                  role="button"
                  onClick={() => setSelectedNews(video)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedNews(video);
                    }
                  }}
                  className="group rounded-[18px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-[16px] transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:border-[#F7A81B]/40 hover:-translate-y-1.5 cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden bg-black">
                      <ImageWithFallback
                        src={video.imageUrl}
                        alt={video.title}
                        className={`w-full h-full object-cover transition-transform duration-500 opacity-90 ${
                          isMirrored
                            ? '-scale-x-100 group-hover:-scale-x-105 group-hover:scale-y-105'
                            : 'group-hover:scale-105'
                        }`}
                      />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-black/30 to-transparent" />

                    <div className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-[0.05em] px-3 py-1 rounded-md shadow-md flex items-center space-x-1 bg-[#0F172A]/90 backdrop-blur-md text-[#F7A81B] border border-white/10">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Video News</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#17458F] text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-1.5 text-[13px] font-sans font-medium uppercase tracking-wider text-[#F7A81B]">
                      <Calendar className="w-3.5 h-3.5 text-[#F7A81B]" />
                      <span>{video.date}</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug transition-colors text-[#F8FAFC] group-hover:text-[#F7A81B]">
                      {video.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-sans leading-relaxed line-clamp-3 text-[#CBD5E1]">
                      {video.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all bg-[#17458F] text-white group-hover:bg-[#123773] shadow-md">
                    <Play className="w-4 h-4 fill-current" />
                    <span>Watch Broadcast</span>
                  </span>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* SUB-TAB 5: PHOTO GALLERY                                           */}
      {/* ================================================================== */}
      {activeSubTab === 'photo-gallery' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Gallery Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <Camera className="w-6 h-6 text-[#F7A81B]" />
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                  RCM Photo & Media Gallery
                </h2>
              </div>
              <p className="text-xs text-[#CBD5E1] font-sans">
                Curated collection of verified group, project, community event, and video milestone photos.
              </p>
            </div>

            {/* Live Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                placeholder="Search photo gallery..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-[#F8FAFC] text-xs font-sans transition-all focus:outline-none focus:ring-2 focus:ring-[#17458F] focus:border-white/20 placeholder-[#94A3B8]"
              />
              {gallerySearch && (
                <button
                  onClick={() => setGallerySearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All Photos (${GALLERY_ITEMS.length})` },
              { id: 'projects', label: `Projects (${GALLERY_ITEMS.filter((i) => i.category === 'projects').length})` },
              { id: 'recent_events', label: `Recent Events (${GALLERY_ITEMS.filter((i) => i.category === 'recent_events').length})` },
              { id: 'heritage', label: `Heritage & Milestones (${GALLERY_ITEMS.filter((i) => i.category === 'heritage').length})` },
              { id: 'videos', label: `Video Highlights (${GALLERY_ITEMS.filter((i) => i.category === 'videos').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGalleryCategory(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  galleryCategory === tab.id
                    ? 'bg-[#17458F] text-white border-white/20 shadow-md'
                    : 'bg-white/5 border-white/10 text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filtered Grid */}
          {(() => {
            const filtered = GALLERY_ITEMS.filter((item) => {
              const matchesCat = galleryCategory === 'all' || item.category === galleryCategory;
              const matchesSearch =
                item.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                (item.pillar && item.pillar.toLowerCase().includes(gallerySearch.toLowerCase())) ||
                item.excerpt.toLowerCase().includes(gallerySearch.toLowerCase());
              return matchesCat && matchesSearch;
            });

            if (filtered.length === 0) {
              return (
                <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5 space-y-2">
                  <Camera className="w-8 h-8 text-[#94A3B8] mx-auto" />
                  <p className="font-serif font-bold text-base text-[#F8FAFC]">
                    No matching photos found
                  </p>
                  <p className="text-xs text-[#CBD5E1]">
                    Try another search term or select a different category filter.
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filtered.map((item) => {
                  const newsObj: NewsItem = {
                    id: item.id,
                    title: item.title,
                    date: item.date || 'RCM Official Gallery Archive',
                    type: item.videoUrl ? 'video' : 'photo',
                    imageUrl: item.imageUrl,
                    videoUrl: item.videoUrl,
                    pillar: item.pillar || item.categoryLabel,
                    excerpt: item.excerpt,
                  };

                  return (
                    <div
                      key={item.id}
                      tabIndex={0}
                      role="button"
                      onClick={() => setSelectedNews(newsObj)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedNews(newsObj);
                        }
                      }}
                      className="group rounded-[18px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-[16px] transition-all duration-300 flex flex-col justify-between shadow-lg hover:-translate-y-1.5 hover:shadow-2xl hover:border-[#F7A81B]/40 cursor-pointer"
                    >
                      <div>
                        <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />

                          <div className="absolute top-3 left-3 bg-[#0F172A]/90 backdrop-blur-md text-[#F7A81B] border border-white/10 text-[10px] font-montserrat font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
                            {item.videoUrl ? (
                              <Tv className="w-3 h-3 text-[#F7A81B]" />
                            ) : (
                              <Camera className="w-3 h-3 text-[#F7A81B]" />
                            )}
                            <span>{item.categoryLabel}</span>
                          </div>

                          {item.pillar && (
                            <div className="absolute top-3 right-3 bg-[#F7A81B] text-[#0F172A] font-montserrat font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                              {item.pillar}
                            </div>
                          )}
                        </div>

                        <div className="p-6 space-y-3">
                          {item.date && (
                            <div className="flex items-center space-x-1.5 text-xs font-montserrat font-bold text-[#F7A81B] uppercase tracking-wider">
                              <Calendar className="w-3.5 h-3.5 text-[#F7A81B]" />
                              <span>{item.date}</span>
                            </div>
                          )}

                          <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug group-hover:text-[#F7A81B] transition-colors text-[#F8FAFC]">
                            {item.title}
                          </h3>

                          <p className="text-xs sm:text-sm font-sans text-[#CBD5E1] leading-relaxed line-clamp-3">
                            {item.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                        <span className="bg-[#17458F] hover:bg-[#123773] text-white border border-white/10 font-montserrat font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md transition-all inline-flex items-center space-x-2 cursor-pointer w-full justify-center">
                          {item.videoUrl ? (
                            <>
                              <Play className="w-3.5 h-3.5 text-white" />
                              <span>Watch Video Highlight</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-3.5 h-3.5 text-white" />
                              <span>View Full Photo</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. CLOSING SOCIAL CTA STRIP                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="p-8 sm:p-10 rounded-[18px] bg-[#16233B] text-[#CBD5E1] border border-white/10 shadow-2xl backdrop-blur-[16px] text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-[#F7A81B]/15 border border-[#F7A81B]/30 px-3.5 py-1 rounded-full text-xs font-montserrat font-bold uppercase tracking-wider text-[#F7A81B]">
          <Sparkles className="w-4 h-4 text-[#F7A81B]" />
          <span>Stay Connected</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F8FAFC]">
          Never Miss an RCM Update
        </h2>

        <p className="font-sans text-sm sm:text-base max-w-xl mx-auto font-normal text-[#CBD5E1]">
          Follow our official social media channels for real-time project updates, meeting streams, and community announcements.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={RCM_INFO.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-[#17458F] hover:bg-[#123773] text-white transition-all font-montserrat font-bold text-xs uppercase tracking-wider inline-flex items-center space-x-2 shadow-md cursor-pointer border border-white/20"
          >
            <Facebook className="w-4 h-4 text-white" />
            <span>Facebook Page</span>
          </a>

          <a
            href={RCM_INFO.socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-[#17458F] hover:bg-[#123773] text-white transition-all font-montserrat font-bold text-xs uppercase tracking-wider inline-flex items-center space-x-2 shadow-md cursor-pointer border border-white/20"
          >
            <Youtube className="w-4 h-4 text-white" />
            <span>YouTube Channel</span>
          </a>

          <a
            href={RCM_INFO.socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-[#17458F] hover:bg-[#123773] text-white transition-all font-montserrat font-bold text-xs uppercase tracking-wider inline-flex items-center space-x-2 shadow-md cursor-pointer border border-white/20"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.812c-1.611 0-2.903-1.304-2.903-2.903 0-1.6 1.3-2.903 2.903-2.903.35 0 .684.062 1.002.175V9.227a6.29 6.29 0 0 0-1.002-.08C6.012 9.147 3 12.16 3 15.683 3 19.205 6.012 22 9.473 22c3.46 0 6.472-2.795 6.472-6.317V9.008a8.196 8.196 0 0 0 4.644 1.442v-3.44c-.334 0-.663-.08-.998-.324z"/>
            </svg>
            <span>TikTok</span>
          </a>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 1: NEWS / VIDEO IN-APP MODAL                                 */}
      {/* ------------------------------------------------------------------ */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedNews(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-w-3xl w-full rounded-[18px] border border-white/10 bg-[#0F172A] text-[#CBD5E1] p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 pr-6">
                <div className="flex items-center space-x-2 text-xs font-montserrat font-bold text-[#F7A81B] uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedNews.date}</span>
                  {selectedNews.pillar && (
                    <>
                      <span className="opacity-50">•</span>
                      <span>{selectedNews.pillar}</span>
                    </>
                  )}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold leading-tight text-[#F8FAFC]">
                  {selectedNews.title}
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedNews(null)}
                aria-label="Close modal"
                className="p-2.5 rounded-full hover:bg-white/10 text-[#F7A81B] transition-colors cursor-pointer shrink-0 border border-[#F7A81B]/30"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedNews.type === 'video' && selectedNews.videoUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(selectedNews.videoUrl)}
                  title={selectedNews.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : selectedNews.imageUrl ? (
              <div className="relative max-h-80 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/40">
                <ImageWithFallback
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover max-h-80"
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-lg bg-gradient-to-br from-[#16233B] via-[#0F172A] to-[#0A0F1D] p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F7A81B]/15 border border-[#F7A81B]/40 flex items-center justify-center text-[#F7A81B] shadow-inner">
                  <Camera className="w-8 h-8 text-[#F7A81B]" />
                </div>
                <span className="font-montserrat font-bold text-sm text-[#F7A81B] uppercase tracking-wider px-4 py-2 rounded-xl bg-[#F7A81B]/10 border border-[#F7A81B]/20">
                  {selectedNews.placeholderLabel || 'Official Photo Pending Verification'}
                </span>
              </div>
            )}

            <div className="space-y-4 font-sans text-base leading-relaxed text-[#CBD5E1]">
              <p className="whitespace-pre-line">{selectedNews.excerpt}</p>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="w-full sm:w-auto bg-[#17458F] hover:bg-[#123773] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 2: KAUNLARAN ISSUE IN-APP MODAL                            */}
      {/* ------------------------------------------------------------------ */}
      {selectedIssue && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedIssue(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-w-2xl w-full rounded-[18px] border border-white/10 bg-[#0F172A] text-[#CBD5E1] p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-montserrat font-extrabold text-[#F7A81B] uppercase tracking-wider">
                  Official Rotary Bulletin
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                  {selectedIssue.issueNo}
                </h2>
                <div className="text-xs font-montserrat flex items-center space-x-1.5 text-[#F7A81B] font-semibold">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{selectedIssue.date}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                aria-label="Close issue modal"
                className="p-2.5 rounded-full hover:bg-white/10 text-[#F7A81B] transition-colors cursor-pointer shrink-0 border border-[#F7A81B]/30"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedIssue.pdfUrl ? (
              <div className="w-full h-96 rounded-xl overflow-hidden border border-white/10 shadow-inner">
                <iframe
                  src={selectedIssue.pdfUrl}
                  title={selectedIssue.issueNo}
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-center">
                <BookOpen className="w-12 h-12 text-[#F7A81B] mx-auto" />
                <h3 className="font-serif text-xl font-bold text-[#F8FAFC]">Bulletin Published</h3>
                <p className="font-sans text-sm text-[#CBD5E1] max-w-md mx-auto leading-relaxed">
                  Full newsletter content will display here once the source PDF is linked. For now, this card confirms the issue was published on rotaryclubmakati.org.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="w-full sm:w-auto bg-[#17458F] hover:bg-[#123773] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Close Bulletin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 3: SOWER'S QUILL COLUMN IN-APP MODAL                       */}
      {/* ------------------------------------------------------------------ */}
      {isQuillOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsQuillOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-w-3xl w-full rounded-[18px] border border-white/10 bg-[#0F172A] text-[#CBD5E1] p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-montserrat font-extrabold text-[#F7A81B] uppercase tracking-wider bg-[#F7A81B]/15 px-3 py-1 rounded-full border border-[#F7A81B]/30 inline-block">
                  The Sower's Quill • President's Column
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                  Sowing Seeds of Hope and Transformation
                </h2>
                <p className="text-xs font-montserrat text-[#F7A81B] font-semibold">
                  By Pres. Chris Ferareza • Rotary Year 2026–2027 (July 7, 2026)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsQuillOpen(false)}
                aria-label="Close column modal"
                className="p-2.5 rounded-full hover:bg-white/10 text-[#F7A81B] transition-colors cursor-pointer shrink-0 border border-[#F7A81B]/30"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed text-[#CBD5E1]">
              <p>
                Fellow Rotarians and esteemed friends, welcome to the inaugural issue of Kaunlaran for Rotary Year 2026–2027.
              </p>
              <p>
                As we begin this year under our guiding theme, <strong className="text-[#F8FAFC]">"Sowing Hope, Cultivating Impact,"</strong> we reaffirm our pledge to serve with unyielding integrity, passion, and vision. The seeds we sow today in basic education, health, environmental protection, and economic empowerment will grow into mighty trees of opportunity for generations to come.
              </p>
              <p>
                Our flagship initiatives — <strong className="text-[#F7A81B]">BERDE</strong> (Environmental Sustainability), <strong className="text-[#F7A81B]">MULAT</strong> (Basic Education & AI Literacy), and <strong className="text-[#F7A81B]">THREEE</strong> (Economic Empowerment & Livelihood) — are built upon six decades of unbroken leadership. Together, let us cultivate lasting transformation.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsQuillOpen(false)}
                className="w-full sm:w-auto bg-[#17458F] hover:bg-[#123773] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Close Column
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
